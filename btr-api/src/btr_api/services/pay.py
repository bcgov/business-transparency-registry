# Copyright © 2022 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Manages filing type codes and payment service interactions."""

from http import HTTPStatus
from typing import Tuple

import requests
from flask import Flask
from flask_jwt_oidc import JwtManager

from btr_api.exceptions import ExternalServiceException


class PayService:
    """
    A class that provides utility functions for connecting with the BC Registries pay-api.
    """
    app: Flask = None
    default_invoice_payload: dict = {}
    svc_url: str = None
    timeout: int = None
    
    def __init__(self, app: Flask = None, default_invoice_payload: dict = None):
        """Initialize the Solr environment."""
        if app:
            self.init_app(app)
        if default_invoice_payload:
            self.default_invoice_payload = default_invoice_payload

    def init_app(self, app: Flask):
        """Initialize app dependent variables."""
        self.app = app
        self.svc_url = app.config.get('PAYMENT_SVC_URL')
        self.timeout = app.config.get('PAY_API_TIMEOUT', 20)

    def create_invoice(self, account_id: str, user_jwt: JwtManager, details: dict) -> Tuple[int, dict, int]:
        """Create the invoice via the pay-api."""
        payload = self.default_invoice_payload
        # update payload details
        if folio_number := details.get('folioNumber', None):
            payload['filingInfo']['folioNumber'] = folio_number

        if identifier := details.get('businessIdentifier', None):
            label_name = 'Registration Number' if identifier[:2] == 'FM' else 'Incorporation Number'
            payload['details'] = [{'label': f'{label_name}: ', 'value': identifier}]
            payload['businessInfo']['businessIdentifier'] = identifier

        try:
            # make api call
            token = user_jwt.get_token_auth_header()
            headers = {'Authorization': 'Bearer ' + token,
                       'Content-Type': 'application/json',
                       'Account-Id': account_id}
            print('here')
            return requests.post(url=self.svc_url, json=payload, headers=headers, timeout=self.timeout)

        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as err:
            self.app.logger.error('Pay-api connection failure:', repr(err))
            raise ExternalServiceException(error=repr(err), status_code=HTTPStatus.PAYMENT_REQUIRED) from err
        except Exception as err:
            self.app.logger.error('Pay-api integration (create invoice) failure:', repr(err))
            raise ExternalServiceException(error=repr(err), status_code=HTTPStatus.PAYMENT_REQUIRED) from err
