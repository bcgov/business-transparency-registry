/**
 * Check if the input value is a valid percentage number from "1" to "100"
 * Empty string is considered valid
 * @param value the input string
 */
export function validatePercentage (value: string): boolean {
  if (value === '') {
    return true
  }
  const regex = /^[0-9]*$/
  return regex.test(value) && parseInt(value) >= 1 && parseInt(value) <= 100
}
