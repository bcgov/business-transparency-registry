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
"""Sample submission class."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import desc, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import backref
from sql_versioning import Versioned

from .db import db
from ..common.enum import auto
from ..common.enum import BaseEnum


class SubmissionType(BaseEnum):
    """Enum of the roles used across the domain."""

    other = auto()
    standard = auto()


class Submission(Versioned, db.Model):
    """Stores a submission of JSON data."""

    __tablename__ = "submission"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum(SubmissionType), default=SubmissionType.other)
    effective_date = db.Column(db.Date(), nullable=True)
    submitted_datetime = db.Column("submitted_datetime", db.DateTime(timezone=True), server_default=func.now())
    payload = db.Column("payload", JSONB)

    # Relationships
    owners = db.relationship('OwnershipDetails', lazy='dynamic')

    submitter_id = db.Column('submitter_id', db.Integer,
                             db.ForeignKey('users.id'))

    submitter = db.relationship('User',
                                backref=backref('filing_submitter', uselist=False),
                                foreign_keys=[submitter_id])


    def save(self):
        """Save and commit immediately."""
        db.session.add(self)
        db.session.commit()

    def save_to_session(self):
        """Save toThe session, do not commit immediately."""
        db.session.add(self)

    @classmethod
    def find_by_id(cls, id):
        """Return the submission by id."""
        return cls.query.filter_by(id=id).one_or_none()

    @classmethod
    def get_filtered_submissions(cls):
        """Return the submissions."""
        query = cls.query.order_by(desc(Submission.submitted_datetime))
        return query.all()
