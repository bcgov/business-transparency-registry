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
This module defines request-related API endpoints.

It provides endpoints to create and retrieve request objects.
The 'get_request' and 'create_request' functions define the 'GET' and 'POST' methods respectively.

"""
import uuid
from http import HTTPStatus
from flask import Blueprint
from flask import current_app
from flask import g
from flask import jsonify
from flask import request
from flask_cors import cross_origin

from btr_api.common.auth import jwt
from btr_api.exceptions import AuthException
from btr_api.exceptions import error_request_response
from btr_api.exceptions import exception_response
from btr_api.models import Request as RequestModel
from btr_api.models import User as UserModel
from btr_api.models.request import RequestSerializer
from btr_api.services import btr_auth
from btr_api.services import SchemaService
from btr_api.services import RequestService
from btr_api.enums import UserType

bp = Blueprint('request', __name__)


@bp.route('/', methods=('GET',))
@jwt.requires_auth
def get_all():  # pylint: disable=redefined-builtin
    try:
      account_id = request.headers.get('Account-Id', None)
      btr_auth.product_authorizations(request=request, account_id=account_id)
      if btr_auth.get_user_type() == UserType.USER_STAFF:
          resp = []
          results = RequestModel.query.filter_by().all()
          for result in results:
              resp.append(RequestSerializer.to_dict(result))
          return jsonify(resp), HTTPStatus.OK
    except AuthException as aex:
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        return exception_response(exception)

@bp.route('/<id>', methods=('GET',))
@jwt.requires_auth
def get_request(id: uuid.UUID | None = None):  # pylint: disable=redefined-builtin
    """Get the request by id."""
    try:
      if req := RequestModel.find_by_uuid(id):
          account_id = request.headers.get('Account-Id', None)
          btr_auth.product_authorizations(request=request, account_id=account_id)
          if btr_auth.get_user_type() == UserType.USER_STAFF:
            return jsonify(RequestSerializer.to_dict(req)), HTTPStatus.OK

      return {}, HTTPStatus.NOT_FOUND

    except AuthException as aex:
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        return exception_response(exception)


@bp.route('/', methods=('POST',))
@cross_origin(origin='*')
def create_request():
    """
    Create a new request.

    Returns:
        A tuple containing the response JSON and the HTTP status code.
    """
    try:

        json_input = request.get_json()

        # validate payload
        schema_name = 'btr-bods-request.json'
        schema_service = SchemaService()
        [valid, errors] = schema_service.validate(schema_name, json_input)
        if not valid:
            return error_request_response('Invalid schema', HTTPStatus.BAD_REQUEST, errors)

        # create request
        req = RequestService.create_request(json_input)
        req.save()

        return jsonify(RequestSerializer.to_dict(req)), HTTPStatus.CREATED

    except AuthException as aex:
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        current_app.logger.error(exception.with_traceback(None))
        return exception_response(exception)


@bp.route('/<req_id>', methods=('PUT',))
@cross_origin(origin='*')
@jwt.requires_auth
def update_request(req_id: str):
    """
    Update an existing request.
    Any fields that are not in the payload will be ignored.
    To remove a field the payload explicitly pass null

    Returns:
        A tuple containing the response JSON and the HTTP status code.
    """
    try:
        UserModel.get_or_create_user_by_jwt(g.jwt_oidc_token_info)
        account_id = request.headers.get('Account-Id', None)
        req = RequestModel.find_by_uuid(req_id)
        if req:
            btr_auth.product_authorizations(request, account_id)
            if btr_auth.get_user_type() != UserType.USER_STAFF:
                return {}, HTTPStatus.NOT_FOUND

            req_json = request.get_json()
            req = RequestService.update_request(req, req_json)

            req_d = RequestSerializer.to_dict(req)
            try:
                req_d['birthdate'] = req_d['birthdate'].strftime('%Y-%m-%d')
            except Exception:
                pass

            # validate resulting full request
            schema_name = 'btr-bods-request.json'
            schema_service = SchemaService()
            [valid, errors] = schema_service.validate(schema_name, req_d)
            if not valid:
                return error_request_response('Invalid schema', HTTPStatus.BAD_REQUEST, errors)

            req.save()

            return jsonify(RequestSerializer.to_dict(req)), HTTPStatus.OK

        return {}, HTTPStatus.NOT_FOUND

    except AuthException as aex:
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        current_app.logger.error(exception.with_traceback(None))
        return exception_response(exception)
