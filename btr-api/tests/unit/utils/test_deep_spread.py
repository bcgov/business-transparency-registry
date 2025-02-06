import pytest
from btr_api.utils.deep_spread import deep_spread, merge_list_on_field
"""
e.g.
dict1 = { 'a': 1, 'b': 2, 'c': 3 }
dict2 = { 'a': 4, 'b': 5 }
deep_spread(dict1, dict2) --> { 'a': 4, 'b': 5, 'c': 3 }

dict1 = { 'a': {'x': [1], 'z': {'a': 1}}, 'b': 5, 'c': 3, 'd': 6 }
dict2 = { 'a': {'x': [2], 'z': {'b': 2}}, 'b': 4, 'd': 7 }
deep_spread(dict1, dict2) --> { 'a': {'x': [2], 'z': {'a': 1, 'b': 2}}, 'b': 4, 'c': 3, 'd': 7 }
"""

def test_basic():
    # Prepare data
    dict1 = { 'a': 1, 'b': 2, 'c': 3 }
    dict2 = { 'a': 4, 'b': 5 }

    # Verify result
    assert deep_spread(dict1, dict2) == { 'a': 4, 'b': 5, 'c': 3 }

def test_median():
    # Prepare data
    dict1 = { 'a': {'x': [1], 'z': {'a': 1}}, 'b': 5, 'c': 3, 'd': 6 }
    dict2 = { 'a': {'x': [2], 'z': {'b': 2}}, 'b': 4, 'd': 7 }

    # Verify result
    assert deep_spread(dict1, dict2) == { 'a': {'x': [2], 'z': {'a': 1, 'b': 2}}, 'b': 4, 'c': 3, 'd': 7 }

def test_complex():
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

def test_array():
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


def test_merge_list_on_field_partial():
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
    pass
    # existing_interests = [
    #     {
    #         'type': 'ownership',
    #         'sharePercentage': 50,
    #         'voteControl': False,
    #         'directorControl': True
    #     },
    #     {
    #         'type': 'ownership',
    #         'sharePercentage': 50,
    #         'voteControl': False,
    #         'directorControl': True
    #     }
    # ]

    # # update the share percentage of the first interest, add vote control to the second interest
    # new_values = [
    #     {
    #         'type': 'ownership',
    #         'sharePercentage': 40
    #     },
    #     {
    #         'type': 'ownership',
    #         'voteControl': True
    #     }
    # ]

    # merged_interests = merge_interests(existing_interests, new_values)

    # expected_interests = [
    #     {
    #         'type': 'ownership',
    #         'sharePercentage': 40,
    #         'voteControl': False,
    #         'directorControl': True
    #     },
    #     {
    #         'type': 'ownership',
    #         'sharePercentage': 50,
    #         'voteControl': True,
    #         'directorControl': True
    #     }
    # ]

    # assert merged_interests == expected_interests


# SI has only physical address -- update the entire physical address
# SI has only physical address -- partial update: update the postal code and clear the rest
# SI has only physical address -- add mailing address
# SI has only physical address -- update both physical and mailing address

# SI has both physical and mailing address -- update physical address
# SI has both physical and mailing address -- update mailing address
# SI has both physical and mailing address -- update both physical and mailing address
# SI has both physical and mailing address -- remove mailing address

# Interest update: update share percentage, add vote control, director control remains unchanged
# Interest update: remove control of director
