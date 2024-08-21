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

    lists are replace with a few exceptions, lists of objects with a UUID field a statementID field will be updated based on that field, 
    personStatements --> name is a special case that matches on type
    """

    return_dict = {}

    if path != '':
        path = path + '.'

    # Create all values in dict1 and if applicable merge values in dict2
    for key, value in dict1.items():
        if isinstance(value, dict):
            if any(isinstance(i, dict) for i in value.values()):
                return_dict[key] = deep_spread(value, dict2.get(key, {}), path + key)
            elif any(isinstance(i, list) for i in value.values()):
                return_dict[key] = deep_spread(value, dict2.get(key, []), path + key)
            else:
                return_dict[key] = {**value, **dict2.get(key, {})}
        elif isinstance(value, list):
            ## list of objects have special cases
            if all(isinstance(i, dict) for i in value):
                if len(value) > 0:
                    if "uuid" in value[0]:
                        return_dict[key] = merge_list_on_field(value, dict2.get(key, []), "uuid")
                    elif "statementID" in value[0]:
                        return_dict[key] = merge_list_on_field(value, dict2.get(key, []), "statementID")
                    elif "type" in value[0] and path == "personStatements.names":
                        return_dict[key] = merge_list_on_field(value, dict2.get(key, []), "type")
                        
        else:
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
    if len(l1) < 1:
        return l1

    if len(l2) < 1:
        return l2
    
    if not(isinstance(l1, dict)):
        return l2
    
    if not(isinstance(l2, dict)):
        return l1
    
    # return list is the list we will return
    return_list = []

    #unique field values is an array mapping return_list/l1 to the unique field values ie 0: l1[0].uuid
    unique_field_values = []
    for i in range(0, len(l1)):
        unique_field_values.append(l1[i][field_name])
        return_list.append(l1[i])
    
    for i in range(0, len(l2)):
        if field_name in l2[i]:
            if l2[i][field_name] in unique_field_values:
                location = unique_field_values.index(l2[i][field_name])
                return_list[location] = deep_spread(return_list[location], l2[i])
            else:
                return_list.append(l2[i])
                unique_field_values.append(l2[i][field_name])
        else:
            return_list.append(l2[i])

    return return_list
