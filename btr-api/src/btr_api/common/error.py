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
"""Core error handlers and custom exceptions.

Following best practices from:
http://flask.pocoo.org/docs/1.0/errorhandling/
http://flask.pocoo.org/docs/1.0/patterns/apierrors/
"""
import sys

from flask import Flask, current_app, jsonify
from werkzeug.exceptions import HTTPException
from werkzeug.routing import RoutingException


def init_app(app: Flask):
    """Initialize the error handlers for the Flask app instance."""
    app.register_error_handler(HTTPException, handle_http_error)
    app.register_error_handler(Exception, handle_uncaught_error)


def handle_http_error(error):
    """Handle HTTPExceptions.

    Include the error description and corresponding status code, known to be
    available on the werkzeug HTTPExceptions.
    """
    # As werkzeug's routing exceptions also inherit from HTTPException,
    # check for those and allow them to return with redirect responses.
    if isinstance(error, RoutingException):
        return error

    response = jsonify({"message": error.description})
    response.status_code = error.code
    return response


def handle_uncaught_error(_: Exception):
    """Handle any uncaught exceptions.

    Since the handler suppresses the actual exception, log it explicitly to ensure it's logged.
    """
    current_app.logger.error("Uncaught exception", exc_info=sys.exc_info())
    response = jsonify({"message": "Internal server error"})
    response.status_code = 500
    return response
