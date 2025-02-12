<template>
  <div data-cy="review-confirm">
    <h1 class="font-bold text-3xl" data-cy="page-header">
      {{ $t('pageHeadings.significantIndividualChange') }}
    </h1>
    <h2 class="font-bold text-lg mt-5" data-cy="review-confirm-section-heading">
      {{ $t('sectionTitles.reviewConfirm') }}
    </h2>
    <p class="mt-5" data-cy="page-info-text">
      {{ $t('texts.reviewConfirm') }}
    </p>
    <div class="mt-10 p-10 bg-white rounded flex" data-cy="effective-date-select">
      <label class="font-bold text-lg w-[200px]">{{ $t('labels.significantIndividualChangeDate') }}</label>
      <div class="ml-10 text-lg">
        {{ currentSIFiling.effectiveDate }}
      </div>
    </div>
    <div class="bg-white rounded-[5px] mt-10">
      <IndividualPersonSummaryTable
        :individuals="allSIs || []"
        :edit="false"
      />
    </div>
    <h2 class="font-bold text-lg mt-16" data-cy="review-confirm-section-heading">
      1. {{ $t('texts.folioNumber.reviewAndConfirm.title') }}
    </h2>
    <p class="mt-5 text-justify" data-cy="folioNumber-reviewAndConfirm-description-text">
      {{ $t('texts.folioNumber.reviewAndConfirm.description') }}
    </p>
    <UForm
      :schema="schemaFolioNumber"
      :state="currentSIFiling"
    >
      <BtrFolioNumber
        v-model="currentSIFiling.folioNumber"
        :max-folio-number-length="maxFolioNumberLength"
        @change="addBtrPayFees"
      />
    </UForm>
    <h2 class="font-bold text-lg mt-16" data-cy="certify-section-label">
      2. {{ $t('labels.certifySection') }}
    </h2>
    <BcrosSection
      :show-section-has-errors="certifiedErrors.length > 0"
      :section-title="$t('texts.certify.certification')"
      rounded-bot
      :border="false"
    >
      <div class="flex-col w-full">
        <UFormGroup name="certified">
          <ReviewConfirmCertify
            v-model="currentSIFiling.certified"
            :has-error="certifiedErrors.length > 0"
            :name="userFullName"
            data-cy="certify-section"
            :show-label="false"
            @update:model-value="reValidateConfirmReviewPage"
          />
        </UFormGroup>
      </div>
    </BcrosSection>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import { SiSchemaType } from '~/utils/si-schema/definitions'

const { confirmReviewPageErrors } = storeToRefs(useConfirmReviewStore())

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling, allSIs }: {
  currentSIFiling: SignificantIndividualFilingI,
  allSIs: SiSchemaType[]
} = storeToRefs(significantIndividuals)

const maxFolioNumberLength = 30

const reValidateConfirmReviewPage = () => {
  const { validateConfirmReviewPage } = useConfirmReviewStore()

  const result = validateConfirmReviewPage()
  if (!result.success) {
    confirmReviewPageErrors.value = result.error.issues
  } else {
    confirmReviewPageErrors.value = []
  }
}

const schemaFolioNumber = z.object({
  folioNumber: getFolioValidator()
})

onBeforeMount(() => {
  currentSIFiling.value.certified = false
})

const certifiedErrors = computed(
  () => {
    const certErrors = confirmReviewPageErrors.value.filter((err: z.ZodIssue) => err.path.includes('certified'))
    return certErrors || []
  }
)

const { userFullName } = storeToRefs(useBcrosAccount())
</script>
