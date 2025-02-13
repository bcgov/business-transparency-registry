<script setup lang="ts">
import { SubmissionTypeE } from '#imports'

const { currentSIFiling } = storeToRefs(useSignificantIndividuals())

const isAnnualFiling = computed(() => {
  return currentSIFiling.value.submissionType === SubmissionTypeE.ANNUAL_FILING &&
    !!currentSIFiling.value.submissionForYear
})
</script>

<template>
  <h1 class="font-bold text-3xl" data-cy="page-header">
    <span>{{ $t('pageHeadings.fileTransparencyRegister') }}</span>
    <span v-if="isAnnualFiling">
      - {{ $t('pageHeadings.annualFiling') }} {{ currentSIFiling.submissionForYear }}
    </span>
  </h1>
</template>
