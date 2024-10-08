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
"""Manages Request (to omit) data."""
from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy.orm import Mapped, mapped_column
from sql_versioning import Versioned

from btr_api.enums import InformationToOmitType
from btr_api.enums import IndividualAtRisk
from btr_api.enums import CompletingParty

from .base import Base


class Request(Versioned, Base):
    """Stores request (to omit) data."""

    __tablename__ = 'request'
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(nullable=False)
    birthdate: Mapped[date] = mapped_column(nullable=False)
    business_identifier: Mapped[str] = mapped_column(nullable=False, index=True)
    information_to_omit: Mapped[InformationToOmitType] = mapped_column(nullable=False)
    individual_at_risk: Mapped[IndividualAtRisk] = mapped_column(nullable=False)
    reasons: Mapped[str] = mapped_column(nullable=False)
    completing_party: Mapped[CompletingParty] = mapped_column(nullable=False)
    completing_name: Mapped[str] = mapped_column(nullable=False)
    completing_email: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False)
    updated_at: Mapped[datetime] = mapped_column(nullable=False)

    def __init__(self, data):
        self.id = uuid.uuid4()
        self.full_name = data['fullName']
        self.email = data['email']
        self.birthdate = data['birthdate']
        self.business_identifier = data['businessIdentifier']
        self.information_to_omit = data['informationToOmit']
        self.individual_at_risk = data['individualAtRisk']
        self.reasons = data['reasons']
        self.completing_party = data['completingParty']
        self.completing_name = data['completingName']
        self.completing_email = data['completingEmail']

    @classmethod
    def find_by_id(cls, request_id: int) -> Request | None:
        """Return the person by id."""
        return cls.query.filter_by(id=request_id).one_or_none()


class RequestSerializer:
    """Serializer for requests. Can convert to dict, string from request model. """

    @staticmethod
    def to_str(request: Request):
        """Return string representation of request model."""
        return str(RequestSerializer.to_dict(request))

    @staticmethod
    def to_dict(request: Request) -> dict:
        """Return the request class as a dict for response purposes."""
        return {
            'id': request.id,
            'fullName': request.full_name,
            'email': request.email,
            'birthdate': request.birthdate,
            'businessIdentifier': request.business_identifier,
            'informationToOmit': request.information_to_omit,
            'individualAtRisk': request.individual_at_risk,
            'reasons': request.reasons,
            'completingParty': request.completing_party,
            'completingEmail': request.completing_email,
            'completingName': request.completing_name,
            'createdAt': request.created_at.isoformat(),
            'updatedAt': request.updated_at.isoformat(),
        }
