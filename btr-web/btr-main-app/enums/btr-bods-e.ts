export enum BodsSourceTypeE {
  SELF_DECLARATION = 'selfDeclaration',
  OFFICIAL_REGISTER = 'officialRegister',
  THIRD_PARTY = 'thirdParty',
  PRIMARY_RESEARCH = 'primaryResearch',
  VERIFIED = 'verified'
}

export enum BodsEntityTypesE {
  REGISTERED_ENTITY = 'registeredEntity',
  LEGAL_ENTITY = 'legalEntity',
  ARRANGEMENT = 'arrangement',
  ANONYMOUS_ENTITY = 'anonymousEntity',
  UNKNOWN_ENTITY = 'unknownEntity',
  STATE = 'state',
  STATE_BODY = 'stateBody'
}

export enum BodsNameTypeE {
  INDIVIDUAL = 'individual',
  TRANSLATION = 'translation',
  TRANSLITERATION = 'transliteration',
  FORMER = 'former',
  ALTERNATIVE = 'alternative',
  BIRTH = 'birth',
}

export enum BodsInterestTypeE {
  SHAREHOLDING = 'shareholding',
  VOTING_RIGHTS = 'votingRights',
  APPOINTMENT_OF_BOARD = 'appointmentOfBoard',
  OTHER_INFLUENCE_OR_CONTROL = 'otherInfluenceOrControl',
  SENIOR_MANAGING_OFFICIAL = 'seniorManagingOfficial',
  SETTLOR = 'settlor',
  TRUSTEE = 'trustee',
  PROTECTOR = 'protector',
  BENEFICIARY_OF_LEGAL_ARRANGEMENT = 'beneficiaryOfLegalArrangement',
  RIGHTS_TO_SURPLUS_ASSETS_ON_DISSOLUTION = 'rightsToSurplusAssetsOnDissolution',
  RIGHTS_TO_PROFIT_OR_INCOME = 'rightsToProfitOrIncome',
  RIGHTS_GRANTED_BY_CONTRACT = 'rightsGrantedByContract',
  CONDITIONAL_RIGHTS_GRANTED_BY_CONTRACT = 'conditionalRightsGrantedByContract',
  CONTROL_VIA_COMPANY_RULES_OR_ARTICLES = 'controlViaCompanyRulesOrArticles',
  CONTROL_BY_LEGAL_FRAMEWORK = 'controlByLegalFramework',
  BOARD_MEMBER = 'boardMember',
  BOARD_CHAIR = 'boardChair',
  UNKNOWN_INTEREST = 'unknownInterest',
  UNPUBLISHED_INTEREST = 'unpublishedInterest',
  ENJOYMENT_AND_USE_OF_ASSETS = 'enjoymentAndUseOfAssets',
  RIGHT_TO_PROFIT_OR_INCOME_FROM_ASSETS = 'rightToProfitOrIncomeFromAssets'
}

export enum BodsInterestDirectOrIndirectTypeI {
  DIRECT = 'direct',
  INDIRECT = 'indirect',
  UNKNOWN = 'unknown'
}

export enum BodsStatementTypeE {
  OWNERSHIP_OR_CONTROL_STATEMENT = 'ownershipOrControlStatement',
  ENTITY_STATEMENT = 'entityStatement',
  PERSON_STATEMENT = 'personStatement'
}

export enum BodsPersonTypeE {
  ANONYMOUS_PERSON = 'anonymousPerson',
  UNKNOWN_PERSON = 'unknownPerson',
  KNOWN_PERSON = 'knownPerson'
}

export enum BodsUnspecifiedPersonDetailsTypeE {
  NO_BENEFICIAL_OWNERS = 'noBeneficialOwners',
  SUBJECT_UNABLE_TO_CONFIRM_OR_IDENTIFY_BENEFICIAL_OWNER = 'subjectUnableToConfirmOrIdentifyBeneficialOwner',
  INTERESTED_PARTY_HAS_NOT_PROVIDED_INFORMATION = 'interestedPartyHasNotProvidedInformation',
  SUBJECT_EXEMPT_FROM_DISCLOSURE = 'subjectExemptFromDisclosure',
  INTERESTED_PARTY_EXEMPT_FROM_DISCLOSURE = 'interestedPartyExemptFromDisclosure',
  UNKNOWN = 'unknown',
  INFORMATION_UNKNOWN_TO_PUBLISHER = 'informationUnknownToPublisher'
}
