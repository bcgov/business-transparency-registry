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
This module defines submission-related API endpoints.

It provides endpoints to create and retrieve submission objects.
The 'registers' and 'create_register' functions define the 'GET' and 'POST' methods respectively.

"""
from http import HTTPStatus
from flask import Blueprint
from flask import current_app
from flask import g
from flask import jsonify
from flask import request
from flask_cors import cross_origin

from btr_api.common.auth import jwt
from btr_api.exceptions import AuthException, ExternalServiceException
from btr_api.exceptions import error_request_response
from btr_api.exceptions import exception_response
from btr_api.models import Submission as SubmissionModel
from btr_api.models import User as UserModel
from btr_api.models.submission import SubmissionSerializer
from btr_api.services import btr_auth, btr_bor, btr_entity, btr_reg_search
from btr_api.services import SchemaService
from btr_api.services import SubmissionService
from btr_api.services.validator import validate_entity
from btr_api.utils import redact_information

bp = Blueprint('submission', __name__)


@bp.route('/<id>', methods=('GET',))
@jwt.requires_auth
def registers(id: int | None = None):  # pylint: disable=redefined-builtin
    """Get the submissions, or specific submission by id."""
    try:
        if submission := SubmissionModel.find_by_id(id):
            account_id = request.headers.get('Account-Id', None)
            btr_auth.is_authorized(request=request, business_identifier=submission.business_identifier)
            btr_auth.product_authorizations(request=request, account_id=account_id)
            redacted = redact_information(SubmissionSerializer.to_dict(submission), btr_auth.get_user_type())
            return jsonify(type=submission.type, submission=redacted['payload'])

        return {}, HTTPStatus.NOT_FOUND

    except AuthException as aex:
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        return exception_response(exception)


@bp.route('/entity/<business_identifier>', methods=('GET',))
@jwt.requires_auth
def get_entity_submission(business_identifier: str):
    """Get the current submission for specified business identifier."""

    try:
        btr_auth.is_authorized(request=request, business_identifier=business_identifier)
        account_id = request.headers.get('Account-Id', None)
        btr_auth.product_authorizations(request=request, account_id=account_id)

        submission = SubmissionModel.find_by_business_identifier(business_identifier)
        if submission:
            return jsonify(redact_information(SubmissionSerializer.to_dict(submission), btr_auth.get_user_type()))

        return {}, HTTPStatus.NOT_FOUND

    except AuthException as aex:
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        return exception_response(exception)


@bp.route('/', methods=('POST',))
@cross_origin(origin='*')
@jwt.requires_auth
def create_register():
    """
    Create a new register.

    Returns:
        A tuple containing the response JSON and the HTTP status code.
    """
    try:
        user = UserModel.get_or_create_user_by_jwt(g.jwt_oidc_token_info)
        account_id = request.headers.get('Account-Id', None)

        json_input = request.get_json()

        # validate payload; TODO: implement business rules validations
        schema_name = 'btr-filing.schema.json'
        schema_service = SchemaService()
        [valid, errors] = schema_service.validate(schema_name, json_input)
        if not valid:
            return error_request_response('Invalid schema', HTTPStatus.BAD_REQUEST, errors)

        business_identifier = json_input.get('businessIdentifier')
        btr_auth.is_authorized(request=request, business_identifier=business_identifier)

        # get entity
        token = btr_auth.get_bearer_token()
        entity: dict = btr_entity.get_entity_info(None, business_identifier, token).json()

        # validate entity; return FORBIDDEN for historial and frozen companies
        if entity_errors := validate_entity(entity):
            return error_request_response('Invalid entity', HTTPStatus.FORBIDDEN, entity_errors)

        # create submission
        submission = SubmissionService.create_submission(json_input, user.id)
        # create ledger record in LEAR
        try:
            print(1)
            btr_entity.submit_filing(submission, user, jwt, account_id)
        except ExternalServiceException as err:
            # Failed to update ledger, log for ops
            print(2)
            print(err)
            current_app.logger.error(err.with_traceback(None))

        submission.save()
        try:
            # TODO: remove as part of #25913
            # update record in BOR (search)
            address = btr_entity.get_entity_info(
                None, f'{business_identifier}/addresses?addressType=deliveryAddress', token).json()
            entity['business']['addresses'] = [address['deliveryAddress']]
            btr_bor.update_owners(submission, entity, token)
            # update record in REG Search
            btr_reg_search.update_business(submission, entity, token)

        except ExternalServiceException as err:
            # Log error and continue to return successfully (does NOT block the submission)
            current_app.logger.info(err.error)
            current_app.logger.error('Error updating search record for submission: %s', submission.id)

        return jsonify(SubmissionSerializer.to_dict(submission)), HTTPStatus.CREATED

    except AuthException as aex:
        return exception_response(aex)
    except ExternalServiceException as err:
        return exception_response(err)
    except Exception as exception:  # noqa: B902
        return exception_response(exception)


@bp.route('/<sub_id>', methods=('PUT',))
@cross_origin(origin='*')
@jwt.requires_auth
def update_submission(sub_id: int):
    """
    Update an existing submission.
    Any fields that are not in the payload will be ignored.
    To remove a field the payload explicitly pass null

    Returns:
        A tuple containing the response JSON and the HTTP status code.
    """
    try:
        user = UserModel.get_or_create_user_by_jwt(g.jwt_oidc_token_info)
        account_id = request.headers.get('Account-Id', None)
        submission = SubmissionModel.find_by_id(sub_id)
        if submission:
            business_identifier = submission.business_identifier
            btr_auth.is_authorized(request=request, business_identifier=business_identifier)
            btr_auth.product_authorizations(request=request, account_id=account_id)

            # get entity
            token = btr_auth.get_bearer_token()
            entity: dict = btr_entity.get_entity_info(None, business_identifier, token).json()

            # validate entity; return FORBIDDEN for historial and frozen companies
            if entity_errors := validate_entity(entity):
                return error_request_response('Invalid entity', HTTPStatus.FORBIDDEN, entity_errors)

            submitted_json = request.get_json()
            submission = SubmissionService.update_submission(submission,
                                                             submitted_json,
                                                             user.id)

            submission.save_to_session()
            new_full_submission = SubmissionSerializer.to_dict(submission)['payload']
            # validate resulting full submission
            schema_name = 'btr-filing.schema.json'
            schema_service = SchemaService()
            [valid, errors] = schema_service.validate(schema_name, new_full_submission)
            if not valid:
                return error_request_response('Invalid schema', HTTPStatus.BAD_REQUEST, errors)

            # create ledger record in LEAR
            try:
                btr_entity.submit_filing(submission, user, jwt, account_id)
            except ExternalServiceException as err:
                # Failed to update ledger, log for ops
                current_app.logger.error(err.with_traceback(None))

            submission.save()

            try:
                # TODO: remove as part of #25913
                # update record in BOR (search)
                address = btr_entity.get_entity_info(
                    None, f'{business_identifier}/addresses?addressType=deliveryAddress', token).json()
                entity['business']['addresses'] = [address['deliveryAddress']]
                btr_bor.update_owners(submission, entity, token)
                # update record in REG Search
                btr_reg_search.update_business(submission, entity, token)

            except ExternalServiceException as err:
                # Log error and continue to return successfully (does NOT block the submission)
                current_app.logger.info(err.error)
                current_app.logger.error('Error updating search records for submission: %s', submission.id)

            return jsonify(redact_information(new_full_submission,
                                              btr_auth.get_user_type())), HTTPStatus.OK

        return {}, HTTPStatus.NOT_FOUND

    except AuthException as aex:
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        return exception_response(exception)
