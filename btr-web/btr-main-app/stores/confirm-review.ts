import { z } from 'zod'
import { defineStore } from 'pinia'
import { FilingSchemaBase } from '~/interfaces/significant-individual-filing-i'
import { getFolioValidator } from '~/utils/validators'

export const useConfirmReviewStore = defineStore('confirmOrReview', () => {
  // list of zod errors
  const confirmReviewPageErrors: Ref<z.ZodIssue[]> = ref([])

  const validateConfirmReviewPage = () => {
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
    return result
  }

  return {
    confirmReviewPageErrors,
    validateConfirmReviewPage
  }
})
