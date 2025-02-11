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
import uuid
from copy import deepcopy
from datetime import datetime
from http import HTTPStatus
from zoneinfo import ZoneInfo

from flask import current_app

from btr_api.exceptions import BusinessException, ExternalServiceException
from btr_api.models import Ownership, Person, Submission as SubmissionModel
from btr_api.models.submission import SubmissionType
from btr_api.utils import deep_spread

from .auth import AuthService
from .email import EmailService
from .entity import EntityService


class SubmissionService:  # pylint: disable=too-few-public-methods
    """
    The `SubmissionService` class is responsible for handling submissions and creating submission models.

    Creates a submission model based on the given submission dictionary. The submission dictionary should contain
    the necessary information for creating a submission.
    """
    @staticmethod
    def _get_linked_ownership_stmnt(person_stmnt_id: str, ownership_stmnts: list[dict]):
        """Return the linked ownership statement. Raises a BusinessException if a linked statement is not found."""
        for ownership in ownership_stmnts:
            if ownership['interestedParty']['describedByPersonStatement'] == person_stmnt_id:
                return ownership

        raise BusinessException(
            'Invalid payload. All submitted person statements must be linked to an ownership statement.',
            f'Person statement id: {person_stmnt_id}',
            HTTPStatus.BAD_REQUEST)

    @staticmethod
    def _get_submission_type_from_filing_type(filing_type: str) -> SubmissionType:
        """Return the submission type enum that maps to the filing type from the filing."""
        mapping = {
            'ANNUAL_FILING': SubmissionType.annual,
            'CHANGE_FILING': SubmissionType.change,
            'INITIAL_FILING': SubmissionType.initial
        }
        # default to change since we don't know what it is and initial/annual have specific meaning
        return mapping.get(filing_type, SubmissionType.change)

    @staticmethod
    def add_statements(submission: SubmissionModel,
                       new_person_stmnts: list[dict],
                       new_ownership_stmnts: list[dict]):
        """
        Add the ownership and person statement records to the session.
        NOTE: Each person statement needs a 1:1 link with a corresponding ownership statement.
        """
        for person_stmnt in new_person_stmnts:
            ownership_stmnt = SubmissionService._get_linked_ownership_stmnt(person_stmnt['statementID'],
                                                                            new_ownership_stmnts)
            person = Person(statement_id=uuid.uuid4(), person_json=deepcopy(person_stmnt))
            person.save_to_session()
            ownership = Ownership(statement_id=uuid.uuid4(),
                                  ownership_json=deepcopy(ownership_stmnt),
                                  person=person,
                                  submission=submission)
            ownership.save_to_session()
            try:
                if person_stmnt.get('email'):
                    business_identifier = submission.submitted_payload['businessIdentifier']
                    auth = AuthService(current_app)
                    entity = EntityService(current_app)
                    token = auth.get_bearer_token()
                    business = entity.get_entity_info(None, business_identifier, token).json()
                    delivery_address = EntityService(current_app).get_entity_info(
                        None, f'{business_identifier}/addresses?addressType=deliveryAddress', token).json()
                    business_contact = auth.get_business_contact(token, business_identifier)
                    business_info = {**business, **delivery_address, 'contact': {**business_contact}}
                    EmailService(current_app).send_added_to_btr_email(person.person_json,
                                                                      business_info,
                                                                      submission.submitted_payload['effectiveDate'],
                                                                      token)

            except (BusinessException, ExternalServiceException) as err:
                # Log error and continue to return successfully (does NOT block the submission)
                current_app.logger.info(err.error)
                current_app.logger.error('Error sending email for person: %s', person.id)

    @staticmethod
    def create_submission(submission_dict: dict, submitter_id: int) -> SubmissionModel:
        """
        This method creates/replaces the current submission for the business using the provided submission dict.

        Parameters:
        - submission_dict (dict): A dictionary containing the submission data. It should have the following keys:
            - 'effectiveDate': A string representing the effective date of the submission in ISO format (YYYY-MM-DD).
            - 'businessIdentifier': A string representing the business identifier for the submission.
            - Any other key-value pairs representing additional payload data.
        - submitter_id (int): The id of the user who is creating the submission.

        Returns:
        - SubmissionModel: A SubmissionModel object that represents the created submission.
        """
        submission = SubmissionModel.find_by_business_identifier(submission_dict['businessIdentifier'])
        if submission:
            return SubmissionService.update_submission(submission, submission_dict, submitter_id)

        # init submission
        submission = SubmissionModel(submitter_id=submitter_id,
                                     submitted_datetime=datetime.now(ZoneInfo('America/Vancouver')),
                                     submitted_payload=submission_dict,
                                     type=SubmissionService._get_submission_type_from_filing_type(
                                         submission_dict.get('filingType', '')))
        submission.save_to_session()
        # add ownership / person records to session
        SubmissionService.add_statements(submission,
                                         submission.submitted_payload['personStatements'],
                                         submission.submitted_payload['ownershipOrControlStatements'])
        return submission

    @staticmethod
    def update_submission(submission: SubmissionModel,
                          submission_dict: dict,
                          submitter_id: int) -> SubmissionModel:
        """
        This method replaces the current submission for the business using the provided submission dict.

        Parameters:
        - submission_dict (dict): A dictionary containing the submission data. It should have the following keys:
            - 'effectiveDate': A string representing the effective date of the submission in ISO format (YYYY-MM-DD).
            - 'businessIdentifier': A string representing the business identifier for the submission.
            - Any other key-value pairs representing additional payload data.
        - submitter_id (int): The id of the user who is creating the submission.

        Returns:
        - SubmissionModel: A SubmissionModel object that represents the created submission.
        """
        submission.submitted_payload = submission_dict
        submission.submitter_id = submitter_id
        submission.submitted_datetime = datetime.now(ZoneInfo('America/Vancouver'))
        submission.type = SubmissionService._get_submission_type_from_filing_type(submission_dict.get('filingType', ''))
        # update ownership statements
        new_person_stmnts = []
        new_ownership_stmnts = []
        for person_stmnt in submission_dict['personStatements']:
            person_stmnt_id = person_stmnt['statementID']
            ownership_stmnt = SubmissionService._get_linked_ownership_stmnt(
                person_stmnt_id,
                submission_dict['ownershipOrControlStatements']
            )
            ownership_stmnt_id = ownership_stmnt['statementID']
            if current_ownership := Ownership.find_by_statement_id(ownership_stmnt_id):
                if current_ownership.submission_id != submission.id:
                    raise BusinessException(
                        'Invalid payload. Existing ownership statement linked to a different submission.',
                        f'Ownership statement id: {ownership_stmnt_id}',
                        HTTPStatus.BAD_REQUEST
                    )

                if str(current_ownership.person.statement_id) != person_stmnt_id:
                    raise BusinessException(
                        'Invalid payload. Existing ownership statement linked to a different person.',
                        f'Ownership statement id: {ownership_stmnt_id}',
                        HTTPStatus.BAD_REQUEST
                    )
                # TODO: 'deep_spread' needs to be fixed #23489
                current_ownership.ownership_json = deep_spread(current_ownership.ownership_json,
                                                               ownership_stmnt)

                current_ownership.person.person_json = deep_spread(current_ownership.person.person_json,
                                                                   person_stmnt)
                current_ownership.save_to_session()
            else:
                new_ownership_stmnts.append(ownership_stmnt)
                new_person_stmnts.append(person_stmnt)

        SubmissionService.add_statements(submission, new_person_stmnts, new_ownership_stmnts)

        return submission
