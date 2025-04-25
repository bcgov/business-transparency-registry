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
"""
This module contains the services necessary for handling email notifications.
"""
from datetime import timedelta
from http import HTTPStatus
from pathlib import Path

import requests
from dateutil.relativedelta import relativedelta
from flask import Flask
from jinja2 import Template

from btr_api.enums import EmailType
from btr_api.exceptions import BusinessException
from btr_api.utils.legislation_datetime import LegislationDatetime
from btr_api.utils.person_stmnt_helpers import get_citizenship_public_desc, get_name


class EmailService:
    """The class responsible for handling email notifications."""

    app: Flask = None
    svc_url: str = None
    timeout: int = None
    template_path: str = None
    business_details_url: str = None
    request_omit_url: str = None
    bcreg_email: str = None
    toll_free_tel: str = None
    vic_office_tel: str = None

    def __init__(self, app: Flask = None):
        """Initialize the email service."""
        if app:
            self.init_app(app)

    def init_app(self, app: Flask):
        """Initialize app dependent variables."""
        self.app = app
        self.svc_url = app.config.get('NOTIFY_SVC_URL')
        self.timeout = app.config.get('NOTIFY_API_TIMEOUT', 20)
        self.template_path = app.config.get('EMAIL_TEMPLATE_PATH', '')
        self.business_act_url = self.app.config['EMAIL_BUSINESS_ACT_URL']
        self.business_details_url = self.app.config['EMAIL_BUSINESS_DETAILS_URL']
        self.request_omit_url = self.app.config['EMAIL_BTR_OMIT_URL']
        self.bcreg_email = self.app.config['EMAIL_BCREG_EMAIL']
        self.toll_free_tel = self.app.config['EMAIL_TOLL_FREE_TEL']
        self.vic_office_tel = self.app.config['EMAIL_VICTORIA_OFFICE_TEL']

    def _compose_updating_minor_public_email(self, person: dict, business_info: dict) -> dict:
        """Return email data for EmailType.UPDATING_MINOR."""
        full_name = get_name(person, 'individual')
        citizenship = get_citizenship_public_desc(person)

        template = Path(f'{self.template_path}/btr-{EmailType.UPDATING_MINOR_PUBLIC.value}.md').read_text('utf-8')
        filled_template = self._substitute_template_parts(template)
        jinja_template = Template(filled_template, autoescape=True)

        identifier = business_info['business']['identifier']
        request_omit_params = f"?businessIdentifier={identifier}&id={person['uuid']}"
        html_out = jinja_template.render(
            business_name=business_info['business']['legalName'],
            business_address_street=business_info['deliveryAddress']['streetAddress'],
            business_contact_email=business_info['contact']['email'],
            business_contact_phone=business_info['contact']['phone'],
            business_identifier=identifier,
            full_name=full_name,
            birth_year=person['birthDate'][0:4],
            citizenship=citizenship,
            business_url=self.business_details_url + f"?identifier={identifier}",
            learn_more_url=self.request_omit_url + request_omit_params + '&help=true',
            request_omit_url=self.request_omit_url + request_omit_params,
            bcreg_email=self.bcreg_email,
            toll_free_tel=self.toll_free_tel,
            vic_office_tel=self.vic_office_tel
        )

        subject = 'You have been listed in the B.C. Transparency Register'
        return {
            'recipients': person.get('email'),
            'requestBy': self.bcreg_email,
            'content': {'subject': subject, 'body': f'{html_out}'},
        }

    def _compose_added_email(self, person: dict, business_info: dict, effective_date: str) -> dict:
        """Return email data for EmailType.ADDING_ADULT or EmailType.ADDING_MINOR"""
        email_type = EmailType.ADDING_ADULT
        effective_datetime = LegislationDatetime.as_legislation_timezone_from_date_str(effective_date)
        # dates
        start_date_label = 'Registration date'
        start_date_desc = 'registration date'
        start_date = LegislationDatetime.format_as_legislation_date(effective_datetime)
        # Must be at least 90 days after 'registration date'. Since we do it at 12 am it has to be 91 days after
        publication_date = LegislationDatetime.format_as_report_string(effective_datetime + timedelta(days=91))

        # birth
        birthdate = person.get('birthDate')
        birth_year = 'Not Entered'
        if birthdate:
            birthdate = LegislationDatetime.as_legislation_timezone_from_date_str(birthdate)
            birth_year = birthdate.year
            minor_threshold = effective_datetime - relativedelta(years=19)

            if minor_threshold < birthdate:
                # update email type and date info
                email_type = EmailType.ADDING_MINOR
                start_date_label = 'Birth Date'
                start_date_desc = '19th birthday'
                start_date = LegislationDatetime.format_as_legislation_date(birthdate)
                publication_date = LegislationDatetime.format_as_report_string((
                    effective_datetime +
                    ((minor_threshold - birthdate) * -1)
                    + timedelta(days=91)
                ))

        full_name = get_name(person, 'individual')

        template = Path(f'{self.template_path}/btr-{email_type.value}.md').read_text('utf-8')
        filled_template = self._substitute_template_parts(template)
        jinja_template = Template(filled_template, autoescape=True)

        identifier = business_info['business']['identifier']
        request_omit_params = f"?businessIdentifier={identifier}&id={person['uuid']}"

        html_out = jinja_template.render(
            business_name=business_info['business']['legalName'],
            business_identifier=identifier,
            full_name=full_name,
            birth_year=str(birth_year),
            publication_date=publication_date,
            start_date=start_date,
            start_date_label=start_date_label,
            start_date_desc=start_date_desc,
            business_act_url=self.business_act_url,
            business_url=self.business_details_url + f"?identifier={identifier}",
            learn_more_url=self.request_omit_url + request_omit_params + '&help=true',
            request_omit_url=self.request_omit_url + request_omit_params,
            bcreg_email=self.bcreg_email,
            toll_free_tel=self.toll_free_tel,
            vic_office_tel=self.vic_office_tel
        )

        subject = 'You have been listed in the B.C. Transparency Register'
        return {
            'recipients': person.get('email'),
            'requestBy': self.bcreg_email,
            'content': {'subject': subject, 'body': f'{html_out}'},
        }

    def _send_email(self, email: dict, token: str):
        """Send the email."""

        if not email or 'recipients' not in email or 'content' not in email or 'body' not in email['content']:
            raise BusinessException("Unsuccessful sending email - required email object(s) is missing.")
        if not email['recipients'] or not email['content'] or not email['content']['body']:
            raise BusinessException("Unsuccessful sending email - required email object(s) is empty.")

        resp = requests.post(
            self.svc_url,
            json=email,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}',
            },
            timeout=self.timeout
        )
        if resp.status_code != HTTPStatus.OK:
            raise BusinessException(
                "Unsuccessful response when sending email.", "", resp.status_code
            )

    def _substitute_template_parts(self, template_code: str) -> str:
        """Substitute template parts in main template.

        Template parts are marked by [[partname.md]] in templates.

        This functionality is restricted by:
        - markup must be exactly [[partname.md]] and have no extra spaces around file name
        - template parts can only be one level deep, ie: this rudimentary framework does not handle nested template
        parts. There is no recursive search and replace.
        """
        template_parts = [
            'btr-contact-business',
            'btr-omit-info',
            'btr-personal-details-text',
            'btr-personal-details',
            'btr-registered-details',
            'btr-title-notification-public',
            'footer'
        ]

        # substitute template parts - marked up by [[filename.md]]
        for template_part in template_parts:
            template_part_code = Path(f'{self.template_path}/common/{template_part}.md').read_text('utf-8')
            template_code = template_code.replace(f'[[{template_part}.md]]', template_part_code)

        return template_code

    def send_added_to_btr_email(self,
                                person_statement: dict,
                                business_info: dict,
                                effective_date: str,
                                token: str):
        """Send 'added person to btr' email via notify api."""
        try:
            email_msg = self._compose_added_email(person_statement, business_info, effective_date)
            self._send_email(email_msg, token)

        except BusinessException as bus_exc:
            # pass along
            raise bus_exc
        except Exception as unhandled_exception:
            self.app.logger.debug(unhandled_exception.with_traceback(None))
            raise BusinessException('Error sending email notification',
                                    business_info['business']['identifier'],
                                    HTTPStatus.INTERNAL_SERVER_ERROR) from unhandled_exception

    def send_updating_minor_btr_email(self,
                                      person: dict,
                                      business_info: dict,
                                      token: str):
        """Send 'updating minor to public' email via notify api."""
        try:
            email_msg = self._compose_updating_minor_public_email(person, business_info)
            self._send_email(email_msg, token)

        except BusinessException as bus_exc:
            # pass along
            raise bus_exc
        except Exception as unhandled_exception:
            self.app.logger.debug(unhandled_exception.with_traceback(None))
            raise BusinessException('Error sending email notification',
                                    business_info['business']['identifier'],
                                    HTTPStatus.INTERNAL_SERVER_ERROR) from unhandled_exception
