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
"""API endpoints for triggering notifications."""
from http import HTTPStatus
from flask import Blueprint, request

from btr_api.exceptions import exception_response
from btr_api.models import Submission
from btr_api.services import btr_auth, btr_email, btr_entity

bp = Blueprint('notify', __name__)


@bp.route('', methods=('POST',))
def registers():  # pylint: disable=redefined-builtin
    """Trigger an email notification to all the given business's SIs."""
    try:
        json_input: dict = request.get_json()
        if business_identifier := json_input.get('businessIdentifier'):
            if submission := Submission.find_by_business_identifier(business_identifier):
                token = btr_auth.get_bearer_token()
                business = btr_entity.get_entity_info(None, business_identifier, token).json()
                delivery_address = btr_entity.get_entity_info(
                    None, f'{business_identifier}/addresses?addressType=deliveryAddress', token).json()
                business_contact = btr_auth.get_business_contact(business_identifier, token)
                business_info = {**business, **delivery_address, 'contact': {**business_contact}}
                submission = Submission.find_by_business_identifier(business_identifier)

                btr_email.send_added_to_btr_emails(submission, business_info, token)
                # NOTE: below is temporary for testing (not sure what will trigger this or how yet)
                btr_email.send_updating_minor_btr_email(submission.payload['personStatements'][0], business_info, token)
                return {}, HTTPStatus.ACCEPTED

        return {}, HTTPStatus.NOT_FOUND

    except Exception as exception:  # noqa: B902
        return exception_response(exception)
