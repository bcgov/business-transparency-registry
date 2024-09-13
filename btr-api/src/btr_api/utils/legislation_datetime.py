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
"""Legislation Date time utilities."""
from datetime import date, datetime

import pytz
from dateutil.tz import gettz
from flask import current_app


class LegislationDatetime:
    """Date utility using legislation timezone for dates."""

    @staticmethod
    def as_legislation_timezone(date_time: datetime) -> datetime:
        """Return a datetime adjusted to the legislation timezone."""
        return date_time.astimezone(
            pytz.timezone(current_app.config.get('LEGISLATIVE_TIMEZONE'))
        )

    @staticmethod
    def as_legislation_timezone_from_date(_date: date) -> datetime:
        """Return a datetime adjusted to the legislation timezone from a date object."""
        return datetime(
            _date.year,
            _date.month,
            _date.day,
            tzinfo=gettz(current_app.config.get('LEGISLATIVE_TIMEZONE')),
        )

    @staticmethod
    def as_legislation_timezone_from_date_str(date_string: str) -> datetime:
        """Return a date time object using provided date_string in legislation timezone.

        Note:
        This function expect a date_sting without time (example: 1990-12-31).
        It is assumed that the date_string provided is already in legislation timezone.
        """
        _date = date.fromisoformat(date_string)
        return LegislationDatetime.as_legislation_timezone_from_date(_date)

    @staticmethod
    def as_utc_timezone(date_time: datetime) -> datetime:
        """Return a datetime adjusted to the GMT timezone (aka UTC)."""
        return date_time.astimezone(pytz.timezone('GMT'))

    @staticmethod
    def as_utc_timezone_from_legislation_date_str(date_string: str) -> datetime:
        """Return a datetime adjusted to the GMT timezone (aka UTC) from a date (1900-12-31) string."""
        _date_time = LegislationDatetime.as_legislation_timezone_from_date_str(
            date_string
        )
        return LegislationDatetime.as_utc_timezone(_date_time)

    @staticmethod
    def format_as_legislation_date(date_time: datetime) -> str:
        """Return the date in legislation timezone as a string."""
        date_time = LegislationDatetime.as_legislation_timezone(date_time)
        return date_time.strftime('%Y-%m-%d')

    @staticmethod
    def now() -> datetime:
        """Construct a datetime using the legislation timezone."""
        return datetime.now().astimezone(
            pytz.timezone(current_app.config.get('LEGISLATIVE_TIMEZONE'))
        )

    @staticmethod
    def format_as_report_string(date_time: datetime) -> str:
        """Return a datetime string in this format (eg: `August 5, 2021 at 11:00 am PT`)."""
        # ensure is set to correct timezone
        date_time = LegislationDatetime.as_legislation_timezone(date_time)
        hour = date_time.strftime('%I').lstrip('0')
        # %p provides locale value: AM, PM (en_US); am, pm (de_DE); So forcing it to be lower in any case
        am_pm = date_time.strftime('%p').lower()
        date_time_str = date_time.strftime(
            f'%B %-d, %Y at {hour}:%M {am_pm} PT'
        )
        return date_time_str

    @staticmethod
    def as_utc_timezone_datetime(datetime_string: str) -> datetime:
        """Return a datetime adjusted to the legislation timezone from a date object."""
        return datetime.fromisoformat(datetime_string)
