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
        @change="$emit('update:modelValue', address)"
      />
    </div>
    <div class="flex py-2">
      <!--  address line 1 -->
      <BcrosInputsAddressLine1Autocomplete
        :countryIso3166Alpha2="address?.country.alpha_2"
        @addrAutoCompleted="addrAutoCompleted"
        @addrLine1Update="addrLine1Updated"
      />
    </div>
    <div class="flex py-2">
      <!--  address line 2 optional -->
      <UInput
        v-model="address.line2"
        :placeholder="$t('labels.line2')"
        class="w-full flex-1"
        variant="bcGov"
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
        @change="$emit('update:modelValue', address)"
      />
      <UInput
        v-else
        v-model="address.region"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        variant="bcGov"
        @change="$emit('update:modelValue', address)"
      />
      <UInput
        v-model="address.postalCode"
        :placeholder="$t('labels.postalCode')"
        type="text"
        class="w-full"
        variant="bcGov"
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
        @change="$emit('update:modelValue', address)"
      />
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import type { PropType } from 'vue'

import { BtrAddressI, BtrCountryI, BtrCountrySubdivisionI } from '~/interfaces/btr-address-i'
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

const addrAutoCompleted = (selectedAddr: BtrAddressI) => {
  Object.assign(address.value, selectedAddr)
  emit('update:modelValue', address.value)
}
const addrLine1Updated = (addressLine1: string) => {
  Object.assign(address.value, { line1: addressLine1 })
}

// todo: add validations
</script>
