""" Tests to ensure that the submission based end-points work correctly.
"""
from http import HTTPStatus

import pytest

from btr_api.models import Submission
from btr_api.models import Person as PersonModel
from btr_api.models import OwnershipDetails as OwnershipDetailsModel
from btr_api.models import SubmissionType

from tests.unit import nested_session


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


def test_post_plots(client, session):
    json_data = {
        "envelope": {"header": {"headerDetail": "metainfo"}, "body": [{"detail": "line1"}, {"detail": "line2"}]}
    }

    rv = client.post("/plots", json=json_data)

    assert rv.status_code == HTTPStatus.CREATED

    submission = Submission.find_by_id(rv.json.get("id"))
    assert submission
    assert submission.payload == json_data


def test_person_with_uuid(client, session):
    uuid = "a37cf085-b8d2-4d41-862d-db674117aa86"
    json_data = {
        "person": {"uuid": uuid},
        "ownership_details": {
            "business_identifier": "BC123465667",
            "control_type": "shares",
            "control_percent": 27
        }
    }

    with nested_session(session):
        # Setup
        person = PersonModel()
        person.uuid = uuid
        person.full_name = "test 123 123"
        person.date_of_birth = "1989-01-01"
        person.save()

        # test
        rv = client.post("/plots", json=json_data)

        assert rv.status_code == HTTPStatus.CREATED

        submission = Submission.find_by_id(rv.json.get("id"))
        assert submission
        assert submission.payload == json_data

        ownership_details: OwnershipDetailsModel = OwnershipDetailsModel.find_by_submission_id(submission.id)
        assert ownership_details
        assert ownership_details.person_id == person.id
