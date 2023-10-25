<template>
  <UFormGroup :label="label" name="address" class="flex flex-col">
    <!--  label -->
    <div class="flex py-2">
      <!--  country -->
      <USelectMenu
        v-model="address.country"
        class="w-full flex-1"
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
      <UInput v-model="address.line2" class="w-full flex-1" variant="bcGov" @change="$emit('update:modelValue', address)" />
    </div>
    <!--  city; region combo; postal code -->
    <div class="flex flex-col sm:flex-row py-2">
      <UInput v-model="address.city" type="text" class="pr-4 w-full" variant="bcGov" @change="$emit('update:modelValue', address)" />
      <USelectMenu
        v-model="address.region"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        variant="bcGov"
        @change="$emit('update:modelValue', address)"
      />
      <UInput v-model="address.postalCode" type="text" class="w-full" variant="bcGov" @change="$emit('update:modelValue', address)" />
    </div>
    <!--  location description optional -->
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import type { PropType } from 'vue'

import type { BtrAddress } from '~/interfaces/btrAddress'

defineEmits<{ 'update:modelValue': [value: BtrAddress] }>()
const props = defineProps({
  label: { type: String, default: '' },
  id: { type: String, required: true },
  modelValue: { type: Object as PropType<BtrAddress>, required: true }
})

const countries = isoCountriesList
const address: Ref<BtrAddress> = ref(props.modelValue)

const addrAutoCompleted = (selectedAddr: BtrAddress) => {
  Object.assign(address.value, selectedAddr)
}

// todo: add validations
</script>
