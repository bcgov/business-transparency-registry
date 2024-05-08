import { z } from 'zod'
import { FilingSchemaBase } from '~/interfaces/significant-individual-filing-i'
import { getFolioValidator } from '~/utils/validators'

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
  const FilingSchema = z.discriminatedUnion(
    'noSignificantIndividualsExist',
    [
      FilingSchemaBase.extend({
        noSignificantIndividualsExist: z.literal(true),
        significantIndividuals: z.object({}).array().max(0),
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
  const result = FilingSchema.safeParse(significantIndividuals.currentSIFiling)
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.log('<> remove this line when validation errors are displayed on page', result.error.issues)
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
