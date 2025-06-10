"""Validator functions for the BTR API."""
from typing import Optional

from dateutil.relativedelta import relativedelta
from flask import current_app
from flask_jwt_oidc import JwtManager

from btr_api.enums import VerificationStatus
from btr_api.services import EntityService
from btr_api.utils.legislation_datetime import LegislationDatetime


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


def validate_tr_filing_for_type(submission: dict, jwt: JwtManager) -> list[str]:
    """
    Validate the filing on its type and available todos to verify if this filing type can be filed.

    Parameters:
    submission (dict): The filing data to validate
    jwt (JwtManager): The JWT manager object for authentication

    Returns:
    list[str]: A list of errors, if any, found during validation
    """
    skip_filing_validation = current_app.config.get('SKIP_CHANGE_AND_ANNUAL_FILING_VALIDATION', False)
    if skip_filing_validation:
        return []

    filing_type = submission['filingType']
    business_identifier = submission['businessIdentifier']
    entity_service = EntityService(current_app)
    todos = (entity_service.get_entity_info(jwt, f'{business_identifier}/tasks')).json().get('tasks', [])

    if filing_type == 'INITIAL_FILING':
        return _validate_initial_filing(todos)

    if filing_type == 'CHANGE_FILING':
        return _validate_change_filing(todos)

    if filing_type == 'ANNUAL_FILING':
        return _validate_ar_filing(todos, submission)

    return ['Invalid filingType']


def _validate_self_declaration(person: dict, full_name: str, login_source: str, roles: list[str]) -> list[dict]:
    errors = []
    # check login source
    if login_source not in ["BCEID", "BCSC"] or (login_source == "BCEID" and "account_holder" not in roles):
        errors.append({
            "statementID": person.get("statementID"),
            "error": f"login source '{login_source}' does not support self verification",
        })

    # Check legal name match
    names = person.get("names", [])
    legal_name = next((n.get("fullName") for n in names if n.get("type") == "individual"), None)
    if legal_name and full_name.lower() != legal_name.lower():
        errors.append({
            "statementID": person.get("statementID"),
            "error": f"legal name '{legal_name}' does not match login name '{full_name}'",
        })

    return errors


def _validate_guardian_verification(person: dict) -> list[dict]:
    # validate guardian verification; only minor SIs can be verified by their parents or guardians
    errors = []
    if birthdate := person.get("birthDate"):
        birthdate = LegislationDatetime.as_legislation_timezone_from_date_str(birthdate).date()
        minor_threshold = LegislationDatetime.now() - relativedelta(years=19)
        is_minor = minor_threshold.date() < birthdate
    else:
        is_minor = False

    if not is_minor:
        errors.append({
            "statementID": person.get("statementID"),
            "error": "guardian verification is only for minors",
        })

    return errors


def validate_verification(person_statements: list[dict], jwt_oidc_token: dict) -> list[str]:
    """
    Validate the verification status of each person statement.

    Parameters:
    person_statements (list[dict]): A list of person statement dictionaries to validate.
    jwt_oidc_token (dict): The decoded JWT token containing user identity and login information.

    Returns:
    list[dict]: A list of validation errors, if any, with associated statementID and error message.
    """
    errors = []

    login_source = jwt_oidc_token.get("loginSource")
    full_name = jwt_oidc_token.get("name")
    roles = jwt_oidc_token.get("roles", [])

    for person in person_statements:
        status = VerificationStatus(person.get("verificationStatus"))

        if status == VerificationStatus.VERIFIED_BY_SELF:
            errors += _validate_self_declaration(person, full_name, login_source, roles)

        elif status == VerificationStatus.VERIFIED_BY_GUARDIAN:
            errors += _validate_guardian_verification(person)

    return errors
