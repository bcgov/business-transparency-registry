export const errorSectionMap = {
  'name.fullName': { sectionId: 'individual-person-full-name', position: 1 },
  'name.nameChangeReason': { sectionId: 'individual-person-full-name', position: 1 },
  'name.preferredName': { sectionId: 'individual-person-preferred-name', position: 2 },
  isControlSelected: { sectionId: 'control', position: 3 },
  controlOfShares: { sectionId: 'control-of-shares', position: 3 },
  controlOfVotes: { sectionId: 'control-of-votes', position: 4 },
  controlOfDirectors: { sectionId: 'control-of-directors', position: 5 },
  effectiveDates: { sectionId: 'effective-dates', position: 7 },
  email: { sectionId: 'individual-person-email', position: 8 },
  address: { sectionId: 'address', position: 9 },
  mailingAddress: { sectionId: 'mailing-address', position: 10 },
  'phoneNumber.number': { sectionId: 'phone-number', position: 11 },
  birthDate: { sectionId: 'birth-date', position: 12 },
  citizenships: { sectionId: 'citizenships', position: 13 },
  tax: { sectionId: 'tax-details', position: 14 },
  isTaxResident: { sectionId: 'tax-residency', position: 15 },
  missingInfoReason: { sectionId: 'missing-info', position: 16 }
} as Record<string, { sectionId: string, position: number }>
