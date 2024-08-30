import { v4 as UUIDv4 } from 'uuid'

const tempContainer: { [key: string]: any } = {}

export const getRandomUuid: () => string = () => UUIDv4()

export const setFieldOriginalValue = (fieldUUid: string, fieldValue: any) => {
  tempContainer[fieldUUid] = fieldValue as any
}

// returns undefined if value not set
export const getFieldOriginalValue = (fieldUUid: string): any => {
  return tempContainer[fieldUUid]
}

import { SiSchemaType } from '~/utils/si-schema/definitions'
import { InputFieldsE } from '~/enums/input-fields-e'

export const hasFieldChanged = (si: SiSchemaType, field: InputFieldsE) => {
  return si.ui.newOrUpdatedFields.includes(field)
}
