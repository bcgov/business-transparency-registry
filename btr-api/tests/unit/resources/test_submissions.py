""" Tests to ensure that the submission based end-points work correctly.
"""
import json
import os
from datetime import datetime
from http import HTTPStatus
from zoneinfo import ZoneInfo

import pytest
import requests
from dateutil.relativedelta import relativedelta

from btr_api.enums import UserType
from btr_api.models import Submission as SubmissionModel
from btr_api.models import SubmissionType
from btr_api.models import User as UserModel
from btr_api.models.submission import SubmissionSerializer
from btr_api.services import SubmissionService
from btr_api.services.auth import auth_cache
from btr_api.utils import redact_information

from tests.unit import nested_session
from tests.unit.models.test_user import sample_user
from tests.unit.utils import create_header
from tests.unit.utils.db_helpers import clear_db
from tests.unit.mocks.response.todos_initial_filing import todos_initial_filing
from tests.unit.mocks.response.todos_annual_filing import todos_annual_filing

mocked_entity_response = {'business': {'adminFreeze': False, 'state': 'ACTIVE', 'legalName': 'Mocked Business', 'identifier': 'BC1234567'}}
mocked_entity_address_response = {
    'deliveryAddress': {'addressCity': 'Vancouver', 'addressCountry': 'Canada', 'streetAddress': 'Fake Street'}
}
mocked_auth_entity_contact_response = {'contacts':[{'email': 'business@email.com', 'phone': '123-456 7890'}]}

helper_people = [
    {
        'email': 'test@test.com',
        'names': [{'type': 'individual', 'fullName': 'Test Test'}, {'type': 'alternative', 'fullName': 'tset tset'}],
        'phoneNumber': {'number': '5555555555', 'countryCallingCode': '1', 'countryCode2letterIso': 'CA'},
        'addresses': [
            {
                'city': 'Victoria',
                'region': 'BC',
                'street': '563 Superior St',
                'country': 'CA',
                'postalCode': 'V9A 5C7',
                'countryName': 'Canada',
                'streetAdditional': '',
                'locationDescription': '',
                'type': 'residence'
            }
        ],
        'hasMailingAddress': False,
        'placeOfResidence': {
            'city': 'Victoria',
            'region': 'BC',
            'street': '563 Superior St',
            'country': 'CA',
            'postalCode': 'V9A 5C7',
            'countryName': 'Canada',
            'streetAdditional': '',
            'locationDescription': '',
        },
        'birthDate': '1988-01-01',
        'identifiers': [{'id': '999 555 444', 'scheme': 'CAN-TAXID', 'schemeName': 'ITN'}],
        'statementID': '1'
    }
]

def verify_emails_sent(json_data: dict, email_mock) -> dict:
    """Return the expected email dict to verify for the data given."""
    expected_emails = {}
    for person in json_data['personStatements']:
        # should have been called once per person with email
        if email := person.get('email'):
            is_minor = (
                person.get('birthDate') and
                datetime.fromisoformat(json_data['effectiveDate']) - relativedelta(years=19) <
                datetime.fromisoformat(person['birthDate'])
            )
            name = [x for x in person['names'] if x['type'] == 'individual'][0]['fullName']
            # NOTE: for test simplicity expects unique emails per person
            assert email not in expected_emails.keys()
            expected_emails[email] = {'is_minor': is_minor, 'name': name, 'citizenship': person.get('nationalities'), 'birth': person.get('birthDate')}

    assert email_mock.call_count == len(expected_emails.keys())
    for email, expected in expected_emails.items():
        email_verified = False
        for email_sent in email_mock.request_history:
            if email in email_sent.json()['recipients']:
                # verify subject
                assert email_sent.json()['content']['subject'] == 'You have been listed in the B.C. Transparency Register'
                def verify_text_in_email(text: str):
                    print(email_sent.json()['content']['body'])
                    assert text in email_sent.json()['content']['body']

                verify_text_in_email('has registered you as a significant individual in their Business Transparency Registry.')
                verify_text_in_email(expected['name'])
                if expected['birth']:
                    verify_text_in_email(expected['birth'][0:4])
                else:
                    verify_text_in_email('Not Entered')

                if expected['is_minor']:
                    verify_text_in_email('Notification of B.C. Business Transparency Registry Filing')
                    verify_text_in_email(expected['birth'])
                else:
                    verify_text_in_email('Notification that your B.C. Business Transparency Registry Filing Information will be public in 90 days')
                email_verified = True
                break
        assert email_verified




