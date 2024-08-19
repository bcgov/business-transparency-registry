import pytest
from btr_api.utils.deep_spread import deep_spread
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