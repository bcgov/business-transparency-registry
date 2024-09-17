import { CompletingPartySchemaType } from '~/utils/omit-schema/definitions'
import { getDefaultInputFormCompletingParty } from '~/utils/omit-schema/defaults'

export const useOmitIndividual = defineStore('bcros/omitIndividual', () => {
  const completingParty: CompletingPartySchemaType = ref(getDefaultInputFormCompletingParty())
  const errors: Ref<ErrorI[]> = ref([])
  const completingPartyRef = ref()

  /** Load the omit individuals for the business into the store */
  function loadSavedOmitIndividual () {
    // TODO: #22111 Add when api for get implemented
  }

  /** Create the omit individuals in the api */
  function createSavedOmitIndividual () {
    // TODO: #22111 Add when api for get implemented
  }

  async function submitOmit () {
    // TODO: #22111 Add logic when API is added
    if (!completingPartyRef.value) {
      console.error('Completing Party Ref missing')
      return
    }
    await completingPartyRef.value.validate()
    errors.value = [...completingPartyRef.value.completingPartyForm.errors]
    if (errors.value.length === 0) {
      // eslint-disable-next-line no-console
      console.log('ok to submit')
    } else {
      console.error('Fix errors before submitting, ', completingPartyRef.value.completingPartyForm.errors)
    }
  }

  return {
    loadSavedOmitIndividual,
    createSavedOmitIndividual,
    errors,
    completingParty,
    completingPartyRef,
    submitOmit
  }
})
