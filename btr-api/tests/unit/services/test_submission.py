from datetime import date

from btr_api.services.auth import auth_cache
from btr_api.services.submission import SubmissionService

from tests.unit import nested_session
from tests.unit.models.test_user import sample_user
from tests.unit.utils import SUBMISSION_DICT
from tests.unit.utils.db_helpers import clear_db


def test_create_submission(session, app, requests_mock, sample_user):
    """Assure the create submission works as expected."""
    requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})
    business_identifier = SUBMISSION_DICT['businessIdentifier']

    requests_mock.get(f"{app.config.get('LEGAL_SVC_URL')}/businesses/{business_identifier}",
                      json={'business': {'identifier': business_identifier, 'legalName': 'test'}})
    requests_mock.get(
        f"{app.config.get('LEGAL_SVC_URL')}/businesses/{business_identifier}/addresses?addressType=deliveryAddress",
        json={'deliveryAddress': {'addressCity': 'Vancouver', 'addressCountry': 'Canada', 'streetAddress': 'Fake Street'}}
    )
    requests_mock.get(f"{app.config.get('AUTH_SVC_URL')}/entities/{business_identifier}",
                      json={'contacts': [{'email': 'test', 'phone': '123'}]})
    with nested_session(session):
        auth_cache.clear()
        clear_db(session)
        sample_user.save()
        submission = SubmissionService.create_submission(submission_dict=SUBMISSION_DICT,
                                                         submitter_id=sample_user.id)
        submission.save()
        # Assert the properties of the resulting SubmissionModel instance
        assert submission.effective_date == date.fromisoformat(SUBMISSION_DICT['effectiveDate'])
        assert submission.business_identifier == SUBMISSION_DICT['businessIdentifier']
        assert submission.submitter == sample_user
        assert submission.submitted_payload == SUBMISSION_DICT
        # Assert ownership / person statements created
        assert len(submission.ownership_statements) == len(SUBMISSION_DICT['ownershipOrControlStatements'])
        assert len(submission.person_statements_json) == len(SUBMISSION_DICT['personStatements'])
