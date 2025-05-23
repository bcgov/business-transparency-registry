"""Enum for user types."""
from btr_api.common.enum import BaseEnum


class VerificationStatus(BaseEnum):
    """Enum for the verification status of a person."""
    VERIFIED_BY_SELF = "verified_by_self"
    VERIFIED_BY_GUARDIAN = "verified_by_guardian"
    VERIFIED_BY_LAWYER = "verified_by_lawyer"
    UNVERIFIED = "unverified"
