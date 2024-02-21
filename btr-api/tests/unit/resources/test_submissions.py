""" Tests to ensure that the submission based end-points work correctly.
"""
import json
import os
from http import HTTPStatus

import pytest
import requests
from sqlalchemy import text

from btr_api.models import Submission as SubmissionModel, User as UserModel
from btr_api.models import SubmissionType
from btr_api.services import SubmissionService

from tests.unit import nested_session
from tests.unit.utils import create_header


@pytest.mark.parametrize(
    'test_name, submission_type, payload',
    [('no id', SubmissionType.other, None), ('simple json', SubmissionType.other, {'racoondog': 'red'})],
)
def test_get_plots(client, session, jwt, test_name, submission_type, payload):
    """Get the plot submissions.
    A parameterized set of tests that runs defined scenarios.
    """
    with nested_session(session):
        session.execute(text('delete from submission'))
        # Setup
        id = ''
        if payload:
            sub = SubmissionModel()
            sub.business_identifier = 'identifier0'
            sub.payload = payload
            sub.type = submission_type
            session.add(sub)
            session.commit()
            id = sub.id

        # Test
        rv = client.get(f'/plots/{id}',
                        headers=create_header(jwt,['basic'], **{'Accept-Version': 'v1',
                                                                'content-type': 'application/json',
                                                                'Account-Id': 1}))

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

        if payload:
            for key, value in payload.items():
                assert key in rv.text
                assert value in rv.text


def test_post_plots_db_mocked(app, session, client, jwt, mocker, requests_mock):
    """Assure post submission works (db mocked)."""
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests", json={'id': 978})

    current_dir = os.path.dirname(__file__)
    mock_user_save = mocker.patch.object(UserModel, 'save')
    mock_submission_save = mocker.patch.object(SubmissionModel, 'save')
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)
        rv = client.post('/plots',
                         json=json_data,
                         headers=create_header(jwt, ['basic'], **{'Accept-Version': 'v1',
                                                                  'content-type': 'application/json',
                                                                  'Account-Id': 1}))
        assert rv.status_code == HTTPStatus.CREATED

    mock_user_save.assert_called_once()
    mock_submission_save.assert_called()
    assert pay_api_mock.called == True
    assert pay_api_mock.request_history[0].json() == {
        'filingInfo': {'filingTypes': [{'filingTypeCode': 'REGSIGIN'}]},
        'businessInfo': {'corpType': 'BTR', 'businessIdentifier': json_data['businessIdentifier']},
        'details': [{'label': 'Incorporation Number: ', 'value': json_data['businessIdentifier']}]}
    
    


def test_post_plots(app, client, session, jwt, requests_mock):
    """Assure post submission works."""
    mocked_invoice_id = 9876
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests", json={'id': mocked_invoice_id})

    current_dir = os.path.dirname(__file__)
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)
        with nested_session(session):
            mocked_username = 'wibbly wabble'
            rv = client.post('/plots',
                             json=json_data,
                             headers=create_header(jwt_manager=jwt,
                                                   roles=['basic'],
                                                   username=mocked_username,
                                                   **{'Accept-Version': 'v1',
                                                      'content-type': 'application/json',
                                                      'Account-Id': 1}))
            print(rv.data)
            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert pay_api_mock.called == True
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']
            # check pay link
            assert created_submission.invoice_id == mocked_invoice_id
            # check user link
            assert created_submission.submitter_id
            user = UserModel.find_by_id(created_submission.submitter_id)
            assert user.username == mocked_username


def test_post_plots_pay_error(app, client, session, jwt, requests_mock):
    """Assure post submission works (pay error)."""
    pay_api_mock = requests_mock.post(f"{app.config.get('PAYMENT_SVC_URL')}/payment-requests", exc=requests.exceptions.ConnectTimeout)

    current_dir = os.path.dirname(__file__)
    with open(
        os.path.join(current_dir, '..', '..', 'mocks', 'significantIndividualsFiling', 'valid.json')
    ) as file:
        json_data = json.load(file)
        with nested_session(session):
            rv = client.post('/plots',
                             json=json_data,
                             headers=create_header(jwt_manager=jwt,
                                                   roles=['basic'],
                                                   **{'Accept-Version': 'v1',
                                                      'content-type': 'application/json',
                                                      'Account-Id': 1}))
            assert rv.status_code == HTTPStatus.CREATED
            submission_id = rv.json.get('id')
            assert submission_id
            assert pay_api_mock.called == True
            # check submission details
            created_submission = SubmissionModel.find_by_id(submission_id)
            assert created_submission
            assert created_submission.business_identifier == json_data['businessIdentifier']
            # no pay link
            assert not created_submission.invoice_id


def test_get_latest_for_entity(client, session):
    """Assure latest submission details are returned."""
    with nested_session(session):
        # Setup
        user = UserModel()
        user.save()
        test_identifier = 'id0'
        s1_dict = {
            'businessIdentifier': test_identifier,
            'effectiveDate': '2020-01-13',
            'ownershipOrControlStatements': {'details': 's1'}
        }
        s2_dict = {
            'businessIdentifier': test_identifier,
            'effectiveDate': '2021-01-13',
            'ownershipOrControlStatements': {'details': 's2'}
        }
        s3_dict = {
            'businessIdentifier': test_identifier + 's3',
            'effectiveDate': '2024-04-22',
            'ownershipOrControlStatements': {'details': 's3'}
        }
        (SubmissionService.create_submission(s1_dict, user.id)).save()
        (SubmissionService.create_submission(s2_dict, user.id)).save()
        (SubmissionService.create_submission(s3_dict, user.id)).save()

        # Test
        rv = client.get(f'/plots/entity/{test_identifier}')

        # Confirm outcome
        assert rv.status_code == HTTPStatus.OK

        assert test_identifier == rv.json.get('business_identifier')
        assert s2_dict['effectiveDate'] == rv.json.get('effective_date')
        assert s2_dict == rv.json.get('payload')
