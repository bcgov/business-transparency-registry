<script setup lang="ts">

import { useOmitIndividual } from '@/stores/omit-individual'

const omitIndividual = useOmitIndividual()
const { completingPartyRef, omitObscureRef } = storeToRefs(omitIndividual)
</script>

<template>
  <div class="w-full">
    <div class="max-w-[787px]">
      <div data-cy="request-to-omit-header">
        <h3 class="text-xl font-bold mb-2.5">
          {{ $t('general.regName') }}
        </h3>
        <h1 class="text-2xl font-bold mb-4" data-cy="request-to-omit-title">
          {{ $t('labels.requestOmit.header') }}
        </h1>
        <p class="text-base mb-4" data-cy="request-to-omit-text">
          {{ $t('texts.requestOmitText') }}
        </p>
        <BcrosHelpTip
          :title="$t('helpTitles.requestOmit.closed')"
          :title-expanded="$t('helpTitles.requestOmit.expanded')"
        >
          <template #default>
            <BcrosI18HelperLink translation-path="helpTexts.requestOmit.detail" />
          </template>
        </BcrosHelpTip>
      </div>

      <BcrosSection
        data-cy="requestToOmit"
        :section-title="$t('labels.requestOmit.omitObscure')"
        section-title-icon="i-mdi-account-cog-outline"
        rounded-bot
        rounded-top
        :padded-top="true"
        class="mb-10"
      >
        <BcrosRequestToOmitObscure ref="omitObscureRef" v-model="omitIndividual.omitObscure" />
      </BcrosSection>

      <BcrosSection
        data-cy="completing-party"
        :section-title="$t('labels.requestOmit.completingParty')"
        section-title-icon="i-mdi-account-supervisor-circle-outline"
        rounded-bot
        rounded-top
        :padded-top="true"
        class="mb-10"
      >
        <BcrosCompletingParty ref="completingPartyRef" v-model="omitIndividual.completingParty" />
      </BcrosSection>
    </div>
  </div>
</template>
