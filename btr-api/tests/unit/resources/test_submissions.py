""" Tests to ensure that the submission based end-points work correctly.
"""
import json
import os
from http import HTTPStatus

import pytest
import requests
from sqlalchemy import text

from btr_api.models import Submission as SubmissionModel, User as UserModel
from btr_api.models import SubmissionType
from btr_api.services import SubmissionService

from tests.unit import nested_session
from tests.unit.utils import create_header

mocked_entity_response = {"business": {"adminFreeze": False, "state": "ACTIVE"}}
mocked_entity_address_response = {"registeredOffice": {"deliveryAddress": {"addressCity": "Vancouver", "addressCountry": "Canada"}}}

helper_people = [
  {
    "uuid": "2c5fd9bc-2ff1-4545-86aa-d1c02705f4cd",
    "email": "test@test.com",
    "names": [
      {
        "type": "individual",
        "fullName": "Test Test"
      },
      {
        "type": "alternative",
        "fullName": "tset tset"
      }
    ],
    "phoneNumber": {
      "number": "5555555555",
      "countryCallingCode": "1",
      "countryCode2letterIso": "CA"
    },
    "addresses": [
      {
        "city": "Victoria",
        "region": "BC",
        "street": "563 Superior St",
        "country": "CA",
        "postalCode": "V9A 5C7",
        "countryName": "Canada",
        "streetAdditional": "",
        "locationDescription": ""
      }
    ],
    "placeOfResidence": {
      "city": "Victoria",
      "region": "BC",
      "street": "563 Superior St",
      "country": "CA",
      "postalCode": "V9A 5C7",
      "countryName": "Canada",
      "streetAdditional": "",
      "locationDescription": ""
    },
    "birthDate": "1988-01-01",
    "identifiers": [
      {
        "id": "999 555 444",
        "scheme": "CAN-TAXID",
        "schemeName": "ITN"
      }
    ],
  }
]

@pytest.mark.parametrize(
    'test_name, submission_type, payload',
    [('simple json', SubmissionType.other, {'racoondog': 'red'})],
)
def test_get_plots(app, client, session, jwt, requests_mock, test_name, submission_type, payload):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        session.execute(text('delete from submission'))
        # Setup
        id = ''
        if payload:
            sub = SubmissionModel()
            sub.business_identifier = 'identifier0'
            sub.payload = payload
            sub.type = submission_type
            session.add(sub)
            session.commit()
            id = sub.id

        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{sub.business_identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})
        # Test
        rv = client.get(f'/plots/{id}',
                        headers=create_header(jwt, ['basic'], **{'Accept-Version': 'v1',
                                                                 'content-type': 'application/json',
                                                                 'Account-Id': 1}))

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

        if payload:
            for key, value in payload.items():
                assert key in rv.text
                assert value in rv.text


