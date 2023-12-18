import glob
import json
import os

from jsonschema import validate


class SchemaService(object):
    loaded_schemas: dict = {}

    @staticmethod
    def scripts_directory():
        script_path = os.path.dirname(os.path.abspath(__file__))
        return os.path.join(script_path, '..', 'schemas')

    def validate(self, schema_name: str, object_data: dict) -> bool:
        if not schema_name:
            raise Exception('invalid schema name')

        schema = self.get_schema(schema_name=schema_name)

        validate(instance=object_data, schema=schema)

        return True

    @staticmethod
    def load_schema(schema_name: str) -> dict | None:
        try:
            schema_file_name = f"{schema_name}.json"
            schema_file_path = os.path.join(SchemaService.scripts_directory(), schema_file_name)
            if not os.path.exists(schema_file_path):
                raise ValueError(f'Schema file could not be found: {schema_file_name}')
            with open(schema_file_path, 'r', encoding='UTF-8') as schema_file:
                schema = json.load(schema_file)
            return schema
        except json.JSONDecodeError:
            # raise ValueError(f'Error decoding JSON from schema file: {schema_file_name}')
            return None
        except Exception as e:
            # raise ValueError(f'Unexpected error occurred when loading schema: {str(e)}')
            return None

    def get_schema(self, schema_name: str) -> dict:
        if schema_name not in self.loaded_schemas:
            schema = self.load_schema(schema_name)
            if not schema:
                raise Exception(f'invalid schema name: {schema_name}')
            self.loaded_schemas[schema_name] = schema

        return self.loaded_schemas[schema_name]

    @staticmethod
    def list_all_schemas():
        directory = SchemaService.scripts_directory()
        return [os.path.splitext(os.path.basename(f))[0] for f in glob.glob(f"{directory}/*.json")]
