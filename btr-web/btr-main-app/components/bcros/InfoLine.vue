<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: false,
    default: ''
  },
  valueClass: {
    type: String,
    required: false,
    default: ''
  },
  labelClass: {
    type: String,
    required: false,
    default: ''
  },
  datacy: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<template>
  <div class="flex items-center my-4">
    <div :class="`basis-1/3 font-bold ${labelClass}`" :data-cy="datacy ? `${datacy}-label` : ''">
      {{ label }}
    </div>
    <div :class="`basis-2/3 ${valueClass}`" :data-cy="datacy ? `${datacy}-value` : ''">
      {{ value }}
    </div>
  </div>
</template>
