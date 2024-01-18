import pytest
from btr_api.models.submission import Submission, SubmissionType, db, SubmissionFilter


def test_find_by_id(client, session):
    # Prepare data
    submission = Submission(type=SubmissionType.other, business_identifier="Test identifier")
    session.add(submission)
    session.commit()

    # Do test
    result = Submission.find_by_id(submission.id)

    # Verify result
    assert result == submission


def test_get_filtered_submissions(client, session):
    # Prepare data
    session.add_all([Submission(type=SubmissionType.other, business_identifier="Test identifier"),
                     Submission(type=SubmissionType.standard, business_identifier="Another identifier")])
    session.commit()
    all_submissions = Submission.query.all()
    # Do test
    result = Submission.get_filtered_submissions()

    # Verify result
    assert len(result) == len(all_submissions)


def test_get_latest_submissions(client, session):
    # Prepare data
    submission1 = Submission(type=SubmissionType.other, business_identifier="Test identifier", payload="{id:123}")
    submission2 = Submission(type=SubmissionType.other, business_identifier="Test identifier", payload="{id:124}")
    submission3 = Submission(type=SubmissionType.other, business_identifier="Test identifier", payload="{id:125}")

    session.add(submission1)
    session.commit()
    session.add(submission2)
    session.commit()
    session.add(submission3)
    session.commit()

    # Do test
    result = Submission.get_latest_submissions()

    # Verify result
    assert result[0] == submission3
    assert submission1 in result
    assert submission2 in result


def test_save_to_session(client, session):
    # Prepare data
    submission = Submission(type=SubmissionType.other, business_identifier="Test identifier")

    # Do test
    submission.save_to_session()

    # Verify result
    session.flush()
    assert submission in session
