<template>
  <UFormGroup v-slot="{ error }" :label="label" :name="name + '.country'">
    <!-- country -->
    <USelectMenu
      v-model="address.country"
      by="alpha_2"
      class="w-full"
      :placeholder="$t('labels.country')"
      :options="countries"
      :variant="error ? 'error' : 'bcGov'"
      :ui-menu="{ label: !!error? 'text-red-500': 'text-gray-700'}"
      option-attribute="name"
      data-cy="address-country"
      @change="countryChange"
    />
  </UFormGroup>
  <UFormGroup v-slot="{ error }" class="mt-4" :name="name + '.line1'">
    <!--  address line 1 -->
    <BcrosInputsAddressLine1Autocomplete
      v-model="address.line1"
      :country-iso3166-alpha2="address.country?.alpha_2"
      :error-state="!!error"
      data-cy="address-line1-autocomplete"
      @addr-auto-completed="addrAutoCompleted"
      @blur="line1BlurEvent"
      @focusin="clearLine1FieldOnEdit"
      @change="line1ChangeEvent"
      @focusout="revertUnchangedLine1Field"
    />
  </UFormGroup>
  <UFormGroup v-slot="{ error }" class="mt-4" :name="name + '.line2'">
    <!--  address line 2 optional -->
    <UInput
      v-model="address.line2"
      :placeholder="$t('labels.line2')"
      class="w-full flex-1"
      :variant="error ? 'error' : 'bcGov'"
      data-cy="address-line2"
      @change="emit('line2-change', address.line2)"
    />
  </UFormGroup>
  <!--  city; region combo; postal code -->
  <div class="flex flex-col sm:flex-row mt-4">
    <UFormGroup v-slot="{ error }" class="sm:flex-1" :name="name + '.city'">
      <UInput
        v-model="address.city"
        :placeholder="$t('labels.city')"
        type="text"
        class="pr-4 w-full"
        :variant="error ? 'error' : 'bcGov'"
        data-cy="address-city"
        @change="emit('city-change', address.city)"
      />
    </UFormGroup>
    <UFormGroup v-slot="{ error }" class="sm:flex-1" :name="name + '.region'">
      <!--          :ui-menu="{ placeholder: regionInvalid ? 'text-red-500' : 'text-gray-700' }"-->
      <USelectMenu
        v-if="address.country?.alpha_2==='US' || address?.country?.alpha_2==='CA'"
        v-model="address.region"
        :options="regions"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        :variant="error ? 'error' : 'bcGov'"
        option-attribute="name"
        value-attribute="code"
        data-cy="address-region-select"
        @change="emit('region-change', address.region)"
      />
      <UInput
        v-else
        v-model="address.region"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        :variant="error ? 'error' : 'bcGov'"
        data-cy="address-region-input"
        @change="emit('region-change', address.region)"
      />
    </UFormGroup>
    <UFormGroup v-slot="{ error }" class="sm:flex-1" :name="name + '.postalCode'">
      <UInput
        v-model="address.postalCode"
        :placeholder="$t('labels.postalCode')"
        type="text"
        class="w-full"
        :variant="error ? 'error' : 'bcGov'"
        data-cy="address-postal-code"
        @focus="clearPostalCodeFieldFieldOnEdit"
        @change="emit('postal-code-change', address.postalCode)"
        @blur="revertUncangedPostalCodeField"
      />
    </UFormGroup>
  </div>
  <!--  location description optional -->
  <UFormGroup v-slot="{ error }" class="mt-4" :name="name + '.locationDescription'">
    <UTextarea
      v-model="address.locationDescription"
      :placeholder="$t('labels.locationDescription')"
      class="w-full"
      :variant="error ? 'error' : 'bcGov'"
      data-cy="address-location-description"
      @focus="clearLocationDescriptionFieldFieldOnEdit"
      @change="emit('location-description-change', address.locationDescription || '')"
      @blur="revertUnchangedLocationDescriptionField"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { type UseEventBusReturn } from '@vueuse/core'
import { BtrAddressI, BtrCountryI } from '~/interfaces/btr-address-i'

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'country-change', value: BtrCountryI): void
  (e: 'line1-change', value: string): void
  (e: 'line2-change', value: string | undefined): void
  (e: 'city-change', value: string): void
  (e: 'region-change', value: string): void
  (e: 'postal-code-change', value: string): void
  (e: 'location-description-change', value: string): void
}>()

