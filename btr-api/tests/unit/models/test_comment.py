import pytest
import datetime

from btr_api.models.comment import Comment

from tests.unit.utils.db_helpers import clear_db
from tests.unit.models.test_user import sample_user
from tests.unit.utils.mock_data import COMMENT_DICT


def test_find_by_uuid(session, sample_user):
    # Prepare data
    clear_db(session)
    session.add(sample_user)
    session.commit()
    c = COMMENT_DICT.copy()
    c['submitter_id'] = sample_user.id
    comment = Comment(c)
    session.add(comment)
    session.commit()

    # Do test
    result = Comment.find_by_uuid(comment.uuid)

    # Verify result
    assert result == comment

def test_find_by_related_uuid(session,sample_user):
    # Prepare data
    clear_db(session)
    session.add(sample_user)
    session.commit()
    c = COMMENT_DICT.copy()
    c['submitter_id'] = sample_user.id
    comment = Comment(c)
    session.add(comment)
    session.commit()

    # Do test
    result = Comment.find_by_related_uuid(comment.related_uuid)

    # Verify result
    assert result == [comment]