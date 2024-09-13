<script setup lang="ts">
import { useOmitIndividual } from '@/stores/omit-individual'

const omitIndividual = useOmitIndividual()
const cpRef = ref()

async function handleDoneButtonClick () {
  // TODO: #22111 Add logic when API is added
  await cpRef.value.validate()
  omitIndividual.errors = [...cpRef.value.completingPartyForm.errors]
  if (omitIndividual.errors.length === 0) {
    // eslint-disable-next-line no-console
    console.log('ok to submit')
  } else {
    console.error('Fix errors before submitting, ', cpRef.value.completingPartyForm.errors)
  }
}
</script>

<template>
  <div>
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
      data-cy="completing-party"
      :section-title="$t('labels.requestOmit.completingParty')"
      :section-title-full="true"
      section-title-icon="i-mdi-account-supervisor-circle-outline"
      rounded-bot
      rounded-top
    >
      <BcrosCompletingParty ref="cpRef" v-model="omitIndividual.completingParty" />
    </BcrosSection>

    <div class="mt-5 w-full mb-5 h-[30px]">
      <UButton
        class="mr-5 px-10 py-3 absolute right-0"
        label="Submit"
        color="primary"
        variant="solid"
        data-cy="new-omit-done-btn"
        @click="handleDoneButtonClick()"
      />
    </div>
  </div>
</template>
