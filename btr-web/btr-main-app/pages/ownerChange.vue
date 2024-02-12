<template>
  <div data-cy="owner-change">
    <h1 class="font-bold text-3xl" data-cy="page-header">
      {{ $t('pageHeadings.significantIndividualChange') }}
    </h1>
    <p class="mt-5" data-cy="page-info-text">
      {{ $t('texts.significantIndividualChange') }}
    </p>
    <div
      class="mt-10 p-10 pb-3 bg-white rounded flex"
      :class="showSignificantDateError ? 'border-l-[3px] border-red-500' : ''"
      data-cy="effective-date-select"
    >
      <label class="text-lg w-[190px]" :class="showSignificantDateError ? 'text-red-500' : ''">
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
      :disabled="isEditing || expandNewSI"
      icon="i-mdi-account-plus"
      :label="$t('labels.addIndividual')"
      variant="outline"
      data-cy="add-new-btn"
      @click="handleAddNewButtonClick"
    />
    <div
      v-if="expandNewSI"
      class="mt-10 p-10 pt-8 bg-white rounded flex flex-row"
      :class="showAddIndividualError ? 'border-l-[3px] border-red-500' : ''"
    >
      <label class="font-bold min-w-[190px] mt-3" :class="showAddIndividualError ? 'text-red-500' : ''">
        {{ $t('labels.addIndividual') }}
      </label>
      <IndividualPersonAddNew
        class="ml-8"
        :start-date="currentSIFiling.effectiveDate"
        @cancel="cancelAddNewSI"
        @add="addNewSI($event)"
      />
    </div>
    <IndividualPersonSummaryTable
      class="mt-10"
      :individuals="currentSIFiling.significantIndividuals || []"
      :edit="true"
      :is-editing="isEditing"
      :editing-disabled="isAddingNewSI"
      @toggle-editing-mode="toggleEditingMode"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)

const expandNewSI = ref(false)

const isEditing = ref(false)

const isAddingNewSI = ref(false)

const toggleEditingMode = () => {
  isEditing.value = !isEditing.value
}

// FUTURE: these will be triggered/replaced for something else in 18883
const showSignificantDateError = ref(false)
const showAddIndividualError = ref(false)

const significantIndividualChangeDate = (event: Date) => {
  const effectiveDate = dateToString(event, 'YYYY-MM-DD')
  currentSIFiling.value.effectiveDate = effectiveDate
  for (const si of currentSIFiling.value.significantIndividuals) {
    si.startDate = effectiveDate
  }
  addBtrPayFees()
}

function handleAddNewButtonClick () {
  expandNewSI.value = true
  isAddingNewSI.value = true
}

function addNewSI (si: SignificantIndividualI) {
  significantIndividuals.filingAddSI(si)
  expandNewSI.value = false
  isAddingNewSI.value = false
}

function cancelAddNewSI () {
  expandNewSI.value = false
  isAddingNewSI.value = false
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
