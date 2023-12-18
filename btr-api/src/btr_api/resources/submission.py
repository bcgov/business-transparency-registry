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
from http import HTTPStatus

from flask import Blueprint
from flask import jsonify
from flask import request

from btr_api.exceptions import exception_response
from btr_api.models import Submission
from btr_api.services.schema import SchemaService
from btr_api.services.submission import SubmissionService


bp = Blueprint("submission", __name__)


@bp.route("/", methods=("GET",))
@bp.route("/<id>", methods=("GET",))
def registers(id: int | None = None):
    """Get the submissions, or sepcific submission by id."""
    try:
        if id:
            if submission := Submission.find_by_id(id):
                return jsonify(type=submission.type, submission=submission.payload)
            return {}, HTTPStatus.NOT_FOUND

        submissions = Submission.get_filtered_submissions()

        return jsonify(submissions)

    except Exception as exception:  # noqa: B902
        return exception_response(exception)


@bp.route("/", methods=("POST",))
def create_register():
    schema_name = "SignificantIndividualsFiling"
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
