from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.orm import backref

from .base import BtrModelBase
from .db import db


class OwnershipDetails(db.Model, BtrModelBase):
    """It holds details about ownership structure, who owns what and how much."""

    __tablename__ = "ownership_details"

    business_identifier = Column(String(300), index=True, nullable=False)
    control_type = Column(String(50), nullable=False)
    control_percent = Column(Integer(), nullable=False)
    additional_text = Column(String(2000), nullable=True)

    # Relationships
    person_id = db.Column('person_id', db.Integer, db.ForeignKey('persons.id'))
    person = db.relationship('Person', backref=backref('person', uselist=False), foreign_keys=[person_id])

    submission_id = db.Column('submission_id', db.Integer, db.ForeignKey('submission.id'))
    submission = db.relationship('Submission', backref=backref('submission', uselist=False), foreign_keys=[submission_id])

    @classmethod
    def find_by_id(cls, search_id: int):
        """Return a OwnershipDetails if they exist, filtered by search_id."""
        return cls.query.filter_by(id=search_id).one_or_none()

    def save(self):
        """Save and commit immediately."""
        db.session.add(self)
        db.session.commit()

    def save_to_session(self):
        """Save toThe session, do not commit immediately."""
        db.session.add(self)
