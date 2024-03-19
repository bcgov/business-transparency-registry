/** Get a new significant individual with all default fields
 * @param startDate expected iso date string (YYYY-MM-DD)
 */
export function getEmptySI (startDate: string) {
  return {
    profile: {
      fullName: '',
      preferredName: '',
      address: {
        city: '',
        country: { name: '', alpha_2: '' },
        line1: '',
        postalCode: '',
        region: '',
        line2: '',
        locationDescription: ''
      },
      competency: {
        decisionMaking: false,
        financialAffairs: false
      },
      birthDate: null,
      citizenshipCA: '',
      citizenshipsExCA: [],
      email: '',
      isTaxResident: undefined,
      hasTaxNumber: undefined,
      taxNumber: undefined
    },
    controlType: {
      sharesVotes: {
        registeredOwner: false,
        beneficialOwner: false,
        indirectControl: false,
        inConcertControl: false
      },
      directors: {
        directControl: false,
        indirectControl: false,
        significantInfluence: false,
        inConcertControl: false
      },
      other: ''
    },
    externalInfluence: ExternalInfluenceE.NO_EXTERNAL_INFLUENCE,
    missingInfoReason: '',
    percentOfShares: PercentageRangeE.NO_SELECTION,
    percentOfVotes: PercentageRangeE.NO_SELECTION,
    startDate: startDate || '',
    action: FilingActionE.ADD
  }
}
