import { defineStore } from 'pinia'
import { SignificantIndividualI } from '../interfaces/significant-individual-i'

/** Manages Significant */
export const useSignificantIndividuals = defineStore('significantIndividuals', () => {
  const currentSIFiling: Ref<SignificantIndividualFilingI> = ref({}) // current significant individual change filing
  const currentSavedSIs: Ref<SignificantIndividualI[]> = ref([]) // saved SIs from api for this business

  watch(() => currentSIFiling.value?.effectiveDate, (val) => {
    // set the start date for all newly added SIs
    for (const i in currentSIFiling.value?.significantIndividuals) {
      if (currentSIFiling.value.significantIndividuals[i].action === FilingActionE.ADD) {
        currentSIFiling.value.significantIndividuals[i].startDate = val
      }
    }
  })

  /** Add currentSI to the currentSIFiling. */
  function filingAddSI (significantIndividual: SignificantIndividualI) {
    // put it at the end of the new individuals
    const lastNewSIIndex = currentSIFiling.value.significantIndividuals
      .findLastIndex(si => si.action === FilingActionE.ADD)
    currentSIFiling.value.significantIndividuals.splice(lastNewSIIndex + 1, 0, significantIndividual)
  }

  const _getFolioNumber = (): string | null => {
    const business = useBcrosBusiness()
    if (business.currentFolioNumber) {
      return business.currentFolioNumber
    }
    return null
  }

  /** Initialize a new significant individual filing */
  async function filingInit (businessIdentifier: string) {
    await loadSavedSIs(businessIdentifier)
    const folioNum = _getFolioNumber()
    currentSIFiling.value = {
      businessIdentifier,
      significantIndividuals: currentSavedSIs.value,
      effectiveDate: null,
      folioNumber: folioNum,
      certified: false
    }
  }

  /** Save the current significant individual filing */
  async function filingSave () {
    console.info('Save', currentSIFiling.value)
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  /** Submit the current significant individual filing */
  async function filingSubmit () {
    console.info('Submit', currentSIFiling.value)
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  /** Get the current significant individuals for the business */
  async function getSIs (businessIdentifier: string) {
    console.info('getSIs', businessIdentifier)
    await new Promise(resolve => setTimeout(resolve, 100))
    return [] as SignificantIndividualI[]
  }

  /** Load the significant individuals for the business into the store */
  async function loadSavedSIs (businessIdentifier: string, force = false) {
    if (currentSavedSIs.value.length === 0 || force) {
      currentSavedSIs.value = await getSIs(businessIdentifier) || []
    }
  }

  return {
    currentSIFiling,
    currentSavedSIs,
    filingAddSI,
    filingInit,
    filingSave,
    filingSubmit,
    getSIs,
    loadSavedSIs
  }
})
