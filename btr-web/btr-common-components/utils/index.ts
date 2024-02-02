export {
  validateEmailRfc6532Regex, validateNameCharacters, validatePreferredName, normalizeName,
  checkSpecialCharacters, checkTaxNumberLength, validateTaxNumber, validateFolioNumberCharacters
} from './validation/form_inputs'

export {
  getAddressCountryValidator, getAddressLine1Validator, getAddressCityValidator,
  getAddressRegionValidator, getAddressPostalCodeValidator
} from './validation/validators'

// canada post retrieve api
export type { CanadaPostRetrieveItemI, CanadaPostApiRetrieveParamsI } from './canadaPostAddressApi/retrieve-v2.11'
export { retrieveAddress } from './canadaPostAddressApi/retrieve-v2.11'

// canada post find api
export type { CanadaPostApiFindResponseItemI, CanadaPostApiFindParamsI } from './canadaPostAddressApi/find-v2.10'
export { findAddress } from './canadaPostAddressApi/find-v2.10'
