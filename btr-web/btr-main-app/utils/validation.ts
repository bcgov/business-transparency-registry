import { RefinementCtx, z } from 'zod'
import { PercentageRangeE } from '~/enums/percentage-range-e'

/**
 * Validate the Type of Director Control checkboxes.
 * If the in-concert or joint control is selected, at least one of the Type of Director Control checkboxes is required.
 * @param formData the form data
 */
export function validateControlOfDirectors (formData: any): boolean {
  return formData.directControl ||
    formData.indirectControl ||
    formData.significantInfluence ||
    (!formData.inConcertControl && !formData.actingJointly)
}

/**
 * Check if one of the CRA Tax Number options has been selected
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

export function validateControlSelectionForSharesAndVotes (form: any, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t
  const hasPercentage = form.percentage !== PercentageRangeE.NO_SELECTION
  const hasInConcertOrJointly: boolean = form.inConcertControl || form.actingJointly
  const hasControlType: boolean = (form.registeredOwner || form.beneficialOwner || form.indirectControl)

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

export function validateNameSuperRefineAddForm (form: any, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t

  // validate the fullname; skip the check if isYourOwnInformation is true
  if (!form.isYourOwnInformation) {
    if (form.fullName) {
      const normalizedFullName = normalizeName(form.fullName)
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
  if (form.isUsePreferredName) {
    if (form.preferredName) {
      const normalizedPreferredName = normalizeName(form.preferredName)
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
 * Validate the citizenship selection:
 * Rule 1: at least one country has been selected for citizenship
 * Rule 2: a person cannot be a Canadian citizen and permenant resident at the same time
 * @param formData the form data
 */
export function validateCitizenshipSuperRefine (citizenships: BtrCountryI[], ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t
  if (citizenships.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.citizenship.required'),
      fatal: true
    })
    return z.NEVER
  }
  const isCanadianCitizen: boolean = citizenships.filter(country => country.alpha_2 === 'CA').length > 0
  const isCanadianPR: boolean = citizenships.filter(country => country.alpha_2 === 'CA_PR').length > 0
  if (isCanadianCitizen && isCanadianPR) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.citizenship.prCitizen'),
      fatal: true
    })
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
