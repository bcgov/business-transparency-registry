"""Function to redact fields and or a submission based on roles with a variety of options"""
from flask import current_app

from btr_api.services import btr_auth
from btr_api.enums import RedactionType, UserType

# the lack of a rule means it shows fully
REDACT_RULES = {
    UserType.USER_PUBLIC: {
        'prefName': RedactionType.REDACT_EMPTY,
        'email': RedactionType.REDACT_EMPTY,
        'phone': RedactionType.REDACT_EMPTY,
        'postal': RedactionType.REDACT_EMPTY,
        'street': RedactionType.REDACT_EMPTY,
        'streetAdditional': RedactionType.REDACT_EMPTY,
        'locationDescription': RedactionType.REDACT_EMPTY,
        'birthDate': RedactionType.REDACT_EMPTY,
        'identifiers': RedactionType.REDACT_EMPTY,
    },
    UserType.USER_STAFF: {
        'email': RedactionType.REDACT_EMAIL,
        'phone': RedactionType.REDACT_PHONE,
        'postal': RedactionType.REDACT_EMPTY,
        'street': RedactionType.REDACT_EMPTY,
        'streetAdditional': RedactionType.REDACT_EMPTY,
        'locationDescription': RedactionType.REDACT_EMPTY,
        'birthDate': RedactionType.REDACT_DATE,
        'identifiers': RedactionType.REDACT_IDENTIFIER,
    },
}


# pylint: disable=too-many-branches
def redact_information(payload):
    """
    Function to redact information from a submission based on rules as defined above
    """
    role = btr_auth.get_user_type()
    if role == UserType.USER_COMPETENT_AUTHORITY:
        return payload
    # otherwise PUBLIC or STAFF
    current_app.logger.info(RedactionType.REDACT_MONONYM)
    redaction_to_use = REDACT_RULES[role]
    current_app.logger.info(redaction_to_use)
    for person in payload['payload']['personStatements']:
        for name in person['names']:
            if 'type' in name and 'fullName' in name and name['type'] == 'alternative':
                name['fullName'] = redact_field(name['fullName'], redaction_to_use.get('prefName'))

        if 'email' in person:
            person['email'] = redact_field(person['email'], redaction_to_use.get('email'))
        if 'phoneNumber' in person and 'number' in person['phoneNumber']:
            person['phoneNumber']['number'] = redact_field(
                person['phoneNumber']['number'], redaction_to_use.get('phone')
            )

        for address in person.get('addresses', []):
            if 'postalCode' in address:
                address['postalCode'] = redact_field(address['postalCode'], redaction_to_use.get('postal'))
            if 'street' in address:
                address['street'] = redact_field(address['street'], redaction_to_use.get('street'))
            if 'streetAdditional' in address:
                address['streetAdditional'] = redact_field(
                    address['streetAdditional'], redaction_to_use.get('streetAdditional')
                )
            if 'locationDescription' in address:
                address['locationDescription'] = redact_field(
                    address['locationDescription'], redaction_to_use.get('locationDescription')
                )

        if 'placeOfResidence' in person and 'postalCode' in person['placeOfResidence']:
            person['placeOfResidence']['postalCode'] = redact_field(
                person['placeOfResidence']['postalCode'], redaction_to_use.get('postal')
            )
        if 'placeOfResidence' in person and 'street' in person['placeOfResidence']:
            person['placeOfResidence']['street'] = redact_field(
                person['placeOfResidence']['street'], redaction_to_use.get('street')
            )
        if 'placeOfResidence' in person and 'streetAdditional' in person['placeOfResidence']:
            person['placeOfResidence']['streetAdditional'] = redact_field(
                person['placeOfResidence']['streetAdditional'], redaction_to_use.get('streetAdditional')
            )
        if 'placeOfResidence' in person and 'locationDescription' in person['placeOfResidence']:
            person['placeOfResidence']['locationDescription'] = redact_field(
                person['placeOfResidence']['locationDescription'], redaction_to_use.get('locationDescription')
            )

        if 'birthDate' in person:
            person['birthDate'] = redact_field(person['birthDate'], redaction_to_use.get('birthDate'))
        for identifier in person.get('identifiers', []):
            identifier['id'] = redact_field(identifier['id'], redaction_to_use.get('identifiers'))
    return payload


def redact_field(field, redact_type):
    """
    Function to redact a field based on the redaction type
    """
    redacted_field = field
    if redact_type == RedactionType.REDACT_MONONYM:
        redacted_field = field[0:1] + '***'
    elif redact_type == RedactionType.REDACT_MONONYM_FN:
        rv = ''
        for word in field.split():
            if rv != '':
                rv += ' '
            rv += word[0:1] + '***'
        redacted_field = rv
    elif redact_type == RedactionType.REDACT_EMAIL:
        redacted_field = field.split('@')[0][0:1] + '***' + '@***.' + field.split('.')[-1]
    elif redact_type == RedactionType.REDACT_PHONE:
        redacted_field = field[0:-7] + '***'
    elif redact_type == RedactionType.REDACT_FULL:
        redacted_field = '***'
    # This is a space instead of blank because if it's empty the ui shows undefined in some spots
    elif redact_type == RedactionType.REDACT_EMPTY:
        redacted_field = ' '
    elif redact_type == RedactionType.REDACT_DATE:
        redacted_field = field.split('-')[0]
    elif redact_type == RedactionType.REDACT_IDENTIFIER:
        redacted_field = '*** **' + field[6:]

    return redacted_field