_valid_auth_response = {"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']}
_forbidden_auth_response2 = {"orgMembership": "COORDINATOR", 'roles': ['no_edit_role', 'view']}
_forbidden_auth_response = {}


@pytest.mark.parametrize(
    "test_name, business_identifier, auth_svc_response, has_auth_header, expected_http_status",
    [
        ('Good path', 'identifier0', _valid_auth_response, True, HTTPStatus.OK),
        ('Bad path, no auth header', 'identifier0', _valid_auth_response, False, HTTPStatus.UNAUTHORIZED),
        ('Bad path, no edit role', 'identifier0', _forbidden_auth_response2, True, HTTPStatus.FORBIDDEN),
        ('Bad path, not allowed', 'identifier0', _forbidden_auth_response, True, HTTPStatus.FORBIDDEN)
    ]
)
def test_get_plots_auth(app, client, session, jwt, requests_mock, test_name, business_identifier, auth_svc_response,
                        has_auth_header, expected_http_status):
    """Test scenarios connected to authentication on plots endpoint."""
    with nested_session(session):
        session.execute(text('delete from submission'))
        # Setup
        sub = SubmissionModel()
        sub.business_identifier = 'identifier0'
        sub.payload = {'racoondog': 'red'}
        sub.type = SubmissionType.other
        session.add(sub)
        session.commit()
        search_id = sub.id

        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{business_identifier}/authorizations",
                          json=auth_svc_response)

        headers = create_header(jwt,
                                ['basic'],
                                **{'Accept-Version': 'v1',
                                   'content-type': 'application/json',
                                   'Account-Id': 1})

        if not has_auth_header:
            headers = {'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}

        # Test
        rv = client.get(f'/plots/{search_id}', headers=headers)

    # Confirm outcome
    assert rv.status_code == expected_http_status


def test_post_plots_db_mocked(app, session, client, jwt, mocker, requests_mock):
    """Assure post submission works (db mocked)."""
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests", json={'id': 978})
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(f"{app.config.get('BOR_SVC_URL')}/internal/solr/update",
                                     json={'message': 'Update accepted'})

    current_dir = os.path.dirname(__file__)
    mock_user_save = mocker.patch.object(UserModel, 'save')
    mock_submission_save = mocker.patch.object(SubmissionModel, 'save')
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}",
            json=mocked_entity_response
        )
        legal_api_entity_addresses_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses",
            json=mocked_entity_address_response
        )

        rv = client.post('/plots',
                         json=json_data,
                         headers=create_header(jwt, ['basic'], **{'Accept-Version': 'v1',
                                                                  'Authoriztion': 'Bearer 123',
                                                                  'content-type': 'application/json',
                                                                  'Account-Id': 1}))
        assert rv.status_code == HTTPStatus.CREATED

    mock_user_save.assert_called_once()
    mock_submission_save.assert_called()
    assert legal_api_entity_mock.called == True
    assert pay_api_mock.called == True
    assert auth_mock.called == True
    assert legal_api_entity_addresses_mock.called == True
    assert bor_api_mock.called == True
    assert pay_api_mock.request_history[0].json() == {
        'filingInfo': {'filingTypes': [{'filingTypeCode': 'REGSIGIN'}]},
        'businessInfo': {'corpType': 'BTR', 'businessIdentifier': json_data['businessIdentifier']},
        'details': [{'label': 'Incorporation Number: ', 'value': json_data['businessIdentifier']}]}
    assert bor_api_mock.request_history[0].json() == {
        'business': {
            'addresses': [mocked_entity_address_response['registeredOffice']['deliveryAddress']],
            'adminFreeze': False,
            'state': 'ACTIVE'
        },
        'owners': [
            {
                'interestedParty': {
                    'describedByPersonStatement': 'bd4061d6-1a24-4356-93f3-c489b56610a4',
                    'birthDate': '1980-06-13',
                    'email': 'test@test.gov.bc.ca',
                    'hasTaxNumber': True,
                    'isComponent': False,
                    'names': [{'fullName': 'Full1 Name1', 'type': 'individual'}],
                    'nationalities': [{'code': 'CA', 'name': 'Canada'}],
                    'personType': 'knownPerson',
                    'publicationDetails': {'bodsVersion': '1.0', 'publicationDate': '2022-12-31', 'publisher': {'name': 'Publisher Name', 'source': {'url': 'http://source.url'}, 'uri': 'http://publisher.uri'}},
                    'source': {'asserted': '2023-02-18', 'description': 'The description', 'metadata': 'Metadata', 'retrievedAt': '2023-02-28T23:17:17Z', 'url': 'https://yourwebsite.com'},
                    'statementDate': '2023-02-28',
                    'statementID': 'bd4061d6-1a24-4356-93f3-c489b56610a4',
                    'statementType': 'personStatement'
                },
                'interests': [
                    {'beneficialOwnershipOrControl': True, 'details': 'controlType.sharesOrVotes.registeredOwner', 'directOrIndirect': 'unknown', 'share': {'maximum': 75, 'minimum': 50}, 'startDate': '2023-03-01', 'type': 'shareholding'},
                    {'beneficialOwnershipOrControl': True, 'details': '', 'directOrIndirect': 'direct', 'startDate': '2023-01-01', 'type': 'appointmentOfBoard'}
                ],
                'isComponent': False,
                'publicationDetails': {'bodsVersion': '1.0', 'publicationDate': '2022-12-31', 'publisher': {'name': 'Publisher Name', 'source': {'url': 'http://source.url'}, 'uri': 'http://publisher.uri'}},
                'source': {'asserted': '2023-02-18', 'description': 'The description', 'metadata': 'Metadata', 'retrievedAt': '2023-02-28T23:17:17Z', 'url': 'https://yourwebsite.com'},
                'statementDate': '2023-02-28',
                'statementID': 'bd4061d6-1a24-4356-93f3-c489b56610a3',
                'statementType': 'ownershipOrControlStatement',
                'subject': {'describedByEntityStatement': 'bd4061d6-1a24-4356-93f3-c489b56610a2'}
            },
            {
                'interestedParty': {
                    'describedByPersonStatement': '123456ab123456ab123456ab123456ab123456ab123456ab123456ab1234',
                    'birthDate': '1997-04-23',
                    'email': 'test2@test2.gov.bc.ca',
                    'hasTaxNumber': True,
                    'isComponent': False,
                    'names': [{'fullName': 'Full2 Name2', 'type': 'individual'}, {'fullName': 'preffered2', 'type': 'alternative'}],
                    'nationalities': [{'code': 'FR', 'name': 'France'}],
                    'personType': 'knownPerson',
                    'publicationDetails': {'bodsVersion': '1.0', 'publicationDate': '2022-12-31', 'publisher': {'name': 'Publisher Name', 'source': {'url': 'http://source.url'}, 'uri': 'http://publisher.uri'}},
                    'source': {'asserted': '2023-02-18', 'description': 'The description', 'metadata': 'Metadata', 'retrievedAt': '2023-02-28T23:17:17Z', 'url': 'https://yourwebsite.com'},
                    'statementDate': '2023-02-28',
                    'statementID': '123456ab123456ab123456ab123456ab123456ab123456ab123456ab1234',
                    'statementType': 'personStatement'
                },
                'interests': [
                    {'beneficialOwnershipOrControl': True, 'details': 'controlType.sharesOrVotes.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'maximum': 50, 'minimum': 25}, 'startDate': '2023-03-01', 'type': 'votingRights'},
                    {'beneficialOwnershipOrControl': True, 'details': '', 'directOrIndirect': 'direct', 'startDate': '2023-01-01', 'type': 'appointmentOfBoard'}
                ],
                'isComponent': False,
                'publicationDetails': {'bodsVersion': '1.0', 'publicationDate': '2022-12-31', 'publisher': {'name': 'Publisher Name', 'source': {'url': 'http://source.url'}, 'uri': 'http://publisher.uri'}},
                'source': {'asserted': '2023-02-18', 'description': 'The description', 'metadata': 'Metadata', 'retrievedAt': '2023-02-28T23:17:17Z', 'url': 'https://yourwebsite.com'},
                'statementDate': '2023-02-28',
                'statementID': '9876qw9876qw9876qw9876qw9876qw9876qw9876qw9876qw9876qw9876qw',
                'statementType': 'ownershipOrControlStatement',
                'subject': {'describedByEntityStatement': 'bd4061d6-1a24-4356-93f3-c489b56610a2'}
            }
        ]
    }


def test_post_plots(app, client, session, jwt, requests_mock):
    """Assure post submission works."""
    mocked_invoice_id = 9876
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests",
                                      json={'id': mocked_invoice_id})
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(f"{app.config.get('BOR_SVC_URL')}/internal/solr/update",
                                     json={'message': 'Update accepted'})

    current_dir = os.path.dirname(__file__)
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}",
            json=mocked_entity_response
        )
        legal_api_entity_addresses_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses",
            json=mocked_entity_address_response
        )

        with nested_session(session):
            mocked_username = 'wibbly wabble'
            rv = client.post('/plots',
                             json=json_data,
                             headers=create_header(jwt_manager=jwt,
                                                   roles=['basic'],
                                                   username=mocked_username,
                                                   **{'Accept-Version': 'v1',
                                                      'content-type': 'application/json',
                                                      'Account-Id': 1}))

            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert legal_api_entity_mock.called == True
            assert pay_api_mock.called == True
            assert legal_api_entity_addresses_mock.called == True
            assert bor_api_mock.called == True
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']
            # check pay link
            assert created_submission.invoice_id == mocked_invoice_id
            # check user link
            assert created_submission.submitter_id
            user = UserModel.find_by_id(created_submission.submitter_id)
            assert user.username == mocked_username