@pytest.mark.parametrize(
    'test_name, submission_type, payload, user_type',
    [('simple json', SubmissionType.INITIAL_FILING, {'businessIdentifier': 'identifier0'}, UserType.USER_COMPETENT_AUTHORITY)],
)
def test_get_plots(app, client, session, jwt, requests_mock, sample_user, test_name, submission_type, payload, user_type):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        clear_db(session)
        # Setup
        id = ''
        if payload:
            sub = SubmissionModel()
            sub.submitted_payload = payload
            sub.business_identifier = payload['businessIdentifier']
            sub.submitted_datetime = datetime.now(ZoneInfo('America/Vancouver'))
            sub.type = submission_type
            sub.submitter = sample_user
            session.add(sub)
            session.commit()
            id = sub.id

        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{sub.business_identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )

        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/orgs/1/products?include_hidden=true",
            json=[{'code': 'CA_SEARCH', 'subscriptionStatus': 'ACTIVE'}])
        # Test
        rv = client.get(
            f'/plots/{id}',
            headers=create_header(
                jwt, ['basic'], **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}
            ),
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

        if payload:
            redacted_payload = redact_information(payload, user_type)
            for key, value in redacted_payload.items():
                assert key in rv.text
                assert value in rv.text


_valid_auth_view_response = {'orgMembership': 'COORDINATOR', 'roles': ['view']}
_valid_auth_edit_response = {'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']}
_forbidden_auth_response_missing_view_role = {'orgMembership': 'COORDINATOR', 'roles': ['no_view_role']}
_forbidden_auth_response_missing_edit_role = {'orgMembership': 'COORDINATOR', 'roles': ['no_edit_role', 'view']}
_forbidden_auth_response_empty = {}


