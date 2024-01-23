from os import path

from btr_api.schemas import utils
from btr_api.services.json_schema import SchemaService

# Replace path_to_schema_file, valid_json_data and invalid_json_data with actual test values
valid_json_data = {}
invalid_json_data = {}

schemas_path = SchemaService.scripts_directory()
btr_filing_path = path.join(schemas_path, 'btr-bods', 'btr-filing.json')


def test_get_schema():
    schema = utils.get_schema(btr_filing_path)
    assert schema is not None
    assert isinstance(schema, dict)

    # Add more specific assertions based on your schema structure


def test_load_json_schema():
    schema = utils._load_json_schema(btr_filing_path)

    assert schema is not None
    assert isinstance(schema, dict)


def test_get_schema_store():
    schema_store = utils.get_schema_store()

    assert schema_store is not None
    assert isinstance(schema_store, dict)
