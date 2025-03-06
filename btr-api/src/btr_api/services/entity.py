# Copyright © 2024 Province of British Columbia
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
"""Manages entity service interactions."""
import uuid
from http import HTTPStatus

import requests
from flask import Flask
from flask_caching import Cache
from flask_jwt_oidc import JwtManager

from btr_api.exceptions import ExternalServiceException
from btr_api.models import Submission, User
from btr_api.models.submission import SubmissionType
from btr_api.utils.legislation_datetime import LegislationDatetime

entity_cache = Cache()


class EntityService:
    """
    A class that provides utility functions for connecting with the BC Registries legal api.
    """
    app: Flask = None
    svc_url: str = None
    timeout: int = None

    def __init__(self, app: Flask = None):
        """Initialize the entity service."""
        if app:
            self.init_app(app)

    def init_app(self, app: Flask):
        """Initialize app dependent variables."""
        self.app = app
        self.svc_url = app.config.get('LEGAL_SVC_URL')
        self.timeout = app.config.get('LEGAL_SVC_TIMEOUT', 20)
        entity_cache.init_app(app)

    def get_cache_key(self, jwt: JwtManager, path: str, token: str = None):
        """Return the cache key for the given args."""
        if not token:
            token = jwt.get_token_auth_header()
        return 'entity' + token + path

    @entity_cache.cached(timeout=600, make_cache_key=get_cache_key)
    def get_entity_info(self, user_jwt: JwtManager, path: str, token: str = None) -> requests.Response:
        """Get the entity info for the given path.

        Args:
            user_jwt: JwtManager containing the user jwt information from the request
            path: the desired suffix for the legal-api endpoint (i.e. BC1234567, BC1234567/addresses, etc.)
            token: Optional override of the userjwt token
        """
        try:
            if not token:
                token = user_jwt.get_token_auth_header()

            headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}
            self.app.logger.debug('Getting legal-api data for: %s', path)
            resp = requests.get(url=self.svc_url + '/businesses/' + path,
                                headers=headers,
                                timeout=self.timeout)

            if resp.status_code != HTTPStatus.OK:
                error = f'{resp.status_code} - {str(resp.json())}'
                self.app.logger.debug('Invalid response from legal-api: %s', error)

                raise ExternalServiceException(error=error, status_code=resp.status_code)

            return resp

        except ExternalServiceException as exc:
            raise exc
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as err:
            self.app.logger.debug('Legal-api connection failure: %s', repr(err))
            raise ExternalServiceException(error=repr(err), status_code=HTTPStatus.SERVICE_UNAVAILABLE) from err
        except Exception as err:
            self.app.logger.debug('Legal-api integration failure: %s', repr(err))
            raise ExternalServiceException(error=repr(err), status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from err

    def get_entity_todos(self, business_identifier: str, user_jwt: JwtManager):
        """Retrieve the list of tasks (todos) for a given business.

        Args:
            business_identifier: The unique identifier of the business (e.g., 'BC1234567').
            user_jwt: JwtManager containing the user jwt information from the request

        Returns:
            A list of task objects retrieved from the external service.

        Raises:
            ExternalServiceException: If the external service throws an error or an invalid response is received.
        """

        token = user_jwt.get_token_auth_header()
        headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}

        try:
            resp = requests.get(url=f'{self.svc_url}/businesses/{business_identifier}/tasks',
                                headers=headers,
                                timeout=self.timeout)

            if resp.status_code not in [HTTPStatus.OK]:
                error = f'{resp.status_code} - {str(resp.json())}'
                self.app.logger.debug('Error response from legal-api: %s', error)
                raise ExternalServiceException(error=error,
                                               message='Could not fetch todos for: ' + business_identifier)
            return resp.json().get('tasks', [])
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as err:
            self.app.logger.debug('Legal-api connection failure:', repr(err))
            raise ExternalServiceException(error=repr(err),
                                           message='Could not fetch todos for: ' + business_identifier) from err
        except Exception as err:
            self.app.logger.debug('Legal-api call generic exception:', repr(err))
            raise ExternalServiceException(error="Generic exception, see logs for details",
                                           message='Could not fetch todos for: ' + business_identifier) from err

    def submit_filing(self, submission: Submission, user: User, user_jwt: JwtManager, account_id: str):
        """Submit a BTR filing to the LEAR filing ledger for the business."""
        submission.ledger_reference_number = uuid.uuid4()
        payload = {
            'filing': {
                'header': {
                    'name': 'transparencyRegister',
                    'certifiedBy': user.display_name,
                    'date': LegislationDatetime.format_as_legislation_date(submission.submitted_datetime),
                    'effectiveDate': submission.submitted_datetime.isoformat(),
                    'source': 'BTR'
                },
                'business': {
                    'identifier': submission.business_identifier
                },
                'transparencyRegister': {
                    'type': EntityService.get_sub_filing_type(submission),
                    'ledgerReferenceNumber': str(submission.ledger_reference_number)
                }
            }
        }

        token = user_jwt.get_token_auth_header()
        headers = {
            'Authorization': 'Bearer ' + token,
            'Account-Id': account_id,
            'Content-Type': 'application/json'
        }

        self.app.logger.debug('Submitting filing to legal-api: %s, %s',
                              submission.business_identifier,
                              submission.ledger_reference_number)

        try:
            resp = requests.post(url=f'{self.svc_url}/businesses/{submission.business_identifier}/filings',
                                 json=payload,
                                 headers=headers,
                                 timeout=self.timeout)

            if resp.status_code not in [HTTPStatus.OK, HTTPStatus.CREATED, HTTPStatus.ACCEPTED]:
                error = f'{resp.status_code} - {str(resp.json())}'
                self.app.logger.debug('Error response from legal-api: %s', error)
                raise ExternalServiceException(error=error,
                                               message=('Ledger update error: %s, %s',
                                                        submission.business_identifier,
                                                        submission.ledger_reference_number))

            submission.ledger_updated = True

        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as err:
            self.app.logger.debug('Legal-api connection failure:', repr(err))
            raise ExternalServiceException(error=repr(err),
                                           message=('Ledger update error: %s, %s',
                                                    submission.business_identifier,
                                                    submission.ledger_reference_number)) from err
        except Exception as err:
            self.app.logger.debug('Legal-api submit filing failure:', repr(err))
            raise ExternalServiceException(error=repr(err),
                                           message=('Ledger update error: %s, %s',
                                                    submission.business_identifier,
                                                    submission.ledger_reference_number)) from err

    @staticmethod
    def get_sub_filing_type(submission: Submission) -> str:
        """Return the submission type enum that maps to the filing type from the filing."""
        mapping = {
            SubmissionType.ANNUAL_FILING: 'annual',
            SubmissionType.CHANGE_FILING: 'change',
            SubmissionType.INITIAL_FILING: 'initial'
        }
        # default to change since we don't know what it is and initial/annual have specific meaning
        return mapping.get(submission.type, 'change')
