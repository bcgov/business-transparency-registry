
from contextlib import contextmanager

@contextmanager
def nested_session(session):
    try:
        sess = session.begin_nested()
        yield sess
    except Exception as error:
        print(error)
        raise error
    finally:
        pass

INDIVIDUAL_1 = {
    "controlType": {
        "sharesVotes": {
            "registeredOwner": True,
            "beneficialOwner": False,
            "indirectControl": True,
            "inConcertControl": False
        },
        "directors": {
            "directControl": True,
            "indirectControl": False,
            "significantInfluence": True,
            "inConcertControl": True
        },
        "other": ""
    },
    "missingInfoReason": "",
    "percentOfShares": "25",
    "percentOfVotes": "30",
    "profile": {
        "address": {},
        "competency": {
            "decisionMaking": True,
            "financialAffairs": False
        },
        "birthDate": "1980-03-01",
        "citizenshipCA": "Canada",
        "citizenshipsExCA": [],
        "email": "example1@email.com",
        "hasTaxNumber": True,
        "isTaxResident": True,
        "fullName": "John Doe",
        "preferredName": "John",
        "taxNumber": "123456789"
    },
    "startDate": "2023-01-01",
    "endDate": "2024-01-01",
    "action": "add"
}

INDIVIDUAL_2 = {
    "controlType": {
        "sharesVotes": {
            "registeredOwner": False,
            "beneficialOwner": True,
            "indirectControl": True,
            "inConcertControl": False
        },
        "directors": {
            "directControl": False,
            "indirectControl": True,
            "significantInfluence": False,
            "inConcertControl": True
        },
        "other": ""
    },
    "missingInfoReason": "",
    "percentOfShares": "12",
    "percentOfVotes": "11",
    "profile": {
        "address": {},
        "competency": {
            "decisionMaking": True,
            "financialAffairs": False
        },
        "birthDate": "1980-01-01",
        "citizenshipCA": "Canada",
        "citizenshipsExCA": [],
        "email": "example2@email.com",
        "hasTaxNumber": True,
        "isTaxResident":True,
        "fullName": "Jane Doe",
        "preferredName": "",
        "taxNumber": "123000111"
    },
    "startDate": "2023-01-01",
    "action": "add"
}

INDIVIDUAL_3 = {
    "controlType": {
        "sharesVotes": {
            "registeredOwner": True,
            "beneficialOwner": False,
            "indirectControl": True,
            "inConcertControl": False
        },
        "directors": {
        "directControl": True,
        "indirectControl": False,
        "significantInfluence": True,
        "inConcertControl": True
        },
        "other": "Other control details"
    },
    "missingInfoReason": "Not applicable",
    "percentOfShares": "15",
    "percentOfVotes": "30",
    "profile": {
        "address": {},
        "competency": {
            "decisionMaking": True,
            "financialAffairs": False
        },
        "birthDate": "1990-01-01",
        "citizenshipCA": "Canada",
        "citizenshipsExCA": [],
        "email": "example3@email.com",
        "hasTaxNumber": True,
        "isTaxResident": True,
        "fullName": "test name",
        "preferredName": "testing",
        "taxNumber": "123456000"
    },
    "startDate": "2023-01-01",
    "action": "add"
}

TEST_SI_FILING = {
    "businessIdentifier": "BC0871427",
    "folioNumber": "12345",
    "effectiveDate": "2023-12-11",
    "significantIndividuals": [
        INDIVIDUAL_1,
        INDIVIDUAL_2,
        INDIVIDUAL_3
    ],
    "certified": True
}
