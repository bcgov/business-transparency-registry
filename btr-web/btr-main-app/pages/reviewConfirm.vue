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
    <div class="mt-10 p-10 bg-white rounded flex align-middle" data-cy="significantIndividualChangeFolioNumber">
      <label
        for="significantIndividualChangeFolioNumber"
        class="text-lg w-[190px] font-bold"
        data-cy="significantIndividualChangeFolioNumberLabel"
      >
        {{ $t('labels.folioNumber') }}
      </label>
      <div class="ml-8 flex-auto">
        <UForm
          :schema="schemaFolioNumber"
          :state="currentSIFiling"
        >
          <UFormGroup label="" name="folioNumber">
            <UInput
              id="significantIndividualChangeFolioNumber"
              v-bind="$attrs"
              v-model="currentSIFiling.folioNumber"
              name="significantIndividualChangeFolioNumber"
              class="my-0"
              type="text"
              variant="bcGov"
              :placeholder="`${$t('labels.folioNumber')} (${$t('labels.optional')})`"
              data-cy="significantIndividualChangeFolioNumberTextArea"
              @change="addBtrPayFees"
            />
          </UFormGroup>
        </UForm>
      </div>
    </div>
    <ReviewConfirmCertify
      v-model="currentSIFiling.certified"
      :name="account.userFullName.value"
      :date="currentSIFiling.effectiveDate"
      data-cy="certify-section"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import { validateFolioNumberCharacters } from '../../btr-common-components/utils'

const { t } = useI18n()

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)
const maxFolioNumberLength = 30

const schemaFolioNumber = z.object({
  folioNumber: z.union([
    z.string()
      .min(1)
      .max(maxFolioNumberLength, t('errors.validation.folioNumber.maxLengthExceeded'))
      .refine(validateFolioNumberCharacters, t('errors.validation.folioNumber.specialCharacter')),
    z.string().length(0)
  ])
    .optional()
})
const account = storeToRefs(useBcrosAccount())
</script>
