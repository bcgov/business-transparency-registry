"""Functions to work with date/timestamps in utc time"""
from datetime import datetime, timezone


def utc_now():
    """get the current time in utc"""
    return datetime.now(timezone.utc)
