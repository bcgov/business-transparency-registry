import { defineStore } from 'pinia'
import { StatusCodes } from 'http-status-codes'
import { Ref } from 'vue'
import { ErrorI } from '../../btr-common-components/interfaces/error-i'
import { dateToString } from '../../btr-common-components/utils/date'
import fileSIApi from '@/services/file-significant-individual'
import { SignificantIndividualFilingI } from '~/interfaces/significant-individual-filing-i'
import { SiSchemaType } from '~/utils/si-schema/definitions'
import { getEmptySiFiling } from '~/utils/si-schema/defaults'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'

/** Manages Significant */
export const useSignificantIndividuals = defineStore('significantIndividuals', () => {
  const currentSIFiling: Ref<SignificantIndividualFilingI> = ref(getEmptySiFiling()) // current significant individual change filing
  const currentSavedSIs: Ref<SiSchemaType[]> = ref([]) // saved SIs from api for this business
  const showErrors = ref(false) // show submit error validations
  const submitting = ref(false)
  const errors: Ref<ErrorI[]> = ref([])

  /** Add currentSI to the currentSIFiling. */
  function filingAddSI (significantIndividual: SiSchemaType) {
    currentSIFiling.value.noSignificantIndividualsExist = false
    // put it at the end of the new individuals
    const lastNewSIIndex = currentSIFiling.value.significantIndividuals
      .findLastIndex(si => si.ui.action === FilingActionE.ADD)
    currentSIFiling.value.significantIndividuals.splice(lastNewSIIndex + 1, 0, significantIndividual)
  }

  const _getFolioNumber = (): string => {
    const business = useBcrosBusiness()
    if (business.currentFolioNumber) {
      return business.currentFolioNumber
    }
    return ''
  }

  /** Update the significant individual at the given index */
  function filingUpdateSI (index: number, significantIndividual: SiSchemaType) {
    if (!significantIndividual.ui.action) {
      significantIndividual.ui.action = FilingActionE.EDIT
    }
    currentSIFiling.value.significantIndividuals.splice(index, 1, significantIndividual)
  }

  /** Mark the significant individual at the given index as removed so it will not be displayed in the table */
  function filingRemoveSI (index: number) {
    currentSIFiling.value.significantIndividuals[index].ui.action = FilingActionE.REMOVE
  }

  /** Initialize a new significant individual filing */
  function filingInit (btrFiling: BtrFilingI) {
    loadSavedSIs(btrFiling)

    const folioNum = _getFolioNumber()
    currentSIFiling.value = {
      noSignificantIndividualsExist: false,
      businessIdentifier: btrFiling.businessIdentifier,
      significantIndividuals: currentSavedSIs.value,
      effectiveDate: dateToString(new Date(), 'YYYY-MM-DD'),
      certified: false,
      folioNumber: folioNum
    }
  }

  /** Save the current significant individual filing */
  async function filingSave () {
    console.info('Save', currentSIFiling.value)
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  /** Submit the current significant individual filing */
  async function filingSubmit () {
    submitting.value = true
    const { error } = await fileSIApi.submitSignificantIndividualFiling(currentSIFiling.value)
    if (error) {
      console.error(error)
      const err = {
        statusCode: error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
        category: ErrorCategoryE.SIGNIFICANT_INDIVIDUAL
      }
      errors.value.push(err)
    }
    submitting.value = false
  }

  /** Load the significant individuals for the business into the store */
  function loadSavedSIs (btrFiling: BtrFilingI, force = false) {
    if (!currentSavedSIs.value || currentSavedSIs.value.length === 0 || force) {
      currentSavedSIs.value = fileSIApi.getCurrentOwners(btrFiling) || []
    }
  }

  function reset () {
    currentSIFiling.value = getEmptySiFiling()
    currentSavedSIs.value = []
    showErrors.value = false
    submitting.value = false
  }

  return {
    currentSIFiling,
    currentSavedSIs,
    errors,
    showErrors,
    submitting,
    filingAddSI,
    filingUpdateSI,
    filingRemoveSI,
    filingInit,
    filingSave,
    filingSubmit,
    reset
  }
})
