<template>
  <div data-cy="owner-change">
    <div class="my-5" data-cy="noSignificantIndividualsExist-section">
      <h1 class="font-bold text-3xl" data-cy="significantIndividuals-heading">
        {{ $t('pageHeadings.significantIndividuals') }}
      </h1>
      <p class="mt-5" data-cy="page-info-text">
        {{ $t('texts.significantIndividuals') }}
      </p>
      <BcrosHelpTip
        :title="$t('helpTitles.significantIndividuals.closed')"
        :title-expanded="$t('helpTitles.significantIndividuals.expanded')"
      >
        <template #default>
          <BcrosI18HelperLink translation-path="helpTexts.significantIndividuals.detail" />
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
      <div class="w-full h-12" data-cy="spacer" />
      <IndividualPersonAddNew
        v-if="expandNewSI"
        :start-date="currentSIFiling.effectiveDate"
        @cancel="cancelAddNewSI"
        @add="addNewSI($event)"
      />
      <div v-if="expandNewSI" class="w-full h-12" data-cy="spacer" />
      <IndividualPersonSummaryTable
        :individuals="currentSIFiling.significantIndividuals || []"
        :edit="true"
        :is-editing="isEditing"
        :editing-disabled="isAddingNewSI"
        @toggle-editing-mode="toggleEditingMode"
      />
      <IndividualPersonControlTable
        v-if="numOfIndividualsWithSharedControl > 0"
        :number-of-rows="numOfIndividualsWithSharedControl"
        class="mt-10"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { StatusCodes } from 'http-status-codes'
import { SiSchemaType } from '~/utils/si-schema/definitions'
import fileSIApi from '~/services/file-significant-individual'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)

const expandNewSI = ref(false)
const showNoSignificantIndividuals = computed(
  (): boolean =>
    !(currentSIFiling.value.significantIndividuals?.filter(si => si.action !== FilingActionE.REMOVE).length > 0) &&
    !expandNewSI.value)

const numOfIndividualsWithSharedControl = computed(() => {
  return currentSIFiling.value.significantIndividuals?.filter(
    si => si.ui.action !== FilingActionE.REMOVE && hasSharedControl(si)
  ).length
})

const isEditing = ref(false)

const isAddingNewSI = ref(false)

const toggleEditingMode = () => {
  isEditing.value = !isEditing.value
}

function handleAddNewButtonClick () {
  expandNewSI.value = true
  isAddingNewSI.value = true
}

function addNewSI (si: SiSchemaType) {
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
  const siControlStore = useSiControlStore()
  const { data, error } = await fileSIApi.getBtrFiling(identifier)

  if (error.statusCode) {
    if (error.statusCode !== StatusCodes.NOT_FOUND) {
      console.error(error)
      const err = {
        statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
        category: ErrorCategoryE.SIGNIFICANT_INDIVIDUAL
      }
      significantIndividuals.errors.value.push(err)
    }
    return null
  }

  if (data?.payload) {
    significantIndividuals.filingInit(data.payload)
    siControlStore.initActingJointlyOrInConcertFromBtrFiling(data.payload)
  }

  currentSIFiling.value.certified = false
})
</script>
