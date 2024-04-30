<template>
  <UFormGroup v-slot="{ error }" :label="label" :name="name + '.country'">
    <!-- country -->
    {{ address.country }}
    <!--        :ui-menu="{ label: countryError ? 'text-red-500' : 'text-gray-700' }"-->
    <USelectMenu
      v-model="address.country"
      by="alpha_2"
      class="w-full"
      :placeholder="$t('labels.country')"
      :options="countries"
      :variant="error ? 'error' : 'bcGov'"
      option-attribute="name"
      data-cy="address-country"
      @blur="countryBlurred = true"
    />
  </UFormGroup>
  <UFormGroup v-slot="{ error }" class="mt-4" :name="name + '.line1'">
    <!--  address line 1 -->
    <BcrosInputsAddressLine1Autocomplete
      v-model="address.line1"
      :country-iso3166-alpha2="address.country?.alpha_2"
      :variant="error ? 'error' : 'bcGov'"
      data-cy="address-line1-autocomplete"
      @addr-auto-completed="addrAutoCompleted"
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
      />
      <UInput
        v-else
        v-model="address.region"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        :variant="error ? 'error' : 'bcGov'"
        data-cy="address-region-input"
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
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { BtrAddressI } from '~/interfaces/btr-address-i'

const t = useNuxtApp().$i18n.t
const address = defineModel({type: Object as PropType<BtrAddressI>, required: true})
// const emit = defineEmits<{ 'update:modelValue': [value: BtrAddressI] }>()
const props = defineProps({
  name: { type: String, default: 'addressInput' },
  label: { type: String, default: '' },
  id: { type: String, required: true },
  modelValue: { type: Object as PropType<BtrAddressI>, required: true }
})

// const country: Ref<BtrCountryI | undefined> = ref(undefined)
// watch(() => country.value, (newCountry: BtrCountryI, _: BtrCountryI) => {
//   address.value.country = newCountry
// })
const countries = iscCountriesListSortedByName
// const address: Ref<BtrAddressI> = ref(props.modelValue)
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

const clearAddressForm = () => {
  Object.assign(
    address.value,
    { city: '', line1: '', line2: '', locationDescription: '', postalCode: '', region: '', country: country.value }
  )
}

const addrAutoCompleted = (selectedAddr: BtrAddressI) => {
  Object.assign(address.value, selectedAddr)
}

// NB for country: needed due to select menu blur / form grp not picking it up
const countryBlurred = ref(false)
// line1
const line1Invalid = ref(false)

</script>
