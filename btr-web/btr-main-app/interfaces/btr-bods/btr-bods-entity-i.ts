import { BodsEntityTypesE, BodsStatementTypeE } from '~/enums/btr-bods-e'
import type { BodsIdentifierI, BodsPublicationDetailsI, BodsSourceI } from '~/interfaces/btr-bods/components-i'

export interface BtrBodsEntityI {
  statementID: string,
  statementType: BodsStatementTypeE, // should always be BodsStatementTypeE.ENTITY_STATEMENT => entityStatement
  statementDate?: string,
  isComponent: boolean, // right now we only support false
  entityType: BodsEntityTypesE, // for now it will always be BodsEntityTypesE.LEGAL_ENTITY
  name?: string,
  identifiers?: BodsIdentifierI[],
  publicationDetails: BodsPublicationDetailsI,
  source?: BodsSourceI
}
