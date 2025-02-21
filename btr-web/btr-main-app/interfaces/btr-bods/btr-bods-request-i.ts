import { CompletingIndividualTypeE } from '~/enums/omit/completing-individual-type-e'
import { IndividualsAtRiskE } from '~/enums/omit/individuals-at-risk-e'
import { InfoToOmitE } from '~/enums/omit/info-to-omit-e'

export interface BtrBodsRequestI {
  fullName: string,
  birthdate: string,
  email: string,
  businessIdentifier: string,
  informationToOmit: [InfoToOmitE],
  individualAtRisk: [IndividualsAtRiskE],
  reasons: string,
  completingParty: CompletingIndividualTypeE,
  completingName: string,
  completingEmail: string
}

export interface BtrBodsRequestPutI {
  fullName?: string,
  birthdate?: string,
  email?: string,
  businessIdentifier?: string,
  informationToOmit?: [InfoToOmitE],
  individualAtRisk?: [IndividualsAtRiskE],
  reasons?: string,
  completingParty?: CompletingIndividualTypeE,
  completingName?: string,
  completingEmail?: string
}

export interface BtrBodsRequestGetI {
  id: number,
  uuid: string,
  fullName: string,
  birthdate: string,
  email: string,
  businessIdentifier: string,
  informationToOmit: [InfoToOmitE],
  individualAtRisk: [IndividualsAtRiskE],
  reasons: string,
  completingParty: CompletingIndividualTypeE,
  completingName: string,
  completingEmail: string,
  created_at: string,
  updated_at: string,
  status: string
}

export interface BtrBodsRequestQueryI {
  id?: number,
  uuid?: string,
  fullName?: string,
  birthdate?: string,
  email?: string,
  businessIdentifier?: string,
  informationToOmit?: [InfoToOmitE],
  individualAtRisk?: [IndividualsAtRiskE],
  reasons?: string,
  completingParty?: CompletingIndividualTypeE,
  completingName?: string,
  completingEmail?: string,
  created_at?: string,
  updated_at?: string,
  status?: string
}
