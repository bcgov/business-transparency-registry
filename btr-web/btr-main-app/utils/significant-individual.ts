/** Get a new significant individual with all default fields
 * @param startDate expected iso date string (YYYY-MM-DD)
*/
export function getNewDefaultSI (startDate: string) {
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
    missingInfoReason: '',
    percentOfShares: '',
    percentOfVotes: '',
    startDate: startDate || '',
    action: FilingActionE.ADD
  }
}
