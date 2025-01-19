import { z } from 'zod'
import { FilingSchemaBase } from '~/interfaces/significant-individual-filing-i'
import { getFolioValidator } from '~/utils/validators'

/** Go to the review/confirm page for the current filing
 * - assumes there is a currentSIFiling
 * - checks if there is an open SI before navigating
 */
export function reviewConfirm () {
  const { currentSIFiling } = storeToRefs(useSignificantIndividuals())
  // FUTURE: change to check if SI being edited? Design needs to be flushed out. Temporary log filing data for devs.
  if (!currentSIFiling.value) {
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
  significantIndividuals.currentSIFiling.significantIndividuals = significantIndividuals.allActiveSIs

  const result = validateConfirmReviewPage()
  if (!result.success) {
    confirmReviewPageErrors.value = result.error.issues
    significantIndividuals.showErrors = true
  } else {
    await significantIndividuals.filingSubmit()
    const businessIdentifier = useBcrosBusiness().currentBusinessIdentifier
    significantIndividuals.reset()
    useRouter().push({
      name: RouteNameE.BEN_OWNR_CHNG,
      params: { identifier: businessIdentifier }
    })
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
