"""Validator functions for the BTR API."""
from typing import Optional

from flask import current_app
from flask_jwt_oidc import JwtManager

from btr_api.services import EntityService


def validate_entity(entity: dict) -> list[str]:
    """
    Validate the entity based on its state and adminFreeze status to determine if the business can file a
    significant individual change

    Parameters:
    entity (dict): The entity data to validate

    Returns:
    list[str]: A list of errors, if any, found during validation
    """
    errors = []
    if entity['business']['state'] != 'ACTIVE':
        errors.append('The business is not active')
    if entity['business']['adminFreeze']:
        errors.append('The business is frozen')

    return errors

def _get_todo_header(todo: dict) -> dict:
    return todo.get('task', {}).get('todo', {}).get('header', {})

def _validate_ar_filing(todos: list, submission: dict) -> []:
    filing_year = submission.get('arFilingForYear', None)
    if not filing_year:
        return ['Missing arFilingForYear']

    for todo in todos:
        todo_enabled = todo.get('enabled', False)
        if todo_enabled:
            tr_filing_year = _get_todo_header(todo).get('TRFilingYear')
            subtype = _get_todo_header(todo).get('subType')
            if tr_filing_year is not None and tr_filing_year == filing_year and subtype == 'annual':
                return []

    return ['Invalid arFilingForYear']


def _find_initial_filing_todo(todos: list) -> Optional[dict]:
    for todo in todos:
        todo_enabled = todo.get('enabled', False)
        if todo_enabled:
            todo_name = _get_todo_header(todo).get('name')
            todo_sub_type = _get_todo_header(todo).get('subType')
            if todo_name == 'tranparencyRegister' and todo_sub_type == 'initial':
                return todo

    return None


def _validate_initial_filing(todos: list) -> []:
    # require to have todo for initial filing
    if _find_initial_filing_todo(todos) is not None:
        return []

    return ['Invalid filingType']


def _validate_change_filing(todos: list) -> []:
    # initial filing should be filed, meaning no enabled initial filing todo should be found
    if _find_initial_filing_todo(todos) is None:
        return []

    return ['Invalid filingType']


def validate_tr_filing_for_type(submission: dict, jwt: JwtManager):
    """
    Validate the filing on its type and available todos to verify if this filing type can be filed.

    Parameters:
    filing (dict): The filing data to validate

    Returns:
    list[str]: A list of errors, if any, found during validation
    """
    filing_type = submission['filingType']
    business_identifier = submission['businessIdentifier']
    entity_service = EntityService(current_app)
    todos = entity_service.get_entity_todos(business_identifier, jwt)

    if filing_type == 'INITIAL_FILING':
        return _validate_initial_filing(todos)

    if filing_type == 'CHANGE_FILING':
        return _validate_change_filing(todos)

    if filing_type == 'ANNUAL_FILING':
        return _validate_ar_filing(todos, submission)

    return ['Invalid filingType']
