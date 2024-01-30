/**
 * Check if the input value is a whole number with no non-digit characters
 * Empty string is considered valid
 * @param value the input string
 */
export function validatePercentageWholeNumber (value: string): boolean {
  const regex = /^[0-9]*$/
  return value === '' || regex.test(value)
}

/**
 * Check if the input value is in a valid format with no leading zeros
 * Empty string is considered valid
 * @param value the input string
 */
export function validatePercentageFormat (value: string): boolean {
  const regex = /^[1-9][0-9]*$/
  return value === '' || regex.test(value)
}

/**
 * Check if the input value is a valid percentage number from "1" to "100"
 * @param value the input string
 */
export function validatePercentageValue (value: string): boolean {
  return value === '' || parseInt(value) <= 100
}

/**
 * Check if the percentage of shares and the percentage of votes are required.
 * If any of the Type of Control checkboxes are checked, at least one of the percentage fields is required.
 * @param formData the form data
 */
export function validateSharesAndVotes (formData: FormInputI): boolean {
  const controlOfShares = formData.controlOfShares
  return !Object.values(controlOfShares).some(Boolean) ||
    (formData.percentOfShares !== '' || formData.percentOfVotes !== '')
}

/**
 * Validate the Type of Control checkboxes. Return false when type of control is required but no selections are made.
 * Case 1: If the percentage of shares or votes is >= 25%, at least one of the Type of Control checkboxes is required.
 * Case 2: If the 'exercised in concert'is selected, at least one of the Type of Control checkboxes is required.
 * @param formData the form data
 */
export function validateControlOfShares (formData: FormInputI): boolean {
  const typeOfControlSelected: boolean = Object.values(formData.controlOfShares).slice(0, 3).some(Boolean)
  const inConcertControlSelected: boolean = formData.controlOfShares.inConcertControl
  const percentOfShares: number = parseInt(formData.percentOfShares)
  const percentOfVotes: number = parseInt(formData.percentOfVotes)

  if (percentOfShares >= 25 || percentOfVotes >= 25 || inConcertControlSelected) {
    return typeOfControlSelected
  } else {
    return true
  }
}

/**
 * Validate the Type of Director Control checkboxes.
 * If the 'exercised in concert' is selected, at least one of the Type of Director Control checkboxes is required.
 * @param formData the form data
 */
export function validateControlOfDirectors (formData: FormInputI): boolean {
  return Object.values(formData.controlOfDirectors).slice(0, 3).some(Boolean) ||
    !formData.controlOfDirectors.inConcertControl
}

/**
 * Check if the text in the 'Other Reason' textarea is less than or equal to 1000 characters
 * @param formData the form data
 */
export function validateOtherReason (formData: FormInputI): boolean {
  return formData.otherReason === undefined || formData.otherReason.length <= 1000
}

/**
 * Check if the birth date has been entered
 * @param formData the form data
 */
export function validateBirthDate (formData: FormInputI): boolean {
  return formData.birthDate !== null
}

/**
 * Check if the citizenship type has been selected
 * @param formData the form data
 */
export function validateCitizenship (formData: FormInputI): boolean {
  return [CitizenshipTypeE.CITIZEN, CitizenshipTypeE.PR, CitizenshipTypeE.OTHER].includes(formData.citizenshipCA)
}

/**
 * Validate other citizenship selections.
 * If 'Other citizenships' is selected, at least one country must be selected.
 * @param formData the form data
 */
export function validateOtherCountrySelection (formData: FormInputI): boolean {
  return formData.citizenshipCA !== CitizenshipTypeE.OTHER || formData.citizenshipsExCA.length > 0
}

/**
 * Check if one of the CRA Tax Number options has been selected
 * @param formData the form data
 */
export function validateTaxNumberInfo (formData: FormInputI): boolean {
  return formData.taxNumber !== undefined || formData.hasTaxNumber === false
}

/**
 * Check if one of the Tax Residency options has been selected
 * @param formData the form data
 */
export function validateTaxResidency (formData: FormInputI): boolean {
  return formData.taxResidency !== undefined
}

/**
 * Check if the text in the 'Unable to Obtain or Confirm Information' textarea is less than or equal to 4000 characters
 * @param formData the form data
 */
export function validateMissingInfoReasonTextarea (formData: FormInputI): boolean {
  return formData.missingInfoReason === undefined || formData.missingInfoReason.length <= 4000
}
