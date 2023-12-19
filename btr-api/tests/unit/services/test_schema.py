import os
import json
import pytest

from btr_api.services.schema import SchemaService


@pytest.mark.parametrize(
    "test_name, invalid_json_file_name, expected_error",
    [
        (
            "Invalid date format -- effectiveDate",
            "effective_date_invalid_format.json",
            "String '2022-01-01----' does not validate against format 'date'."
        ),
        (
            "Address Line 1 to long",
            "address_line1_too_long.json",
            "String '123 Main St 123 Main St123 Main St123 Main St123 Main St123 Main St123 Main St123 Main St123 "
            "Main St123 Main St123 Main St123 Main St123 Main St123 Main St123 Main St123 Main St' exceeds maximum "
            "length of 50."),
        (
            "Missing required fields -- effectiveDate",
            "effective_date_missing.json",
            "Required properties are missing from object: effectiveDate."),
        (
            "Max size exceeds maximum of 100 -- percent shares",
            "percent_shares_more_then_100.json",
            "Integer 101 exceeds maximum value of 100."
        ),
        (
            "Not a number -- percent shares",
            "percent_shares_not_a_number.json",
            "Invalid type. Expected Number but got String."
        ),
    ],
)
def test_invalid_significant_individuals_filing_schema(
    client, session, test_name, invalid_json_file_name, expected_error
):
    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, "../mocks/SignificantIndividualsFiling", invalid_json_file_name)) as file:
        data = json.load(file)
        ss = SchemaService()
        [valid, errors] = ss.validate(schema_name="SignificantIndividualsFiling", data=data)
        assert valid is False
        assert expected_error in errors
