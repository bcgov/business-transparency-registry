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
defineProps<{ modelValue: BtrAddressI }>()
</script>
