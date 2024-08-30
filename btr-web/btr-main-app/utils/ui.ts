import { SiSchemaType } from '~/utils/si-schema/definitions'
import { InputFieldsE } from '~/enums/input-fields-e'

export const hasFieldChanged = (si: SiSchemaType, field: InputFieldsE) => {
  return si.ui.newOrUpdatedFields.includes(field)
}
