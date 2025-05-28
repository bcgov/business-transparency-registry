import { BodsBtrAddressTypeE } from '~/interfaces/btr-bods/components-i'
import type {
  BodsBtrAddressI,

  BodsCountryI,
  BodsIdentifierI,
  BodsInterestI,
  BodsNameI
} from '~/interfaces/btr-bods/components-i'
import {
  BodsInterestDirectOrIndirectE,
  BodsInterestTypeE,
  BodsNameTypeE,
  BodsPersonTypeE,
  ControlOfDirectorsDetailsE,
  ControlOfSharesDetailsE,
  ControlOfVotesDetailsE
} from '~/enums/btr-bods-e'
import { PercentageRangeE } from '~/enums/percentage-range-e'
import type {
  ConnectedInvidualSchemaType,
  SiControlOfDirectorsSchemaType,
  SiControlOfSchemaType,
  SiSchemaType
} from '~/utils/si-schema/definitions'

const getBodsAddressFromSi = (si: SiSchemaType): BodsBtrAddressI | undefined => {
  const addr = { type: BodsBtrAddressTypeE.PHYSICAL_ADDRESS } as BodsBtrAddressI
  if (hasFieldChanged(si, InputFieldsE.ADDRESS_LINE1)) {
    addr.street = si.address.line1
  }
  if (hasFieldChanged(si, InputFieldsE.ADDRESS_LINE2)) {
    addr.streetAdditional = si.address.line2
  }
  if (hasFieldChanged(si, InputFieldsE.ADDRESS_CITY)) {
    addr.city = si.address.city
  }
  if (hasFieldChanged(si, InputFieldsE.ADDRESS_COUNTRY)) {
    addr.country = si.address.country?.alpha_2 || ''
    addr.countryName = si.address.country?.name || ''
  }
  if (hasFieldChanged(si, InputFieldsE.ADDRESS_REGION)) {
    addr.region = si.address.region
  }
  if (hasFieldChanged(si, InputFieldsE.ADDRESS_POSTAL_CODE)) {
    addr.postalCode = si.address.postalCode
  }
  if (hasFieldChanged(si, InputFieldsE.ADDRESS_LOCATION_DESCRIPTION)) {
    addr.locationDescription = si.address.locationDescription as string
  }

  return Object.keys(addr).length > 1 ? addr : undefined
}

const getBodsMailingAddressFromSi = (si: SiSchemaType): BodsBtrAddressI | undefined => {
  const addr = { type: BodsBtrAddressTypeE.MAILING_ADDRESS } as BodsBtrAddressI
  if (!si.mailingAddress?.address) {
    return undefined
  }

  if (hasFieldChanged(si, InputFieldsE.MAILING_ADDRESS_LINE1)) {
    addr.street = si.mailingAddress.address.line1
  }
  if (hasFieldChanged(si, InputFieldsE.MAILING_ADDRESS_LINE2)) {
    addr.streetAdditional = si.mailingAddress.address.line2
  }
  if (hasFieldChanged(si, InputFieldsE.MAILING_ADDRESS_CITY)) {
    addr.city = si.mailingAddress.address.city
  }
  if (hasFieldChanged(si, InputFieldsE.MAILING_ADDRESS_COUNTRY)) {
    addr.country = si.mailingAddress.address.country?.alpha_2 || ''
    addr.countryName = si.mailingAddress.address.country?.name || ''
  }
  if (hasFieldChanged(si, InputFieldsE.MAILING_ADDRESS_REGION)) {
    addr.region = si.mailingAddress.address.region
  }
  if (hasFieldChanged(si, InputFieldsE.MAILING_ADDRESS_POSTAL_CODE)) {
    addr.postalCode = si.mailingAddress.address.postalCode
  }
  if (hasFieldChanged(si, InputFieldsE.MAILING_ADDRESS_LOCATION_DESCRIPTION)) {
    addr.locationDescription = si.mailingAddress.address.locationDescription as string
  }

  return Object.keys(addr).length > 1 ? addr : undefined
}

