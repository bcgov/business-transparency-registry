# Copyright © 2024 Province of British Columbia
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
"""Manages person data."""
from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from dateutil.relativedelta import relativedelta
from flask import current_app
from sqlalchemy import Column, event
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sql_versioning import Versioned

from btr_api.enums import EmailType
from btr_api.utils.legislation_datetime import LegislationDatetime

from .base import Base

if TYPE_CHECKING:
    # https://mypy.readthedocs.io/en/stable/runtime_troubles.html#import-cycles
    from .ownership import Ownership


class Person(Versioned, Base):
    """Stores person statement data."""

    __tablename__ = 'person'

    id: Mapped[int] = mapped_column(primary_key=True)
    statement_id: Mapped[uuid.UUID] = mapped_column(nullable=False, unique=True)
    person_json = Column(JSONB, nullable=False)

    birthdate: Mapped[date] = mapped_column(nullable=True)
    is_public: Mapped[bool] = mapped_column(default=True)
    last_notification_type: Mapped[EmailType] = mapped_column(nullable=True)
    last_notification_datetime: Mapped[datetime] = mapped_column(nullable=True)

    # relationships
    ownerships: Mapped[list['Ownership']] = relationship(back_populates='person')

    @property
    def is_minor(self):
        """Return True if the person is under 19 (calculation based off birthdate)."""
        if self.birthdate:
            minor_threshold = LegislationDatetime.now() - relativedelta(years=19)
            return minor_threshold.date() < self.birthdate
        # if birthdate is not entered then the person is treated as an adult
        return False

    @classmethod
    def find_by_id(cls, person_id: int) -> Person | None:
        """Return the person by id."""
        return cls.query.filter_by(id=person_id).one_or_none()

    @classmethod
    def find_by_statement_id(cls, statement_id: str) -> Person | None:
        """Return the person by statement."""
        return cls.query.filter_by(statement_id=statement_id).one_or_none()

    @classmethod
    def find_statement_id_by_uuid(cls, orig_uuid: str) -> str:
        """Return the generated statement id by the uuid in the person_json and the ownership id."""
        # NOTE: if this becomes slow add a jsonb index
        try:
            person: Person = cls.query.filter(cls.person_json['uuid'].astext == orig_uuid).one_or_none()
            return str(person.statement_id) if person else None
        except TypeError as err:
            current_app.logger.debug(err.with_traceback(None))
            current_app.logger.error(f'Error multiple uuids on person json for uuid={orig_uuid}. Needs manual update.')
            return None


@event.listens_for(Person, 'before_insert')
def receive_before_insert(mapper, connection, target: Person):  # pylint: disable=unused-argument
    """Set the statement_id within the person_json and the birthdate."""
    target.person_json['statementID'] = str(target.statement_id)

    if birthdate := target.person_json.get('birthDate'):
        target.birthdate = LegislationDatetime.as_legislation_timezone_from_date_str(birthdate).date()
        # check if minor here / flip is public if necessary
        target.is_public = target.is_minor
