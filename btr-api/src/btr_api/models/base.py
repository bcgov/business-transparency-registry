from sqlalchemy.sql import func
from sqlalchemy import Column, Integer, DateTime

from .db import db


class BtrModelBase:
    id = db.Column(db.Integer, primary_key=True)

    created_by = Column(Integer)
    updated_by = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