const getBodsNamesFromSi = (si: SiSchemaType) => {
  const names: BodsNameI[] = [
    {
      fullName: si.name.fullName,
      type: BodsNameTypeE.INDIVIDUAL
    }
  ]

  if (hasFieldChanged(si, InputFieldsE.PREFERRED_NAME) && si.name.preferredName) {
    names.push({
      fullName: si.name.preferredName,
      type: BodsNameTypeE.ALTERNATIVE
    })
  }
  return names
}

const getBodsIdentifiersFromSi = (si: SiSchemaType) => {
  if (!hasFieldChanged(si, InputFieldsE.TAX)) {
    return undefined
  }
  const identifiers: BodsIdentifierI[] = []
  if (si.tax?.taxNumber) {
    identifiers.push({
      id: si.tax.taxNumber,
      scheme: 'CAN-TAXID',
      schemeName: 'ITN'
    })
  }
  return identifiers
}

const getPersonType = (_si: SiSchemaType): BodsPersonTypeE => {
  // future: when we have requirements to hide person details we can use
  // BodsPersonTypeE.ANONYMOUS_PERSON
  return BodsPersonTypeE.KNOWN_PERSON
}

const _getDirectorsInterests = (
  controlOfDirectors: SiControlOfDirectorsSchemaType,
  individualsWithInConcertInterest: ConnectedInvidualSchemaType[],
  individualsWithJointInterest: ConnectedInvidualSchemaType[],
  startDate: string,
  endDate?: string
) => {
  const interests: BodsInterestI[] = []

  if (controlOfDirectors.directControl) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.DIRECT,
        ControlOfDirectorsDetailsE.DIRECT_CONTROL,
        BodsInterestTypeE.APPOINTMENT_OF_BOARD,
        startDate,
        endDate
      )
    interests.push(interest)
  }
  if (controlOfDirectors.indirectControl) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.INDIRECT,
        ControlOfDirectorsDetailsE.INDIRECT_CONTROL,
        BodsInterestTypeE.APPOINTMENT_OF_BOARD,
        startDate,
        endDate
      )
    interests.push(interest)
  }
  if (controlOfDirectors.significantInfluence) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.INDIRECT,
        ControlOfDirectorsDetailsE.SIGNIFICANT_INFLUENCE,
        BodsInterestTypeE.APPOINTMENT_OF_BOARD,
        startDate,
        endDate
      )
    interests.push(interest)
  }
  if (controlOfDirectors.inConcertControl) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.UNKNOWN,
        ControlOfDirectorsDetailsE.IN_CONCERT_CONTROL,
        BodsInterestTypeE.APPOINTMENT_OF_BOARD,
        startDate,
        endDate,
        individualsWithInConcertInterest
      )
    interests.push(interest)
  }
  if (controlOfDirectors.actingJointly) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.UNKNOWN,
        ControlOfDirectorsDetailsE.ACTING_JOINTLY,
        BodsInterestTypeE.APPOINTMENT_OF_BOARD,
        startDate,
        endDate,
        individualsWithJointInterest
      )
    interests.push(interest)
  }

  return interests
}

const _createInterest = (
  directOrIndirect: BodsInterestDirectOrIndirectE,
  details: string,
  type: BodsInterestTypeE,
  startDate: string,
  endDate?: string,
  connectedIndividuals?: ConnectedInvidualSchemaType[]
): BodsInterestI => {
  if (startDate?.trim() === '') {
    startDate = (new Date()).toISOString().substring(0, 10)
  }
  return {
    directOrIndirect,
    details,
    type,
    startDate,
    endDate: endDate || undefined,
    connectedIndividuals: connectedIndividuals || undefined
  }
}