@pytest.mark.parametrize(
    'test_name, business_identifier, auth_svc_response, has_auth_header, expected_http_status',
    [
        ('Good path', 'BC1234567', _valid_auth_view_response, True, HTTPStatus.OK),
        ('Bad path, no auth header', 'BC1234566', _valid_auth_view_response, False, HTTPStatus.UNAUTHORIZED),
        ('Bad path, no view role', 'BC1234565', _forbidden_auth_response_missing_view_role, True, HTTPStatus.FORBIDDEN),
        ('Bad path, no roles', 'BC1234564', _forbidden_auth_response_empty, True, HTTPStatus.FORBIDDEN)
    ],
)
def test_get_plots_auth(
    app,
    client,
    session,
    jwt,
    requests_mock,
    sample_user,
    test_name,
    business_identifier,
    auth_svc_response,
    has_auth_header,
    expected_http_status,
):
    """Test scenarios connected to authentication on plots endpoint."""
    with nested_session(session):
        # Setup
        auth_cache.clear()
        clear_db(session)
        sub = SubmissionModel()
        sub.submitted_payload = {'businessIdentifier': business_identifier}
        sub.business_identifier = business_identifier
        sub.submitted_datetime = datetime.now(ZoneInfo('America/Vancouver'))
        sub.type = SubmissionType.INITIAL_FILING
        sub.submitter = sample_user
        session.add(sub)
        session.commit()
        search_id = sub.id
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{business_identifier}/authorizations", json=auth_svc_response
        )

        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/orgs/1/products?include_hidden=true",
            json=[{'code': 'CA_SEARCH', 'subscriptionStatus': 'ACTIVE'}])

        headers = create_header(
            jwt, ['basic'], **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}
        )

        if not has_auth_header:
            headers = {'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}

        # Test
        rv = client.get(f'/plots/{search_id}', headers=headers)

    # Confirm outcome
    assert rv.status_code == expected_http_status


@pytest.mark.parametrize(
    'test_name, auth_svc_response, has_auth_header, expected_http_status',
    [
        ('Good path', _valid_auth_edit_response, True, HTTPStatus.CREATED),
        ('Bad path, no auth header', _valid_auth_edit_response, False, HTTPStatus.UNAUTHORIZED),
        ('Bad path, no edit role', _forbidden_auth_response_missing_edit_role, True, HTTPStatus.FORBIDDEN),
        ('Bad path, no roles', _forbidden_auth_response_empty, True, HTTPStatus.FORBIDDEN)
    ],
)
def test_create_update_plots_auth(
    app,
    client,
    session,
    jwt,
    requests_mock,
    test_name,
    auth_svc_response,
    has_auth_header,
    expected_http_status,
):
    """Test scenarios connected to authentication on plots endpoint."""
    with nested_session(session):
        # Setup
        auth_cache.clear()
        clear_db(session)
        current_dir = os.path.dirname(__file__)
        with open(os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')) as file:
            json_data = json.load(file)
            identifier = json_data['businessIdentifier']
            requests_mock.get(
                f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_initial_filing
            )
            requests_mock.get(
                f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations", json=auth_svc_response
            )
            requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
            requests_mock.get(
                f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}", json=mocked_entity_response
            )
            requests_mock.post(
                f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/filings", json={'message': 'Success'}
            )
            requests_mock.get(
                f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses?addressType=deliveryAddress",
                json=mocked_entity_address_response
            )
            requests_mock.get(
                f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}",
                json=mocked_auth_entity_contact_response
            )

            headers = create_header(
                jwt, ['basic'], **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}
            )

            if not has_auth_header:
                headers = {'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}

            # Test
            rv = client.post('/plots', json=json_data, headers=headers)

    # Confirm outcome
    assert rv.status_code == expected_http_status


def test_post_plots_db_mocked(app, session, client, jwt, mocker, requests_mock):
    """Assure post submission works (db mocked)."""
    auth_cache.clear()
    clear_db(session)
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(
        f"{app.config.get('BOR_SVC_URL')}/internal/solr/update", json={'message': 'Update accepted'}
    )

    email_mock = requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})
    mock_user_save = mocker.patch.object(UserModel, 'save')
    mock_submission_save = mocker.patch.object(SubmissionModel, 'save')

    def mocked_to_dict(submission: SubmissionModel):
        return {'id': 123, 'payload': {}}
    mocker.patch.object(SubmissionSerializer, 'to_dict', mocked_to_dict)

    auth_cache.clear()

    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}", json=mocked_entity_response
        )
        legal_api_ledger_mock = requests_mock.post(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/filings", json={'message': 'Success'}
        )
        legal_api_delivery_address_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_initial_filing
        )
        auth_api_entity_contact_mock = requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}",
            json=mocked_auth_entity_contact_response
        )

        rv = client.post(
            '/plots',
            json=json_data,
            headers=create_header(
                jwt,
                ['basic'],
                **{
                    'Accept-Version': 'v1',
                    'Authoriztion': 'Bearer 123',
                    'content-type': 'application/json',
                    'Account-Id': 1,
                },
            ),
        )
        assert rv.status_code == HTTPStatus.CREATED

    mock_user_save.assert_called_once()
    mock_submission_save.assert_called()
    assert legal_api_entity_mock.called == True
    assert auth_mock.called == True
    assert legal_api_delivery_address_mock.called == True
    assert bor_api_mock.called == True
    assert auth_api_entity_contact_mock.called == True
    assert legal_api_ledger_mock.called == True
    assert email_mock.called == True

    assert bor_api_mock.request_history[0].json() == {
        'business': {
            'addresses': [mocked_entity_address_response['deliveryAddress']],
            **mocked_entity_response['business']
        },
        'owners': [
            {'interestedParty': {'describedByPersonStatement': '1199dc30-6cd8-47fa-be79-f057348ab36b', 'hasMailingAddress': False, 'addresses': [{'type': 'residence', 'city': 'Edmonton', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'T6T 1B6', 'region': 'AB', 'street': '4323 33 St NW', 'streetAdditional': ''}], 'birthDate': '2023-11-07', 'email': 'fake@email.com', 'hasTaxNumber': True, 'identifiers': [{'id': '711 612 325', 'scheme': 'CAN-TAXID', 'schemeName': 'ITN'}], 'isComponent': False, 'isPermanentResidentCa': False, 'names': [{'fullName': 'Kial Jinnah', 'type': 'individual'}], 'nationalities': [{'code': 'CA', 'name': 'Canada'}], 'personType': 'knownPerson', 'phoneNumber': {'countryCallingCode': '1', 'countryCode2letterIso': 'CA', 'number': '7783888844'}, 'placeOfResidence': {'city': 'Edmonton', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'T6T 1B6', 'region': 'AB', 'street': '4323 33 St NW', 'streetAdditional': ''}, 'publicationDetails': {'bodsVersion': '0.3', 'publicationDate': '2024-09-11', 'publisher': {'name': 'BCROS - BC Registries and Online Services', 'url': 'https://www.bcregistry.gov.bc.ca/'}}, 'source': {'assertedBy': [{'name': 'Kial Jinnah'}], 'description': 'Using Gov BC - BTR - Web UI', 'type': ['selfDeclaration']}, 'statementDate': '2024-09-11', 'statementID': '1199dc30-6cd8-47fa-be79-f057348ab36b', 'statementType': 'personStatement', 'taxResidencies': [{'code': 'CA', 'name': 'Canada'}], 'uuid': 'a4b3844a-f68b-4092-b490-85a603f6d424'},
             'interests': [{'details': 'controlType.shares.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25}, 'startDate': '2014-11-07', 'type': 'shareholding'}, {'details': 'controlType.shares.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25}, 'startDate': '2014-11-07', 'type': 'shareholding'}, {'details': 'controlType.votes.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07', 'type': 'votingRights'}],
             'interestTypes': ['shareholding', 'votingRights'],
             'isComponent': False,
             'publicationDetails': {'bodsVersion': '0.3', 'publicationDate': '2024-09-11', 'publisher': {'name': 'BCROS - BC Registries and Online Services', 'url': 'https://www.bcregistry.gov.bc.ca/'}},
             'source': {'assertedBy': [{'name': 'Kial Jinnah'}], 'description': 'Using Gov BC - BTR - Web UI', 'type': ['selfDeclaration']},
             'statementDate': '2024-09-11',
             'statementID': '6c08495f-c9d7-4c85-8d4f-8ed7c108fe3d',
             'statementType': 'ownershipOrControlStatement',
             'subject': {'describedByEntityStatement': ''}
            },
            {'interestedParty': {'describedByPersonStatement': '4b7863a1-4fbf-42a5-afe8-8f4a4f3ca049', 'hasMailingAddress': False, 'addresses': [{'type': 'residence', 'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V6H 2T8', 'region': 'BC', 'street': 'Th-3023 Birch St', 'streetAdditional': ''}], 'birthDate': '2000-02-02', 'email': 'fake2@email.com', 'hasTaxNumber': True, 'identifiers': [{'id': '402 931 299', 'scheme': 'CAN-TAXID', 'schemeName': 'ITN'}], 'isComponent': False, 'isPermanentResidentCa': True, 'names': [{'fullName': 'Wallaby Willow', 'type': 'individual'}], 'nationalities': [{'code': 'AL', 'name': 'Albania'}, {'code': 'BZ', 'name': 'Belize'}], 'personType': 'knownPerson', 'phoneNumber': {'countryCallingCode': '1', 'countryCode2letterIso': 'CA', 'number': '2508747772'}, 'placeOfResidence': {'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V6H 2T8', 'region': 'BC', 'street': 'Th-3023 Birch St', 'streetAdditional': ''}, 'publicationDetails': {'bodsVersion': '0.3', 'publicationDate': '2024-09-16', 'publisher': {'name': 'BCROS - BC Registries and Online Services', 'url': 'https://www.bcregistry.gov.bc.ca/'}}, 'source': {'assertedBy': [{'name': 'Wallaby Willow'}], 'description': 'Using Gov BC - BTR - Web UI', 'type': ['selfDeclaration']}, 'statementDate': '2024-09-16', 'statementID': '4b7863a1-4fbf-42a5-afe8-8f4a4f3ca049', 'statementType': 'personStatement', 'taxResidencies': [{'code': 'CA', 'name': 'Canada'}], 'uuid': '1a825cce-a3fa-47b2-b8c3-e2fae40ac7df'},
             'interests': [{'details': 'controlType.shares.indirectControl', 'directOrIndirect': 'indirect', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25}, 'startDate': '2019-09-19', 'type': 'shareholding'}, {'details': 'controlType.votes.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25}, 'startDate': '2019-09-19', 'type': 'votingRights'}],
             'interestTypes': ['shareholding', 'votingRights'],
             'isComponent': False,
             'publicationDetails': {'bodsVersion': '0.3', 'publicationDate': '2024-09-16', 'publisher': {'name': 'BCROS - BC Registries and Online Services', 'url': 'https://www.bcregistry.gov.bc.ca/'}},
             'source': {'assertedBy': [{'name': 'Wallaby Willow'}], 'description': 'Using Gov BC - BTR - Web UI', 'type': ['selfDeclaration']},
             'statementDate': '2024-09-16',
             'statementID': 'aef71bd1-8c64-4fff-a2d5-9a25b450745d',
             'statementType': 'ownershipOrControlStatement',
             'subject': {'describedByEntityStatement': ''}},
            {'interestedParty': {'describedByPersonStatement': 'ce935e86-f4b9-4938-b12e-29c5e5cc213d', 'hasMailingAddress': False, 'addresses': [{'type': 'residence', 'city': 'Longueuil', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'J4H 3X9', 'region': 'QC', 'street': '433-405 Ch De Chambly', 'streetAdditional': ''}], 'birthDate': '2005-09-13', 'email': 'fake3@email.com', 'hasTaxNumber': False, 'identifiers': [], 'isComponent': False, 'isPermanentResidentCa': False, 'names': [{'fullName': 'Waffles Butter', 'type': 'individual'}], 'nationalities': [{'code': 'US', 'name': 'United States'}], 'personType': 'knownPerson', 'phoneNumber': {'countryCallingCode': '1', 'countryCode2letterIso': 'CA', 'number': '7784467467'}, 'placeOfResidence': {'city': 'Longueuil', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'J4H 3X9', 'region': 'QC', 'street': '433-405 Ch De Chambly', 'streetAdditional': ''}, 'publicationDetails': {'bodsVersion': '0.3', 'publicationDate': '2024-09-12', 'publisher': {'name': 'BCROS - BC Registries and Online Services', 'url': 'https://www.bcregistry.gov.bc.ca/'}}, 'source': {'assertedBy': [{'name': 'Waffles Butter'}], 'description': 'Using Gov BC - BTR - Web UI', 'type': ['selfDeclaration']}, 'statementDate': '2024-09-12', 'statementID': 'ce935e86-f4b9-4938-b12e-29c5e5cc213d', 'statementType': 'personStatement', 'taxResidencies': [], 'uuid': '839e35b8-d536-42e6-82ba-ba3c5a13582d'},
             'interests': [{'details': 'controlType.shares.indirectControl', 'directOrIndirect': 'indirect', 'share': {'exclusiveMaximum': True, 'exclusiveMinimum': False, 'maximum': 25, 'minimum': 0}, 'startDate': '2021-09-07', 'type': 'shareholding'}],
             'interestTypes': ['shareholding'],
             'isComponent': False,
             'publicationDetails': {'bodsVersion': '0.3', 'publicationDate': '2024-09-12', 'publisher': {'name': 'BCROS - BC Registries and Online Services', 'url': 'https://www.bcregistry.gov.bc.ca/'}},
             'source': {'assertedBy': [{'name': 'Waffles Butter'}], 'description': 'Using Gov BC - BTR - Web UI', 'type': ['selfDeclaration']},
             'statementDate': '2024-09-12',
             'statementID': 'f4d9f29b-559b-4353-9bd4-89ada5ae5209',
             'statementType': 'ownershipOrControlStatement',
             'subject': {'describedByEntityStatement': ''}}
        ]
    }
    verify_emails_sent(json_data, email_mock)


