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
This module defines the `Person` model for the `persons` table in database.

It also contains several class methods to search and fetch records based on different criteria,
as well as the instance methods `save` and `save_to_session` to commit changes to the table.
"""
import uuid

from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy import Column, String, Boolean

from .base import BtrModelBase
from .db import db


class Person(db.Model, BtrModelBase):
    """It holds details of person that are public."""

    __tablename__ = "persons"

    uuid = Column(UUID(as_uuid=True), default=uuid.uuid4)  # used as external reference

    full_name = Column(String(300), index=True, nullable=True)
    preferred_name = Column(String(300), nullable=True)
    family_name = Column(String(100), nullable=True)
    given_name = Column(String(100), nullable=True)
    patronymic_name = Column(String(100), nullable=True)

    birth_date = db.Column(db.Date(), nullable=True)
    email = db.Column(db.String(150), nullable=True)

    citizenships_ex_ca = db.Column(JSONB, nullable=True)
    is_permanent_resident = Column(Boolean(), default=True)
    is_canadian_citizen = Column(Boolean(), default=True)
    is_canadian_tax_resident = Column(Boolean(), default=True)
    tax_number = db.Column(db.String(150), nullable=True)
    competency = db.Column(JSONB, nullable=True)

    address = db.Column(JSONB, nullable=True)

    @property
    def display_name(self):
        """Display name of a person; if fullname exists, return full name if not, return combination of parts. """
        if self.full_name:
            return self.full_name

        return " ".join(filter(None, [self.given_name, self.patronymic_name, self.family_name])).strip()

    @classmethod
    def find_by_id(cls, search_id: int):
        """Return a Person if they exist and match the provided search_id."""
        return cls.query.filter_by(id=search_id).one_or_none()

    @classmethod
    def find_by_uuid(cls, search_uuid: uuid):
        """Return a Person if they exist and match the provided search_id."""
        return cls.query.filter_by(uuid=search_uuid).one_or_none()

    def save(self):
        """Save and commit immediately."""
        db.session.add(self)
        db.session.commit()

    def save_to_session(self):
        """Save toThe session, do not commit immediately."""
        db.session.add(self)
