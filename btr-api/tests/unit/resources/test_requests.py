""" Tests to ensure that the submission based end-points work correctly.
"""
import json
import os
from datetime import datetime
from http import HTTPStatus

import pytest
import requests
from dateutil.relativedelta import relativedelta

from btr_api.enums import UserType
from btr_api.models import Request as RequestModel
from btr_api.models import User as UserModel
from btr_api.models.request import RequestSerializer
from btr_api.services import RequestService
from btr_api.services.auth import auth_cache
from btr_api.utils import redact_information

from tests.unit import nested_session
from tests.unit.models.test_user import sample_user
from tests.unit.utils import create_header
from tests.unit.utils.db_helpers import clear_db
from tests.unit.utils.mock_data import REQUEST_DICT

UPDATE_R_DICT = {
    'fullName': 'edited'
}

@pytest.mark.parametrize(
    'test_name, user_type',
    [('test_get', UserType.USER_COMPETENT_AUTHORITY)],
)
def test_get(app, client, session, jwt, requests_mock, sample_user, test_name, user_type):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        clear_db(session)
        # Setup
        id = ''
        req = RequestModel(REQUEST_DICT)
        session.add(req)
        session.commit()
        id = req.uuid

        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/orgs/1/products?include_hidden=true",
            json=[{'code': 'CA_SEARCH', 'subscriptionStatus': 'ACTIVE'}])
        # Test
        rv = client.get(
            f'/requests/{id}',
            headers=create_header(
                jwt, ['basic'], **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}
            ),
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

@pytest.mark.parametrize(
    'test_name, user_type',
    [('test_get_no_auth', UserType.USER_COMPETENT_AUTHORITY)],
)
def test_get_fail_no_auth(app, client, session, jwt, requests_mock, sample_user, test_name, user_type):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        clear_db(session)
        # Setup
        id = ''
        req = RequestModel(REQUEST_DICT)
        session.add(req)
        session.commit()
        id = req.uuid

        # Test
        rv = client.get(
            f'/requests/{id}',
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.UNAUTHORIZED


@pytest.mark.parametrize(
    'test_name, user_type',
    [('test_post', UserType.USER_COMPETENT_AUTHORITY)],
)
def test_post(app, client, session, jwt, requests_mock, sample_user, test_name, user_type):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        clear_db(session)
        # Setup
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/orgs/1/products?include_hidden=true",
            json=[{'code': 'CA_SEARCH', 'subscriptionStatus': 'ACTIVE'}])
        # Test
        rv = client.post(
            f'/requests',
            json=REQUEST_DICT,
            headers=create_header(
                jwt, ['basic'], **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}
            ),
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.CREATED


@pytest.mark.parametrize(
    'test_name, user_type',
    [('test_post_unauthorized', UserType.USER_COMPETENT_AUTHORITY)],
)
def test_post_unauth(app, client, session, jwt, requests_mock, sample_user, test_name, user_type):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        clear_db(session)
        # Test
        rv = client.post(
            f'/requests',
            json=REQUEST_DICT,
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.CREATED

@pytest.mark.parametrize(
    'test_name, user_type',
    [('test_put', UserType.USER_COMPETENT_AUTHORITY)],
)
def test_put(app, client, session, jwt, requests_mock, sample_user, test_name, user_type):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        clear_db(session)
        # Setup
        requests_mock.get(
            f"{app.config.get('AUTH_SVC_URL')}/orgs/1/products?include_hidden=true",
            json=[{'code': 'CA_SEARCH', 'subscriptionStatus': 'ACTIVE'}])
        rv = client.post(
            f'/requests',
            json=REQUEST_DICT,
        )
        id = rv.json['uuid']
        # Test
        rv = client.put(
            f'/requests/{id}',
            json=UPDATE_R_DICT,
            headers=create_header(
                jwt, ['basic'], **{'Accept-Version': 'v1', 'content-type': 'application/json', 'Account-Id': 1}
            ),
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

@pytest.mark.parametrize(
    'test_name, user_type',
    [('test_put_no_auth', UserType.USER_COMPETENT_AUTHORITY)],
)
def test_put_no_auth(app, client, session, jwt, requests_mock, sample_user, test_name, user_type):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        clear_db(session)
        # Setup
        rv = client.post(
            f'/requests',
            json=REQUEST_DICT,
        )
        id = rv.json['uuid']
        # Test
        rv = client.put(
            f'/requests/{id}',
            json=UPDATE_R_DICT,
        )

        # Confirm outcome
        assert rv.status_code == HTTPStatus.UNAUTHORIZED