def test_post_plots(app, client, session, jwt, requests_mock):
    """Assure post submission works."""
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(
        f"{app.config.get('BOR_SVC_URL')}/internal/solr/update", json={'message': 'Update accepted'}
    )
    email_mock = requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}", json=mocked_entity_response
        )
        legal_api_ledger_mock = requests_mock.post(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/filings", json={'message': 'Success'}
        )
        legal_api_delivery_address_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_initial_filing
        )
        auth_api_entity_contact_mock = requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}",
            json=mocked_auth_entity_contact_response
        )

        with nested_session(session):
            auth_cache.clear()
            clear_db(session)
            mocked_username = 'wibbly wabble'
            rv = client.post(
                '/plots',
                json=json_data,
                headers=create_header(
                    jwt_manager=jwt,
                    roles=['basic'],
                    username=mocked_username,
                    **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
                ),
            )

            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']
            # check user link
            assert created_submission.submitter_id
            user = UserModel.find_by_id(created_submission.submitter_id)
            assert user.username == mocked_username
            # post submission things all triggered
            assert legal_api_entity_mock.called == True
            assert auth_mock.called == True
            assert legal_api_delivery_address_mock.called == True
            assert bor_api_mock.called == True
            assert auth_api_entity_contact_mock.called == True
            assert email_mock.called == True
            assert legal_api_ledger_mock.called == True
            assert created_submission.ledger_updated
            assert created_submission.ledger_reference_number
            assert legal_api_ledger_mock.request_history[0].json()['filing']['transparencyRegister']['ledgerReferenceNumber'] == str(created_submission.ledger_reference_number)
            verify_emails_sent(json_data, email_mock)

