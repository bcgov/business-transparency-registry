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
This module contains the services necessary for handling Submissions,
including creating a submission. Each service is encapsulated in its own class.

The `SubmissionService` class provides the method `create_submission`,
which accepts a dictionary as an input and returns a SubmissionModel object.

The individual services can be invoked as per the requirements.
"""
from datetime import datetime

from btr_api.models import Request as RequestModel


class RequestService:  # pylint: disable=too-few-public-methods
    """
    The `RequestService` class is responsible for handling submissions and creating request models.

    Creates a request model based on the given request dictionary. The request dictionary should contain
    the necessary information for creating a request.
    """

    @staticmethod
    def create_request(request_dict: dict) -> RequestModel:
        """
        This method creates the current request request dict.

        Parameters:
        - request_dict (dict): A dictionary containing the submission data. It should have the following keys:
            - 'effectiveDate': A string representing the effective date of the submission in ISO format (YYYY-MM-DD).
            - 'businessIdentifier': A string representing the business identifier for the submission.
            - Any other key-value pairs representing additional payload data.

        Returns:
        - RequestnModel: A RequestModel object that represents the created request.
        """

        # init request
        request = RequestModel(request_dict)
        request.created_at = datetime.today().strftime('%Y-%m-%dT%H:%M:%S')
        request.updated_at = datetime.today().strftime('%Y-%m-%dT%H:%M:%S')
        request.save_to_session()
        return request

    @staticmethod
    def update_request(request: RequestModel,
                       request_dict: dict) -> RequestModel:
        """
        This method replaces the current request for the business using the provided request dict.

        Parameters:
        - request_dict (dict): A dictionary containing the submission data. It should have the following keys:
            - 'effectiveDate': A string representing the effective date of the submission in ISO format (YYYY-MM-DD).
            - 'businessIdentifier': A string representing the business identifier for the submission.

        Returns:
        - RequestModel: A RequestModel object that represents the updated request
        """

        # I dislike that I can't use a for loop here but it doesn't like to access the model with [key]
        # even if i override __setitems__ or add a set function
        if 'fullName' in request_dict:
            request.full_name = request_dict['fullName']

        if 'email' in request_dict:
            request.email = request_dict['email']

        if 'birthdate' in request_dict:
            request.birthdate = request_dict['birthdate']

        if 'businessIdentifier' in request_dict:
            request.business_identifier = request_dict['businessIdentifier']

        if 'informationToOmit' in request_dict:
            request.information_to_omit = request_dict['informationToOmit']

        if 'individualAtRisk' in request_dict:
            request.individual_at_risk = request_dict['individualAtRisk']

        if 'reasons' in request_dict:
            request.reasons = request_dict['reasons']

        if 'completingParty' in request_dict:
            request.completing_party = request_dict['completingParty']

        if 'completingEmail' in request_dict:
            request.completing_email = request_dict['completingEmail']

        if 'completingName' in request_dict:
            request.completing_name = request_dict['completingName']

        if 'status' in request_dict:
            request.status = request_dict['status']

        # for key in dict_keys:
        #     if key in request_dict:
        #         request[key] = request_dict[key]

        request['updatedAt'] = datetime.today().strftime('%Y-%m-%dT%H:%M:%S')

        return request
