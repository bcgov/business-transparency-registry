export { validateEmailRfc6532Regex, validateNameCharacters, normalizeName } from './validation/form_inputs'

// canada post retrieve api
export type { CanadaPostRetrieveItemI, CanadaPostApiRetrieveParamsI } from './canadaPostAddressApi/retrieve-v2.11'
export { retrieveAddress } from './canadaPostAddressApi/retrieve-v2.11'

// canada post find api
export type { CanadaPostApiFindResponseItemI, CanadaPostApiFindParamsI } from './canadaPostAddressApi/find-v2.10'
export { findAddress } from './canadaPostAddressApi/find-v2.10'
