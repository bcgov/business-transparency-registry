<script setup lang="ts">
import { useOmitIndividual } from '~/stores/omit-individual'

setPageLayout('omit-submitted')
const { submitted } = storeToRefs(useOmitIndividual())
const submittedTime = ref(new Date())

if (!submitted.value) {
  navigateTo('/request-to-omit')
}
</script>

<template>
  <div class="max-w-[987px] mx-auto" data-cy="request-to-omit-header">
    <h3 class="text-xl font-bold mb-2.5 max-w-">
      {{ $t('general.regName') }}
    </h3>
    <h1 class="text-2xl font-bold mb-4" data-cy="request-to-omit-title">
      {{ $t('labels.requestOmit.submittedHeader') }}
    </h1>
    <p class="mb-3">
      {{ $t('general.submittedOn') }}:{{ ' ' }}
      {{
        submittedTime.toLocaleString('default', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZoneName: 'long'
        })
      }}
    </p>
    <p>
      {{ $t('labels.requestOmit.submittedp1') }}
    </p>
    <p class="font-bold mt-3 mb-3">
      {{ $t('labels.requestOmit.submittedp2') }}
    </p>
    <p>
      {{ $t('labels.requestOmit.submittedp3') }}
    </p>
  </div>
</template>

<style scoped>

</style>
