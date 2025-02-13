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
"""The Legal API service.

This module is the API for the Legal Entity system.
"""
import os

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from structured_logging import StructuredLogging

from .common import error
from .common.auth import jwt
from .common.flags import Flags
from .common.run_version import get_run_version
from .config import Development, Migration, Production, Sandbox, Testing
from .models import db
from .resources import register_endpoints
from .services import btr_auth, btr_bor, btr_email, btr_entity, btr_reg_search
from .translations import babel

CONFIG_MAP = {
    'development': Development,
    'testing': Testing,
    'migration': Migration,
    'sandbox': Sandbox,
    'production': Production
}


def create_app(environment=os.getenv('DEPLOYMENT_ENV', 'production'), **kwargs) -> Flask:
    """Return a configured Flask App using the Factory method."""
    app = Flask(__name__)
    app.logger = StructuredLogging().get_logger()
    app.config.from_object(CONFIG_MAP.get(environment, Production))

    CORS(app)
    db.init_app(app)

    if environment == 'migration':
        Migrate(app, db)

    else:
        btr_auth.init_app(app)
        btr_bor.init_app(app)
        btr_email.init_app(app)
        btr_entity.init_app(app)
        btr_reg_search.init_app(app)
        # td is testData instance passed in to support testing
        td = kwargs.get('ld_test_data', None)
        Flags().init_app(app, td)
        babel.init_app(app)
        register_endpoints(app)
        setup_jwt_manager(app, jwt)
        error.init_app(app)

    @app.after_request
    def add_version(response):  # pylint: disable=unused-variable
        version = get_run_version()
        response.headers['API'] = f'btr-api/{version}'
        return response

    return app


def setup_jwt_manager(app, jwt_manager):
    """Use flask app to configure the JWTManager to work for a particular Realm."""
    def get_roles(a_dict):
        return a_dict['realm_access']['roles']  # pragma: no cover
    app.config['JWT_ROLE_CALLBACK'] = get_roles

    jwt_manager.init_app(app)
