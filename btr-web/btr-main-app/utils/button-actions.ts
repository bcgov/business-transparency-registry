import { RefinementCtx, z } from 'zod'
import { FilingSchemaBase } from '~/interfaces/significant-individual-filing-i'
import { FilingActionE } from '#imports'

const _getSIsToSubmit = () => {
  const { allEditableSIs } = storeToRefs(useSignificantIndividuals())
  const sisToSubmit = []
  for (const si of allEditableSIs.value) {
    sisToSubmit.push(toRaw(si))
  }
  return sisToSubmit
}

/** Go to the review/confirm page for the current filing
 * - assumes there is a currentSIFiling
 * - checks if there is an open SI before navigating
 */
export function reviewConfirm () {
  const { currentSIFiling, filingErrors } = storeToRefs(useSignificantIndividuals())
  filingErrors.value = []
  // FUTURE: change to check if SI being edited? Design needs to be flushed out. Temporary log filing data for devs.
  if (!currentSIFiling.value) {
    return
  }
  const filingSchema =
    FilingSchemaBase
      .extend({ certified: z.boolean() })
      .superRefine((schema, ctx: RefinementCtx) => {
        const t = useNuxtApp().$i18n.t
        const updated = !!(schema.significantIndividuals.find(si => si.ui?.newOrUpdatedFields?.length > 0) ||
          schema.significantIndividuals.find(si => si.ui?.actions?.length > 0))

        if ((schema.submissionType === SubmissionTypeE.INITIAL_FILING || schema.noPreviousFiling) &&
          !schema.noSignificantIndividualsExist &&
          !schema.significantIndividuals?.find(si => si.ui?.actions?.includes(FilingActionE.ADD))
        ) {
          // (Initial Filing or Initial Annual Filing) + no new SI added + noSI checkbox not checked
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.validation.report.noSIsOrAddSI'),
            path: ['incompleteFiling']
          })
        }
        if (schema.submissionType === SubmissionTypeE.CHANGE_FILING && !updated) {
          // Change Filing + no new SI added + no SI updated
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.validation.report.addOrUpdateSIs'),
            path: ['incompleteFiling']
          })
        }

        if ((schema.submissionType === SubmissionTypeE.ANNUAL_FILING && !schema.noPreviousFiling) &&
          !schema.annualFilingNoChanges && !updated
        ) {
          // Subsequent Annual Filing + noChange checkbox not checked + no new SI + no SI updated
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('errors.validation.report.makeSelectionOrEditPage'),
            path: ['incompleteFiling']
          })
        }
        // todo: add year verification; ticket: #25669
      })

  currentSIFiling.value.significantIndividuals = _getSIsToSubmit()

  const result = filingSchema.safeParse(toRaw(currentSIFiling.value))
  if (result?.error?.issues.length > 0) {
    filingErrors.value = filingErrors.value.concat(result.error.issues)
    // TODO: shouldn't this still go to review page? See comment below
    return
  }

  // NOTE: filing validation only needs to happen before submission -- reviewConfirm can still have validation issues
  // navigate to reviewConfirm page
  useRouter().push({
    name: RouteNameE.REVIEW_CONFIRM,
    params: { identifier: currentSIFiling.value.businessIdentifier }
  })
}

export async function siChangeSubmit () {
  const { validateConfirmReviewPage } = useConfirmReviewStore()
  const { confirmReviewPageErrors } = storeToRefs(useConfirmReviewStore())
  const significantIndividuals = useSignificantIndividuals()
  // TODO: below is not doing anything?
  // 'currentSIFiling' gets overwritten within 'validateConfirmReviewPage' and 'filingSubmit'
  significantIndividuals.currentSIFiling.significantIndividuals = _getSIsToSubmit()

  const result = validateConfirmReviewPage()
  if (!result.success) {
    confirmReviewPageErrors.value = result.error.issues
    significantIndividuals.showErrors = true
  } else {
    await significantIndividuals.filingSubmit()
  }
}

export function getOmitSubmitButton () {
  const t = useNuxtApp().$i18n.t
  const omitIndividual = useOmitIndividual()
  return {
    action: omitIndividual.submitOmit,
    class: 'font-bold',
    icon: '',
    label: t('general.submit'),
    trailing: true
  }
}

export function getStaffReviewSubmitButton () {
  const t = useNuxtApp().$i18n.t
  const omitIndividual = useOmitIndividual()
  return {
    action: omitIndividual.submitStaffReview,
    class: 'font-bold',
    icon: '',
    label: t('general.submitArrow'),
    trailing: true
  }
}
