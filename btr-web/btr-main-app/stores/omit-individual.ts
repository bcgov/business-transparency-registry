import { CompletingPartySchemaType, OmitObscureSchemaType, SiBizInfoSchemaType } from '~/utils/omit-schema/definitions'
import {
  getDefaultInputFormCompletingParty,
  getDefaultInputFormOmitObscure,
  getDefaultInputFormSiBiz
} from '~/utils/omit-schema/defaults'

export const useOmitIndividual = defineStore('bcros/omitIndividual', () => {
  const completingParty: CompletingPartySchemaType = ref(getDefaultInputFormCompletingParty())
  const errors: Ref<ErrorI[]> = ref([])
  const completingPartyRef = ref()
  const omitObscureRef = ref()
  const omitObscure: OmitObscureSchemaType = ref(getDefaultInputFormOmitObscure())
  const siBizRef = ref()
  const siBiz: SiBizInfoSchemaType = ref(getDefaultInputFormSiBiz())
  const siBizName = ref('')

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
    if (!omitObscureRef.value) {
      console.error('Omit Obscure Ref missing')
      return
    }
    if (!siBizRef.value) {
      console.error('Si Biz Ref missing')
      return
    }
    await completingPartyRef.value.validate()
    await omitObscureRef.value.validate()
    await siBizRef.value.validate()
    errors.value = [
      ...completingPartyRef.value.completingPartyForm.errors,
      ...omitObscureRef.value.omitObscureForm.errors,
      ...siBizRef.value.siBizForm.errors]
    if (errors.value.length === 0) {
      // eslint-disable-next-line no-console
      console.log('ok to submit')
    } else {
      console.error('Fix errors before submitting, ', errors.value)
    }
  }

  return {
    loadSavedOmitIndividual,
    createSavedOmitIndividual,
    errors,
    completingParty,
    completingPartyRef,
    submitOmit,
    omitObscure,
    omitObscureRef,
    siBiz,
    siBizRef,
    siBizName
  }
})
