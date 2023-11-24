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
