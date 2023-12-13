""" Tests to ensure that the submission based end-points work correctly.
"""
from http import HTTPStatus

import pytest

from btr_api.models import Submission as SubmissionModel
from btr_api.models import Person as PersonModel
from btr_api.models import SubmissionType
from btr_api.services.person import PersonService
from btr_api.services.ownership_details import OwnershipDetailsService

from tests.unit import nested_session, TEST_SI_FILING


@pytest.mark.parametrize(
    "test_name, submission_type, payload",
    [("no id", SubmissionType.other, None), ("simple json", SubmissionType.other, {"racoondog": "red"})],
)
def test_get_plots(client, session, test_name, submission_type, payload):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        # Setup
        id = ""
        if payload:
            sub = Submission()
            sub.payload = payload
            sub.type = submission_type
            session.add(sub)
            session.commit()
            id = sub.id

        # Test
        rv = client.get(f"/plots/{id}")

        # Confirm outcome
        print(test_name)
        assert rv.status_code == HTTPStatus.OK

        if payload:
            for key, value in payload.items():
                assert key in rv.text
                assert value in rv.text


def test_post_plots(client, mocker):
    mock_submission_save = mocker.patch.object(SubmissionModel, 'save')
    mock_find_by_uuid = mocker.patch.object(PersonModel, 'find_by_uuid')
    mock_save_person = mocker.patch.object(PersonService, 'save_person_from_submission')
    mock_save_ownership = mocker.patch.object(OwnershipDetailsService, 'save_ownership_details_from_submission')

    rv = client.post("/plots", json=TEST_SI_FILING, content_type='application/json')
    
    assert rv.status_code == HTTPStatus.CREATED

    mock_submission_save.assert_called_once()
    mock_find_by_uuid.assert_called()
    mock_save_person.assert_called()
    mock_save_ownership.assert_called()

    assert mock_save_ownership.call_count == len(TEST_SI_FILING['significantIndividuals'])
