from datetime import date

from btr_api.services.auth import auth_cache
from btr_api.models.comment import Comment
from btr_api.services.comment import CommentService

from tests.unit import nested_session
from tests.unit.models.test_user import sample_user
from tests.unit.utils.mock_data import COMMENT_DICT
from tests.unit.utils.db_helpers import clear_db


def test_create_comment(session, app, requests_mock, sample_user):
    """Assure the create request works as expected."""
    requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    with nested_session(session):
        auth_cache.clear()
        clear_db(session)
        session.add(sample_user)
        session.commit()
        c = COMMENT_DICT.copy()
        c['submitter_id'] = sample_user.id
        comment = CommentService.create_comment(c)
        comment.save()
        # Assert the properties of the resulting SubmissionModel instance
        assert comment.text == c['text']
        assert comment.type == c['type']
        assert comment.submitter_id == c['submitter_id']
        assert str(comment.related_uuid) == c['related_uuid']

def test_update_comment(session, app, requests_mock, sample_user):
    """Assure the create request works as expected."""
    requests_mock.post(app.config.get('SSO_SVC_TOKEN_URL'), json={'access_token': 'token'})
    requests_mock.post(f"{app.config.get('NOTIFY_SVC_URL')}", json={})

    with nested_session(session):
        auth_cache.clear()
        clear_db(session)
        session.add(sample_user)
        session.commit()
        comment_dict2={
            'text': 'edited',
        }
        c = COMMENT_DICT.copy()
        c['submitter_id'] = sample_user.id
        comment = Comment(c)
        comment = CommentService.update_comment(comment, comment_dict2)
        comment.save()
        # Assert the properties of the resulting SubmissionModel instance
        assert comment.text == comment_dict2['text']
        assert comment.type == c['type']
        assert comment.submitter_id == c['submitter_id']
        assert str(comment.related_uuid) == c['related_uuid']