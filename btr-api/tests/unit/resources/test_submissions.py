""" Tests to ensure that the submission based end-points work correctly.
"""
from http import HTTPStatus

import pytest

from btr_api.models import Submission as SubmissionModel
from btr_api.models import SubmissionType

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
            sub = SubmissionModel()
            sub.payload = payload
            sub.type = submission_type
            session.add(sub)
            session.commit()
            id = sub.id

        # Test
        rv = client.get(f"/plots/{id}")

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

        if payload:
            for key, value in payload.items():
                assert key in rv.text
                assert value in rv.text


def test_post_plots_db_mocked(client, mocker):
    """Assure post submission works (db mocked)."""
    mock_submission_save = mocker.patch.object(SubmissionModel, 'save')

    rv = client.post("/plots", json=TEST_SI_FILING, content_type='application/json')
    assert rv.status_code == HTTPStatus.CREATED

    mock_submission_save.assert_called_once()


def test_post_plots(client, session):
    """Assure post submission works."""
    with nested_session(session):
        rv = client.post("/plots", json=TEST_SI_FILING, content_type='application/json')
        assert rv.status_code == HTTPStatus.CREATED
