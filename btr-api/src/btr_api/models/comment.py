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
"""Manages Request (to omit) data."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sql_versioning import Versioned

from btr_api.enums import CommentTypes
from btr_api.models import User as UserModel
from btr_api.utils import utc_now

from .base import Base


class Comment(Versioned, Base):
    """Stores comment data"""

    __tablename__ = 'comment'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[uuid.UUID] = mapped_column(index=True)
    type: Mapped[CommentTypes] = mapped_column(nullable=False, default=CommentTypes.REQUEST)
    submitter_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), 
                                                 nullable=False, default=utc_now, onupdate=utc_now)
    related_uuid: Mapped[uuid.UUID] = mapped_column(nullable=False)
    text: Mapped[str] = mapped_column(nullable=True, default=None)

    def __init__(self, data):
        self.uuid = uuid.uuid4()
        self.type = data['type']
        self.text = data['text']
        self.submitter_id = data['submitter_id']
        self.related_uuid = data['related_uuid']

    @classmethod
    def find_by_uuid(cls, comment_id: uuid.UUID) -> Comment | None:
        """Return the comment by id."""
        return cls.query.filter_by(uuid=comment_id).one_or_none()

    @classmethod
    def find_by_related_uuid(cls, related_uuid: uuid.UUID) -> Comment | None:
        """Return the comment by id."""
        # return cls.query.filter_by(related_uuid=related_uuid).all()
        q = cls.query
        q = q.join(UserModel, Comment.submitter_id == UserModel.id)
        q = q.add_columns(UserModel.firstname.label('firstname'), UserModel.lastname.label('lastname'))
        q = q.where(Comment.related_uuid == related_uuid)
        return q.all()

    @classmethod
    def __setitem__(cls, key, value):
        match key:
            case 'id':
                cls.id = value
            case 'uuid':
                cls.uuid = value
            case 'submitter_id':
                cls.submitter_id = value
            case 'createdAt':
                cls.created_at = value
            case 'updatedAt':
                cls.updated_at = value
            case 'type':
                cls.type = value
            case 'text':
                cls.text = value
            case 'related_uuid':
                cls.related_uuid = value


class CommentSerializer:
    """Serializer for comment. Can convert to dict, string from comment model. """

    @staticmethod
    def to_str(comment: Comment):
        """Return string representation of comment model."""
        return str(CommentSerializer.to_dict(comment))

    @staticmethod
    def to_dict(comment: Comment) -> dict:
        """Return the comment class as a dict for response purposes."""
        return {
            'id': comment.id,
            'uuid': comment.uuid,
            'type': comment.type,
            'createdAt': comment.created_at,
            'updatedAt': comment.updated_at,
            'text': comment.text,
            'relatedUuId': comment.related_uuid
        }