const _updateInterestWithPercentRange =
  (interest: BodsInterestI, range: PercentageRangeE) => {
    // the default range is (min, max]
    interest.share = {
      exclusiveMinimum: true,
      exclusiveMaximum: false
    }

    switch (range) {
      case PercentageRangeE.LESS_THAN_25:
        // [0, 25)
        interest.share.minimum = 0
        interest.share.maximum = 25
        interest.share.exclusiveMinimum = false
        interest.share.exclusiveMaximum = true
        break
      case PercentageRangeE.AT_LEAST_25_TO_50:
        // [25, 50]
        interest.share.minimum = 25
        interest.share.maximum = 50
        interest.share.exclusiveMinimum = false
        break
      case PercentageRangeE.MORE_THAN_50_TO_75:
        // (50, 75]
        interest.share.minimum = 50
        interest.share.maximum = 75
        break
      case PercentageRangeE.MORE_THAN_75:
        // (75, 100]
        interest.share.minimum = 75
        interest.share.maximum = 100
        break
    }
  }

const _getInterestsOfSharesOrVotes = (
  controlOf: SiControlOfSchemaType,
  individualsWithInConcertInterest: ConnectedInvidualSchemaType[],
  individualsWithJointInterest: ConnectedInvidualSchemaType[],
  startDate: string,
  endDate?: string
): BodsInterestI[] => {
  const interests: BodsInterestI[] = []
  let controlOfDetails: typeof ControlOfSharesDetailsE | typeof ControlOfVotesDetailsE = ControlOfVotesDetailsE
  let bodsInterestType: BodsInterestTypeE = BodsInterestTypeE.UNKNOWN_INTEREST

  if (controlOf.controlName === 'controlOfShares') {
    controlOfDetails = ControlOfSharesDetailsE
    bodsInterestType = BodsInterestTypeE.SHAREHOLDING
  } else if (controlOf.controlName === 'controlOfVotes') {
    controlOfDetails = ControlOfVotesDetailsE
    bodsInterestType = BodsInterestTypeE.VOTING_RIGHTS
  }

  if (controlOf.indirectControl) {
    const interest = _createInterest(
      BodsInterestDirectOrIndirectE.INDIRECT,
      controlOfDetails.INDIRECT_CONTROL,
      bodsInterestType,
      startDate,
      endDate
    )
    _updateInterestWithPercentRange(interest, controlOf.percentage!)
    interests.push(interest)
  }
  if (controlOf.beneficialOwner) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.DIRECT,
        controlOfDetails.BENEFICIAL_OWNER,
        bodsInterestType,
        startDate,
        endDate
      )
    _updateInterestWithPercentRange(interest, controlOf.percentage!)
    interests.push(interest)
  }
  if (controlOf.registeredOwner) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.DIRECT,
        controlOfDetails.REGISTERED_OWNER,
        bodsInterestType,
        startDate,
        endDate
      )
    _updateInterestWithPercentRange(interest, controlOf.percentage!)
    interests.push(interest)
  }
  if (controlOf.actingJointly) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.UNKNOWN,
        controlOfDetails.ACTING_JOINTLY,
        bodsInterestType,
        startDate,
        endDate,
        individualsWithJointInterest
      )
    _updateInterestWithPercentRange(interest, controlOf.percentage!)
    interests.push(interest)
  }
  if (controlOf.inConcertControl) {
    const interest =
      _createInterest(
        BodsInterestDirectOrIndirectE.UNKNOWN,
        controlOfDetails.IN_CONCERT_CONTROL,
        bodsInterestType,
        startDate,
        endDate,
        individualsWithInConcertInterest
      )
    _updateInterestWithPercentRange(interest, controlOf.percentage!)
    interests.push(interest)
  }

  return interests
}

