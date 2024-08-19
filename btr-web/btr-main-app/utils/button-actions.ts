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
  if (!currentSIFiling) {
    return
  }
  // NOTE: filing validation only needs to happen before submission -- reviewConfirm can still have validation issues
  // navigate to reviewConfirm page
  useRouter().push({
    name: RouteNameE.REVIEW_CONFIRM,
    params: { identifier: currentSIFiling.businessIdentifier }
  })
}

export async function siChangeSubmit () {
  const FilingSchema = z.discriminatedUnion(
    'noSignificantIndividualsExist',
    [
      FilingSchemaBase.extend({
        noSignificantIndividualsExist: z.literal(true),
        significantIndividuals: z.object({}).array(),
        folioNumber: getFolioValidator()
      }),
      FilingSchemaBase.extend({
        noSignificantIndividualsExist: z.literal(false),
        significantIndividuals: z.object({}).array().nonempty(),
        folioNumber: getFolioValidator()
      })
    ]
  )

  const significantIndividuals = useSignificantIndividuals()
  significantIndividuals.currentSIFiling.significantIndividuals = significantIndividuals.allActiveSIs
  const result = FilingSchema.safeParse(significantIndividuals.currentSIFiling)
  if (!result.success) {
    console.warn('<> remove this line when validation errors are displayed on page', result.error.issues)
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