def test_put_plots(app, client, session, jwt, requests_mock):
    """Assure put submission works."""
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(
        f"{app.config.get('BOR_SVC_URL')}/internal/solr/update", json={'message': 'Update accepted'}
    )
    email_mock = requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}", json=mocked_entity_response
        )
        legal_api_ledger_mock = requests_mock.post(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/filings", json={'message': 'Success'}
        )
        legal_api_delivery_address_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_annual_filing
        )
        auth_api_entity_contact_mock = requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}",
            json=mocked_auth_entity_contact_response
        )

        with nested_session(session):
            auth_cache.clear()
            clear_db(session)
            mocked_username = 'wibbly wabble'
            print(json_data['businessIdentifier'])
            rv = client.post(
                '/plots',
                json=json_data,
                headers=create_header(
                    jwt_manager=jwt,
                    roles=['basic'],
                    username=mocked_username,
                    **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
                ),
            )

            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert rv.json.get('payload')
            assert rv.json['payload'].get('personStatements')
            assert rv.json['payload'].get('ownershipOrControlStatements')
            # need to get api generated statement ids
            url = f'/plots/{submission_id}'
            person_stmnt_id = rv.json['payload']['personStatements'][0]['statementID']
            ownership_stmnt_id = rv.json['payload']['ownershipOrControlStatements'][0]['statementID']
            put_data = {
                'businessIdentifier': identifier,
                'effectiveDate': '2024-09-23',
                'filingType': 'CHANGE_FILING',
                'entityStatement': {
                    'entityType': 'legalEntity',
                    'identifiers': [],
                    'isComponent': False,
                    'name': '1230113 B.C. LTD.',
                    'publicationDetails': {
                        'bodsVersion': '0.3',
                        'publicationDate': '2024-09-19',
                        'publisher': {
                            'name': 'BCROS - BC Registries and Online Services',
                            'url': 'https://www.bcregistry.gov.bc.ca/'
                        }
                    },
                    'source': {
                        'assertedBy': [
                            {
                                'name': 'BCROS - BC Registries and Online Services',
                                'uri': 'https://www.bcregistry.gov.bc.ca/'
                            }
                        ],
                        'retrievedAt': '2024-09-19T13:59:55.310Z',
                        'type': [
                            'officialRegister',
                            'verified'
                        ]
                    },
                    'statementDate': '2024-09-19',
                    'statementID': '0df55746-4d87-4500-ba14-f16e4a91bda6',
                    'statementType': 'entityStatement'
                },
                'noSignificantIndividualsExist': False,
                'ownershipOrControlStatements': [{
                    'statementID': ownership_stmnt_id,
                    'interestedParty': {'describedByPersonStatement': person_stmnt_id},
                    'interests': [],
                    'interestTypes': ['shareholding', 'votingRights']
                }],
                'personStatements': [{
                    'statementID': person_stmnt_id,
                    'names': [
                        {
                            'type': 'individual',
                            'fullName': 'Full2 Name2'
                        }
                    ]
                }]
            }
            requests_mock.get(
                f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_annual_filing
            )
            rv = client.put(
              url,
              json=put_data,
              headers=create_header(
                    jwt_manager=jwt,
                    roles=['basic'],
                    username=mocked_username,
                    **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
              ),
            )

            assert rv.status_code == HTTPStatus.OK
            json_data['personStatements'][0]['names'][0]['fullName'] = 'Full2 Name2'

            # check submission details
            updated_submission = SubmissionModel.find_by_id(submission_id)
            assert updated_submission
            assert updated_submission.business_identifier == json_data['businessIdentifier']

            # Check name changed
            assert updated_submission.person_statements_json[0]['names'][0]['fullName'] == json_data['personStatements'][0]['names'][0]['fullName']

            # post submission things all triggered
            assert legal_api_entity_mock.called == True
            assert auth_mock.called == True
            assert legal_api_delivery_address_mock.called == True
            assert bor_api_mock.called == True
            assert auth_api_entity_contact_mock.called == True
            assert email_mock.called == True
            assert legal_api_ledger_mock.called == True


