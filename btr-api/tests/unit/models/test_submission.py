import unittest
from unittest.mock import patch
from btr_api.models.submission import Submission, SubmissionType, db


class TestSubmission(unittest.TestCase):

    @patch.object(db.session, 'commit')
    @patch.object(db.session, 'add')
    def test_save(self, mock_add, mock_commit):
        submission = Submission()
        submission.save()
        mock_add.assert_called_once_with(submission)
        mock_commit.assert_called_once()  # commit should be called once

    @patch.object(db.session, 'add')
    def test_save_to_session(self, mock_add):
        submission = Submission()
        submission.save_to_session()
        mock_add.assert_called_once_with(submission)

    @patch.object(db.Model, 'query')
    def  test_find_by_id(self, mock_query):
        submission = Submission()
        submission.find_by_id(1)
        mock_query.filter_by.assert_called_once_with(id=1)  # assert that filter_by is called once

    @patch.object(db.Model, 'query')
    def test_get_filtered_submissions(self, mock_query):
        submission = Submission()
        submission.get_filtered_submissions()
        mock_query.order_by.assert_called_once()  # assert that order_by is called once


class TestSubmissionType(unittest.TestCase):

    def test_enum_values(self):
        self.assertEqual(SubmissionType.other.value, 'other')
        self.assertEqual(SubmissionType.standard.value, 'standard')
