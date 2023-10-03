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
import json

from sqlalchemy import DateTime

from btr_api.models import Person as PersonModel


class PersonSerializer(object):
    @staticmethod
    def from_dict(json_dict: dict) -> PersonModel:
        """Create Person from json dict"""
        person = PersonModel()
        person.full_name = json_dict.get('full_name')
        person.family_name = json_dict.get('family_name')
        person.given_name = json_dict.get('given_name')
        person.patronymic_name = json_dict.get('patronymic_name')

        date_of_birth_str = json_dict.get('date_of_birth')
        person.date_of_birth = date_of_birth_str if date_of_birth_str else None

        person.is_permanent_resident = json_dict.get('is_permanent_resident', False)
        person.is_canadian_citizen = json_dict.get('is_canadian_citizen', False)
        person.is_canadian_tax_resident = json_dict.get('is_canadian_tax_resident', False)

        return person


class PersonService(object):
    @staticmethod
    def save_person_from_submission(submission_dict: dict) -> PersonModel | None:
        if 'person' in submission_dict:
            person_dict = submission_dict['person']
            person: PersonModel = PersonSerializer.from_dict(person_dict)
            return person

        return None
