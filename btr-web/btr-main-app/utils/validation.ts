import { type RefinementCtx, z } from 'zod'
import { PercentageRangeE } from '~/enums/percentage-range-e'
import type { CitizenshipSchemaType, SiNameSchemaType, SiSchemaType } from '~/utils/si-schema/definitions'

/**
 * Validate the Type of Director Control checkboxes.
 * If the in-concert or joint control is selected, at least one of the Type of Director Control checkboxes is required.
 * @param conrtol control of directors data
 */
export function validateControlOfDirectors (control: any, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t

  if ((control.inConcertControl || control.actingJointly) &&
    !control.directControl && !control.indirectControl && !control.significantInfluence) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.controlOfDirectors.required')
    })
  }

  return z.NEVER
}

/**
 * Check if one of the CRA Tax Number options has been selected. If a tax number is provided, it must be validated.
 * @param taxData the form data
 */
export function validateTaxNumberInfo (
  taxData: { taxNumber?: string, hasTaxNumber?: boolean },
  ctx: RefinementCtx
): never {
  const t = useNuxtApp().$i18n.t
  if (taxData.hasTaxNumber && taxData.taxNumber) {
    if (!checkSpecialCharacters(taxData.taxNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('errors.validation.taxNumber.specialCharacter'),
        path: ['taxNumber']
      })
      return z.NEVER
    }

    if (!checkTaxNumberLength(taxData.taxNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('errors.validation.taxNumber.invalidLength'),
        path: ['taxNumber']
      })
      return z.NEVER
    }

    if (!validateTaxNumber(taxData.taxNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('errors.validation.taxNumber.invalidNumber'),
        path: ['taxNumber']
      })
      return z.NEVER
    }
  } else if (taxData.hasTaxNumber !== false) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.taxNumber.required'),
      path: ['hasTaxNumber']
    })
    if (!taxData.taxNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('errors.validation.taxNumber.invalidLength'),
        path: ['taxNumber']
      })
    }
    return z.NEVER
  }
  return z.NEVER
}

/**
 * Check if one of the Tax Residency options has been selected
 * @param formData the form data
 */
export function validateTaxResidency (taxResidency: unknown): boolean {
  return taxResidency !== null && taxResidency !== undefined
}

/**
 * Check if the text in the 'Unable to Obtain or Confirm Information' textarea is less than or equal to 4000 characters
 * @param formData the form data
 */
export function validateMissingInfoTextarea (formData: FormInputI): boolean {
  return formData.missingInfoReason === undefined || formData.missingInfoReason.length <= 4000
}

/**
 * If the 'Unable to Obtain or Confirm Information' checkbox is checked, the textarea cannot be empty
 * @param formData the form data
 */
export function validateMissingInfoReason (formData: any): boolean {
  return formData.reason && formData.reason.trim() !== ''
}

export function validateControlSelectionForSharesAndVotes (control: any, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t
  const hasPercentage = control.percentage !== PercentageRangeE.NO_SELECTION
  const hasInConcertOrJointly: boolean = control.inConcertControl || control.actingJointly
  const hasControlType: boolean = (control.registeredOwner || control.beneficialOwner || control.indirectControl)

  if (!hasPercentage && !hasControlType && !hasInConcertOrJointly) {
    return z.NEVER
  }

  if (hasControlType && !hasPercentage) {
    ctx.addIssue({
      path: ['percentage'],
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.controlPercentage.empty')
    })
  }

  if (hasPercentage && !hasControlType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['controlType'],
      message: t('errors.validation.sharesAndVotes.required')
    })
  }

  if (hasInConcertOrJointly && !hasControlType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['controlType'],
      message: t('errors.validation.sharesAndVotes.required')
    })
  }

  if (hasInConcertOrJointly && !hasPercentage) {
    ctx.addIssue({
      path: ['percentage'],
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.controlPercentage.empty')
    })
  }
  return z.NEVER
}

