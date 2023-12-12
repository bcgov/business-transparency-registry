<template>
  <div>
    <h1 class="font-bold text-3xl" data-cy="page-header">
      {{ $t('pageHeadings.significantIndividualChange') }}
    </h1>
    <h2 class="font-bold text-lg mt-5" data-cy="review-confirm-section-heading">
      {{ $t('sectionHeadings.reviewConfirm') }}
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
      <div class="bg-bcGovBlue-50 flex p-5 rounded-t-[5px]">
        <UIcon class="text-bcGovBlue-400 text-2xl" name="i-mdi-account-star" />
        <h3 class="font-bold ml-2" data-cy="summary-table-header">
          {{ $t('labels.significantIndividuals') }}
        </h3>
      </div>
      <IndividualPersonSummaryTable :individuals="currentSIFiling.significantIndividuals || []" />
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
    <ReviewConfirmCertify
      v-model="currentSIFiling.certified"
      :name="userFullName"
      data-cy="certify-section"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { z } from 'zod'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)

const maxFolioNumberLength = 30

const schemaFolioNumber = z.object({
  folioNumber: getFolioValidator()
})

onBeforeMount(() => {
  currentSIFiling.value.certified = false
})

const { userFullName } = storeToRefs(useBcrosAccount())
</script>
