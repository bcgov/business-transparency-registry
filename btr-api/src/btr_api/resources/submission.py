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
from btr_api.exceptions import AuthException
from btr_api.exceptions import error_request_response
from btr_api.exceptions import exception_response
from btr_api.exceptions import ExternalServiceException
from btr_api.models import Submission as SubmissionModel
from btr_api.models import User as UserModel
from btr_api.models.submission import SubmissionSerializer
from btr_api.services import btr_auth
from btr_api.services import btr_bor
from btr_api.services import btr_entity
from btr_api.services import btr_pay
from btr_api.services import btr_reg_search
from btr_api.services import SchemaService
from btr_api.services import SubmissionService
from btr_api.services.validator import validate_entity
from btr_api.utils import redact_information, deep_spread

bp = Blueprint('submission', __name__)


@bp.route('/<id>', methods=('GET',))
def registers(id: int | None = None):  # pylint: disable=redefined-builtin
    """Get the submissions, or specific submission by id."""
    try:
        if submission := SubmissionModel.find_by_id(id):
            account_id = request.headers.get('Account-Id', None)
            btr_auth.is_authorized(request=request, business_identifier=submission.business_identifier)
            btr_auth.product_authorizations(request=request, account_id=account_id)
            if submission.submitted_payload is None or submission.submitted_payload == '':
                submission.submitted_payload = submission.payload
            redacted = redact_information(SubmissionSerializer.to_dict(submission))
            return jsonify(type=submission.type, submission=redacted['payload'])

        return {}, HTTPStatus.NOT_FOUND

    except AuthException as aex:
        current_app.logger.info("auth ex")
        current_app.logger.error(aex)
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        current_app.logger.info("ex")
        current_app.logger.error(exception)
        return exception_response(exception)


@bp.route('/entity/<business_identifier>', methods=('GET',))
def get_entity_submission(business_identifier: str):
    """Get the current submission for specified business identifier."""

    try:
        btr_auth.is_authorized(request=request, business_identifier=business_identifier)
        account_id = request.headers.get('Account-Id', None)
        btr_auth.product_authorizations(request=request, account_id=account_id)

        submission = SubmissionModel.find_by_business_identifier(business_identifier)
        if submission:
            if submission.submitted_payload is None or submission.submitted_payload == '':
                submission.submitted_payload = submission.payload
            return jsonify(redact_information(SubmissionSerializer.to_dict(submission)))

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
        entity: dict = btr_entity.get_entity_info(jwt, business_identifier).json()

        # validate entity; return FORBIDDEN for historial and frozen companies
        if entity_errors := validate_entity(entity):
            return error_request_response('Invalid entity', HTTPStatus.FORBIDDEN, entity_errors)

        # create submission
        submission = SubmissionService.create_submission(json_input, user.id)
        # save before attempting invoice creation so that we can log the id for ops if there's an error
        submission.save_to_session()
        try:
            # NOTE: this will be moved out of this api once lear filings are linked
            # create invoice in pay system
            invoice_resp = btr_pay.create_invoice(account_id, jwt, json_input)
            submission.invoice_id = invoice_resp.json()['id']
        except ExternalServiceException as err:
            # Log error and continue to return successfully (does NOT block the submission)
            current_app.logger.info(err.error)
            current_app.logger.error('Error creating invoice for submission: %s', submission.id)

        submission.save()
        try:
            # NOTE: this will be moved out of this api once lear filings are linked
            # update record in BOR (search)
            token = btr_auth.get_bearer_token()
            entity_addresses: dict[str, dict[str, dict]] = btr_entity.get_entity_info(
                jwt, f'{business_identifier}/addresses'
            ).json()
            entity['business']['addresses'] = [entity_addresses.get('registeredOffice', {}).get('deliveryAddress')]
            btr_bor.update_owners(submission, entity, token)
            # update record in REG Search
            btr_reg_search.update_business(submission, entity, token)

        except ExternalServiceException as err:
            # Log error and continue to return successfully (does NOT block the submission)
            current_app.logger.info(err.error)
            current_app.logger.error('Error updating search record for submission: %s', submission.id)

        return jsonify(id=submission.id), HTTPStatus.CREATED

    except AuthException as aex:
        return exception_response(aex)
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
            entity: dict = btr_entity.get_entity_info(jwt, business_identifier).json()

            # validate entity; return FORBIDDEN for historial and frozen companies
            if entity_errors := validate_entity(entity):
                return error_request_response('Invalid entity', HTTPStatus.FORBIDDEN, entity_errors)

            submitted_json = request.get_json()
            sub_dict = SubmissionSerializer.to_dict(submission)
            new_payload = deep_spread(sub_dict['payload'], submitted_json)

            # validate payload; TODO: implement business rules validations
            schema_name = 'btr-filing.schema.json'
            schema_service = SchemaService()
            [valid, errors] = schema_service.validate(schema_name, new_payload)
            if not valid:
                return error_request_response('Invalid schema', HTTPStatus.BAD_REQUEST, errors)

            submission = SubmissionService.update_submission(submission, new_payload, user.id, submitted_json)

            submission.save()
            try:
                # NOTE: this will be moved out of this api once lear filings are linked
                # update record in BOR (search)
                token = btr_auth.get_bearer_token()
                entity_addresses: dict[str, dict[str, dict]] = btr_entity.get_entity_info(
                    jwt, f'{business_identifier}/addresses'
                ).json()
                entity['business']['addresses'] = [entity_addresses.get('registeredOffice', {}).get('deliveryAddress')]
                btr_bor.update_owners(submission, entity, token)
                # update record in REG Search
                btr_reg_search.update_business(submission, entity, token)

            except ExternalServiceException as err:
                # Log error and continue to return successfully (does NOT block the submission)
                current_app.logger.info(err.error)
                current_app.logger.error('Error updating submission: %s', submission.id)
            return jsonify(redact_information(SubmissionSerializer.to_dict(submission))), HTTPStatus.OK

        return {}, HTTPStatus.NOT_FOUND

    except AuthException as aex:
        return exception_response(aex)
    except Exception as exception:  # noqa: B902
        return exception_response(exception)