export function validateNameSuperRefineAddForm (name: SiNameSchemaType, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t

  if (name.isNameChanged && !name.nameChangeReason) {
    ctx.addIssue({
      path: ['nameChangeReason'],
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.nameChangeReason.empty'),
      fatal: true
    })
  }

  // validate the fullname; skip the check if isYourOwnInformation is true
  if (!name.isYourOwnInformation) {
    if (name.fullName) {
      const normalizedFullName = normalizeName(name.fullName)
      if (normalizedFullName.length < 1) {
        ctx.addIssue({
          path: ['fullName'],
          code: z.ZodIssueCode.custom,
          message: t('errors.validation.fullName.empty'),
          fatal: true
        })
      } else if (normalizedFullName.length > 150) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fullName'],
          message: t('errors.validation.fullName.maxLengthExceeded'),
          fatal: true
        })
      }
    } else {
      ctx.addIssue({
        path: ['fullName'],
        code: z.ZodIssueCode.custom,
        message: t('errors.validation.fullName.empty'),
        fatal: true
      })
    }
  }

  // validate the preferred name if isUsePreferredName is true
  if (name.isUsePreferredName) {
    if (name.preferredName) {
      const normalizedPreferredName = normalizeName(name.preferredName)
      if (normalizedPreferredName.length < 1) {
        ctx.addIssue({
          path: ['preferredName'],
          code: z.ZodIssueCode.custom,
          message: t('errors.validation.preferredName.empty'),
          fatal: true
        })
      } else if (normalizedPreferredName.length > 150) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['preferredName'],
          message: t('errors.validation.preferredName.maxLengthExceeded'),
          fatal: true
        })
      }
    } else {
      ctx.addIssue({
        path: ['preferredName'],
        code: z.ZodIssueCode.custom,
        message: t('errors.validation.preferredName.empty'),
        fatal: true
      })
    }
  }

  return z.NEVER
}

export function validateNameSuperRefineOmitForm (nameVal: string, ctx: RefinementCtx): never {
  // name
  if (nameVal) {
    const normalizedFullName = normalizeName(nameVal)
    if (normalizedFullName.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        translate: 'errors.validation.fullName.empty',
        fatal: true
      })
      return z.NEVER
    }

    if (normalizedFullName.length > 150) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        translate: 'errors.validation.fullName.maxLengthExceeded',
        fatal: true
      })
      return z.NEVER
    }
  } else {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      translate: 'errors.validation.fullName.empty',
      fatal: true
    })
    return z.NEVER
  }
  return z.NEVER
}

/**
 * Validate the citizenship schema
 * Rule 1: One of the radio buttons must be selected (citizenships.citizenshipType cannot be undefined)
 * Rule 2: If the 'Other Citizenship' radio button is selected, at least one foreign country must be selected
 */
export function validateCitizenshipSuperRefine (citizenships: CitizenshipSchemaType, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t
  // no radio button selected
  if (!citizenships.citizenshipType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.citizenship.required'),
      fatal: true
    })
    return z.NEVER
  }

  // the 'Other Citizenship' radio button is checked but no country is selected
  const otherNationalities = citizenships.nationalities.filter(
    country => country.alpha_2 !== 'CA' && country.alpha_2 !== 'CA_PR'
  )
  if (otherNationalities.length === 0 && citizenships.citizenshipType === CitizenshipTypeE.OTHER) {
    ctx.addIssue({
      path: ['other'],
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.citizenship.other'),
      fatal: true
    })
    return z.NEVER
  }

  return z.NEVER
}

export function validatePhoneNumberSuperRefine (phoneNumber: PhoneSchemaType, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t
  if (!phoneNumber.number || phoneNumber.number.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.phoneNumber.required'),
      path: ['number'],
      fatal: true
    })
  }
  return z.NEVER
}

