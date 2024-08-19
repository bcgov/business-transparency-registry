"""Function to redact fields and or a submission based on roles with a variety of options"""
from flask import current_app

def deep_spread(dict1, dict2):
    """
    Function to perform the spread operator on nested dicts
    Returns a new dict where dict2 is merged into dict1 in case of a key conflict dict2 takes precedence

    e.g.
    dict1 = { 'a': 1, 'b': 2, 'c': 3 }
    dict2 = { 'a': 4, 'b': 5 }
    deep_spread(dict1, dict2) --> { 'a': 4, 'b': 5, 'c': 3 }

    dict1 = { 'a': {'x': [1], 'z': {'a': 1}}, 'b': 5, 'c': 3, 'd': 6 }
    dict2 = { 'a': {'x': [2], 'z': {'b': 2}}, 'b': 4, 'd': 7 }
    deep_spread(dict1, dict2) --> { 'a': {'x': [2], z: {'a': 1, 'b': 2}}, 'b': 4, 'c': 3, 'd': 7 }
    """

    returnDict = {}
    
    #Create all values in dict1 and if applicable merge values in dict2
    for key, value in dict1.items():
        if isinstance(value, dict):
            if any(isinstance(i, dict) for i in value.values()):
                returnDict[key] = deep_spread(value, dict2.get(key, {}))
            else:
                returnDict[key] = {**value, **dict2.get(key, {})}
        else:
          returnDict[key] = value
          if dict2.get(key, '') is None:
              del returnDict[key] 
          elif dict2.get(key, None) is not None:
            returnDict[key] = dict2[key]

    # Merge values that only exist in dict2
    for key, value in dict2.items():
        if key not in returnDict:
            returnDict[key] = value
    
    # Clear values set to None
    for key, value in returnDict.items():
        if value is None:
            del returnDict[key]

    return returnDict