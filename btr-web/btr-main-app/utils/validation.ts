import { RefinementCtx, z } from 'zod'
import { PercentageRangeE } from '~/enums/percentage-range-e'

/**
 * Check if the percentage of shares and the percentage of votes are required.
 * If any of the Type of Control checkboxes are checked, at least one of the percentage fields is required.
 * @param formData the form data
 */
export function validateSharesAndVotes (formData: FormInputI): boolean {
  const controlOfShares = formData.controlOfShares

  return !Object.values(controlOfShares).some(Boolean) || (
    formData.percentOfShares !== PercentageRangeE.NO_SELECTION ||
    formData.percentOfVotes !== PercentageRangeE.NO_SELECTION
  )
}

/**
 * Validate the Type of Control checkboxes. Return false when type of control is required but no selections are made.
 * Case 1: If the percentage of shares or votes is >= 25%, at least one of the Type of Control checkboxes is required.
 * Case 2: If the 'exercised in concert'is selected, at least one of the Type of Control checkboxes is required.
 * @param formData the form data
 */
export function validateControlOfShares (formData: FormInputI): boolean {
  const typeOfControlSelected: boolean = Object.values(formData.controlOfShares).slice(0, 3).some(Boolean)
  const inConcertControlSelected: boolean = formData.controlOfShares.inConcertControl
  const percentagesOver25: PercentageRangeE[] = [
    PercentageRangeE.AT_LEAST_25_TO_50, PercentageRangeE.MORE_THAN_50_TO_75, PercentageRangeE.MORE_THAN_75
  ]

  if (
    percentagesOver25.includes(formData.percentOfShares) ||
    percentagesOver25.includes(formData.percentOfVotes) ||
    inConcertControlSelected
  ) {
    return typeOfControlSelected
  } else {
    return true
  }
}

/**
 * Validate the Type of Director Control checkboxes.
 * If the 'exercised in concert' is selected, at least one of the Type of Director Control checkboxes is required.
 * @param formData the form data
 */
export function validateControlOfDirectors (formData: any): boolean {
  console.log(">>>>", formData)
  return formData.directControl ||
    formData.indirectControl ||
    formData.significantInfluence ||
    !formData.inConcertControl
}

/**
 * Check if the text in the 'Other Reasons' textarea is less than or equal to 1000 characters
 * @param formData the form data
 */
export function validateOtherReasons (formData: FormInputI): boolean {
  return formData.otherReasons === undefined || formData.otherReasons.length <= 1000
}

/**
 * Check if the birth date has been entered
 * @param formData the form data
 */
export function validateBirthDate (birthDate: any): boolean {
  return !!birthDate
}

/**
 * Check if one of the CRA Tax Number options has been selected
 * @param formData the form data
 */
export function validateTaxNumberInfo (formData: any): boolean {
  console.log("~~~~~~~~~~~~", formData)
  return formData.hasTaxNumber === false || formData.taxNumber !== null || formData.taxNumber !== ''
}

/**
 * Check if one of the Tax Residency options has been selected
 * @param formData the form data
 */
export function validateTaxResidency (formData: FormInputI): boolean {
  return formData.taxResidency !== undefined
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
  return !formData.couldNotProvideSomeInfo || formData.reason.trim() !== ''
}

export function validateControlSelectionForSharesAndVotes (form: any, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t
  const hasPercentage = form.percentage !== PercentageRangeE.NO_SELECTION
  const hasInConcert: boolean = form.inConcertControl
  const hasControlType: boolean = (form.registeredOwner || form.beneficialOwner || form.indirectControl)

  if (!hasPercentage && !hasControlType && !hasInConcert) {
    return z.NEVER
  }

  if (hasControlType && !hasPercentage) {
    ctx.addIssue({
      path: ['percentage'],
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.controlPercentage.empty')
    })
  }

  if ((hasPercentage && !hasControlType) || (hasInConcert && !hasControlType)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.sharesAndVotes.required')
    })
  }

  return z.NEVER
}

export function validateFullNameSuperRefine (form: any, ctx: RefinementCtx): never {
  const t = useNuxtApp().$i18n.t
  if (form.isYourOwnInformation) {
    return z.NEVER
  }

  if (form.fullName) {
    const normalizedFullName = normalizeName(form.fullName)
    if (normalizedFullName.length < 1) {
      ctx.addIssue({
        path: ['fullName'],
        code: z.ZodIssueCode.custom,
        message: t('errors.validation.fullName.empty'),
        fatal: true
      })
      return z.NEVER
    }

    if (normalizedFullName.length > 150) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fullName'],
        message: t('errors.validation.fullName.maxLengthExceeded'),
        fatal: true
      })
      return z.NEVER
    }

    if (!validateNameCharacters(normalizedFullName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fullName'],
        message: t('errors.validation.fullName.specialCharacter'),
        fatal: true
      })
      return z.NEVER
    }
  } else {
    ctx.addIssue({
      path: ['fullName'],
      code: z.ZodIssueCode.custom,
      message: t('errors.validation.fullName.empty'),
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
export function validateCitizenshipSuperRefine (citizenships: BtrCountryI[], ctx: RefinementCtx): boolean {
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
