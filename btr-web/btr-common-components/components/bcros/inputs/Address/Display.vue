<template>
  <div data-cy="address-display">
    <p>{{ modelValue.line1 }}</p>
    <p v-if="modelValue.line2">
      {{ modelValue.line2 }}
    </p>
    <p>{{ modelValue.city }} {{ modelValue.region }}&nbsp;&nbsp;{{ modelValue.postalCode }}</p>
    <p>{{ modelValue.country.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { type BtrAddressI } from '~/interfaces/btr-address-i'
defineModel({ type: Object as PropType<BtrAddressI>, required: true })
</script>
