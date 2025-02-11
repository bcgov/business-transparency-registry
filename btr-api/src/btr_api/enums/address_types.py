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
"""Enum for user types."""
from btr_api.common.enum import BaseEnum


class AddressType(BaseEnum):
    """
    Enum for the address types in line with BODS standard.
    https://standard.openownership.org/en/0.4.0/standard/reference.html#address-type
    """

    PHYSICAL_ADDRESS = 'residence'
    MAILING_ADDRESS = 'service'
