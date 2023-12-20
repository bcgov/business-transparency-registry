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
from datetime import datetime

from btr_api.models import Person as PersonModel, Submission as SubmissionModel
from btr_api.services.ownership_details import OwnershipDetailsService
from btr_api.services.person import PersonService


class SubmissionService(object):

    @staticmethod
    def create_submission(submission_dict: dict) -> SubmissionModel:
        submission = SubmissionModel()
        submission.effective_date = datetime.fromisoformat(submission_dict['effectiveDate'])
        submission.payload = submission_dict

        for significant_individual in submission_dict['significantIndividuals']:
            if person_uuid := significant_individual.get('profile', {}).get('uuid'):
                person = PersonModel.find_by_uuid(search_uuid=person_uuid)
            else:
                person = PersonService.create_person_from_owner(owner_dict=significant_individual)

            significant_individual['businessIdentifier'] = submission_dict['businessIdentifier']
            owner = OwnershipDetailsService.create_ownership_details_from_owner(owner_dict=significant_individual,
                                                                                person=person)
            submission.owners.append(owner)

        return submission
