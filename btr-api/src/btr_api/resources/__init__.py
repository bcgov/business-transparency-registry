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
This module is responsible for registering the endpoints.

The register_endpoints function registers the provided blueprints and URL prefixes to the Flask application.
"""
from flask import Flask

from .base import bp as base_endpoint
from .ops import bp as ops_endpoint
from .submission import bp as submission_endpoint
from .json_schema import bp as json_schema_endpoint


def register_endpoints(app: Flask):
    """
    Register Endpoints

    Registers the provided blueprints and URL prefixes to the Flask application.

    :param app: The Flask application to register the endpoints to.
    :type app: Flask
    """
    # Allow base route to match with, and without a trailing slash
    app.url_map.strict_slashes = False

    app.register_blueprint(
        url_prefix="/",
        blueprint=base_endpoint,
    )

    app.register_blueprint(
        url_prefix="/ops",
        blueprint=ops_endpoint,
    )

    app.register_blueprint(
        url_prefix="/plots",
        blueprint=submission_endpoint,
    )

    app.register_blueprint(
        url_prefix="/json-schemas",
        blueprint=json_schema_endpoint,
    )
