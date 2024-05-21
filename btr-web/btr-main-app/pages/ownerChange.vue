<template>
  <div data-cy="owner-change">
    <div class="my-5" data-cy="noSignificantIndividualsExist-section">
      <h1 class="font-bold text-3xl" data-cy="noSignificantIndividualsExist-title">
        {{ $t('pageHeadings.significantIndividuals') }}
      </h1>
      <p class="mt-5">
        {{ $t('texts.significantIndividuals') }}
      </p>
      <BcrosHelpTip
        :title="$t('helpTitles.significantIndividuals.closed')"
        :title-expanded="$t('helpTitles.significantIndividuals.expanded')"
      >
        <template #default>
          <ul class="mx-3">
            <li>{{ $t('helpTexts.significantIndividuals.helpPlaceholder1') }}</li>
            <li>{{ $t('helpTexts.significantIndividuals.helpPlaceholder2') }}</li>
          </ul>
        </template>
      </BcrosHelpTip>
      <div v-if="showNoSignificantIndividuals" class="p-5">
        <UCheckbox
          v-model="currentSIFiling.noSignificantIndividualsExist"
          name="noSignificantIndividualsExist"
          data-cy="noSignificantIndividualsExist-checkbox"
          :label="$t('labels.noSignificantIndividualsExist')"
        />
        <template v-if="currentSIFiling.noSignificantIndividualsExist">
          <div class="mt-5">
            <p data-cy="noSignificantIndividualsExistExplain">
              {{ $t('texts.noSignificantIndividualsExistExplain') }}
            </p>
          </div>
        </template>
      </div>
    </div>
    <div data-cy="significantIndividuals-section">
      <UButton
        class="px-4 py-3"
        color="primary"
        :disabled="isEditing || expandNewSI || currentSIFiling.noSignificantIndividualsExist"
        icon="i-mdi-account-plus"
        :label="$t('labels.addIndividual')"
        data-cy="add-new-btn"
        @click="handleAddNewButtonClick"
      />
      <UButton
        v-if="!currentSIFiling.noSignificantIndividualsExist"
        class="mx-5 px-4 py-3"
        color="primary"
        :disabled="true"
        icon="i-mdi-swap-vertical"
        :label="$t('labels.importLegacySIList')"
        variant="outline"
        data-cy="import-legacy-si-list-btn"
      />
      <IndividualPersonAddNew
        v-if="expandNewSI"
        :start-date="currentSIFiling.effectiveDate"
        @cancel="cancelAddNewSI"
        @add="addNewSI($event)"
      />
      <IndividualPersonSummaryTable
        class="mt-10"
        :individuals="currentSIFiling.significantIndividuals || []"
        :edit="true"
        :is-editing="isEditing"
        :editing-disabled="isAddingNewSI"
        @toggle-editing-mode="toggleEditingMode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)

const expandNewSI = ref(false)
const showNoSignificantIndividuals = computed(
  (): boolean =>
    !(currentSIFiling.value.significantIndividuals?.filter(si => si.action !== 'remove').length > 0) &&
    !expandNewSI.value)

const isEditing = ref(false)

const isAddingNewSI = ref(false)

const toggleEditingMode = () => {
  isEditing.value = !isEditing.value
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
