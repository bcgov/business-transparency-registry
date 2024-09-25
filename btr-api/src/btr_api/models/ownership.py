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
"""Manages ownership data."""
from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, event
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sql_versioning import Versioned

from .base import Base

if TYPE_CHECKING:
    # https://mypy.readthedocs.io/en/stable/runtime_troubles.html#import-cycles
    from .person import Person
    from .submission import Submission


class Ownership(Versioned, Base):
    """Stores ownership statement data."""

    __tablename__ = 'ownership'

    id: Mapped[int] = mapped_column(primary_key=True)
    statement_id: Mapped[uuid.UUID] = mapped_column(nullable=False, unique=True)
    ownership_json = Column(JSONB, nullable=False)

    # Relationships
    person_id: Mapped[int] = mapped_column(ForeignKey('person.id'), nullable=True)
    person: Mapped['Person'] = relationship(back_populates='ownerships')

    submission_id: Mapped[int] = mapped_column(ForeignKey('submission.id'), nullable=True)
    submission: Mapped['Submission'] = relationship(back_populates='ownership_statements')

    @classmethod
    def find_by_id(cls, ownership_id: int) -> Ownership | None:
        """Return the ownership by id."""
        return cls.query.filter_by(id=ownership_id).one_or_none()

    @classmethod
    def find_by_statement_id(cls, statement_id: str) -> Ownership | None:
        """Return the ownership by statement."""
        return cls.query.filter_by(statement_id=statement_id).one_or_none()

    @classmethod
    def find_all_by_submission_id(cls, submission_id: int) -> list[Ownership]:
        """Return the ownerships by submission_id."""
        return cls.query.filter_by(submission_id=submission_id).all()

    @classmethod
    def find_all_by_person_id(cls, person_id: int) -> list[Ownership]:
        """Return the ownerships by person_id."""
        return cls.query.filter_by(person_id=person_id).all()


@event.listens_for(Ownership, 'before_insert')
def receive_before_insert(mapper, connection, target: Ownership):  # pylint: disable=unused-argument
    """Set the statement_id and describedByPersonStatement within the ownership_json."""
    target.ownership_json['statementID'] = str(target.statement_id)
    target.ownership_json['interestedParty']['describedByPersonStatement'] = str(target.person.statement_id)

    for interest in target.ownership_json.get('interests', []):
        for individual in interest.get('connectedIndividuals', []):
            # update the mapping to the generated statement id
            if (
                individual.get('uuid') and
                (matching_statement_id := target.person.find_statement_id_by_uuid(individual['uuid']))
            ):
                individual['uuid'] = matching_statement_id