def test_post_plots_auth_error(app, client, session, jwt, requests_mock):
    """Assure post submission fails with (auth get token error)."""
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), exc=requests.exceptions.ConnectTimeout)
    bor_api_mock = requests_mock.put(f"{app.config.get('BOR_SVC_URL')}/internal/solr/update", json={})
    email_mock = requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}", json=mocked_entity_response
        )
        legal_api_delivery_address_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_initial_filing
        )
        auth_api_entity_contact_mock = requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}",
            json=mocked_auth_entity_contact_response
        )

        with nested_session(session):
            auth_cache.clear()
            clear_db(session)
            rv = client.post(
                '/plots',
                json=json_data,
                headers=create_header(
                    jwt_manager=jwt,
                    roles=['basic'],
                    **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
                ),
            )
            assert rv.status_code == HTTPStatus.SERVICE_UNAVAILABLE
            submission_id = rv.json.get('id')
            assert not submission_id
            assert auth_mock.called == True
            assert legal_api_entity_mock.called == False
            assert legal_api_delivery_address_mock.called == False
            assert bor_api_mock.called == False
            assert auth_api_entity_contact_mock.called == False
            assert email_mock.called == False


def test_post_plots_bor_error(app, client, session, jwt, requests_mock):
    """Assure post submission works (bor error)."""
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(
        f"{app.config.get('BOR_SVC_URL')}/internal/solr/update", exc=requests.exceptions.ConnectTimeout
    )
    email_mock = requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )
        legal_api_ledger_mock = requests_mock.post(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/filings", json={'message': 'Success'}
        )
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}", json=mocked_entity_response
        )
        legal_api_delivery_address_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_initial_filing
        )
        auth_api_entity_contact_mock = requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}",
            json=mocked_auth_entity_contact_response
        )

        with nested_session(session):
            auth_cache.clear()
            clear_db(session)
            rv = client.post(
                '/plots',
                json=json_data,
                headers=create_header(
                    jwt_manager=jwt,
                    roles=['basic'],
                    **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
                ),
            )
            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert legal_api_entity_mock.called == True
            assert auth_mock.called == True
            assert legal_api_delivery_address_mock.called == True
            assert bor_api_mock.called == True
            assert auth_api_entity_contact_mock.called == True
            assert email_mock.called == True
            assert legal_api_ledger_mock.called == True
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']


