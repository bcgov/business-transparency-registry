import { CompletingPartySchemaType } from '~/utils/omit-schema/definitions'
import { getDefaultInputFormCompletingParty } from '~/utils/omit-schema/defaults'

export const useOmitIndividual = defineStore('bcros/omitIndividual', () => {
  const completingParty: CompletingPartySchemaType = ref(getDefaultInputFormCompletingParty())
  const errors: Ref<ErrorI[]> = ref([])

  /** Load the omit individuals for the business into the store */
  function loadSavedOmitIndividual () {
    // TODO: #22111 Add when api for get implemented
  }

  /** Create the omit individuals in the api */
  function createSavedOmitIndividual () {
    // TODO: #22111 Add when api for get implemented
  }

  return {
    loadSavedOmitIndividual,
    createSavedOmitIndividual,
    errors,
    completingParty
  }
})
