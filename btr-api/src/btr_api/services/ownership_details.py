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
from btr_api.models import OwnershipDetails as OwnershipDetailsModel


class OwnershipDetailsSerializer(object):
    @staticmethod
    def from_dict(json_dict: dict) -> OwnershipDetailsModel:
        """Create Person from json dict"""
        ownership_details = OwnershipDetailsModel()
        ownership_details.business_identifier = json_dict['business_identifier']
        ownership_details.submission_id = json_dict['submission_id']

        ownership_details.person_id = json_dict.get('person_id')
        ownership_details.additional_text = json_dict.get('additional_text')
        ownership_details.control_type = json_dict.get('control_type')
        ownership_details.control_percent = json_dict.get('control_percent')

        return ownership_details


class OwnershipDetailsService(object):
    @staticmethod
    def save_ownership_details_from_submission(submission_dict: dict,
                                               submission_id: int,
                                               person_id: int | None) -> OwnershipDetailsModel | None:
        if 'ownership_details' in submission_dict:
            ownership_dict = submission_dict['ownership_details']
            ownership_dict['submission_id'] = submission_id
            if ownership_dict.get('id') is None and person_id is not None:
                ownership_dict['id'] = person_id
            ownership_details = OwnershipDetailsSerializer.from_dict(ownership_dict)
            ownership_details.save()
            return ownership_details

        return None
