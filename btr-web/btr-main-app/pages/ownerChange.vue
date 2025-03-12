<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { StatusCodes } from 'http-status-codes'
import { SiSchemaType } from '~/utils/si-schema/definitions'
import fileSIApi from '~/services/file-significant-individual'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling, allActiveSIs, allEditableSIs, filingErrors, isAnnualFiling } =
  storeToRefs(significantIndividuals)

const { scrollToAnchor } = useAnchorScroll({
  toAnchor: {
    target: document.documentElement,
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: -20
    }
  }
})

const expandNewSI = ref(false)
const showNoSignificantIndividuals = computed(
  (): boolean => !(allEditableSIs.value.length > 0) && !expandNewSI.value)

const numOfIndividualsWithSharedControl = computed(() => {
  return allActiveSIs.value.filter(si => hasSharedControl(si)).length
})

const isEditing = ref(false)

const isAddingNewSI = ref(false)

const toggleEditingMode = () => {
  isEditing.value = !isEditing.value
}

function handleAddNewButtonClick () {
  expandNewSI.value = true
  isAddingNewSI.value = true
  clearIncompleteFilingError()
}

function addNewSI (si: SiSchemaType) {
  significantIndividuals.filingUpdateSI(si)
  expandNewSI.value = false
  isAddingNewSI.value = false
}

function cancelAddNewSI () {
  expandNewSI.value = false
  isAddingNewSI.value = false
}

const incompleteFilingError = computed(() => {
  const issue = filingErrors.value.find(zi => zi.path.includes('incompleteFiling'))
  return issue?.message
})

const infoChanged = computed(() => {
  return !!(allEditableSIs.value.find(si => si.ui?.newOrUpdatedFields?.length > 0) ||
    allEditableSIs.value.find(si => si.ui?.actions?.length > 0))
})

const annualFilingNoChangesInactive = computed(() => {
  return expandNewSI.value || infoChanged.value || isEditing.value
})

const clearIncompleteFilingError = () => {
  const index = filingErrors?.value?.findIndex(zi => zi.path.includes('incompleteFiling'))
  if (index > -1) {
    filingErrors.value.splice(index, 1)
  }
}

onBeforeMount(async () => {
  const identifier = useRoute().params.identifier as string
  // FUTURE: put in a loading page or something while this happens in case network is slow
  await useBcrosBusiness().loadBusiness(identifier)
  const siControlStore = useSiControlStore()
  significantIndividuals.updateFilingTypeFromRoute()
  const { data, error } = await fileSIApi.getBtrFiling(identifier)

  if (error?.value?.statusCode) {
    significantIndividuals.previousFilingSubmissionId = null
    if (error?.value?.statusCode !== StatusCodes.NOT_FOUND) {
      significantIndividuals.previousFilingSubmissionId = undefined
      console.error(error.value)
      const err = {
        statusCode: error?.value?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.value?.message,
        category: ErrorCategoryE.SIGNIFICANT_INDIVIDUAL
      }
      significantIndividuals.errors.push(err)
    }
    return null
  } else {
    significantIndividuals.previousFilingSubmissionId = data?.id
  }

  significantIndividuals.filingInit(identifier, data?.payload)
  siControlStore.initActingJointlyOrInConcertFromBtrFiling(data?.payload)

  currentSIFiling.value.certified = false
})

watch(() => allEditableSIs, () => {
  filingErrors.value = []
}, { deep: true })

watch(() => filingErrors, () => {
  if (filingErrors.value.length > 0) {
    scrollToAnchor('info-section')
  }
}, { deep: true })
</script>

<template>
  <div data-cy="owner-change">
    <div id="info-section" class="my-5" data-cy="info-section">
      <BtrPageTitle />
      <p class="mt-5" data-cy="page-info-text">
        {{ $t('texts.significantIndividuals') }}
      </p>
      <p class="mt-5 italic" data-cy="collection-notice-text">
        {{ $t('texts.collectionNotice') }}
      </p>
      <BcrosHelpTip
        :title="$t('helpTitles.significantIndividuals.closed')"
        :title-expanded="$t('helpTitles.significantIndividuals.expanded')"
      >
        <template #default>
          <BcrosI18HelperLink translation-path="helpTexts.significantIndividuals.detail" />
        </template>
      </BcrosHelpTip>

      <UFormGroup :error="incompleteFilingError" />

      <div v-if="showNoSignificantIndividuals" class="p-5">
        <UCheckbox
          v-model="currentSIFiling.noSignificantIndividualsExist"
          name="noSignificantIndividualsExist"
          data-cy="noSignificantIndividualsExist-checkbox"
          :disabled="currentSIFiling.annualFilingNoChanges"
          @click="clearIncompleteFilingError"
        >
          <template #label>
            <span :class="{'text-red-500': incompleteFilingError}">
              {{ $t('labels.noSignificantIndividualsExist') }}
            </span>
          </template>
        </UCheckbox>
        <template v-if="currentSIFiling.noSignificantIndividualsExist">
          <div class="mt-5">
            <p data-cy="noSignificantIndividualsExistExplain">
              {{ $t('texts.noSignificantIndividualsExistExplain') }}
            </p>
          </div>
        </template>
      </div>

      <BcrosSection
        v-if="isAnnualFiling && !currentSIFiling.noPreviousFiling"
        class="mt-5"
        data-cy="annualFilingNoChanges-section"
        :section-title="$t('sectionTitles.annualFiling')"
        :show-section-has-errors="incompleteFilingError"
        :dim-section-title="annualFilingNoChangesInactive"
        rounded-top
        rounded-bot
      >
        <UCheckbox
          v-model="currentSIFiling.annualFilingNoChanges"
          name="annualFilingNoChanges"
          data-cy="annualFilingNoChanges-checkbox"
          :disabled="annualFilingNoChangesInactive"
          @click="clearIncompleteFilingError"
        >
          <template #label>
            <BcrosTooltip
              v-if="annualFilingNoChangesInactive"
              :text="$t('texts.annualFilingChanged')"
              :popper="{ placement: 'top', arrow: true, resize: true }"
            >
              <span class="opacity-50">
                {{ $t('texts.annualFilingNoChanges') }}
              </span>
            </BcrosTooltip>
            <span v-else :class="{'text-red-500': incompleteFilingError}">
              {{ $t('texts.annualFilingNoChanges') }}
            </span>
          </template>
        </UCheckbox>
      </BcrosSection>
    </div>

    <div data-cy="significantIndividuals-section">
      <UButton
        class="px-4 py-3"
        color="primary"
        :disabled="isEditing ||
          expandNewSI ||
          currentSIFiling.noSignificantIndividualsExist ||
          currentSIFiling.annualFilingNoChanges
        "
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
        :individuals="allEditableSIs || []"
        :edit="true"
        :is-editing="isEditing"
        :editing-disabled="isAddingNewSI || currentSIFiling.annualFilingNoChanges"
        :has-error="incompleteFilingError"
        @toggle-editing-mode="toggleEditingMode"
      />
      <IndividualPersonControlTable
        v-if="numOfIndividualsWithSharedControl > 0"
        :number-of-rows="numOfIndividualsWithSharedControl"
        :has-error="incompleteFilingError"
        :editing-disabled="currentSIFiling.annualFilingNoChanges"
        class="mt-10"
      />
    </div>
  </div>
</template>
