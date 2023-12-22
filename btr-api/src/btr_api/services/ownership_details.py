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
from datetime import date, datetime

from btr_api.exceptions import BusinessException
from btr_api.models import OwnershipDetails as OwnershipDetailsModel, Person as PersonModel
from btr_api.services.person import PersonSerializer


class OwnershipDetailsSerializer(object):
    @staticmethod
    def from_dict(owner_dict: dict) -> OwnershipDetailsModel | None:
        """Create Person from json dict"""
        ownership_details = None
        # TODO: add enum for action
        if owner_dict.get('action') == 'remove':
            if (uuid := owner_dict.get('uuid')) and (end_date := owner_dict.get('endDate')):
                ownership_details = OwnershipDetailsModel.find_by_uuid(uuid)
                ownership_details.end_date = date.fromisoformat(end_date)
            else:
                # TODO: handle this in initial filing validation
                raise BusinessException('Error removing owner')

        elif owner_dict.get('action') in ['add', 'edit'] or owner_dict.get('uuid'):
            if uuid := owner_dict.get('uuid'):
                ownership_details = OwnershipDetailsModel.find_by_uuid(uuid)
            else:
                ownership_details = OwnershipDetailsModel()

            ownership_details.business_identifier = owner_dict['businessIdentifier']
            ownership_details.control_type = owner_dict.get('controlType')
            ownership_details.missing_info_reason = owner_dict.get('missingInfoReason')

            ownership_details.percent_of_shares = owner_dict.get('percentOfShares')
            ownership_details.percent_of_votes = owner_dict.get('percentOfVotes')

            if start_date := owner_dict.get('startDate'):
                ownership_details.start_date = date.fromisoformat(start_date)

        return ownership_details

    @staticmethod
    def to_dict(ownership_details: OwnershipDetailsModel) -> dict:
        """Return the ownership details class as a dict."""
        # TODO: remove this once sqlalchemy dataclass/attrs/cattrs integration added
        return {
            'uuid': ownership_details.uuid,
            'controlType': ownership_details.control_type,
            'missingInfoReason': ownership_details.missing_info_reason,
            'percentOfShares': ownership_details.percent_of_shares,
            'percentOfVotes': ownership_details.percent_of_votes,
            'profile': PersonSerializer.to_dict(ownership_details.person),
            'startDate': ownership_details.start_date.isoformat() if ownership_details.start_date else None,
            'endDate': ownership_details.end_date.isoformat() if ownership_details.end_date else None
        }


class OwnershipDetailsService(object):
    @staticmethod
    def create_ownership_details_from_owner(owner_dict: dict, person: PersonModel) -> OwnershipDetailsModel:
        ownership_details = OwnershipDetailsSerializer.from_dict(owner_dict)
        ownership_details.person = person
        return ownership_details
