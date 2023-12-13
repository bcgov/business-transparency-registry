""" Tests to ensure that the person services and serialization work correctly.
"""
import pytest

from btr_api.models import Person
from btr_api.services.person import PersonSerializer, PersonService

from tests.unit import nested_session

person_example = {
    'fullName': 'This is persons full name',
    'familyName': None,
    'givenName': None,
    'patronymicName': None,
    'birthDate': '1980-01-01'
}

owner_dict = {
    'profile': person_example
}


@pytest.mark.parametrize(
    "test_name, person_details_dict",
    [
        ("test ownership_details dic is converted to model", person_example),
    ],
)
def test_convert_dict_to_model(client, session, test_name, person_details_dict):
    with nested_session(session):
        model = PersonSerializer.from_dict(person_details_dict)

        assert model

        model.save()
        assert model.id
        assert model.full_name == person_details_dict['fullName']
        assert model.family_name is None
        assert model.given_name is None

        assert model.uuid is not None
        assert model.created_at is not None


@pytest.mark.parametrize(
    "test_name, submission_details_dict",
    [
        ("test ownership_details dic is converted to model", owner_dict),
    ],
)
def test_create_model_from_json(session, test_name, submission_details_dict):
    """Assure the create person method works as expected."""
    with nested_session(session):
        person = PersonService.create_person_from_owner(owner_dict)
        assert person
        person.save()

        assert person.full_name == owner_dict['profile']['fullName']
        assert person.family_name is None
        assert person.uuid is not None
        assert person.created_at is not None
