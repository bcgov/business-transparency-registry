<template>
  <UFormGroup :label="label" name="address" class="flex flex-col">
    <!--  label -->
    <div class="flex py-2">
      <!--  country -->
      <USelectMenu
        v-model="country"
        by="alpha_2"
        class="w-full"
        :placeholder="$t('labels.country')"
        :options="countries"
        variant="bcGov"
        option-attribute="name"
        data-cy="address-country"
        @change="changeCountry"
      />
    </div>
    <div class="flex py-2">
      <!--  address line 1 -->
      <BcrosInputsAddressLine1Autocomplete
        v-model="address.line1"
        :country-iso3166-alpha2="address?.country.alpha_2"
        data-cy="address-line1-autocomplete"
        @addr-auto-completed="addrAutoCompleted"
      />
    </div>
    <div class="flex py-2">
      <!--  address line 2 optional -->
      <UInput
        v-model="address.line2"
        :placeholder="$t('labels.line2')"
        class="w-full flex-1"
        variant="bcGov"
        data-cy="address-line2"
        @change="$emit('update:modelValue', address)"
      />
    </div>
    <!--  city; region combo; postal code -->
    <div class="flex flex-col sm:flex-row py-2">
      <UInput
        v-model="address.city"
        :placeholder="$t('labels.city')"
        type="text"
        class="pr-4 w-full"
        variant="bcGov"
        data-cy="address-city"
        @change="$emit('update:modelValue', address)"
      />
      <USelectMenu
        v-if="address.country.alpha_2==='US' || address?.country.alpha_2==='CA'"
        v-model="address.region"
        :options="regions"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        variant="bcGov"
        option-attribute="name"
        value-attribute="code"
        data-cy="address-region-select"
        @change="$emit('update:modelValue', address)"
      />
      <UInput
        v-else
        v-model="address.region"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        variant="bcGov"
        data-cy="address-region-input"
        @change="$emit('update:modelValue', address)"
      />
      <UInput
        v-model="address.postalCode"
        :placeholder="$t('labels.postalCode')"
        type="text"
        class="w-full"
        variant="bcGov"
        data-cy="address-postal-code"
        @change="$emit('update:modelValue', address)"
      />
    </div>
    <!--  location description optional -->
    <div class="flex py-2">
      <UTextarea
        v-model="address.locationDescription"
        :placeholder="$t('labels.locationDescription')"
        class="w-full"
        variant="bcGov"
        data-cy="address-location-description"
        @change="$emit('update:modelValue', address)"
      />
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import type { PropType } from 'vue'

import { BtrAddressI, BtrCountryI } from '~/interfaces/btr-address-i'
import { countrySubdivisions } from '~/utils/isoCountriesList'

const emit = defineEmits<{ 'update:modelValue': [value: BtrAddressI] }>()
const props = defineProps({
  label: { type: String, default: '' },
  id: { type: String, required: true },
  modelValue: { type: Object as PropType<BtrAddressI>, required: true }
})

const country = ref(null)
watch(country, (newCountry: BtrCountryI, _: BtrCountryI) => {
  address.value.country = newCountry
})

const countries = isoCountriesList
const address: Ref<BtrAddressI> = ref(props.modelValue)
const regions = computed(() => {
  switch (address.value.country.alpha_2) {
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

const changeCountry = () => {
  clearAddressForm()
  emit('update:modelValue', address.value)
}

const addrAutoCompleted = (selectedAddr: BtrAddressI) => {
  Object.assign(address.value, selectedAddr)
  emit('update:modelValue', address.value)
}

// todo: add validations
</script>
