<template>
  <CountryFlag :country="countryCodeIso2letter" class="block m-0 p-0" />
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'

defineProps<{
  countryCodeIso2letter: string,
  tooltipText?: string
}>()
</script>
