import { z } from 'zod'

/** Go to the review/confirm page for the current filing
 * - assumes there is a currentSIFiling
 * - checks if there is an open SI before navigating
 */
export function reviewConfirm () {
  const significantIndividuals = useSignificantIndividuals()
  // FUTURE: change to check if SI being edited? Design needs to be flushed out. Temporary log filing data for devs.
  if (!significantIndividuals.currentSIFiling) {
    return
  }
  // NOTE: filing validation only needs to happen before submission -- reviewConfirm can still have validation issues
  // navigate to reviewConfirm page
  useRouter().push({
    name: RouteNameE.REVIEW_CONFIRM,
    params: { identifier: significantIndividuals.currentSIFiling.businessIdentifier }
  })
}

export async function siChangeSubmit () {
  const significantIndividuals = useSignificantIndividuals()
  const filingSchema = z.object({
    businessIdentifier: z.string(),
    significantIndividuals: z.object({}).array().min(1),
    certified: z.boolean().refine(val => val),
    effectiveDate: z.string(),
    folioNumber: getFolioValidator()
  })
  const isValid = filingSchema.safeParse(significantIndividuals.currentSIFiling)
  console.log(significantIndividuals.currentSIFiling)
  console.log(filingSchema)
  console.log(isValid)
  if (!isValid.success) {
    significantIndividuals.showErrors = true
  } else {
    await significantIndividuals.filingSubmit()
    const businessIdentifier = significantIndividuals.currentSIFiling.businessIdentifier
    significantIndividuals.reset()
    useRouter().push({
      name: RouteNameE.BEN_OWNR_CHNG,
      params: { identifier: businessIdentifier }
    })
  }
}
