<template>
  <UFormGroup
    v-slot="{ error }"
    :name="name"
    :help="help"
    class="flex flex-col"
    data-cy="countryOfCitizenship"
  >
    <BcrosInputsCountriesOfCitizenshipDropdown
      v-model="model"
      class="text-gray-900"
      :class="{'text-red-500': !!error }"
      :error-state="!!error"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { type UseEventBusReturn } from '@vueuse/core'

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

const model = defineModel({ type: Array<BtrCountryI>, required: true })
const props = defineProps({
  name: { type: String, default: 'countriesOfCitizenship' },
  help: { type: String, default: '' }
})
watch(model, () => {
  if (formBus) {
    formBus.emit({ type: 'blur', path: props.name })
    formBus.emit({ type: 'change', path: props.name })
  }
}, { deep: true })
</script>
