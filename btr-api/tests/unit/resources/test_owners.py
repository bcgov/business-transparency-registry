""" Tests to ensure that the submission based end-points work correctly.
"""
from http import HTTPStatus

import pytest

from btr_api.services.person import PersonService
from btr_api.services.ownership_details import OwnershipDetailsService

from tests.unit import nested_session, INDIVIDUAL_2


@pytest.mark.parametrize("test_name, owner_dict",
    [("basic", INDIVIDUAL_2)],
)
def test_get_owners(client, session, test_name, owner_dict):
    """Get the owners for a business."""
    business_identifier = 'BC1234567'
    owner_dict['businessIdentifier'] = business_identifier
    with nested_session(session):
        # Setup
        person = PersonService.create_person_from_owner(owner_dict)
        assert person
        owner = OwnershipDetailsService.create_ownership_details_from_owner(owner_dict, person)
        owner.save()
        assert owner.id
        assert owner.business_identifier == business_identifier

        # Test
        rv = client.get(f"/owners/{owner.business_identifier}")

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK
        
        rv_json = rv.json
        assert isinstance(rv_json, list)
        assert len(rv_json) == 1
        assert rv_json[0]['controlType'] == owner_dict['controlType']
        assert rv_json[0]['missingInfoReason'] == owner_dict['missingInfoReason']
        assert rv_json[0]['percentOfShares'] == float(owner_dict['percentOfShares'])
        assert rv_json[0]['percentOfVotes'] == float(owner_dict['percentOfVotes'])
        assert rv_json[0]['startDate'] == owner_dict['startDate']
        assert rv_json[0]['profile'] is not None
