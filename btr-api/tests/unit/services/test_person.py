""" Tests to ensure that the person services and serialization work correctly.
"""
import json

import pytest

from btr_api.models import OwnershipDetails, Person
from btr_api.services.ownership_details import OwnershipDetailsSerializer, OwnershipDetailsService
from btr_api.services.person import PersonSerializer, PersonService
from tests.unit import nested_session

person_example = {
    'full_name': 'This is persons full name',
    'family_name': None,
    'given_name': None,
    'patronymic_name': None,
    'date_of_birth': '1980-01-01',
    'is_permanent_resident': False,
    'is_canadian_citizen': False,
    'is_canadian_tax_resident': False,
}

submission_details_example = {
    'person': person_example
}


@pytest.mark.parametrize(
    "test_name, person_details_dict",
    [
        ("test ownership_details dic is converted to model", person_example),
    ],
)
def test_convert_dict_to_model(client, session, test_name, person_details_dict):
    with nested_session(session):
        model: Person = PersonSerializer.from_dict(person_details_dict)

        assert model

        model.save()
        assert model.id
        assert model.full_name == person_details_dict['full_name']
        assert model.family_name is None
        assert model.given_name is None

        assert model.uuid is not None
        assert model.created_at is not None


@pytest.mark.parametrize(
    "test_name, submission_details_dict",
    [
        ("test ownership_details dic is converted to model", submission_details_example),
    ],
)
def test_create_model_from_json(client, session, test_name, submission_details_dict):
    with nested_session(session):
        model = PersonService.save_person_from_submission(submission_dict=submission_details_dict)

        assert model

        from_db: Person = Person.find_by_id(model.id)
        assert from_db

        assert from_db.person_id == submission_details_dict['id']
        assert model.full_name == submission_details_dict['person']['full_name']
        assert model.family_name is None
        assert model.uuid is not None
        assert model.created_at is not None
