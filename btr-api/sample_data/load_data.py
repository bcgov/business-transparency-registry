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
from random import choice, randint

import pycountry
from faker import Faker
from flask import current_app

from btr_api import create_app
from btr_api.models import User, db
from btr_api.services import SubmissionService


fake = Faker()


def _get_ooc_interests(limit: int = None):
    """Return the ooc interests."""

    def _get_details(interestType: str):
        """Return a random details string based on the interest type."""
        if interestType == 'shareholding':
            return choice(['controlType.shares.registeredOwner', 'controlType.shares.indirectControl', 'controlType.shares.beneficialOwner'])
        if interestType == 'votingRights':
            return choice(['controlType.votes.registeredOwner', 'controlType.votes.indirectControl', 'controlType.votes.beneficialOwner'])
        if interestType == 'appointmentOfBoard':
            return choice(['controlType.directors.directControl', 'controlType.directors.indirectControl', 'controlType.directors.significantInfluence'])
        return 'fake details'

    ooc_interests: dict[str, list[dict]] = {}
    with open('bods_csvs/ooc_interests.csv', encoding='utf-8') as ooc_interests_csv:
        reader = csv.DictReader(ooc_interests_csv)
        for row in reader:
            type = row['type'].split('-')
            type = type[0] + ''.join(ele.title() for ele in type[1:])
            new_interest = {
                'type': type,
                'beneficialOwnershipOrControl': True,
                'details': row['details'] or _get_details(type),
                'directOrIndirect': 'unknown',
                'startDate': row['startDate'],
                'endDate': row['endDate'],
            }
            if type in ['shareholding', 'votingRights']:
                new_interest['share'] = choice([{'maximum': 100, 'minimum': 75}, {'maximum': 75, 'minimum': 50}, {'maximum': 50, 'minimum': 25}])

            ooc_interests.setdefault(row['_link_ooc_statement'], []).append(new_interest)

            if limit and len(ooc_interests.keys()) == limit:
                return ooc_interests

    return ooc_interests


def _get_ooc_stmnts(ooc_interests: dict[str, list], limit: int = None):
    """Return the ooc statements."""
    ooc_stmnts: list[dict] = []
    with open('bods_csvs/ooc_statement.csv', encoding='utf-8') as oocs_csv:
        reader = csv.DictReader(oocs_csv)
        for row in reader:
            if row['subject_describedByEntityStatement'] and row['interestedParty_describedByPersonStatement'] and len(ooc_interests.get(row['_link'], [])) > 0 and row['statementDate']:
                ooc_stmnts.append({
                    'statementID': row['statementID'],
                    'statementType': row['statementType'],
                    'statementDate': row['statementDate'],
                    'subject': {'describedByEntityStatement': row['subject_describedByEntityStatement']},
                    'interestedParty': {
                        'describedByPersonStatement': row['interestedParty_describedByPersonStatement']},
                    'interests': ooc_interests.get(row['_link'], [])
                })
                if limit and len(ooc_stmnts) == limit:
                    return ooc_stmnts
    return ooc_stmnts


def _get_entity_stmnts(limit: int = None):
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
                'foundingDate': row['foundingDate'],
                'dissolutionDate': row['dissolutionDate'],
            }
            if limit and len(entity_stmnts.keys()) == limit:
                return entity_stmnts
    return entity_stmnts


def _get_names(limit: int = None):
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
            if limit and len(names.keys()) == limit:
                return names
    return names


def _get_nationalities(limit: int = None):
    """Return the person nationalities."""
    nationalities: dict[str, list] = {}
    with open('bods_csvs/person_nationalities.csv', encoding='utf-8') as person_nationalities_csv:
        reader = csv.DictReader(person_nationalities_csv)
        for row in reader:
            nationalities.setdefault(row['_link_person_statement'], []).append({
                'code': row['code'],
                'name': row['name']
            })
            if limit and len(nationalities.keys()) == limit:
                return nationalities
    return nationalities


def _get_addresses(limit: int = None):
    """Return the person addresses."""
    addresses: dict[str, list] = {}
    with open('bods_csvs/person_addresses.csv', encoding='utf-8') as person_address_csv:
        reader = csv.DictReader(person_address_csv)
        for row in reader:
            address = {
                'type': row['type'],
                'street': '',
                'city': '',
                'region': '',
                'postalCode': '',
                'locationDescription': row['address'],
                'country': row['country'],
            }
            if country_info := pycountry.countries.get(alpha_2=row['country']):
                address['countryName'] = country_info.name
            addresses.setdefault(row['_link_person_statement'], []).append(address)
            if limit and len(addresses.keys()) == limit:
                return addresses
    return addresses


