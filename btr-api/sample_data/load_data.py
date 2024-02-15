# Copyright © 2024 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""The BTR data loader script."""
import csv
import sys

import pycountry
from faker import Faker
from flask import current_app

from btr_api import create_app
from btr_api.models import User
from btr_api.services import SubmissionService


fake = Faker()


def _get_ooc_interests():
    """Return the ooc interests."""
    ooc_interests: dict[str, list[dict]] = {}
    with open('bods_csvs/ooc_interests.csv', encoding='utf-8') as ooc_interests_csv:
        reader = csv.DictReader(ooc_interests_csv)
        for row in reader:
            ooc_interests.setdefault(row['_link_ooc_statement'], []).append({
                'type': row['type'],
                'beneficialOwnershipOrControl': True,
                'details': row['details'],
                'directOrIndirect': 'unknown',
                'share': {
                    'exact': row['share_exact'],
                    'maximum': row['share_maximum'],
                    'minimum': row['share_minimum']
                },
                'startDate': row['startDate'],
                'endDate': row['endDate'],
            })
    return ooc_interests


def _get_ooc_stmnts(ooc_interests: dict[str, list], limit: int):
    """Return the ooc statements."""
    ooc_stmnts: list[dict] = []
    with open('bods_csvs/ooc_statement.csv', encoding='utf-8') as oocs_csv:
        reader = csv.DictReader(oocs_csv)
        for row in reader:
            if row['subject_describedByEntityStatement'] and row['interestedParty_describedByPersonStatement']:
                ooc_stmnts.append({
                    'statementID': row['statementID'],
                    'statementType': row['statementType'],
                    'statementDate': row['statementDate'],
                    'subject': {'describedByEntityStatement': row['subject_describedByEntityStatement']},
                    'interestedParty': {
                        'describedByPersonStatement': row['interestedParty_describedByPersonStatement']},
                    'interests': ooc_interests.get(row['_link'], [])
                })
                # TODO: remove below
                if len(ooc_stmnts) == limit:
                    break
    return ooc_stmnts


def _get_entity_stmnts():
    """Return the entity statements."""
    entity_stmnts: dict[str, dict] = {}
    with open('bods_csvs/entity_statement.csv', encoding='utf-8') as entities_csv:
        reader = csv.DictReader(entities_csv)
        for row in reader:
            entity_stmnts[row['statementID']] = {
                'statementID': row['statementID'],
                'statementType': row['statementType'],
                'statementDate': row['statementDate'],
                'isComponent': row['isComponent'],
                'entityType': row['entityType'],
                'name': row['name'],
                # NOTE: fake identifiers based on _link
                'identifiers': [{'id': f"TST-E{row['_link']}", 'scheme': 'TST-E'}],
                'publicationDetails': {
                    'publicationDate': row['publicationDetails_publicationDate'],
                    'bodsVersion': '0.3',
                    'publisher': {
                        'name': row['publicationDetails_publisher_name'],
                        'url': row['publicationDetails_publisher_url']
                    }
                },
                'foundingDate': row['foundingDate'],
                'dissolutionDate': row['dissolutionDate'],
            }
    return entity_stmnts


def _get_names():
    """Return the person names."""
    names: dict[str, list] = {}
    with open('bods_csvs/person_names.csv', encoding='utf-8') as person_names_csv:
        reader = csv.DictReader(person_names_csv)
        for row in reader:
            names.setdefault(row['_link_person_statement'], []).append({
                'type': row['type'],
                'fullName': row['fullName'],
                'familyName': row['familyName'],
                'givenName': row['givenName']
            })
    return names


def _get_nationalities():
    """Return the person nationalities."""
    nationalities: dict[str, list] = {}
    with open('bods_csvs/person_nationalities.csv', encoding='utf-8') as person_nationalities_csv:
        reader = csv.DictReader(person_nationalities_csv)
        for row in reader:
            nationalities.setdefault(row['_link_person_statement'], []).append({
                'code': row['code'],
                'name': row['name']
            })
    return nationalities


def _get_addresses():
    """Return the person addresses."""
    addresses: dict[str, list] = {}
    with open('bods_csvs/person_addresses.csv', encoding='utf-8') as person_address_csv:
        reader = csv.DictReader(person_address_csv)
        for row in reader:
            addresses.setdefault(row['_link_person_statement'], []).append({
                'type': row['type'],
                'street': '',
                'city': '',
                'region': '',
                'postalCode': '',
                'locationDescription': row['address'],
                'country': pycountry.countries.get(alpha_2=row['country']) or row['country']
            })
    return addresses


