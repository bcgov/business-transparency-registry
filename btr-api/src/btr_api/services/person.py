# Copyright © 2023 Province of British Columbia
#
# Licensed under the BSD 3 Clause License, (the "License");
# you may not use this file except in compliance with the License.
# The template for the license can be found here
#    https://opensource.org/license/bsd-3-clause/
#
# Redistribution and use in source and binary forms,
# with or without modification, are permitted provided that the
# following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice,
#    this list of conditions and the following disclaimer.
#
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
#
# 3. Neither the name of the copyright holder nor the names of its contributors
#    may be used to endorse or promote products derived from this software
#    without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS”
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
# THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
"""
This module contains classes related to the serialization and service of a Person Model. The classes here
are used to convert a Person Model from and to a dictionary, and also to create a Person Model from an owner's dictionary.

Classes:
    PersonSerializer: A serializer to convert Person Model to dictionary and vice-versa.
    PersonService: A service to create Person Model objects from owner's dictionary.
"""
from datetime import date

from btr_api.models import Person as PersonModel


class PersonSerializer:
    """ serializer for PersonModel """

    @staticmethod
    def from_dict(json_dict: dict) -> PersonModel:
        """Create Person from json dict"""
        person = PersonModel()
        person.full_name = json_dict.get('fullName')
        person.preferred_name = json_dict.get('preferredName')
        person.family_name = json_dict.get('familyName')
        person.given_name = json_dict.get('givenName')
        person.patronymic_name = json_dict.get('patronymicName')

        if birth_date := json_dict.get('birthDate'):
            person.birth_date = date.fromisoformat(birth_date)

        person.email = json_dict.get('email')
        person.address = json_dict.get('address')

        person.is_permanent_resident = json_dict.get('citizenshipCA') == 'pr'
        person.is_canadian_citizen = json_dict.get('citizenshipCA') == 'citizen'
        person.citizenships_ex_ca = json_dict.get('citizenshipExCA')

        person.tax_number = json_dict.get('taxNumber')
        person.is_canadian_tax_resident = json_dict.get('isTaxResident')

        person.competency = json_dict.get('competency')

        return person

    @staticmethod
    def to_dict(person: PersonModel) -> dict:
        """Return the person class as a dict."""
        # TODO: remove this once sqlalchemy dataclass/attrs/cattrs integration added
        citizenship_ca = 'other'
        if person.is_canadian_citizen:
            citizenship_ca = 'citizen'
        elif person.is_permanent_resident:
            citizenship_ca = 'pr'

        return {
            'uuid': person.uuid,
            'fullName': person.full_name,
            'preferredName': person.preferred_name,
            'birthDate': person.birth_date.isoformat() if person.birth_date else None,
            'competency': person.competency,
            'email': person.email,
            'hasTaxNumber': person.tax_number is not None,
            'taxNumber': person.tax_number,
            'citizenshipCA': citizenship_ca,
            'citizenshipsExCa': person.citizenships_ex_ca,
            'isTaxResident': person.is_canadian_tax_resident,
            'address': person.address
        }


class PersonService:  # pylint: disable=too-few-public-methods
    """
    The `PersonService` class provides a static method for creating a `PersonModel` object from an owner dictionary.
    """

    @staticmethod
    def create_person_from_owner(owner_dict: dict) -> PersonModel | None:
        """
        create_person_from_owner(owner_dict: dict) -> PersonModel | None

        This method takes a dictionary representing an owner and creates a person object from it.

        Parameters:
            owner_dict (dict): A dictionary representing the owner. Should contain key 'profile' that has profile dict.

        Returns:
            PersonModel | None: If the profile dictionary is found in the owner dictionary,
            a PersonModel object is created from it and returned. Otherwise, None is returned.
        """
        if person_dict := owner_dict.get('profile'):
            person: PersonModel = PersonSerializer.from_dict(person_dict)
            return person

        return None
