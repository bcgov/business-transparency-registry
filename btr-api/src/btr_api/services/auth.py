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
"""Manages auth service interactions."""
from http import HTTPStatus

import requests
from requests import exceptions
from flask import Flask

from btr_api.exceptions import ExternalServiceException


class AuthService:
    """Provides utility functions for connecting with the BC Registries auth-api and SSO service."""
    app: Flask = None
    svc_url: str = None
    timeout: int = None
    sso_svc_token_url: str = None
    sso_svc_timeout: int = None
    svc_acc_id: str = None
    svc_acc_secret: str = None

    def __init__(self, app: Flask = None):
        """Initialize the auth service."""
        if app:
            self.init_app(app)

    def init_app(self, app: Flask):
        """Initialize app dependent variables."""
        self.app = app
        self.svc_url = app.config.get('AUTH_SVC_URL')
        self.timeout = app.config.get('AUTH_API_TIMEOUT', 20)
        self.sso_svc_token_url = app.config.get('SSO_SVC_TOKEN_URL')
        self.sso_svc_timeout = app.config.get('SSO_SVC_TIMEOUT', 20)
        self.svc_acc_id = app.config.get('SVC_ACC_CLIENT_ID')
        self.svc_acc_secret = app.config.get('SVC_ACC_CLIENT_SECRET')

    def get_bearer_token(self):
        """Get a valid Bearer token for the service to use."""
        data = 'grant_type=client_credentials'
        try:
            res = requests.post(url=self.sso_svc_token_url,
                                data=data,
                                headers={'content-type': 'application/x-www-form-urlencoded'},
                                auth=(self.svc_acc_id, self.svc_acc_secret),
                                timeout=self.sso_svc_timeout)
            if res.status_code != HTTPStatus.OK:
                raise ConnectionError({'statusCode': res.status_code, 'json': res.json()})
            return res.json().get('access_token')
        except exceptions.Timeout as err:
            self.app.logger.debug('SSO SVC connection timeout: %s', err.with_traceback(None))
            raise ExternalServiceException(HTTPStatus.GATEWAY_TIMEOUT,
                                           [{'message': 'Unable to get service account token.',
                                             'reason': err.with_traceback(None)}]) from err
        except Exception as err:  # noqa: B902
            self.app.logger.debug('SSO SVC connection failure: %s', err.with_traceback(None))
            raise ExternalServiceException(HTTPStatus.SERVICE_UNAVAILABLE,
                                           [{'message': 'Unable to get service account token.',
                                             'reason': err.with_traceback(None)}]) from err
