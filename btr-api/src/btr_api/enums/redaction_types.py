# Copyright © 2024 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Enum for redaction types."""
from btr_api.common.enum import BaseEnum
from btr_api.services import btr_auth


class RedactionType(BaseEnum):
    """Enum for the redaction types"""

    REDACT_MONONYM = 'mono'
    REDACT_MONONYM_FN = 'mono_fn'
    REDACT_EMAIL = 'mono_email'
    REDACT_PHONE = 'mono_phone'
    REDACT_FULL = 'full'
    REDACT_EMPTY = 'empty'
    REDACT_DATE = 'date'
    REDACT_IDENTIFIER = 'identifier'
