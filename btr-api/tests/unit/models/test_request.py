import pytest
import datetime

from sqlalchemy import text

from btr_api.models.request import Request

from tests.unit.utils.db_helpers import clear_db
from tests.unit.utils.mock_data import REQUEST_DICT


def test_find_by_uuid(session):
    # Prepare data
    clear_db(session)
    request = Request(REQUEST_DICT)
    session.add(request)
    session.commit()

    # Do test
    result = Request.find_by_uuid(request.uuid)

    # Verify result
    assert result == request
