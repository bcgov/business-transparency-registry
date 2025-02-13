<template>
  <div class="flex flex-col gap-5" data-cy="review-confirm">
    <BtrPageTitle />

    <h2 class="font-bold text-lg" data-cy="review-confirm-section-heading">
      {{ $t('sectionTitles.reviewConfirm') }}
    </h2>
    <p data-cy="page-info-text">
      {{ $t('texts.reviewConfirm') }}
    </p>

    <BcrosAlertsMessage :flavour="AlertsFlavourE.INFO">
      <p class="py-2">
        <BcrosI18HelperBold translation-path="texts.reviewConfirmAlert" />
      </p>
    </BcrosAlertsMessage>

    <div class="bg-white rounded-[5px]">
      <IndividualPersonSummaryTable
        :individuals="allSIs || []"
        :edit="false"
        :accordion-expanded="true"
      />
    </div>

    <h2 class="font-bold text-lg" data-cy="certify-section-label">
      {{ $t('labels.authorize') }}
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

const reValidateConfirmReviewPage = () => {
  const { validateConfirmReviewPage } = useConfirmReviewStore()

  const result = validateConfirmReviewPage()
  if (!result.success) {
    confirmReviewPageErrors.value = result.error.issues
  } else {
    confirmReviewPageErrors.value = []
  }
}

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
