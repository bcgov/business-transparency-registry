""" Tests to ensure that the ownership details services and serialization work correctly.
"""
import pytest

from btr_api.models import Person
from btr_api.services.ownership_details import OwnershipDetailsSerializer, OwnershipDetailsService
from tests.unit import nested_session

ownership_details = {
    'businessIdentifier': 'BC12345',
    'controlType': {
        "sharesVotes": {
            "registeredOwner": True,
            "beneficialOwner": False,
            "indirectControl": True,
            "inConcertControl": False
        },
        "directors": {
        "directControl": True,
        "indirectControl": False,
        "significantInfluence": True,
        "inConcertControl": True
        },
        "other": "Other control details"
    },
    'missingInfoReason': 'bla bla',
    "percentOfShares": "25",
    "percentOfVotes": "30",
    "startDate": "2023-01-01",
    "action": "add"
}


@pytest.mark.parametrize(
    "test_name, ownership_details_dict",
    [
        ("test ownership_details dic is converted to model", ownership_details),
    ],
)
def test_convert_dict_to_model(session, test_name, ownership_details_dict):
    """Assure the ownership details from_dict method works."""
    with nested_session(session):
        model = OwnershipDetailsSerializer.from_dict(ownership_details_dict)

        assert model is not None

        model.save()
        assert model.id
        assert model.business_identifier == ownership_details_dict['businessIdentifier']


@pytest.mark.parametrize(
    "test_name, ownership_details_dict, person",
    [
        ("test ownership_details dic is converted to model", ownership_details, Person()),
    ],
)
def test_create_ownership_details(client, session, test_name, ownership_details_dict, person):
    """Assure the ownership details service create works as expected."""
    with nested_session(session):
        model = OwnershipDetailsService.create_ownership_details_from_owner(owner_dict=ownership_details_dict, person=person)

        assert model is not None
        model.save()
        
        assert model.business_identifier == ownership_details_dict['businessIdentifier']
        assert model.missing_info_reason == ownership_details_dict['missingInfoReason']
        assert model.uuid is not None
