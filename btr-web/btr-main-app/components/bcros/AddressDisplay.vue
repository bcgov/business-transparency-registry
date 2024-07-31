<template>
  <div data-cy="address-display">
    <div
      v-for="addressLine, i in addressData"
      :key="addressLine + i"
      data-cy="address-line"
    >
      {{ addressLine }}
    </div>
    <BcrosDetailsInfoBox
      v-if="address.locationDescription"
      class="mt-2"
      :content="address.locationDescription"
      title="Location Description"
      data-cy="location-description"
    />
  </div>
</template>

<script setup lang="ts">
import { getName } from 'country-list'

const props = defineProps<{ address: Partial<AddressI> }>()

const addressData = computed((): string[] => {
  return [
    props.address.line1,
    props.address.line2,
    [props.address.city, props.address.region, props.address.postalCode].filter(val => !!val).join(' '),
    // NOTE: getName throws an error when called with undefined
    getName(props.address.country.alpha_2 ?? '') || props.address.country.name
  ].filter(val => !!val)
})
</script>
