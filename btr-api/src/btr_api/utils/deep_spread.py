"""Function to redact fields and or a submission based on roles with a variety of options"""


def deep_spread(dict1, dict2, path=''):
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

    lists are replace with a few exceptions, lists of objects with a UUID field a statementID field will
    be updated based on that field, personStatements --> name is a special case that matches on type
    """
    # pylint: disable=too-many-branches
    return_dict = {}

    if path != '':
        path = path + '.'

    # Create all values in dict1 and if applicable merge values in dict2
    for key, value in dict1.items():
        use_default = True
        if isinstance(value, dict):
            use_default = False
            if any(isinstance(i, dict) for i in value.values()):
                return_dict[key] = deep_spread(value, dict2.get(key, {}), path + key)
            elif any(isinstance(i, list) for i in value.values()):
                return_dict[key] = deep_spread(value, dict2.get(key, {}), path + key)
            else:
                return_dict[key] = {**value, **dict2.get(key, {})}
        elif isinstance(value, list):
            # list of objects have special cases
            if all(isinstance(i, dict) for i in value) and len(value) > 0:
                if 'uuid' in value[0]:
                    use_default = False
                    return_dict[key] = merge_list_on_field(value, dict2.get(key, []), 'uuid')
                elif 'statementID' in value[0]:
                    use_default = False
                    return_dict[key] = merge_list_on_field(value, dict2.get(key, []), 'statementID')
                elif 'type' in value[0] and path == 'personStatements.names':
                    use_default = False
                    return_dict[key] = merge_list_on_field(value, dict2.get(key, []), 'type')
        if use_default:
            return_dict[key] = value
            if dict2.get(key, '') is None:
                del return_dict[key]
            elif dict2.get(key, None) is not None:
                return_dict[key] = dict2[key]

    # Merge values that only exist in dict2
    for key, value in dict2.items():
        if key not in return_dict:
            return_dict[key] = value

    # Clear values set to None
    for key, value in return_dict.items():
        if value is None:
            del return_dict[key]

    return return_dict


def merge_list_on_field(l1, l2, field_name):
    """
    merge list on field takes in two lists of dictionaries and a field name
    all elements from l1 are initially added
    if an element in l2 doesn't have field_name or l2[field_name] is not in l1, it is added
    if l2[field_name] matches an element in l1 it is updated by taking the values in l2 as the new truthy values
      and keys that aren't in l2 default to the l1 values
    """
    if not isinstance(l1, list) or len(l1) < 1 or not isinstance(l1[0], dict):
        return l2

    if not isinstance(l2, list) or len(l2) < 1 or not isinstance(l2[0], dict):
        return l1

    # return list is the list we will return
    return_list = []

    # unique field values is an array mapping return_list/l1 to the unique field values ie 0: l1[0].uuid
    unique_field_values = []
    for val in l1:
        if val[field_name]:
            unique_field_values.append(val[field_name])
        return_list.append(val)

    for val in l2:
        if field_name in val:
            if val[field_name] in unique_field_values:
                location = unique_field_values.index(val[field_name])
                return_list[location] = deep_spread(return_list[location], val)
            else:
                return_list.append(val)
                unique_field_values.append(val[field_name])
        else:
            return_list.append(val)

    return return_list