def test_post_plots_pay_error(app, client, session, jwt, requests_mock):
    """Assure post submission works (pay error)."""
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests",
                                      exc=requests.exceptions.ConnectTimeout)
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(f"{app.config.get('BOR_SVC_URL')}/internal/solr/update",
                                     json={'message': 'Update accepted'})

    current_dir = os.path.dirname(__file__)
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}",
            json=mocked_entity_response
        )
        legal_api_entity_addresses_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses",
            json=mocked_entity_address_response
        )

        with nested_session(session):
            rv = client.post('/plots',
                             json=json_data,
                             headers=create_header(jwt_manager=jwt,
                                                   roles=['basic'],
                                                   **{'Accept-Version': 'v1',
                                                      'content-type': 'application/json',
                                                      'Account-Id': 1}))
            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert legal_api_entity_mock.called == True
            assert pay_api_mock.called == True
            assert auth_mock.called == True
            assert legal_api_entity_addresses_mock.called == True
            assert bor_api_mock.called == True
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']
            # no pay link
            assert not created_submission.invoice_id


def test_post_plots_auth_error(app, client, session, jwt, requests_mock):
    """Assure post submission works (auth get token error)."""
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests", json={'id': 1234})
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), exc=requests.exceptions.ConnectTimeout)
    bor_api_mock = requests_mock.put(f"{app.config.get('BOR_SVC_URL')}/internal/solr/update", json={})

    current_dir = os.path.dirname(__file__)
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}",
            json=mocked_entity_response
        )
        legal_api_entity_addresses_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses",
            json=mocked_entity_address_response
        )

        with nested_session(session):
            rv = client.post('/plots',
                             json=json_data,
                             headers=create_header(jwt_manager=jwt,
                                                   roles=['basic'],
                                                   **{'Accept-Version': 'v1',
                                                      'content-type': 'application/json',
                                                      'Account-Id': 1}))
            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert legal_api_entity_mock.called == True
            assert pay_api_mock.called == True
            assert auth_mock.called == True
            assert legal_api_entity_addresses_mock.called == False
            assert bor_api_mock.called == False
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']


