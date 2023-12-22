<template>
  <div>
    <h1 class="font-bold text-3xl" data-cy="page-header">
      {{ $t('pageHeadings.significantIndividualChange') }}
    </h1>
    <p class="mt-5" data-cy="page-info-text">
      {{ $t('texts.significantIndividualChange') }}
    </p>
    <div
      class="mt-10 p-10 bg-white rounded flex"
      :class="showSignificantDateError ? 'border-l-[3px] border-bcGovRed-500' : ''"
      data-cy="effective-date-select"
    >
      <label class="text-lg w-[190px]" :class="showSignificantDateError ? 'text-bcGovRed-500' : ''">
        {{ $t('labels.significantIndividualChangeDate') }}
      </label>
      <div class="ml-8 flex-auto">
        <BcrosInputsDateSelect
          :initial-date="currentSIFiling.effectiveDate ? dateStringToDate(currentSIFiling.effectiveDate) : undefined"
          :max-date="new Date()"
          :placeholder="$t('placeholders.dateSelect.significantIndividualChange')"
          :variant="showSignificantDateError ? 'error' : 'bcGov'"
          @selection="significantIndividualChangeDate($event)"
        />
      </div>
    </div>
    <UButton
      class="mt-10 px-4 py-3"
      color="primary"
      :disabled="expandNewSI"
      icon="i-mdi-account-plus"
      :label="$t('labels.addIndividual')"
      variant="outline"
      data-cy="add-new-btn"
      @click="expandNewSI = true"
    />
    <div
      v-if="expandNewSI"
      class="mt-10 p-10 bg-white rounded flex flex-row"
      :class="showAddIndividualError ? 'border-l-[3px] border-bcGovRed-500' : ''"
    >
      <label class="font-bold text-lg min-w-[190px]" :class="showAddIndividualError ? 'text-bcGovRed-500' : ''">
        {{ $t('labels.addIndividual') }}
      </label>
      <IndividualPersonAddNew
        class="ml-8"
        :start-date="currentSIFiling.effectiveDate"
        @cancel="expandNewSI = false"
        @add="addNewSI($event)"
      />
    </div>
    <IndividualPersonSummaryTable
      class="mt-10"
      :individuals="currentSIFiling.significantIndividuals || []"
      :edit="true"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)

const expandNewSI = ref(false)

// FUTURE: these will be triggered/replaced for something else in 18883
const showSignificantDateError = ref(false)
const showAddIndividualError = ref(false)

const significantIndividualChangeDate = (event: Date) => {
  currentSIFiling.value.effectiveDate = dateToString(event, 'YYYY-MM-DD')
  addBtrPayFees()
}

function addNewSI (si: SignificantIndividualI) {
  significantIndividuals.filingAddSI(si)
  expandNewSI.value = false
}

onBeforeMount(async () => {
  const identifier = useRoute().params.identifier as string
  // FUTURE: put in a loading page or something while this happens in case network is slow
  await useBcrosBusiness().loadBusiness(identifier)
  if (!currentSIFiling.value.businessIdentifier) {
    await significantIndividuals.filingInit(identifier)
  }
  currentSIFiling.value.certified = false
})
</script>
