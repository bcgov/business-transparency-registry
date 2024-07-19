from flask import current_app

from btr_api.services import btr_auth
from btr_api.enums import RedactionType

# the lack of a rule means it shows fully
REDACT_RULES = {
    btr_auth.USER_PUBLIC: {
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
    btr_auth.USER_STAFF: {
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

def redactInformation(request, payload):
  role = btr_auth.getUserType()
  if role == btr_auth.USER_COMPETENT_AUTHORITY:
      return payload
  # otherwise PUBLIC or STAFF
  current_app.logger.info(RedactionType.REDACT_MONONYM)
  redactionToUse = REDACT_RULES[role]
  current_app.logger.info(redactionToUse)
  for person in payload['payload']['personStatements']:
      for name in person['names']:
          if name['type'] == 'alternative':
              name['fullName'] = redactField(name['fullName'], redactionToUse.get('prefName'))

      person['email'] = redactField(person['email'], redactionToUse.get('email'))
      person['phoneNumber']['number'] = redactField(person['phoneNumber']['number'], redactionToUse.get('phone'))
      for address in person['addresses']:
          address['postalCode'] = redactField(address['postalCode'], redactionToUse.get('postal'))
          address['street'] = redactField(address['street'], redactionToUse.get('street'))
          address['streetAdditional'] = redactField(
              address['streetAdditional'], redactionToUse.get('streetAdditional')
          )
          address['locationDescription'] = redactField(
              address['locationDescription'], redactionToUse.get('locationDescription')
          )

      person['placeOfResidence']['postalCode'] = redactField(
          person['placeOfResidence']['postalCode'], redactionToUse.get('postal')
      )
      person['placeOfResidence']['street'] = redactField(
          person['placeOfResidence']['street'], redactionToUse.get('street')
      )
      person['placeOfResidence']['streetAdditional'] = redactField(
          person['placeOfResidence']['streetAdditional'], redactionToUse.get('streetAdditional')
      )
      person['placeOfResidence']['locationDescription'] = redactField(
          person['placeOfResidence']['locationDescription'], redactionToUse.get('locationDescription')
      )
      person['birthDate'] = redactField(person['birthDate'], redactionToUse.get('birthDate'))
      for identifier in person['identifiers']:
          identifier['id'] = redactField(identifier['id'], redactionToUse.get('identifiers'))
  return payload


def redactField(field, redactType):
  if redactType == RedactionType.REDACT_MONONYM:
      return field[0:1] + '***'
  elif redactType == RedactionType.REDACT_MONONYM_FN:
      rv = ''
      for word in field.split():
          if not (rv == ''):
              rv += ' '
          rv += word[0:1] + '***'
      return rv
  elif redactType == RedactionType.REDACT_EMAIL:
      return field.split('@')[0][0:1] + '***' + '@***.' + field.split('.')[-1]
  elif redactType == RedactionType.REDACT_PHONE:
      return field[0:-7] + '***'
  elif redactType == RedactionType.REDACT_FULL:
      return '***'
  # This is a space instead of blank because if it's empty the ui shows undefined in some spots
  elif redactType == RedactionType.REDACT_EMPTY:
      return ' '
  elif redactType == RedactionType.REDACT_DATE:
      return field.split('-')[0]
  elif redactType == RedactionType.REDACT_IDENTIFIER:
      return '*** **' + field[6:]

  return field
