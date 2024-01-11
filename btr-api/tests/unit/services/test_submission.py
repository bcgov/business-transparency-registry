from unittest.mock import patch, MagicMock
from datetime import date
from btr_api.models import Person as PersonModel
from btr_api.services.submission import SubmissionService
from btr_api.services.person import PersonService
from btr_api.services.ownership_details import OwnershipDetailsService


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

    with (patch.object(PersonModel, 'find_by_uuid') as mock_find_by_uuid,
          patch.object(PersonService, 'create_person_from_owner') as mock_create_person_from_owner,
          patch.object(OwnershipDetailsService,
                       'create_ownership_details_from_owner') as mock_create_ownership_details_from_owner
          ):
        # Return values of the mocked methods
        mock_find_by_uuid.return_value = MagicMock()
        mock_create_person_from_owner.return_value = MagicMock()
        mock_create_ownership_details_from_owner.return_value = MagicMock()

        submission = SubmissionService.create_submission(submission_dict=submission_dict)

        # Assert find_by_uuid is called with the proper parameter
        mock_find_by_uuid.assert_called_with(search_uuid='123-abc')

        # Assert create_ownership_details_from_owner is called with the proper parameters
        mock_create_ownership_details_from_owner.assert_any_call(
            owner_dict=submission_dict['significantIndividuals'][0],
            person=mock_find_by_uuid.return_value)
        mock_create_ownership_details_from_owner.assert_any_call(
            owner_dict=submission_dict['significantIndividuals'][1],
            person=mock_create_person_from_owner.return_value)

        # Assert the properties of the resulting SubmissionModel instance
        assert submission.effective_date == date.fromisoformat(submission_dict['effectiveDate'])
        assert submission.payload == submission_dict
