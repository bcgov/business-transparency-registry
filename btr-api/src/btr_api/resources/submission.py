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

from flask import Blueprint, current_app, g, jsonify, request
from flask_cors import cross_origin

from btr_api.common.auth import jwt
from btr_api.exceptions import ExternalServiceException, exception_response
from btr_api.models import Submission as SubmissionModel, User as UserModel
from btr_api.models.submission import SubmissionSerializer
from btr_api.services import btr_pay, btr_entity, SchemaService, SubmissionService
from btr_api.services.validator import validate_entity

bp = Blueprint("submission", __name__)


@bp.route("/", methods=("GET",))
@bp.route("/<id>", methods=("GET",))
def registers(id: int | None = None):  # pylint: disable=redefined-builtin
    """Get the submissions, or sepcific submission by id."""
    try:
        if id:
            if submission := SubmissionModel.find_by_id(id):
                return jsonify(type=submission.type, submission=submission.payload)
            return {}, HTTPStatus.NOT_FOUND

        submissions = SubmissionModel.get_filtered_submissions()
        submissions = [SubmissionSerializer.to_dict(submission) for submission in submissions]

        return jsonify(submissions)

    except Exception as exception:  # noqa: B902
        return exception_response(exception)


@bp.route("/entity/<business_identifier>", methods=("GET",))
def get_entity_submission(business_identifier: str):
    """Get the current submission for specified business identifier."""

    try:
        submission = SubmissionModel.find_by_business_identifier(business_identifier)
        if submission:
            return jsonify(SubmissionSerializer.to_dict(submission))

        return {}, HTTPStatus.NOT_FOUND

    except Exception as exception:  # noqa: B902
        return exception_response(exception)


@bp.route("/", methods=("POST",))
@cross_origin(origin='*')
@jwt.requires_auth
def create_register():
    """
    Create a new register.

    Returns:
        A tuple containing the response JSON and the HTTP status code.
    """
    try:
        # TODO: check auth / validate user access
        user = UserModel.get_or_create_user_by_jwt(g.jwt_oidc_token_info)
        account_id = request.headers.get('Account-Id', None)

        json_input = request.get_json()

        # validate payload; TODO: implement business rules validations
        schema_name = "btr-filing.schema.json"
        schema_service = SchemaService()
        [valid, errors] = schema_service.validate(schema_name, json_input)
        if not valid:
            return {"errors": errors}, HTTPStatus.BAD_REQUEST

        # get entity
        identifier = json_input['businessIdentifier']
        entity = btr_entity.get_entity(jwt, identifier).json()

        # validate entity; return BAD_REQUEST for historial companies and frozem company
        entity_errors = validate_entity(entity)
        if entity_errors:
            return {"error": entity_errors}, HTTPStatus.BAD_REQUEST

        # create submission
        submission = SubmissionService.create_submission(json_input, user.id)
        # save before attempting invoice creation so that we can log the id for ops if there's an error
        submission.save_to_session()
        try:
            # create invoice in pay system
            invoice_resp = btr_pay.create_invoice(account_id, jwt, json_input)
            submission.invoice_id = invoice_resp.json()['id']
            submission.save()
        except ExternalServiceException as err:
            # Log error and continue to return successfully (does NOT block the submission)
            # TODO: save this information to a table so that a daily job can pick these up and retry them
            # Current process is for OPs to retry the invoice creation manually
            current_app.logger.info(err.error)
            current_app.logger.error('Error creating invoice for submission: %s', submission.id)

        return jsonify(id=submission.id), HTTPStatus.CREATED

    except Exception as exception:  # noqa: B902
        return exception_response(exception)