def test_post_plots_bor_error(app, client, session, jwt, requests_mock):
    """Assure post submission works (bor error)."""
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests", json={'id': 1234})
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(f"{app.config.get('BOR_SVC_URL')}/internal/solr/update",
                                     exc=requests.exceptions.ConnectTimeout)

    current_dir = os.path.dirname(__file__)
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)

        identifier = json_data['businessIdentifier']
        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}",
            json=mocked_entity_response
        )
        legal_api_entity_addresses_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses",
            json=mocked_entity_address_response
        )

        with nested_session(session):
            rv = client.post('/plots',
                             json=json_data,
                             headers=create_header(jwt_manager=jwt,
                                                   roles=['basic'],
                                                   **{'Accept-Version': 'v1',
                                                      'content-type': 'application/json',
                                                      'Account-Id': 1}))
            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert legal_api_entity_mock.called == True
            assert pay_api_mock.called == True
            assert auth_mock.called == True
            assert legal_api_entity_addresses_mock.called == True
            assert bor_api_mock.called == True
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']


@pytest.mark.parametrize("test_name, admin_freeze, state, expected_response, errors", [
    ("invalid entity - frozen", True, "ACTIVE", HTTPStatus.FORBIDDEN, ['The business is frozen']),
    ("invalid entity - historical", False, "HISTORICAL", HTTPStatus.FORBIDDEN, ['The business is not active'])
])
def test_post_plots_invalid_entity(app, client, session, jwt, requests_mock, test_name, admin_freeze, state,
                                   expected_response, errors):
    """Assure no submission is created for frozen and historical entities."""
    mocked_invoice_id = 9876
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests",
                                      json={'id': mocked_invoice_id})
    auth_mock = requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    bor_api_mock = requests_mock.put(f"{app.config.get('BOR_SVC_URL')}/internal/solr/update",
                                     json={'message': 'Update accepted'})

    current_dir = os.path.dirname(__file__)
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)

        mocked_entity_response = {"business": {"adminFreeze": admin_freeze, "state": state}}
        identifier = json_data['businessIdentifier']
        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})
        legal_api_entity_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}",
            json=mocked_entity_response
        )
        legal_api_entity_addresses_mock = requests_mock.get(
            f"{app.config.get('LEGAL_SVC_URL')}/businesses/{identifier}/addresses",
            json=mocked_entity_address_response
        )

        with nested_session(session):
            rv = client.post('/plots',
                             json=json_data,
                             headers=create_header(jwt_manager=jwt,
                                                   roles=['basic'],
                                                   **{'Accept-Version': 'v1',
                                                      'content-type': 'application/json',
                                                      'Account-Id': 1}))
            assert rv.status_code == expected_response
            assert rv.json.get('details') == errors
            assert legal_api_entity_mock.called == True
            assert pay_api_mock.called == False
            assert auth_mock.called == False
            assert legal_api_entity_addresses_mock.called == False
            assert bor_api_mock.called == False