const address = defineModel({ type: Object as PropType<BtrAddressI>, required: true })

const props = defineProps({
  name: { type: String, default: 'addressInput' },
  label: { type: String, default: '' },
  id: { type: String, required: true },
  modelValue: { type: Object as PropType<BtrAddressI>, required: true },
  isEditing: { type: Boolean, required: true }
})

const line1BlurEvent = () => {
  formBus?.emit({ type: 'blur', path: props.name + '.line1' })
}
const line1ChangeEvent = () => {
  hasLine1Changed.value = true
  formBus?.emit({ type: 'change', path: props.name + '.line1' })
  emit('line1-change', props.modelValue.line1)
}

const postalCodeFieldUuid = getRandomUuid()
const hasPostalCodeChanged = ref(false)
const clearPostalCodeFieldFieldOnEdit = () => {
  if (props.isEditing) {
    setFieldOriginalValue(postalCodeFieldUuid, address.value.postalCode)
    address.value.postalCode = ''
  }
}
const revertUncangedPostalCodeField = () => {
  const originalValue = getFieldOriginalValue(postalCodeFieldUuid)
  if (props.isEditing && !hasPostalCodeChanged.value && originalValue) {
    address.value.postalCode = originalValue
  }
}

const locationDescriptionFieldUuid = getRandomUuid()
const hasLocationDescriptionChanged = ref(false)
const clearLocationDescriptionFieldFieldOnEdit = () => {
  if (props.isEditing) {
    setFieldOriginalValue(locationDescriptionFieldUuid, address.value.locationDescription)
    address.value.locationDescription = ''
  }
}
const revertUnchangedLocationDescriptionField = () => {
  const originalValue = getFieldOriginalValue(locationDescriptionFieldUuid)
  if (props.isEditing && !hasLocationDescriptionChanged.value && originalValue) {
    address.value.locationDescription = originalValue
  }
}

const line1FieldUuid = getRandomUuid()
const hasLine1Changed = ref(false)
const clearLine1FieldOnEdit = () => {
  if (props.isEditing) {
    setFieldOriginalValue(line1FieldUuid, address.value.line1)
    address.value.line1 = ''
  }
}
const revertUnchangedLine1Field = () => {
  const originalValue = getFieldOriginalValue(line1FieldUuid)
  if (props.isEditing && !hasLine1Changed.value && originalValue) {
    address.value.line1 = originalValue
  }
}

const countries = iscCountriesListSortedByName

const regions = computed(() => {
  switch (props.modelValue.country?.alpha_2) {
    case 'US':
      return countrySubdivisions.us
    case 'CA':
      return countrySubdivisions.ca
    default:
      return []
  }
})

const addrAutoCompleted = (selectedAddr: BtrAddressI) => {
  Object.assign(address.value, selectedAddr)

  setTimeout(() => {
    formBus?.emit({ type: 'blur', path: props.name + '.country' })
    formBus?.emit({ type: 'change', path: props.name + '.country' })
    emit('country-change', props.modelValue.country)
  })

  setTimeout(() => {
    formBus?.emit({ type: 'blur', path: props.name + '.line1' })
    formBus?.emit({ type: 'change', path: props.name + '.line1' })
    emit('line1-change', props.modelValue.line1)
  }, 10)

  setTimeout(() => {
    formBus?.emit({ type: 'blur', path: props.name + '.line2' })
    formBus?.emit({ type: 'change', path: props.name + '.line2' })
    emit('line2-change', props.modelValue.line2)
  }, 20)

  setTimeout(() => {
    formBus?.emit({ type: 'blur', path: props.name + '.city' })
    formBus?.emit({ type: 'change', path: props.name + '.city' })
    emit('city-change', props.modelValue.city)
  }, 30)

  setTimeout(() => {
    formBus?.emit({ type: 'blur', path: props.name + '.postalCode' })
    formBus?.emit({ type: 'change', path: props.name + '.postalCode' })
    emit('postal-code-change', props.modelValue.postalCode)
  }, 40)

  setTimeout(() => {
    formBus?.emit({ type: 'blur', path: props.name + '.region' })
    formBus?.emit({ type: 'change', path: props.name + '.region' })
    emit('region-change', props.modelValue.region)
  }, 50)
}

const countryChange = () => {
  emit('country-change', props.modelValue.country)
}
</script>