def test_post_plots_email_error(app, client, session, jwt, requests_mock):
    """Assure post submission works (email error)."""
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(
        f"{app.config.get('BOR_SVC_URL')}/internal/solr/update", json={}
    )
    email_mock = requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", exc=requests.exceptions.ConnectTimeout)

    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}", json=mocked_entity_response
        )
        legal_api_ledger_mock = requests_mock.post(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/filings", json={'message': 'Success'}
        )
        legal_api_delivery_address_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_initial_filing
        )
        auth_api_entity_contact_mock = requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}",
            json=mocked_auth_entity_contact_response
        )

        with nested_session(session):
            auth_cache.clear()
            clear_db(session)
            rv = client.post(
                '/plots',
                json=json_data,
                headers=create_header(
                    jwt_manager=jwt,
                    roles=['basic'],
                    **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
                ),
            )
            # should have still completed even though email sending failed
            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert legal_api_entity_mock.called == True
            assert auth_mock.called == True
            assert legal_api_delivery_address_mock.called == True
            assert bor_api_mock.called == True
            assert auth_api_entity_contact_mock.called == True
            assert email_mock.called == True
            assert legal_api_ledger_mock.called == True
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']


@pytest.mark.parametrize(
    'test_name, admin_freeze, state, expected_response, errors',
    [
        ('invalid entity - frozen', True, 'ACTIVE', HTTPStatus.FORBIDDEN, ['The business is frozen']),
        ('invalid entity - historical', False, 'HISTORICAL', HTTPStatus.FORBIDDEN, ['The business is not active']),
    ],
)
def test_post_plots_invalid_entity(
    app, client, session, jwt, requests_mock, test_name, admin_freeze, state, expected_response, errors
):
    """Assure no submission is created for frozen and historical entities."""
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(
        f"{app.config.get('BOR_SVC_URL')}/internal/solr/update", json={'message': 'Update accepted'}
    )
    email_mock = requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')) as file:
        json_data = json.load(file)

        mocked_entity_response = {'business': {'adminFreeze': admin_freeze, 'state': state}}
        identifier = json_data['businessIdentifier']
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}", json=mocked_entity_response
        )
        legal_api_delivery_address_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/tasks", json=todos_initial_filing
        )
        auth_api_entity_contact_mock = requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}",
            json=mocked_auth_entity_contact_response
        )

        with nested_session(session):
            auth_cache.clear()
            clear_db(session)
            rv = client.post(
                '/plots',
                json=json_data,
                headers=create_header(
                    jwt_manager=jwt,
                    roles=['basic'],
                    **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
                ),
            )
            assert rv.status_code == expected_response
            assert rv.json.get('details') == errors
            assert auth_mock.called == True
            assert legal_api_entity_mock.called == True
            assert legal_api_delivery_address_mock.called == False
            assert bor_api_mock.called == False
            assert auth_api_entity_contact_mock.called == False
            assert email_mock.called == False