// Refine the entire SiSchema in the Edit form to apply all validation rules that are not covered by the schema itself.
export function validateEditFormSchemaSuperRefine (schema: SiSchemaType, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t

  // Control of Shares
  if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.CONTROL_OF_SHARES)) {
    ctx.path.push('controlOfShares')
    validateControlSelectionForSharesAndVotes(schema.controlOfShares, ctx)
    const shareControlPath = ctx.path.findIndex(v => v === 'controlOfShares')
    if (shareControlPath !== -1) {
      ctx.path.splice(shareControlPath, 1)
    }
  }
  // Control of Votes
  if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.CONTROL_OF_VOTES)) {
    ctx.path.push('controlOfVotes')
    validateControlSelectionForSharesAndVotes(schema.controlOfVotes, ctx)
    const voteControlPath = ctx.path.findIndex(v => v === 'controlOfVotes')
    if (voteControlPath !== -1) {
      ctx.path.splice(voteControlPath, 1)
    }
  }

  // Control of Directors
  if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.CONTROL_OF_DIRECTORS)) {
    ctx.path.push('controlOfDirectors')
    validateControlOfDirectors(schema.controlOfDirectors, ctx)
    const directorsControlPath = ctx.path.findIndex(v => v === 'controlOfDirectors')
    if (directorsControlPath !== -1) {
      ctx.path.splice(directorsControlPath, 1)
    }
  }

  // Effective dates
  if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.EFFECTIVE_DATES)) {
    if ((!schema.effectiveDates || schema.effectiveDates.length === 0) && !schema.couldNotProvideMissingInfo) {
      // TO-DO: consolidate validation rules for effectiveDates
      console.error('effectiveDates is empty')
    }
  }

  // Email
  if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.EMAIL)) {
    if (!schema.email || schema.email.trim() === '') {
      if (!schema.couldNotProvideMissingInfo) {
        // when email is empty but 'missing info' checkbox is not selected
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: t('errors.validation.email.empty')
        })
      }
    } else if (!validateEmailRfc6532Regex(schema.email)) {
      // when email is not empty, validate it
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: t('errors.validation.email.invalid')
      })
    }
  }

  // Some fields are required unless the 'missing info' checkbox is selected
  if (!schema.couldNotProvideMissingInfo) {
    // Physical address: country, line1, city, region, postalCode
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.ADDRESS_COUNTRY)) {
      if (!schema.address || !schema.address.country || !schema.address.country.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address', 'country'],
          message: t('errors.validation.address.country')
        })
      }
    }
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.ADDRESS_LINE1)) {
      if (!schema.address || !schema.address.line1 || schema.address.line1.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address', 'line1'],
          message: t('errors.validation.address.line1')
        })
      }
    }
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.ADDRESS_CITY)) {
      if (!schema.address || !schema.address.city || schema.address.city.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address', 'city'],
          message: t('errors.validation.address.city')
        })
      }
    }
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.ADDRESS_REGION)) {
      if (!schema.address || !schema.address.region || schema.address.region.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address', 'region'],
          message: t('errors.validation.address.region')
        })
      }
    }
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.ADDRESS_POSTAL_CODE)) {
      if (!schema.address || !schema.address.postalCode || schema.address.postalCode.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address', 'postalCode'],
          message: t('errors.validation.address.postalCode')
        })
      }
    }

    // Mailing address: country, line1, city, region, postalCode
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.MAILING_ADDRESS_COUNTRY)) {
      if (!schema.mailingAddress.address ||
        !schema.mailingAddress.address.country ||
        !schema.mailingAddress.address.country.name
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mailingAddress', 'address', 'country'],
          message: t('errors.validation.address.country')
        })
      }
    }
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.MAILING_ADDRESS_LINE1)) {
      if (!schema.mailingAddress.address ||
        !schema.mailingAddress.address.line1 ||
        schema.mailingAddress.address.line1.trim() === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mailingAddress', 'address', 'line1'],
          message: t('errors.validation.address.line1')
        })
      }
    }
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.MAILING_ADDRESS_CITY)) {
      if (!schema.mailingAddress.address ||
        !schema.mailingAddress.address.city ||
        schema.mailingAddress.address.city.trim() === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mailingAddress', 'address', 'city'],
          message: t('errors.validation.address.city')
        })
      }
    }
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.MAILING_ADDRESS_REGION)) {
      if (!schema.mailingAddress.address ||
        !schema.mailingAddress.address.region ||
        schema.mailingAddress.address.region.trim() === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mailingAddress', 'address', 'region'],
          message: t('errors.validation.address.region')
        })
      }
    }
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.MAILING_ADDRESS_POSTAL_CODE)) {
      if (!schema.mailingAddress.address ||
        !schema.mailingAddress.address.postalCode ||
        schema.mailingAddress.address.postalCode.trim() === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mailingAddress', 'address', 'postalCode'],
          message: t('errors.validation.address.postalCode')
        })
      }
    }

    // birthdate check
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.BIRTH_DATE)) {
      if (!schema.birthDate || schema.birthDate.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['birthDate'],
          message: t('errors.validation.birthDate.required')
        })
      }
    }
  }

  // citizenship
  if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.CITIZENSHIPS)) {
    ctx.path.push('citizenships')
    validateCitizenshipSuperRefine(schema.citizenships, ctx)
    const citizenshipPath = ctx.path.findIndex(v => v === 'citizenships')
    if (citizenshipPath !== -1) {
      ctx.path.splice(citizenshipPath, 1)
    }
  }

  // tax number
  if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.TAX_NUMBER) ||
      schema.ui.newOrUpdatedFields.includes(InputFieldsE.TAX)) {
    ctx.path.push('tax')
    validateTaxNumberInfo(schema.tax, ctx)
    const taxPath = ctx.path.findIndex(v => v === 'tax')
    if (taxPath !== -1) {
      ctx.path.splice(taxPath, 1)
    }
  }

  // tax residency
  return z.NEVER
}
