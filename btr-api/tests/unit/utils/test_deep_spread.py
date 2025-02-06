import pytest
from btr_api.utils.deep_spread import deep_spread, merge_list_on_field, merge_interests
from .mock_data import SUBMISSION_DICT
"""
e.g.
dict1 = { 'a': 1, 'b': 2, 'c': 3 }
dict2 = { 'a': 4, 'b': 5 }
deep_spread(dict1, dict2) --> { 'a': 4, 'b': 5, 'c': 3 }

dict1 = { 'a': {'x': [1], 'z': {'a': 1}}, 'b': 5, 'c': 3, 'd': 6 }
dict2 = { 'a': {'x': [2], 'z': {'b': 2}}, 'b': 4, 'd': 7 }
deep_spread(dict1, dict2) --> { 'a': {'x': [2], 'z': {'a': 1, 'b': 2}}, 'b': 4, 'c': 3, 'd': 7 }
"""

def test_deep_spread_basic():
    # Prepare data
    dict1 = { 'a': 1, 'b': 2, 'c': 3 }
    dict2 = { 'a': 4, 'b': 5 }

    # Verify result
    assert deep_spread(dict1, dict2) == { 'a': 4, 'b': 5, 'c': 3 }


def test_deep_spread_median():
    # Prepare data
    dict1 = { 'a': {'x': [1], 'z': {'a': 1}}, 'b': 5, 'c': 3, 'd': 6 }
    dict2 = { 'a': {'x': [2], 'z': {'b': 2}}, 'b': 4, 'd': 7 }

    # Verify result
    assert deep_spread(dict1, dict2) == { 'a': {'x': [2], 'z': {'a': 1, 'b': 2}}, 'b': 4, 'c': 3, 'd': 7 }


def test_deep_spread_complex():
    # Prepare data
    dict1 = {
        'field_1': {
            'list': [1,2,3],
            'dict': {
                'super_nested_dict': {
                    'num': 5,
                    'str': 'hello',
                    'l': ['a', 'b']
                }
              }
        },
        'num': 2,
        'str': 'ie',
        'l': ['qq']
      }
    dict2 = {
      'field_1': {
            'list': [4,5,6],
        },
        'str2': 'str2',
        'l': ['zz'],
        'l2': ['a', 'b']
    }
    expected = {
      'field_1': {
            'list': [4,5,6],
            'dict': {
                'super_nested_dict': {
                    'num': 5,
                    'str': 'hello',
                    'l': ['a', 'b']
                }
              }
        },
        'num': 2,
        'str': 'ie',
        'str2': 'str2',
        'l': ['zz'],
        'l2': ['a', 'b']
    }

    # Verify result
    assert deep_spread(dict1, dict2) == expected


def test_deep_spread_array():
    # Prepare data
    dict1 = {
        'persons': [
            {
                'uuid': '1',
                'name': 'John',
                'age': 30
            },
            {
                'uuid': '2',
                'name': 'Jane',
                'age': 25
            }
        ]
      }
    dict2 = {
      'persons': [
          {
              'uuid': '1',
              'name': 'Brandon',
              'age': 30
          },
      ]
    }
    expected = {
      'persons': [
          {
              'uuid': '1',
              'name': 'Brandon',
              'age': 30
          },
          {
                'uuid': '2',
                'name': 'Jane',
                'age': 25
          }
      ]
    }

    # Verify result
    assert deep_spread(dict1, dict2) == expected


