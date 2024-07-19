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
from flask import Flask
import requests
from requests import exceptions

from btr_api.exceptions import AuthException
from btr_api.exceptions import ExternalServiceException
from btr_api.common.auth import jwt
from btr_api.enums import UserType


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

    def get_user_type(self):
        """
        Get the type of user based on their products, roles, and organization membership.

        Returns:
            str: The type of the user (USER_COMPETENT_AUTHORITY, USER_STAFF, or USER_PUBLIC).
        """
        try:
            products = jwt.products.json()
            if any(
                product
                for product in products
                if product['code'].upper() == UserType.CA_PRODUCT and product['subscriptionStatus'].upper() == 'ACTIVE'
            ):
                self.app.logger.info('Get User Type: ' + UserType.USER_COMPETENT_AUTHORITY)
                return UserType.USER_COMPETENT_AUTHORITY
            if jwt.validate_roles([UserType.STAFF_ROLE]):
                return UserType.USER_STAFF
        except Exception as e:
            self.app.logger.error('Error in Get User Type: ' + str(e))

        self.app.logger.info('Get User Type: ' + UserType.USER_PUBLIC)
        return UserType.USER_PUBLIC

    def get_bearer_token(self):
        """Get a valid Bearer token for the service to use."""
        data = 'grant_type=client_credentials'
        try:
            res = requests.post(
                url=self.sso_svc_token_url,
                data=data,
                headers={'content-type': 'application/x-www-form-urlencoded'},
                auth=(self.svc_acc_id, self.svc_acc_secret),
                timeout=self.sso_svc_timeout,
            )
            if res.status_code != HTTPStatus.OK:
                raise ConnectionError({'statusCode': res.status_code, 'json': res.json()})
            return res.json().get('access_token')
        except exceptions.Timeout as err:
            self.app.logger.debug('SSO SVC connection timeout: %s', err.with_traceback(None))
            raise ExternalServiceException(
                HTTPStatus.GATEWAY_TIMEOUT,
                [{'message': 'Unable to get service account token.', 'reason': err.with_traceback(None)}],
            ) from err
        except Exception as err:  # noqa: B902
            self.app.logger.debug('SSO SVC connection failure: %s', err.with_traceback(None))
            raise ExternalServiceException(
                HTTPStatus.SERVICE_UNAVAILABLE,
                [{'message': 'Unable to get service account token.', 'reason': err.with_traceback(None)}],
            ) from err

    def get_authorization_header(self, request) -> str:
        """Gets authorization header from request."""
        authorization_header = request.headers.get('Authorization', None)
        if not authorization_header:
            error = f'Missing authorization header: {request.headers}'
            self.app.logger.debug('Cannot find authorization_header in request.')
            raise AuthException(error=error, status_code=HTTPStatus.UNAUTHORIZED)

        return authorization_header

    # TODO: Add caching
    def product_authorizations(self, request, account_id: str) -> bool:
        """Get the products associated with the user and account_id."""
        if not account_id:
            error = 'Missing account_id'
            self.app.logger.debug(error)
            return True
        try:
            auth_token = self.get_authorization_header(request)
            # make api call
            headers = {'Authorization': auth_token}
            auth_url = f'{self.svc_url}/orgs/{account_id}/products?include_hidden=true'
            self.app.logger.debug(auth_url)
            resp = requests.get(url=auth_url, headers=headers, timeout=self.timeout)

            if resp.status_code >= HTTPStatus.INTERNAL_SERVER_ERROR:
                error = f'{resp.status_code} - {str(resp.json())}'
                self.app.logger.debug('Invalid response from auth-api: %s', error)

            if resp.status_code != HTTPStatus.OK:
                error = f'Unauthorized access to products {account_id}'
                self.app.logger.debug(error)

            jwt.products = resp
            return True
        except Exception as err:
            self.app.logger.debug(err)
            return True

    # TODO: Add caching
    def is_authorized(self, request, business_identifier: str) -> bool:
        """Authorize the user for access to the service."""
        try:
            auth_token = self.get_authorization_header(request)
            # make api call
            headers = {'Authorization': auth_token}
            auth_url = f'{self.svc_url}/entities/{business_identifier}/authorizations'

            resp = requests.get(url=auth_url, headers=headers, timeout=self.timeout)

            if resp.status_code >= HTTPStatus.INTERNAL_SERVER_ERROR:
                error = f'{resp.status_code} - {str(resp.json())}'
                self.app.logger.debug('Invalid response from auth-api: %s', error)
                raise ExternalServiceException(error=error, status_code=HTTPStatus.SERVICE_UNAVAILABLE)

            if resp.status_code != HTTPStatus.OK or 'edit' not in resp.json().get('roles', []):
                error = f'Unauthorized access to business: {business_identifier}'
                self.app.logger.debug(error)
                raise AuthException(error=error, status_code=HTTPStatus.FORBIDDEN)

            return True
        except AuthException as e:
            # pass along
            raise e
        except ExternalServiceException as exc:
            # pass along
            raise exc
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as err:
            self.app.logger.debug('Auth connection failure:', repr(err))
            raise ExternalServiceException(error=repr(err), status_code=HTTPStatus.SERVICE_UNAVAILABLE) from err
        except Exception as err:
            self.app.logger.debug('Generic Auth verification failure:', repr(err))
            raise ExternalServiceException(error=repr(err), status_code=HTTPStatus.SERVICE_UNAVAILABLE) from err