def _get_person_stmnts(addresses: dict, names: dict, nationalities: dict, limit: int = None):
    """Return the person statements."""
    person_stmnts = {}

    def get_random_email():
        """Return a randomly generated email."""
        return (fake.name()).replace(' ', '_') + '@test.com'

    with open('bods_csvs/person_statement.csv', encoding='utf-8') as persons_csv:
        reader = csv.DictReader(persons_csv)
        for row in reader:
            person_addresses = addresses.get(row['_link'], [])
            if names.get(row['_link'], None) and len(person_addresses) > 0 and nationalities.get(row['_link'], None):
                person_stmnts[row['statementID']] = {
                    'statementID': row['statementID'],
                    'statementType': row['statementType'],
                    'statementDate': row['statementDate'],
                    'personType': row['personType'],
                    'names': names[row['_link']],
                    'nationalities': nationalities.get(row['_link'], []),
                    'birthDate': row['birthDate'],
                    'addresses': person_addresses,
                    'placeOfResidence': person_addresses[0] if len(person_addresses) > 0 else None,
                    # NOTE: below is fake info
                    'hasTaxNumber': choice([True, False]),
                    'identifiers': [],
                    'taxResidencies': nationalities.get(row['_link'], []),
                    'email': get_random_email(),
                    'uuid': fake.uuid4()
                }
                if person_stmnts[row['statementID']]['hasTaxNumber']:
                    person_stmnts[row['statementID']]['identifiers'].append({
                        'id': f'{randint(100, 999)} {randint(100, 999)} {randint(100, 999)}',
                        'scheme': 'CAN-TAXID'})
                if limit and len(person_stmnts.keys()) == limit:
                    return person_stmnts
    return person_stmnts


def _get_filings(ooc_stmnts: list, entity_stmnts: dict, person_stmnts: dict):
    """Return the filings based on the given statements."""
    # group by businesses, then by ooc dates, then do a filing with all ooc info per date
    filings: dict[str, dict[str, dict]] = {}
    for ooc in ooc_stmnts:
        entity_id = ooc['subject']['describedByEntityStatement']
        person_id = ooc['interestedParty']['describedByPersonStatement']
        if len(ooc['interests']) > 0 and entity_id in entity_stmnts.keys() and person_id in person_stmnts.keys():
            # has interests and an entity statement so add to filings
            ooc_date = ooc['statementDate']

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
    max = 50000
    user = User.find_by_username('service-account-nds')
    if not user:
        current_app.logger.debug('error user not found.')
        return
    # get interests of oocs
    ooc_interests = _get_ooc_interests(max)
    current_app.logger.debug('got interests')
    ooc_stmnts = _get_ooc_stmnts(ooc_interests, max)
    current_app.logger.debug('got ooc statements')
    del ooc_interests

    entity_stmnts = _get_entity_stmnts(max)
    current_app.logger.debug('got entity statements')

    # get the person names, nationalities, addresses
    names = _get_names(max)
    current_app.logger.debug('got names')
    nationalities = _get_nationalities(max)
    current_app.logger.debug('got nationalities')
    addresses = _get_addresses(max)
    current_app.logger.debug('got addresses')

    # get the person statements
    person_stmnts = _get_person_stmnts(names=names, nationalities=nationalities, addresses=addresses, limit=max)
    current_app.logger.debug('got person statements')
    del names
    del nationalities
    del addresses

    # group by businesses, then by ooc dates, then do a filing with all ooc info per date
    filings = _get_filings(ooc_stmnts=ooc_stmnts, entity_stmnts=entity_stmnts, person_stmnts=person_stmnts)
    current_app.logger.debug('got filings')
    count = 0
    for business_filings_by_date in filings.values():
        # the sort will ensure the filings are saved in order of the date
        for filing in dict(sorted(business_filings_by_date.items())).values():
            del filing['personIds']
            (SubmissionService.create_submission(filing, user.id)).save_to_session()
            count += 1
            if count%1000 == 0:
                db.session.commit()
                current_app.logger.debug(f'Records loaded: {count}')
    # commit to db
    db.session.commit()
    current_app.logger.debug(f'Successfully loaded {count} records')


if __name__ == '__main__':
    print('Starting data load...')
    app = create_app()  # pylint: disable=invalid-name
    with app.app_context():
        load_data()
        sys.exit(0)
