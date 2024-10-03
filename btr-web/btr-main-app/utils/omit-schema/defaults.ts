import { v4 as UUIDv4 } from 'uuid'
import { OmitSchemaType, CompletingPartySchemaType, OmitObscureSchemaType } from '~/utils/omit-schema/definitions'
import { CompletingIndividualTypeE } from '~/enums/omit/completing-individual-type-e'

export function getDefaultInputFormCompletingParty (): CompletingPartySchemaType {
  return {
    name: '',
    email: '',
    certify: false,
    invididualType: CompletingIndividualTypeE.SI
  }
}

export function getDefaultInputFormOmitObscure (): OmitObscureSchemaType {
  return {
    infoToOmit: [],
    individualsAtRisk: [],
    reasons: ''
  }
}

export function getDefaultInputFormOmit (): OmitSchemaType {
  return {
    uuid: UUIDv4(),
    completingParty: getDefaultInputFormCompletingParty(),
    omitObscure: getDefaultInputFormOmitObscure()
  }
}
