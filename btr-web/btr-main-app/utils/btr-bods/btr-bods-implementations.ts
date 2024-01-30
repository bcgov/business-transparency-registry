import { BodsPublicationDetailsI, BodsPublisherI, BodsSourceI } from '~/interfaces/btr-bods/components-i'
import { BodsSourceTypeE } from '~/enums/btr-bods-e'

const BCROS_URL = 'https://www.bcregistry.gov.bc.ca/'
const BCROS_NAME = 'BCROS - BC Registries and Online Services'

export const BtrBodsAgent = {
  BCROS: {
    name: BCROS_NAME,
    uri: BCROS_URL
  }
}

const BcrosAsBodsSourceOfficialVerified: BodsSourceI = {
  type: [BodsSourceTypeE.OFFICIAL_REGISTER, BodsSourceTypeE.VERIFIED],
  // url: 'https://www.bcregistry.gov.bc.ca/' // todo: here be link to info how this information is generated
  assertedBy: [BtrBodsAgent.BCROS]
}

const SelfDeclarationSource: BodsSourceI = {
  type: [BodsSourceTypeE.SELF_DECLARATION],
  // url: 'https://www.bcregistry.gov.bc.ca/' // todo: here be link to info how this information is generated
  assertedBy: []
}

export const BtrBodsSources = {
  OFFICIAL_AND_VERIFIED: BcrosAsBodsSourceOfficialVerified,
  SELF_DECLARATION: SelfDeclarationSource
}

const BcrosAsBodsPublisher: BodsPublisherI = {
  name: BCROS_NAME,
  url: BCROS_URL
}

export const BtrBodsPublishers = {
  BCROS: BcrosAsBodsPublisher
}

export const BtrBodsBcrosPublicationDetails = (): BodsPublicationDetailsI => {
  const today = new Date()
  const isoDateString = today.toISOString().substring(0, 10)

  return {
    bodsVersion: '0.3',
    publicationDate: isoDateString,
    publisher: BcrosAsBodsPublisher
  }
}

export const BtrSourceDescriptionProvidedByBtrGovBC: string = 'Using Gov BC - BTR - Web UI'