def test_get_latest_for_entity(app, client, session, jwt, requests_mock, sample_user):
    """Assure latest submission details are returned. However, there is redaction here based on jwt"""
    requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})
    with nested_session(session):
        # Setup
        clear_db(session)
        sample_user.save()
        test_identifier = 'id0'
        requests_mock.get(f"{app.config.get('LEGAL_SVC_URL')}/businesses/{test_identifier}",
                          json=mocked_entity_response)
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{test_identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        s1_dict = {
            'businessIdentifier': test_identifier,
            'effectiveDate': '2020-01-13',
            'ownershipOrControlStatements': [{
                'details': 's1',
                'interestedParty': {'describedByPersonStatement': helper_people[0]['statementID']}
            }],
            'personStatements': helper_people
        }
        s1 = SubmissionService.create_submission(s1_dict, sample_user.id)
        s1.save()
        s2_dict = {
            'businessIdentifier': test_identifier,
            'effectiveDate': '2021-01-13',
            'ownershipOrControlStatements': [{
                'details': 's2',
                'interestedParty': {'describedByPersonStatement': s1.person_statements_json[0]['statementID']},
                'statementID': s1.ownership_statements[0].ownership_json['statementID']
            }],
            'personStatements': s1.person_statements_json
        }
        s3_dict = {
            'businessIdentifier': test_identifier + 's3',
            'effectiveDate': '2024-04-22',
            'ownershipOrControlStatements': [{
                'details': 's3',
                'interestedParty': {'describedByPersonStatement': s1.person_statements_json[0]['statementID']},
                'statementID': s1.ownership_statements[0].ownership_json['statementID']
            }],
            'personStatements': s1.person_statements_json
        }

        (SubmissionService.create_submission(s2_dict, sample_user.id)).save()
        (SubmissionService.create_submission(s3_dict, sample_user.id)).save()
        mock_account_id = 1

        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{test_identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )

        ca_products = [{'code': 'CA_SEARCH', 'subscriptionStatus': 'ACTIVE'}]
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/orgs/{mock_account_id}/products?include_hidden=true", json=ca_products
        )
        # Test
        rv = client.get(
            f'/plots/entity/{test_identifier}?account_id={mock_account_id}',
            headers=create_header(
                jwt_manager=jwt,
                roles=['basic'],
                **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
            ),
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK
        assert s2_dict == rv.json.get('payload')
        assert test_identifier == rv.json['payload'].get('businessIdentifier')
        assert s2_dict['effectiveDate'] == rv.json['payload'].get('effectiveDate')


def test_get_redacted_for_entity(app, client, session, jwt, requests_mock, sample_user):
    """Assure latest submission details are returned. However, there is redaction here based on jwt"""
    requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})
    with nested_session(session):
        # Setup
        clear_db(session)
        sample_user.save()
        test_identifier = 'id0'
        requests_mock.get(f"{app.config.get('LEGAL_SVC_URL')}/businesses/{test_identifier}",
                          json=mocked_entity_response)
        requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{test_identifier}/addresses?addressType=deliveryAddress",
            json=mocked_entity_address_response
        )
        s1_dict = {
            'businessIdentifier': test_identifier,
            'effectiveDate': '2021-01-13',
            'ownershipOrControlStatements': [{
                'details': 's2',
                'interestedParty': {'describedByPersonStatement': helper_people[0]['statementID']}
            }],
            'personStatements': helper_people,
        }
        (SubmissionService.create_submission(s1_dict, sample_user.id)).save()

        mock_account_id = 1

        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/entities/{test_identifier}/authorizations",
            json={'orgMembership': 'COORDINATOR', 'roles': ['edit', 'view']},
        )

        ca_products = [{'code': 'CA_SEARCH', 'subscriptionStatus': 'NOT_SUBSCRIBED'}]
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/orgs/{mock_account_id}/products?include_hidden=true", json=ca_products
        )
        # Test
        rv = client.get(
            f'/plots/entity/{test_identifier}?account_id={mock_account_id}',
            headers=create_header(
                jwt_manager=jwt,
                roles=['basic'],
                **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1},
            ),
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

        expected_dict = {
            'businessIdentifier': 'id0',
            'effectiveDate': '2021-01-13',
            'ownershipOrControlStatements': [{
                'details': 's2',
                'interestedParty': {
                    'describedByPersonStatement': rv.json['payload']['personStatements'][0]['statementID']
                },
                'statementID': rv.json['payload']['ownershipOrControlStatements'][0]['statementID']
            }],
            'personStatements': [
                {
                    'addresses': [
                        {
                            'city': 'Victoria',
                            'country': 'CA',
                            'countryName': 'Canada',
                            'locationDescription': ' ',
                            'postalCode': ' ',
                            'region': 'BC',
                            'street': ' ',
                            'streetAdditional': ' ',
                            'type': 'residence'
                        }
                    ],
                    'hasMailingAddress': False,
                    'birthDate': '1988',
                    'email': 't***@***.com',
                    'identifiers': [{'id': '*** **5 444', 'scheme': 'CAN-TAXID', 'schemeName': 'ITN'}],
                    'names': [
                        {'fullName': 'Test Test', 'type': 'individual'},
                        {'fullName': 'tset tset', 'type': 'alternative'},
                    ],
                    'phoneNumber': {'countryCallingCode': '1', 'countryCode2letterIso': 'CA', 'number': '555***'},
                    'placeOfResidence': {
                        'city': 'Victoria',
                        'country': 'CA',
                        'countryName': 'Canada',
                        'locationDescription': ' ',
                        'postalCode': ' ',
                        'region': 'BC',
                        'street': ' ',
                        'streetAdditional': ' ',
                    },
                    'statementID': rv.json['payload']['personStatements'][0]['statementID']
                }
            ],
        }

        # validate
        assert expected_dict == rv.json.get('payload')
        assert test_identifier == rv.json['payload'].get('businessIdentifier')
        assert s1_dict['effectiveDate'] == rv.json['payload'].get('effectiveDate')
