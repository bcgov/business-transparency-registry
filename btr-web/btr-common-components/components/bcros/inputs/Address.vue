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
        @change="$emit('update:modelValue', address)"
        option-attribute="name"
      />
    </div>
    <div class="flex py-2">
      <!--  address line 1 -->
      <BcrosInputsAddressLine1Autocomplete
        :countryIso3166Alpha2="address.country.alpha_2"
        @addrAutoCompleted="addrAutoCompleted"
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
        type="text" class="pr-4 w-full"
        variant="bcGov"
        @change="$emit('update:modelValue', address)"
        :placeholder="$t('labels.city')"
      />
      <USelectMenu
        v-if="address?.country.alpha_2==='US' || address?.country.alpha_2==='CA'"
        v-model="address.region"
        :options="regions"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        variant="bcGov"
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

import type { BtrAddress, BtrCountry } from '~/interfaces/btrAddress'
import { BtrCountrySubdivision } from '~/interfaces/btrAddress'

const emit = defineEmits<{ 'update:modelValue': [value: BtrAddress] }>()
const props = defineProps({
  label: { type: String, default: '' },
  id: { type: String, required: true },
  modelValue: { type: Object as PropType<BtrAddress>, required: true }
})

const country = ref(null)
watch(country, (newCountry: BtrCountry, oldCountry: BtrCountry) => {
  address.value.country = newCountry
})

const countries = isoCountriesList
const address: Ref<BtrAddress> = ref(props.modelValue)
const regions: Ref<Array<BtrCountrySubdivision>> = ref([])

const addrAutoCompleted = (selectedAddr: BtrAddress) => {
  Object.assign(address.value, selectedAddr)
  emit('update:modelValue', address.value)
}

// todo: add validations
</script>