def _get_person_stmnts(addresses: dict, names: dict, nationalities: dict):
    """Return the person statements."""
    person_stmnts = {}

    def get_random_email():
        """Return a randomly generated email."""
        return (fake.name()).replace(' ', '_') + '@test.com'

    with open('bods_csvs/person_statement.csv', encoding='utf-8') as persons_csv:
        reader = csv.DictReader(persons_csv)
        for row in reader:
            person_addresses = addresses.get(row['_link'], [])
            person_stmnts[row['statementID']] = {
                'statementID': row['statementID'],
                'statementType': row['statementType'],
                'statementDate': row['statementDate'],
                'isComponent': row['isComponent'],
                'personType': row['personType'],
                'names': names[row['_link']],
                'nationalities': nationalities[row['_link']],
                'identifiers': [
                    # NOTE: fake identifiers + tax numbers based on _link
                    {'id': f"TST-P{row['_link']}", 'scheme': 'TST-P'},
                    {'id': f"TST-TAX{row['_link']}", 'scheme': 'TST-TAX'},
                ],
                'publicationDetails': {
                    'publicationDate': row['publicationDetails_publicationDate'],
                    'bodsVersion': '0.3',
                    'publisher': {
                        'name': row['publicationDetails_publisher_name'],
                        'url': row['publicationDetails_publisher_url']
                    }
                },
                'birthDate': row['birthDate'],
                'addresses': person_addresses,
                'placeOfResidence': person_addresses[0] if len(person_addresses) > 0 else None,
                # NOTE: below is fake info
                'taxResidencies': nationalities[row['_link']],
                'email': get_random_email(),
                'externalInfluence': 'NoExternalInfluence'
            }
    return person_stmnts


def _get_filings(ooc_stmnts: list, entity_stmnts: dict, person_stmnts: dict):
    """Return the filings based on the given statements."""
    # group by businesses, then by ooc dates, then do a filing with all ooc info per date
    filings: dict[str, dict[str, dict]] = {}
    for ooc in ooc_stmnts:
        entity_id = ooc['subject']['describedByEntityStatement']
        if len(ooc['interests']) > 0 and entity_id in entity_stmnts.keys():
            # has interests and an entity statement so add to filings
            ooc_date = ooc['statementDate']
            person_id = ooc['interestedParty']['describedByPersonStatement']

            if ooc_date in filings.get(entity_id, {}).keys():
                # filing for this date is already initialized so add this entry to it
                filings[entity_id][ooc_date]['ownershipOrControlStatements'].append(ooc)
                # add person statement if not already added
                if person_id not in filings[entity_id][ooc_date]['personIds']:
                    filings[entity_id][ooc_date]['personStatements'].append(person_stmnts[person_id])
            else:
                # initialize filing for this entity / date
                filings.setdefault(entity_id, {})[ooc_date] = {
                    'businessIdentifier': entity_stmnts[entity_id]['identifiers'][0]['id'],
                    'effectiveDate': ooc_date,
                    'entityStatement': entity_stmnts[entity_id],
                    'personStatements': [person_stmnts[person_id]],
                    'ownershipOrControlStatements': [ooc],
                    # NOTE: below will be removed before filimng is submitted
                    'personIds': [person_id]
                }
    return filings


def load_data():
    """Load data via csv files BTR."""
    user = User.find_by_username('service-account-nds')
    if not user:
        current_app.logger.debug('error user not found.')
        return
    # get interests of oocs
    ooc_interests = _get_ooc_interests()
    current_app.logger.debug('got interests')
    ooc_stmnts = _get_ooc_stmnts(ooc_interests, 10)
    current_app.logger.debug('got ooc statements')
    del ooc_interests

    entity_stmnts = _get_entity_stmnts()
    current_app.logger.debug('got entity statements')

    # get the person names, nationalities, addresses
    names = _get_names()
    current_app.logger.debug('got names')
    nationalities = _get_nationalities()
    current_app.logger.debug('got nationalities')
    addresses = _get_addresses()
    current_app.logger.debug('got addresses')

    # get the person statements
    person_stmnts = _get_person_stmnts(names=names, nationalities=nationalities, addresses=addresses)
    current_app.logger.debug('got person statements')
    del names
    del nationalities
    del addresses

    # group by businesses, then by ooc dates, then do a filing with all ooc info per date
    filings = _get_filings(ooc_stmnts=ooc_stmnts, entity_stmnts=entity_stmnts, person_stmnts=person_stmnts)
    current_app.logger.debug('got filings')
    for filing in filings.values():
        current_app.logger.debug(filing)
        (SubmissionService.create_submission(filing, user.id)).save()


if __name__ == '__main__':
    print('Starting data load...')
    app = create_app()  # pylint: disable=invalid-name
    with app.app_context():
        load_data()
        sys.exit(0)
