""" Tests to ensure that the ownership details services and serialization work correctly.
"""
import json

import pytest

from btr_api.models import OwnershipDetails
from btr_api.services.ownership_details import OwnershipDetailsSerializer, OwnershipDetailsService
from tests.unit import nested_session

ownership_details = {
    'business_identifier': 'BC12345',
    'person_id': 1,
    'additional_text': 'Some additional text.',
    'control_type': 'test_control',
    'control_percent': ''
}

submission_details = {
    'ownership_details': ownership_details
}


@pytest.mark.parametrize(
    "test_name, ownership_details_dict",
    [
        ("test ownership_details dic is converted to model", ownership_details),
    ],
)
def test_convert_dict_to_model(client, session, test_name, ownership_details_dict):
    with nested_session(session):
        model = OwnershipDetailsSerializer.from_dict(ownership_details_dict)

        assert model

        model.save()
        assert model.id
        assert model.person_id
        assert model.business_identifier == ownership_details_dict['business_identifier']


@pytest.mark.parametrize(
    "test_name, submission_details_dict",
    [
        ("test ownership_details dic is converted to model", submission_details),
    ],
)
def test_create_model_from_json(client, session, test_name, submission_details_dict):
    with nested_session(session):
        submission_details_json = json.dumps(submission_details_dict)
        model = OwnershipDetailsService.save_ownership_details_from_submission(submission_dict=submission_details_json)

        assert model

        from_db: OwnershipDetails = OwnershipDetails.find_by_id(model.id)
        assert from_db

        assert from_db.person_id == submission_details_dict['id']
        assert from_db.business_identifier == submission_details_dict['ownership_details']['business_identifier']
