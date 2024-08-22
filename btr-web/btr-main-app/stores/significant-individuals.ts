import { StatusCodes } from 'http-status-codes'
import { dateToString } from '../../btr-common-components/utils/date'
import fileSIApi from '@/services/file-significant-individual'
import { SiSchemaType } from '~/utils/si-schema/definitions'
import { getEmptySiFiling } from '~/utils/si-schema/defaults'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import { ErrorI, FilingActionE, SignificantIndividualFilingI } from '#imports'

/** Manages Significant */
export const useSignificantIndividuals = defineStore('significantIndividuals', () => {
  const { currentBusinessIdentifier } = storeToRefs(useBcrosBusiness())
  const currentSIFiling: Ref<SignificantIndividualFilingI> = ref(getEmptySiFiling()) // current significant individual change filing
  // saved SIs from fetched from the api for this business (includes historicals)
  const savedSIs: Ref<SiSchemaType[]> = ref([])
  // editable list of SIs viewed in the edit table
  const allEditableSIs: Ref<SiSchemaType[]> = ref([])
  const showErrors = ref(false) // show submit error validations
  const submitting = ref(false)
  const errors: Ref<ErrorI[]> = ref([])

  const allActiveSIs = computed(
    (): SiSchemaType[] => allEditableSIs.value.filter(
      si => !si.ui.actions?.includes(FilingActionE.CEASE)))

  const allSIs = computed(
    (): SiSchemaType[] => allEditableSIs.value.concat(
      savedSIs.value.filter(si => si.ui.actions?.includes(FilingActionE.HISTORICAL))))
  watch(currentBusinessIdentifier, () => {
    if (currentBusinessIdentifier.value) {
      currentSIFiling.value.businessIdentifier = currentBusinessIdentifier.value
    }
  })
  /**
   * Applies 'updating' to the si record or all si records.
   * Needed for the nuxt/ui table to render changes to si array fields correctly.
   */
  const _applyUpdatingSI = (index?: number) => {
    if (index !== undefined) {
      // apply it to specified record
      allEditableSIs.value[index].ui.updating = true
      setTimeout(() => {
        allEditableSIs.value[index].ui.updating = false
      }, 1000)
    } else {
      // apply it to all records
      for (const si of allEditableSIs.value) {
        si.ui.updating = true
      }
      setTimeout(() => {
        for (const si of allEditableSIs.value) {
          si.ui.updating = false
        }
      }, 1000)
    }
  }

  const _getFolioNumber = (): string => {
    const business = useBcrosBusiness()
    if (business.currentFolioNumber) {
      return business.currentFolioNumber
    }
    return ''
  }

  /** Add the SI to the editable SIs list. */
  const _filingAddSI = (significantIndividual: SiSchemaType, isCeased: boolean) => {
    significantIndividual.ui.actions ??= []
    if (!significantIndividual.ui.actions.includes(FilingActionE.ADD)) {
      significantIndividual.ui.actions.push(FilingActionE.ADD)
    }
    if (isCeased && !significantIndividual.ui.actions.includes(FilingActionE.CEASE)) {
      significantIndividual.ui.actions.push(FilingActionE.CEASE)
    }
    // add new filing to list
    const lastNewSIIndex = allEditableSIs.value.findLastIndex(
      si => si.ui.actions?.includes(FilingActionE.ADD))
    allEditableSIs.value.splice(lastNewSIIndex + 1, 0, significantIndividual)
    _applyUpdatingSI()
  }

  /** Update the significant individual at the given index */
  const filingUpdateSI = (significantIndividual: SiSchemaType, index?: number) => {
    significantIndividual.ui.actions ??= []
    const isCeased = significantIndividual.effectiveDates.filter(date => !date.endDate).length === 0
    if (index === undefined) {
      // newly added SI
      _filingAddSI(significantIndividual, isCeased)
    } else {
      if (
        !significantIndividual.ui.actions.includes(FilingActionE.ADD) &&
        !significantIndividual.ui.actions.includes(FilingActionE.EDIT)
      ) {
        significantIndividual.ui.actions.push(FilingActionE.EDIT)
      }
      if (isCeased && !significantIndividual.ui.actions.includes(FilingActionE.CEASE)) {
        significantIndividual.ui.actions.push(FilingActionE.CEASE)
      }
      // update SI in the list
      const editableSI = { ...significantIndividual, ui: { ...significantIndividual.ui, updating: true } }
      allEditableSIs.value.splice(index, 1, editableSI)
      _applyUpdatingSI(index)
    }
  }

  /** Cease the significant individual at the given index */
  const filingCeaseSI = (index: number, cessationDate: string) => {
    const ceasedSI: SiSchemaType = JSON.parse(JSON.stringify(allEditableSIs.value[index]))
    const activeDateGrp = ceasedSI.effectiveDates.filter(dateGrp => !dateGrp.endDate)[0]
    activeDateGrp.endDate = cessationDate
    filingUpdateSI(ceasedSI, index)
    _applyUpdatingSI(index)
  }

  /** Remove the significant individual at the given index */
  const filingRemoveSI = (index: number) => {
    allEditableSIs.value.splice(index, 1)
    _applyUpdatingSI()
  }

  /** Remove the significant individual at the given index */
  const undoSIChanges = (index: number) => {
    const origIndex = allEditableSIs.value[index].ui.origIndex
    if (origIndex !== undefined) {
      const editableSI = { ...savedSIs.value[origIndex], ui: { origIndex } }
      allEditableSIs.value.splice(index, 1, editableSI)
      _applyUpdatingSI(index)
    }
  }

  /** Initialize a new significant individual filing */
  const filingInit = (businessIdentifier: string, btrFiling?: BtrFilingI) => {
    if (btrFiling) {
      loadSavedSIs(btrFiling)
    }

    const folioNum = _getFolioNumber()
    currentSIFiling.value = {
      noSignificantIndividualsExist: false,
      businessIdentifier,
      significantIndividuals: [], // only updated during submit
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
    currentSIFiling.value.significantIndividuals = allEditableSIs.value
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
    if (!savedSIs.value || savedSIs.value.length === 0 || force) {
      savedSIs.value = fileSIApi.getCurrentOwners(btrFiling) || []
      allEditableSIs.value = JSON.parse(JSON.stringify(
        savedSIs.value.filter((si, index) => {
          if (!si.ui.actions?.includes(FilingActionE.HISTORICAL)) {
            si.ui.origIndex = index
            return true
          }
          return false
        })
      ))
    }
  }

  function reset () {
    const { currentBusinessIdentifier } = storeToRefs(useBcrosBusiness())
    currentSIFiling.value = getEmptySiFiling()
    currentSIFiling.value.businessIdentifier = currentBusinessIdentifier.value
    savedSIs.value = []
    allEditableSIs.value = []
    showErrors.value = false
    submitting.value = false
  }

  return {
    allSIs,
    allActiveSIs,
    allEditableSIs,
    currentSIFiling,
    savedSIs,
    errors,
    showErrors,
    submitting,
    filingCeaseSI,
    filingUpdateSI,
    filingRemoveSI,
    filingInit,
    filingSave,
    filingSubmit,
    reset,
    undoSIChanges
  }
})
