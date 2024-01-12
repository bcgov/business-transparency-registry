from datetime import date
from btr_api.services.submission import SubmissionService


def test_create_submission():
    # Mock the submission dictionary
    submission_dict = {
        'effectiveDate': '2023-12-31',
        'significantIndividuals': [
            {
                'profile': {
                    'uuid': '123-abc'
                },
                'businessIdentifier': 'identifier1'
            },
            {
                'businessIdentifier': 'identifier2'
            }
        ],
        'businessIdentifier': 'business1'
    }

    submission = SubmissionService.create_submission(submission_dict=submission_dict)

    # Assert the properties of the resulting SubmissionModel instance
    assert submission.effective_date == date.fromisoformat(submission_dict['effectiveDate'])
    assert submission.payload == submission_dict
