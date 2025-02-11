import pytest
from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import text

from btr_api.models import User
from btr_api.models.submission import Submission, SubmissionType

from tests.unit.models.test_user import sample_user
from tests.unit.utils.db_helpers import clear_db


def test_find_by_id(session, sample_user):
    # Prepare data
    clear_db(session)
    submission = Submission(type=SubmissionType.initial,
                            submitted_payload={
                                'businessIdentifier': 'BC1234567',
                                'personStatements': [],
                                'ownershipOrControlStatements': []
                            },
                            business_identifier='BC1234567',
                            submitted_datetime=datetime.now(ZoneInfo('America/Vancouver')),
                            submitter=sample_user)
    session.add(submission)
    session.commit()

    # Do test
    result = Submission.find_by_id(submission.id)

    # Verify result
    assert result == submission


def test_get_filtered_submissions(session, sample_user):
    # Prepare data
    clear_db(session)
    session.add_all([Submission(type=SubmissionType.initial,
                                submitted_payload={
                                    'businessIdentifier': 'Test identifier',
                                    'personStatements': [],
                                    'ownershipOrControlStatements': []
                                },
                                business_identifier='Test identifier',
                                submitted_datetime=datetime.now(ZoneInfo('America/Vancouver')),
                                submitter=sample_user),
                     Submission(type=SubmissionType.initial,
                                submitted_payload={
                                    'businessIdentifier': 'Another identifier',
                                    'personStatements': [],
                                    'ownershipOrControlStatements': []
                                },
                                business_identifier='Another identifier',
                                submitted_datetime=datetime.now(ZoneInfo('America/Vancouver')),
                                submitter=sample_user)
                     ])
    session.commit()
    all_submissions = Submission.query.all()
    # Do test
    result = Submission.get_filtered_submissions()

    # Verify result
    assert len(result) == len(all_submissions)


def test_save_to_session(session, sample_user):
    # Prepare data
    clear_db(session)
    submission = Submission(type=SubmissionType.initial,
                            submitted_payload={
                                'businessIdentifier': 'BC1234567',
                                'personStatements': [],
                                'ownershipOrControlStatements': []
                            },
                            business_identifier='BC1234567',
                            submitted_datetime=datetime.now(ZoneInfo('America/Vancouver')),
                            submitter=sample_user)

    # Do test
    submission.save_to_session()

    # Verify result
    session.flush()
    assert submission in session