def test_get_latest_for_entity(app, client, session, jwt, requests_mock):
    """Assure latest submission details are returned."""
    """However, there is redaction here based on jwt"""
    with nested_session(session):
        # Setup
        user = UserModel()
        user.save()
        test_identifier = 'id0'
        s1_dict = {
            'businessIdentifier': test_identifier,
            'effectiveDate': '2020-01-13',
            'ownershipOrControlStatements': {'details': 's1'}
        }
        s2_dict = {
            'businessIdentifier': test_identifier,
            'effectiveDate': '2021-01-13',
            'ownershipOrControlStatements': {'details': 's2'},
            "personStatements": helper_people
        }
        s3_dict = {
            'businessIdentifier': test_identifier + 's3',
            'effectiveDate': '2024-04-22',
            'ownershipOrControlStatements': {'details': 's3'}
        }
        (SubmissionService.create_submission(s1_dict, user.id)).save()
        (SubmissionService.create_submission(s2_dict, user.id)).save()
        (SubmissionService.create_submission(s3_dict, user.id)).save()
        mock_account_id = 1

        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{test_identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})

        ca_products = [{"code": "CA_SEARCH", "subscriptionStatus": "ACTIVE"}]
        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/orgs/{mock_account_id}/products?include_hidden=true",
                          json=ca_products)
        # Test
        rv = client.get(f'/plots/entity/{test_identifier}?account_id={mock_account_id}',
                        headers=create_header(jwt_manager=jwt,
                                              roles=['basic'],
                                              **{'Accept-Version': 'v1',
                                                 'content-type': 'application/json',
                                                 'Account-Id': 1}))

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

        assert test_identifier == rv.json.get('business_identifier')
        assert s2_dict['effectiveDate'] == rv.json.get('effective_date')
        assert s2_dict == rv.json.get('payload')

def test_get_redacted_for_entity(app, client, session, jwt, requests_mock):
    """Assure latest submission details are returned."""
    """However, there is redaction here based on jwt"""
    with nested_session(session):
        # Setup
        user = UserModel()
        user.save()
        test_identifier = 'id0'
        s1_dict = {
            'businessIdentifier': test_identifier,
            'effectiveDate': '2021-01-13',
            'ownershipOrControlStatements': {'details': 's2'},
            "personStatements": helper_people,
        }
        (SubmissionService.create_submission(s1_dict, user.id)).save()
        
        mock_account_id = 1

        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{test_identifier}/authorizations",
                          json={"orgMembership": "COORDINATOR", 'roles': ['edit', 'view']})

        ca_products = [{"code": "CA_SEARCH", "subscriptionStatus": "NOT_SUBSCRIBED"}]
        requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/orgs/{mock_account_id}/products?include_hidden=true",
                          json=ca_products)
        # Test
        rv = client.get(f'/plots/entity/{test_identifier}?account_id={mock_account_id}',
                        headers=create_header(jwt_manager=jwt,
                                              roles=['basic'],
                                              **{'Accept-Version': 'v1',
                                                 'content-type': 'application/json',
                                                 'Account-Id': 1}))

        expected_dict = {
          'businessIdentifier': 'id0',
          'effectiveDate': '2021-01-13',
          'ownershipOrControlStatements': {
              'details': 's2'
          },
          'personStatements': [{
              'addresses': [{
                  'city': 'Victoria',
                  'country': 'CA',
                  'countryName': 'Canada',
                  'locationDescription': ' ',
                  'postalCode': ' ',
                  'region': 'BC',
                  'street': ' ',
                  'streetAdditional': ' '
              }],
              'birthDate': ' ',
              'email': ' ',
              'identifiers': [{
                  'id': ' ',
                  'scheme': 'CAN-TAXID',
                  'schemeName': 'ITN'
              }],
              'names': [
                {
                  'fullName': 'Test Test',
                  'type': 'individual'
                },
                {
                    'fullName': ' ',
                    'type': 'alternative'
                }
              ],
              'phoneNumber': {
                  'countryCallingCode': '1',
                  'countryCode2letterIso': 'CA',
                  'number': ' '
              },
              'placeOfResidence': {
                  'city': 'Victoria',
                  'country': 'CA',
                  'countryName': 'Canada',
                  'locationDescription': ' ',
                  'postalCode': ' ',
                  'region': 'BC',
                  'street': ' ',
                  'streetAdditional': ' '
              },
              'uuid': '2c5fd9bc-2ff1-4545-86aa-d1c02705f4cd'
          }],
        }

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

        assert test_identifier == rv.json.get('business_identifier')
        assert s1_dict['effectiveDate'] == rv.json.get('effective_date')
        assert expected_dict == rv.json.get('payload')
