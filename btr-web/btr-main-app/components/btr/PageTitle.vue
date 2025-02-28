<script setup lang="ts">
const { currentSIFiling, isAnnualFiling } = storeToRefs(useSignificantIndividuals())
</script>

<template>
  <h1 class="font-bold text-3xl" data-cy="page-header">
    <span>{{ $t('pageHeadings.fileTransparencyRegister') }}</span>
    <span v-if="isAnnualFiling">
      - {{ $t('pageHeadings.annualFiling') }} {{ currentSIFiling.submissionForYear }}
    </span>
  </h1>
</template>
