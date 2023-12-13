from __future__ import annotations

import uuid

from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import backref

from .base import BtrModelBase
from .db import db


class OwnershipDetails(db.Model, BtrModelBase):
    """It holds details about ownership structure, who owns what and how much."""

    __tablename__ = "ownership_details"

    uuid = db.Column(UUID(as_uuid=True), default=uuid.uuid4)  # used as external reference

    business_identifier = db.Column(db.String(300), index=True, nullable=False)
    control_type = db.Column(JSONB, nullable=True)
    percent_of_shares = db.Column(db.REAL(), nullable=True)
    percent_of_votes = db.Column(db.REAL(), nullable=True)
    missing_info_reason = db.Column(db.String(2000), nullable=True)
    start_date = db.Column(db.Date(), nullable=False)
    end_date = db.Column(db.Date(), nullable=True)

    # Relationships
    person_id = db.Column('person_id', db.Integer, db.ForeignKey('persons.id'))
    person = db.relationship('Person', backref=backref('person', uselist=False), foreign_keys=[person_id])

    submission_id = db.Column('submission_id', db.Integer, db.ForeignKey('submission.id'))

    @classmethod
    def find_by_id(cls, search_id: int) -> OwnershipDetails:
        """Return a OwnershipDetails if they exist, filtered by search_id."""
        return cls.query.filter_by(id=search_id).one_or_none()
    
    @classmethod
    def find_by_uuid(cls, search_uuid: uuid) -> OwnershipDetails:
        """Return a OwnershipDetails if they exist and match the provided search_uuid."""
        return cls.query.filter_by(uuid=search_uuid).one_or_none()

    @classmethod
    def find_by_submission_id(cls, search_id: int) -> OwnershipDetails:
        """Return a OwnershipDetails if they exist, filtered by submission_id."""
        return cls.query.filter_by(submission_id=search_id).one_or_none()

    @classmethod
    def find_current_for_business(cls, business_identifier: str) -> list[OwnershipDetails]:
        """Return all the current ownership details for the business identifier."""
        return cls.query.filter_by(business_identifier=business_identifier, end_date=None).all()

    def save(self):
        """Save and commit immediately."""
        db.session.add(self)
        db.session.commit()

    def save_to_session(self):
        """Save toThe session, do not commit immediately."""
        db.session.add(self)
