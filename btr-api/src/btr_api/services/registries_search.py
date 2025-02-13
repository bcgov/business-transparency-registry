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
"""Manages registries search api interactions.

NOTE: this is temporary as the trickle feed listener will handle this in the future.
"""
from http import HTTPStatus

import requests
from flask import Flask

from btr_api.exceptions import ExternalServiceException
from btr_api.models import Submission


class RegSearchService:
    """
    A class that provides utility functions for connecting with the BC Registries search-api.
    """
    app: Flask = None
    svc_url: str = None
    timeout: int = None

    def __init__(self, app: Flask = None):
        """Initialize the registries search service."""
        if app:
            self.init_app(app)

    def init_app(self, app: Flask):
        """Initialize app dependent variables."""
        self.app = app
        self.svc_url = app.config.get('SEARCH_SVC_URL')
        self.timeout = app.config.get('SEARCH_API_TIMEOUT', 20)

    def update_business(self, submission: Submission, business: dict, token: str) -> requests.Response:
        """Update businesses via the search-api."""
        try:
            business_identifier = business['business']['identifier']
            # collect current parties
            parties = []
            for person in submission.person_statements_json:
                party_name = ''
                for name in person.get('names'):
                    if name.get('type') == 'individual':  # expecting this to be 'individual' or 'alternative'
                        party_name = name.get('fullName')
                        break
                if not party_name:
                    self.app.logger.debug('Person names: %s', person.get('names'))
                    self.app.logger.error('Error parsing SI name for %s', business_identifier)

                parties.append({
                    'id': f"{business_identifier}_{person['statementID']}",
                    'partyName': party_name,
                    'partyRoles': ['significant individual'],
                    'partyType': 'person'
                })

            # make update call to reg search with headers + payload
            payload = {
                'type': 'partial',
                'businesses': [{
                    'id': business_identifier,
                    'parties': {'add': parties}
                }]
            }

            headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}
            resp = requests.put(url=self.svc_url + '/internal/solr/import',
                                json=payload,
                                headers=headers,
                                timeout=self.timeout)

            if not resp.ok:
                error = f'{resp.status_code} - {str(resp.json())}'
                self.app.logger.debug('Invalid response from search-api: %s', error)
                raise ExternalServiceException(error=error, status_code=HTTPStatus.SERVICE_UNAVAILABLE)

            return resp

        except ExternalServiceException as exc:
            # pass along
            raise exc
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as err:
            self.app.logger.debug('search-api connection failure: %s', repr(err))
            raise ExternalServiceException(error=repr(err), status_code=HTTPStatus.SERVICE_UNAVAILABLE) from err
        except Exception as err:
            self.app.logger.debug('search-api integration (update businesses) failure: %s', repr(err))
            raise ExternalServiceException(error=repr(err), status_code=HTTPStatus.SERVICE_UNAVAILABLE) from err
