from datetime import date

from btr_api.services.auth import auth_cache
from btr_api.models.request import Request
from btr_api.services.request import RequestService

from tests.unit import nested_session
from tests.unit.utils import REQUEST_DICT
from tests.unit.utils.db_helpers import clear_db


def test_create_request(session, app, requests_mock):
    """Assure the create request works as expected."""
    requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    with nested_session(session):
        auth_cache.clear()
        request = RequestService.create_request(REQUEST_DICT)
        request.save()
        # Assert the properties of the resulting SubmissionModel instance
        assert request.birthdate == date.fromisoformat(REQUEST_DICT['birthdate'])
        assert request.full_name == REQUEST_DICT['fullName']
        assert request.email == REQUEST_DICT['email']
        assert request.business_identifier == REQUEST_DICT['businessIdentifier']
        assert request.information_to_omit == REQUEST_DICT['informationToOmit']
        assert request.individual_at_risk == REQUEST_DICT['individualAtRisk']
        assert request.reasons == REQUEST_DICT['reasons']
        assert request.completing_party == REQUEST_DICT['completingParty']
        assert request.completing_name == REQUEST_DICT['completingName']
        assert request.completing_email == REQUEST_DICT['completingEmail']
        assert request.completing_phone == REQUEST_DICT['completingPhoneNumber']
        assert request.completing_address == REQUEST_DICT['completingMailingAddress']
        assert request.supporting_documents == REQUEST_DICT['supportingDocuments']

def test_update_request(session, app, requests_mock):
    """Assure the create request works as expected."""
    requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    with nested_session(session):
        auth_cache.clear()
        request_dict2={
            'fullName': 'edited',
            'email': 'edited@email.ca'
        }
        req = Request(REQUEST_DICT)
        request = RequestService.update_request(req, request_dict2)
        request.save()
        # Assert the properties of the resulting SubmissionModel instance
        assert request.birthdate == date.fromisoformat(REQUEST_DICT['birthdate'])
        assert request.full_name == request_dict2['fullName']
        assert request.email == request_dict2['email']
        assert request.business_identifier == REQUEST_DICT['businessIdentifier']
        assert request.information_to_omit == REQUEST_DICT['informationToOmit']
        assert request.individual_at_risk == REQUEST_DICT['individualAtRisk']
        assert request.reasons == REQUEST_DICT['reasons']
        assert request.completing_party == REQUEST_DICT['completingParty']
        assert request.completing_name == REQUEST_DICT['completingName']
        assert request.completing_email == REQUEST_DICT['completingEmail']