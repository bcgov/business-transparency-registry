import { defineStore } from 'pinia'
import { SignificantIndividualI } from '../interfaces/significant-individual-i'

/** Manages Significant */
export const useSignificantIndividuals = defineStore('significantIndividuals', () => {
  const currentSIFiling: Ref<SignificantIndividualFilingI> = ref({}) // current significant individual change filing
  const currentSavedSIs: Ref<SignificantIndividualI[]> = ref([]) // saved SIs from api for this business
  const showErrors = ref(false) // show submit error validations
  const submitting = ref(false)
  const editingIndex = ref(-1)

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
  
  function filingEditSIOpen(index: number) {
    console.log('Editing index:' + index)
    const significantIndividual = currentSIFiling.value.significantIndividuals[index]
    editingIndex.value = index
    let deepCopy = JSON.parse(JSON.stringify(significantIndividual))
    deepCopy.class = 'editing'
    deepCopy.action = FilingActionE.EDIT
    currentSIFiling.value.significantIndividuals.splice(index + 1, 0, deepCopy)
  }

  function filingEditSIDone(significantIndividual: SignificantIndividualI) {
    console.log('Updating index:' + editingIndex.value)
    significantIndividual.class = ''
    significantIndividual.action = FilingActionE.ADD
    currentSIFiling.value.significantIndividuals.splice(editingIndex.value, 2, significantIndividual)
    editingIndex.value = -1
  }

  function filingEditSICancel() {
    console.log('Canceling editing index:' + editingIndex.value)
    currentSIFiling.value.significantIndividuals.splice(editingIndex.value + 1, 1)
    editingIndex.value = -1
  }

  const _getFolioNumber = (): string => {
    const business = useBcrosBusiness()
    if (business.currentFolioNumber) {
      return business.currentFolioNumber
    }
    return ''
  }

  /** Initialize a new significant individual filing */
  async function filingInit (businessIdentifier: string) {
    await loadSavedSIs(businessIdentifier)
    const folioNum = _getFolioNumber()
    currentSIFiling.value = {
      businessIdentifier,
      significantIndividuals: currentSavedSIs.value,
      effectiveDate: null,
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
    console.info('Submit', currentSIFiling.value)
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 3000))
    submitting.value = false
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

  function reset () {
    currentSIFiling.value = {}
    currentSavedSIs.value = []
    showErrors.value = false
    submitting.value = false
  }

  return {
    currentSIFiling,
    currentSavedSIs,
    showErrors,
    submitting,
    filingAddSI,
    filingEditSIOpen,
    filingEditSIDone,
    filingEditSICancel,
    filingInit,
    filingSave,
    filingSubmit,
    getSIs,
    loadSavedSIs,
    reset
  }
})
