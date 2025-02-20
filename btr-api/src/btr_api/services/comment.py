# Copyright © 2025 Province of British Columbia
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
This module contains the services necessary for handling Submissions,
including creating a submission. Each service is encapsulated in its own class.

The `SubmissionService` class provides the method `create_submission`,
which accepts a dictionary as an input and returns a SubmissionModel object.

The individual services can be invoked as per the requirements.
"""
from datetime import datetime

from btr_api.models import Comment as CommentModel


class CommentService:  # pylint: disable=too-few-public-methods
    """
    The `CommentService` class is responsible for handling comments

    Creates a comment model based on the given comment dictionary. The comment dictionary should contain
    the necessary information for creating a comment.
    """

    @staticmethod
    def create_comment(comment_dict: dict) -> CommentModel:
        """
        This method creates the current request comment dict.

        Parameters:
        - comment_dict (dict): A dictionary containing the submission data. It should have the following keys:
            - 'text': String representing the text of the comment
            - 'type': The type of comment (refers to another table)
            - 'related_uuid': The id of the related object
            - Any other key-value pairs representing additional payload data.

        Returns:
        - CommentModel: A CommentModel object that represents the created request.
        """

        # init request
        comment = CommentModel(comment_dict)
        comment.created_at = datetime.today().strftime('%Y-%m-%dT%H:%M:%S')
        comment.updated_at = datetime.today().strftime('%Y-%m-%dT%H:%M:%S')
        comment.save_to_session()
        return comment

    @staticmethod
    def update_comment(comment: CommentModel,
                       comment_dict: dict) -> CommentModel:
        """
        This method replaces the current comment for using the provided comment dict.

        Parameters:
        - comment (dict): A dictionary containing the comment data. It can have the following keys:
            - 'text': String representing the text of the comment

        Returns:
        - CommentModel: A CommentModel object that represents the updated comment
        """

        updated = False
        if 'text' in comment_dict:
            comment.text = comment_dict['text']
            updated = True

        if updated:
            comment.updated_at = datetime.today().strftime('%Y-%m-%dT%H:%M:%S')

        return comment