def test_merge_list_on_field():
    existing_addresses = [
        {
            'city': 'Pitt Meadows',
            'type': 'residence',
            'region': 'BC',
            'street': '2-19032 Advent Rd',
            'country': 'CA',
            'postalCode': 'V3Y 1S9',
            'countryName': 'Canada',
            'streetAdditional': ''
        },
        {
            'city': 'Albany',
            'type': 'service',
            'region': 'NY',
            'street': '23 Central Ave',
            'country': 'US',
            'postalCode': '12210-1396',
            'countryName': 'United States',
            'streetAdditional': 'additional'
        }
    ]

    # add streetAdditional to physical address, and update the country of the mailing address
    new_values = [
        {
            'type': 'residence',
            'streetAdditional': 'some text'
        },
        {
            'type': 'service',
            'country': 'UG',
            'countryName': 'Uganda'
        }
    ]

    merged_addresses = merge_list_on_field(existing_addresses, new_values, 'type')

    expected_addresses = [
        {
            'city': 'Pitt Meadows',
            'type': 'residence',
            'region': 'BC',
            'street': '2-19032 Advent Rd',
            'country': 'CA',
            'postalCode': 'V3Y 1S9',
            'countryName': 'Canada',
            'streetAdditional': 'some text'
        },
        {
            'city': 'Albany',
            'type': 'service',
            'region': 'NY',
            'street': '23 Central Ave',
            'country': 'UG',
            'postalCode': '12210-1396',
            'countryName': 'Uganda',
            'streetAdditional': 'additional'
        }
    ]

    assert merged_addresses == expected_addresses


