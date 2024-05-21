// import {
//   BodsCountryI, BodsIdentifierI, BodsInterestI, BodsNameI, BodsBtrAddressI
// } from '~/interfaces/btr-bods/components-i'
// import {
//   BodsInterestDirectOrIndirectE,
//   BodsInterestTypeE,
//   BodsNameTypeE,
//   BodsPersonTypeE
// } from '~/enums/btr-bods-e'
// import { SignificantIndividualI } from '~/interfaces/significant-individual-i'
// import { PercentageRangeE } from '~/enums/percentage-range-e'
//
// const getBodsAddressFromSi = (si: SignificantIndividualI): BodsBtrAddressI => {
//   return {
//     street: si.profile.address.line1,
//     streetAdditional: si.profile.address.line2,
//     city: si.profile.address.city,
//     region: si.profile.address.region,
//     postalCode: si.profile.address.postalCode,
//     locationDescription: si.profile.address.locationDescription,
//     country: si.profile.address.country.alpha_2,
//     countryName: si.profile.address.country.name
//   }
// }
//
// const getBodsNamesFromSi = (si: SignificantIndividualI) => {
//   const names: BodsNameI[] = [
//     {
//       fullName: si.profile.fullName,
//       type: BodsNameTypeE.INDIVIDUAL
//     }
//   ]
//
//   if (si.profile.preferredName) {
//     names.push({
//       fullName: si.profile.preferredName,
//       type: BodsNameTypeE.ALTERNATIVE
//     })
//   }
//   return names
// }
//
// const getBodsIdentifiersFromSi = (si: SignificantIndividualI) => {
//   const identifiers: BodsIdentifierI[] = []
//   if (si.profile.taxNumber) {
//     identifiers.push({
//       id: si.profile.taxNumber,
//       scheme: 'CAN-TAXID',
//       schemeName: 'ITN'
//     })
//   }
//   return identifiers
// }
//
// const getPersonType = (_si: SignificantIndividualI): BodsPersonTypeE => {
//   // future: when we have requirements to hide person details we can use
//   // BodsPersonTypeE.ANONYMOUS_PERSON
//   return BodsPersonTypeE.KNOWN_PERSON
// }
//
// const _createInterestDirectors = (
//   si: SignificantIndividualI,
//   directOrIndirect: BodsInterestDirectOrIndirectE,
//   flagName: string
// ) => {
//   return {
//     type: BodsInterestTypeE.APPOINTMENT_OF_BOARD,
//     directOrIndirect,
//     details: `controlType.directors.${flagName}`,
//     startDate: si.startDate,
//     endDate: si.endDate
//   }
// }
//
// const _getDirectorsInterests = (si: SignificantIndividualI) => {
//   const interests: BodsInterestI[] = []
//
//   if (si.controlType.directors.directControl) {
//     interests.push(
//       _createInterestDirectors(si, BodsInterestDirectOrIndirectE.DIRECT, 'directControl'))
//   }
//   if (si.controlType.directors.inConcertControl) {
//     interests.push(
//       _createInterestDirectors(si, BodsInterestDirectOrIndirectE.INDIRECT, 'inConcertControl'))
//   }
//   if (si.controlType.directors.indirectControl) {
//     interests.push(
//       _createInterestDirectors(si, BodsInterestDirectOrIndirectE.INDIRECT, 'indirectControl'))
//   }
//   if (si.controlType.directors.significantInfluence) {
//     interests.push(
//       _createInterestDirectors(si, BodsInterestDirectOrIndirectE.UNKNOWN, 'significantInfluence'))
//   }
//   return interests
// }
//
// const _createInterestSharesVotes = (
//   si: SignificantIndividualI,
//   directOrIndirect: BodsInterestDirectOrIndirectE,
//   flagName: string
// ): BodsInterestI => {
//   return {
//     directOrIndirect,
//     details: `controlType.sharesOrVotes.${flagName}`,
//     startDate: si.startDate,
//     endDate: si.endDate
//   }
// }
//
// const _getPercentageRange = (interest: BodsInterestI, range: PercentageRangeE, sharesAndVotes: BodsInterestTypeE) => {
//   // the default range is (min, max]
//   interest.share = {
//     exclusiveMinimum: true,
//     exclusiveMaximum: false
//   }
//   interest.type = sharesAndVotes
//
//   switch (range) {
//     case PercentageRangeE.LESS_THAN_25:
//       // [0, 25)
//       interest.share.minimum = 0
//       interest.share.maximum = 25
//       interest.share.exclusiveMinimum = false
//       interest.share.exclusiveMaximum = true
//       break
//     case PercentageRangeE.AT_LEAST_25_TO_50:
//       // [25, 50]
//       interest.share.minimum = 25
//       interest.share.maximum = 50
//       interest.share.exclusiveMinimum = false
//       break
//     case PercentageRangeE.MORE_THAN_50_TO_75:
//       // (50, 75]
//       interest.share.minimum = 50
//       interest.share.maximum = 75
//       break
//     case PercentageRangeE.MORE_THAN_75:
//       // (75, 100]
//       interest.share.minimum = 75
//       interest.share.maximum = 100
//       break
//   }
// }
//
// const _getSharesVotesInterests = (si: SignificantIndividualI) => {
//   const interests: BodsInterestI[] = []
//   if (si.controlType.sharesVotes.registeredOwner) {
//     if (si.percentOfVotes !== PercentageRangeE.NO_SELECTION) {
//       const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectE.DIRECT, 'registeredOwner')
//       _getPercentageRange(interest, si.percentOfVotes, BodsInterestTypeE.VOTING_RIGHTS)
//       interests.push(interest)
//     }
//     if (si.percentOfShares !== PercentageRangeE.NO_SELECTION) {
//       const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectE.DIRECT, 'registeredOwner')
//       _getPercentageRange(interest, si.percentOfShares, BodsInterestTypeE.SHAREHOLDING)
//       interests.push(interest)
//     }
//   }
//
//   if (si.controlType.sharesVotes.indirectControl) {
//     if (si.percentOfVotes !== PercentageRangeE.NO_SELECTION) {
//       const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectE.INDIRECT, 'indirectControl')
//       _getPercentageRange(interest, si.percentOfVotes, BodsInterestTypeE.VOTING_RIGHTS)
//       interests.push(interest)
//     }
//     if (si.percentOfShares !== PercentageRangeE.NO_SELECTION) {
//       const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectE.INDIRECT, 'indirectControl')
//       _getPercentageRange(interest, si.percentOfShares, BodsInterestTypeE.SHAREHOLDING)
//       interests.push(interest)
//     }
//   }
//
//   if (si.controlType.sharesVotes.inConcertControl) {
//     if (si.percentOfVotes !== PercentageRangeE.NO_SELECTION) {
//       const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectE.INDIRECT, 'inConcertControl')
//       _getPercentageRange(interest, si.percentOfVotes, BodsInterestTypeE.VOTING_RIGHTS)
//       interests.push(interest)
//     }
//     if (si.percentOfShares !== PercentageRangeE.NO_SELECTION) {
//       const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectE.INDIRECT, 'inConcertControl')
//       _getPercentageRange(interest, si.percentOfShares, BodsInterestTypeE.SHAREHOLDING)
//       interests.push(interest)
//     }
//   }
//
//   if (si.controlType.sharesVotes.beneficialOwner) {
//     if (si.percentOfVotes !== PercentageRangeE.NO_SELECTION) {
//       const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectE.INDIRECT, 'beneficialOwner')
//       _getPercentageRange(interest, si.percentOfVotes, BodsInterestTypeE.VOTING_RIGHTS)
//       interests.push(interest)
//     }
//     if (si.percentOfShares !== PercentageRangeE.NO_SELECTION) {
//       const interest = _createInterestSharesVotes(si, BodsInterestDirectOrIndirectE.INDIRECT, 'beneficialOwner')
//       _getPercentageRange(interest, si.percentOfShares, BodsInterestTypeE.SHAREHOLDING)
//       interests.push(interest)
//     }
//   }
//   return interests
// }
//
// const getInterests = (si: SignificantIndividualI): BodsInterestI[] => {
//   let interests: BodsInterestI[] = []
//
//   interests = interests.concat(_getDirectorsInterests(si))
//   interests = interests.concat(_getSharesVotesInterests(si))
//   if (si.controlType.other) {
//     interests.push({
//       type: BodsInterestTypeE.OTHER_INFLUENCE_OR_CONTROL,
//       details: si.controlType.other
//     })
//   }
//   return interests
// }
//
// const getBodsNationalitiesFromSi = (si: SignificantIndividualI): BodsCountryI[] => {
//   const citizenships: BodsCountryI[] = []
//   for (const btrCountry of si.profile.citizenships) {
//     if (btrCountry.alpha_2 !== 'CA_PR') {
//       const code = btrCountry.alpha_2
//       const name = code === 'CA' ? 'Canada' : btrCountry.name
//       citizenships.push({ name, code })
//     }
//   }
//   return citizenships
// }
//
// const getTaxResidenciesFromSi = (si: SignificantIndividualI): BodsCountryI[] => {
//   const taxResidencies: BodsCountryI[] = []
//   if (si.profile.isTaxResident) {
//     taxResidencies.push({ name: 'Canada', code: 'CA' })
//   }
//   return taxResidencies
// }
//
// export default {
//   getBodsAddressFromSi,
//   getBodsNamesFromSi,
//   getBodsIdentifiersFromSi,
//   getBodsNationalitiesFromSi,
//   getInterests,
//   getTaxResidenciesFromSi,
//   getPersonType
// }
