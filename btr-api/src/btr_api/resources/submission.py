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
from flask import jsonify
from flask import request

from btr_api.exceptions import exception_response
from btr_api.models import Submission as SubmissionModel
from btr_api.models.submission import SubmissionSerializer, SubmissionFilter
from btr_api.services.json_schema import SchemaService
from btr_api.services.submission import SubmissionService

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
def latest_submission_for_entity(business_identifier: str):
    """Get the latest submission for specified business identifier."""
    sf = SubmissionFilter()
    sf.business_identifier = business_identifier

    try:
        submissions = SubmissionModel.get_latest_submissions(submission_filter=sf)
        if submissions:
            return jsonify(SubmissionSerializer.to_str(submissions[0]))

        return None, HTTPStatus.NOT_FOUND

    except Exception as exception:  # noqa: B902
        return exception_response(exception)


@bp.route("/", methods=("POST",))
def create_register():
    """
    Create a new register.

    Returns:
        A tuple containing the response JSON and the HTTP status code.
    """
    schema_name = "significantIndividualsFiling"
    schema_service = SchemaService()
    schema = schema_service.get_schema(schema_name)
    if not schema:
        return {}, HTTPStatus.INTERNAL_SERVER_ERROR

    try:
        if json_input := request.get_json():
            # normally do some validation here
            [valid, errors] = schema_service.validate(schema_name, json_input)
            if not valid:
                return {"errors": errors}, HTTPStatus.BAD_REQUEST

            submission = SubmissionService.create_submission(json_input)
            submission.save()
            return jsonify(id=submission.id), HTTPStatus.CREATED

        return {}, HTTPStatus.BAD_REQUEST

    except Exception as exception:  # noqa: B902
        return exception_response(exception)