def test_merge_interests():
    existing_interests = [
        {'type': 'shareholding', 'details': 'controlType.shares.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25}, 'startDate': '2014-11-07'},
        {'type': 'shareholding', 'details': 'controlType.shares.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25}, 'startDate': '2014-11-07'},
        {'type': 'votingRights', 'details': 'controlType.votes.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07'}
    ]

    # update: 1) update share percentage, 2) remove registered owner type for shareHolding interest, 3) add director control
    new_values = [
        {'type': 'shareholding', 'details': 'controlType.shares.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07'},
        {'type': 'appointmentOfBoard', 'directOrIndirect': 'indirect', 'details': 'controlType.directors.indirectControl', 'startDate': '2021-09-07'}
    ]

    merged_interests = merge_interests(existing_interests, new_values)

    expected_interests = [
        {'type': 'shareholding', 'details': 'controlType.shares.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07'},
        {'type': 'appointmentOfBoard', 'directOrIndirect': 'indirect', 'details': 'controlType.directors.indirectControl', 'startDate': '2021-09-07'},
        {'type': 'votingRights', 'details': 'controlType.votes.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07'}
    ]

    assert merged_interests == expected_interests


@pytest.mark.parametrize('test_name, person_statement_index, partially_updated_fields, hasMailingAddress, updated_addresses', [
    (
        'SI has only physical address -- update the postal code of physical address',
        0,
        [{'postalCode': 'V2N 5A8', 'type': 'residence'}],
        False,
        [{'city': 'Edmonton', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V2N 5A8', 'region': 'AB', 'street': '4323 33 St NW', 'streetAdditional': '', 'type': 'residence'}]
    ),
    (
        'SI has only physical address -- add a mailing address',
        0,
        [{'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V0V 0A0', 'region': 'BC', 'street': '123 Tester Ave', 'streetAdditional': '', 'type': 'service'}],
        True,
        [{'city': 'Edmonton', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'T6T 1B6', 'region': 'AB', 'street': '4323 33 St NW', 'streetAdditional': '', 'type': 'residence'}, {'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V0V 0A0', 'region': 'BC', 'street': '123 Tester Ave', 'streetAdditional': '', 'type': 'service'}]
    ),
    (
        'SI has only physical address -- update physical address and add a mailing address',
        0,
        [{'type': 'residence', 'street': '999 10th Street'}, {'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V0V 0A0', 'region': 'BC', 'street': '123 Tester Ave', 'streetAdditional': '', 'type': 'service'}],
        True,
        [{'city': 'Edmonton', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'T6T 1B6', 'region': 'AB', 'street': '999 10th Street', 'streetAdditional': '', 'type': 'residence'}, {'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V0V 0A0', 'region': 'BC', 'street': '123 Tester Ave', 'streetAdditional': '', 'type': 'service'}]
    ),
    (
        'SI has both physical address and mailing address -- update the postal code of mailing address',
        1,
        [{'postalCode': 'A1B 2C3', 'type': 'service'}],
        True,
        [{'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V6H 2T8', 'region': 'BC', 'street': 'Th-3023 Birch St', 'streetAdditional': '', 'type': 'residence'}, {'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'A1B 2C3', 'region': 'BC', 'street': '1234 Some Street', 'streetAdditional': 'PO-Box 567', 'type': 'service'}]
    ),
    (
        'SI has both physical address and mailing address -- remove the mailing address',
        1,
        [],
        False,
        [{'city': 'Vancouver', 'country': 'CA', 'countryName': 'Canada', 'postalCode': 'V6H 2T8', 'region': 'BC', 'street': 'Th-3023 Birch St', 'streetAdditional': '', 'type': 'residence'}]
    )
])
def test_deep_spread_address_update(
    client, session, test_name, person_statement_index, partially_updated_fields, hasMailingAddress, updated_addresses
):
    # set up existing person statement
    person_statement = SUBMISSION_DICT['personStatements'][person_statement_index]

    # set up expected person statement after merge
    expected_person_statement = person_statement.copy()
    expected_person_statement['addresses'] = updated_addresses
    expected_person_statement['hasMailingAddress'] = hasMailingAddress

    # Note: submission_payload ignores some fields (for example, 'placeOfResidence') that usually comes together with addresses change
    submission_payload = {
        'addresses': partially_updated_fields,
        'hasMailingAddress': hasMailingAddress
    }

    updated_person_statement = deep_spread(person_statement, submission_payload)

    assert updated_person_statement == expected_person_statement


@pytest.mark.parametrize('test_name, partially_updated_fields, interestTypes, updated_interests', [
    (
        'update share percentage',
        [
            {'details': 'controlType.shares.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07', 'type': 'shareholding'},
            {'details': 'controlType.shares.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50 },  'startDate': '2014-11-07', 'type': 'shareholding'}
        ],
        ['shareholding', 'votingRights'],
        [
            {'details': 'controlType.shares.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07', 'type': 'shareholding'},
            {'details': 'controlType.shares.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50 },  'startDate': '2014-11-07', 'type': 'shareholding'},
            {'details': 'controlType.votes.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07', 'type': 'votingRights'}
        ]
    ),
    (
        'update votingRights and add indirect director control',
        [
            {'details': 'controlType.votes.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07', 'type': 'votingRights'},
            {'directOrIndirect': 'indirect', 'details': 'controlType.directors.indirectControl', 'type': 'appointmentOfBoard', 'startDate': '2021-09-07'}
        ],
        ['shareholding', 'votingRights', 'appointmentOfBoard'],
        [
            {'details': 'controlType.votes.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07', 'type': 'votingRights'},
            {'directOrIndirect': 'indirect', 'details': 'controlType.directors.indirectControl', 'type': 'appointmentOfBoard', 'startDate': '2021-09-07'},
            {'details': 'controlType.shares.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25}, 'startDate': '2014-11-07', 'type': 'shareholding'},
            {'details': 'controlType.shares.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25},  'startDate': '2014-11-07', 'type': 'shareholding'}
        ]
    ),
    (
        'remove share control',
        [],
        ['votingRights'],
        [
            {'details': 'controlType.votes.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07', 'type': 'votingRights'}
        ]
    ),
    (
        'no interest update',
        [],
        ['shareholding', 'votingRights'],
        [
            {'details': 'controlType.shares.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25}, 'startDate': '2014-11-07', 'type': 'shareholding'},
            {'details': 'controlType.shares.registeredOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': False, 'maximum': 50, 'minimum': 25},  'startDate': '2014-11-07', 'type': 'shareholding'},
            {'details': 'controlType.votes.beneficialOwner', 'directOrIndirect': 'direct', 'share': {'exclusiveMaximum': False, 'exclusiveMinimum': True, 'maximum': 75, 'minimum': 50}, 'startDate': '2014-11-07', 'type': 'votingRights'}
        ]
    )
])
def test_deep_spread_interest_update(client, session, test_name, partially_updated_fields, interestTypes, updated_interests):
    # set up ownership statement
    ownership_statement = SUBMISSION_DICT['ownershipOrControlStatements'][0]

    # set up expected ownership statement after merge
    expected_ownership_statement = ownership_statement.copy()
    expected_ownership_statement['interests'] = updated_interests
    expected_ownership_statement['interestTypes'] = interestTypes

    submission_payload = {
        'interests': partially_updated_fields,
        'interestTypes': interestTypes
    }

    updated_ownership_statement = deep_spread(ownership_statement, submission_payload)

    assert updated_ownership_statement == expected_ownership_statement
