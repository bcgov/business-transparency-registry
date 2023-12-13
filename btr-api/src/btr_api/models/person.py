from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy import Column, String, Boolean

import uuid

from .base import BtrModelBase
from .db import db


class Person(db.Model, BtrModelBase):
    """It holds details of person that are public."""

    __tablename__ = "persons"

    uuid = Column(UUID(as_uuid=True), default=uuid.uuid4)  # used as external reference

    full_name = Column(String(300), index=True, nullable=True)
    preffered_name = Column(String(300), nullable=True)
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
