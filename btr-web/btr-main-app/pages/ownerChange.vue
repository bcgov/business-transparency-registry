<template>
  <div>
    <h1 class="font-bold text-3xl" data-cy="page-header">
      {{ $t('pageHeadings.significantIndividualChange') }}
    </h1>
    <p class="mt-5" data-cy="page-info-text">
      {{ $t('texts.significantIndividualChange') }}
    </p>
    <div class="mt-10 p-10 bg-white rounded flex" data-cy="effective-date-select">
      <label class="text-lg w-[190px]">{{ $t('labels.significantIndividualChangeDate') }}</label>
      <div class="ml-8 flex-auto">
        <BcrosInputsDateSelect
          :max-date="new Date()"
          :placeholder="$t('placeholders.dateSelect.significantIndividualChange')"
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
    <div v-if="expandNewSI" class="mt-10 p-10 bg-white rounded flex flex-row">
      <label class="font-bold text-lg min-w-[190px]">{{ $t('labels.addIndividual') }}</label>
      <IndividualPersonAddNew
        class="ml-8"
        :start-date="currentSIFiling.effectiveDate"
        @cancel="expandNewSI = false"
        @add="addNewSI($event)"
      />
    </div>
    <IndividualPersonSummaryTable class="mt-10" :individuals="currentSIFiling.significantIndividuals || []" />
    <div class="mt-10 p-10 bg-white rounded flex align-middle">
      <div class="my-auto">
        <label
          for="significantIndividualChangeFolioNumber"
          class="text-lg max-w-[190px] w-[190px]"
          data-cy="significantIndividualChangeFolioNumberLabel"
        >
          {{ $t('labels.folioNumber') }}
        </label>
      </div>
      <div class="ml-8 flex-auto">
        <UFormGroup label="">
          <UInput
            id="significantIndividualChangeFolioNumber"
            v-bind="$attrs"
            v-model="currentSIFiling.folioNumber"
            name="significantIndividualChangeFolioNumber"
            type="text"
            variant="bcGov"
            :placeholder="$t('labels.folioNumber') + `(${$t('labels.optional')})`"
            data-cy="significantIndividualChangeFolioNumberTextArea"
            @change="addBtrPayFees"
          />
        </UFormGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)

const expandNewSI = ref(false)

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
  await significantIndividuals.filingInit(identifier)
})

</script>
