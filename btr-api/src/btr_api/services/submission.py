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
In this process, it also interacts with the `PersonService` and `OwnershipDetailsService`.

The individual services can be invoked as per the requirements.

"""
from datetime import date

from btr_api.models import Submission as SubmissionModel


class SubmissionService:  # pylint: disable=too-few-public-methods
    """
    The `SubmissionService` class is responsible for handling submissions and creating submission models.

    Creates a submission model based on the given submission dictionary. The submission dictionary should contain
    the necessary information for creating a submission.

    """
    @staticmethod
    def create_submission(submission_dict: dict) -> SubmissionModel:
        """
        create_submission(submission_dict: dict) -> SubmissionModel

        Creates a submission object from the provided submission dictionary.

        Parameters:
        - submission_dict (dict): A dictionary representing the submission details.
          It should consist of the following keys:
            - 'effectiveDate' (str): The effective date of the submission in ISO format.
            - 'significantIndividuals' (list):
                A list of dictionaries containing information about significant individuals.
                Each dictionary should include the following keys:
                - 'profile' (dict, optional): A dictionary representing the profile of the significant individual.
                    It should have the 'uuid' key, which provides the UUID of the person. If not provided, a new person
                    will be created using the information from 'significantIndividuals'.
                - 'businessIdentifier' (str): The business identifier associated with the submission.

        Returns:
        - submission (SubmissionModel): An instance of the SubmissionModel class, representing the created submission.

        """
        submission = SubmissionModel()
        submission.effective_date = date.fromisoformat(submission_dict['effectiveDate'])
        submission.payload = submission_dict

        for significant_individual in submission_dict['significantIndividuals']:

            significant_individual['businessIdentifier'] = submission_dict['businessIdentifier']

        return submission