const getInterests = (si: SiSchemaType, includeAll: boolean = false) => {
  let interests: BodsInterestI[] = []

  for (const dateGroup of si.effectiveDates) {
    const siControlStore = useSiControlStore()
    const startDate = dateGroup.startDate
    const endDate = dateGroup.endDate

    if (
      hasFieldChanged(si, InputFieldsE.CONTROL_OF_SHARES) ||
      includeAll ||
      (si.controlOfShares && hasFieldChanged(si, InputFieldsE.EFFECTIVE_DATES))
    ) {
      const newInterests =
        _getInterestsOfSharesOrVotes(
          si.controlOfShares,
          siControlStore.actingJointlyAndInConcert.get(si.uuid)?.sharesInConcert || [],
          siControlStore.actingJointlyAndInConcert.get(si.uuid)?.sharesJointly || [],
          startDate,
          endDate
        )

      interests = interests.concat(newInterests)
    }

    if (
      hasFieldChanged(si, InputFieldsE.CONTROL_OF_VOTES) ||
      includeAll ||
      (si.controlOfVotes && hasFieldChanged(si, InputFieldsE.EFFECTIVE_DATES))
    ) {
      const newInterests =
        _getInterestsOfSharesOrVotes(
          si.controlOfVotes,
          siControlStore.actingJointlyAndInConcert.get(si.uuid)?.votesInConcert || [],
          siControlStore.actingJointlyAndInConcert.get(si.uuid)?.votesJointly || [],
          startDate,
          endDate
        )
      interests = interests.concat(newInterests)
    }

    if (
      hasFieldChanged(si, InputFieldsE.CONTROL_OF_DIRECTORS) ||
      includeAll ||
      (si.controlOfDirectors && hasFieldChanged(si, InputFieldsE.EFFECTIVE_DATES))
    ) {
      const newInterests =
        _getDirectorsInterests(
          si.controlOfDirectors,
          siControlStore.actingJointlyAndInConcert.get(si.uuid)?.directorsInConcert || [],
          siControlStore.actingJointlyAndInConcert.get(si.uuid)?.directorsJointly || [],
          startDate,
          endDate
        )
      interests = interests.concat(newInterests)
    }
  }
  return interests
}

const getInterestTypes = (si: SiSchemaType) => {
  const interestTypes: BodsInterestTypeE[] = []
  const controlOfShares = si.controlOfShares
  const controlOfVotes = si.controlOfVotes
  const controlOfDirectors = si.controlOfDirectors
  if (controlOfShares.registeredOwner || controlOfShares.beneficialOwner || controlOfShares.indirectControl) {
    interestTypes.push(BodsInterestTypeE.SHAREHOLDING)
  }
  if (controlOfVotes.registeredOwner || controlOfVotes.beneficialOwner || controlOfVotes.indirectControl) {
    interestTypes.push(BodsInterestTypeE.VOTING_RIGHTS)
  }
  if (controlOfDirectors.directControl || controlOfDirectors.indirectControl ||
    controlOfDirectors.significantInfluence) {
    interestTypes.push(BodsInterestTypeE.APPOINTMENT_OF_BOARD)
  }
  return interestTypes
}

const getBodsNationalitiesFromSi = (si: SiSchemaType): BodsCountryI[] | undefined => {
  if (!hasFieldChanged(si, InputFieldsE.CITIZENSHIPS)) {
    return undefined
  }
  const citizenships: BodsCountryI[] = []
  for (const btrCountry of si.citizenships.nationalities) {
    if (btrCountry.alpha_2 !== 'CA_PR') {
      const code = btrCountry.alpha_2
      const name = code === 'CA' ? 'Canada' : btrCountry.name
      citizenships.push({ name, code })
    }
  }
  return citizenships
}

const getTaxResidenciesFromSi = (si: SiSchemaType): BodsCountryI[] | undefined => {
  if (!hasFieldChanged(si, InputFieldsE.IS_TAX_RESIDENT)) {
    return undefined
  }

  const taxResidencies: BodsCountryI[] = []
  if (si.isTaxResident) {
    taxResidencies.push({ name: 'Canada', code: 'CA' })
  }
  return taxResidencies
}

export default {
  getBodsAddressFromSi,
  getBodsMailingAddressFromSi,
  getBodsNamesFromSi,
  getBodsIdentifiersFromSi,
  getBodsNationalitiesFromSi,
  getInterests,
  getInterestTypes,
  getTaxResidenciesFromSi,
  getPersonType
}
