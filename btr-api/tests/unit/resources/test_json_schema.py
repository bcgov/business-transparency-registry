""" Tests to ensure that the json_schema end-points work correctly.
"""
from http import HTTPStatus

import pytest


def test_list_all_schemas(client, session):
    expected_available_schemas = ['SignificantIndividualsFiling']
    rv = client.get('/json-schemas')

    json_data = rv.get_json()
    assert rv.status_code == HTTPStatus.OK
    assert json_data['schemas'] == expected_available_schemas


@pytest.mark.parametrize(
    "test_name, schema_name, expected_status",
    [("Existing schema", "SignificantIndividualsFiling", HTTPStatus.OK),
     ("Non existing schema", "NonExistingSchema", HTTPStatus.NOT_FOUND)],
)
def test_get_schema(client, session, test_name, schema_name, expected_status):
    rv = client.get(f'/json-schemas/{schema_name}')
    assert rv.status_code == expected_status


