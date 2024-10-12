<script setup lang="ts">

import { useOmitIndividual } from '@/stores/omit-individual'

const omitIndividual = useOmitIndividual()
const { completingPartyRef, omitObscureRef, siBizRef, submitted } = storeToRefs(omitIndividual)

const showSubmission: Ref<Boolean> = ref(true)
const submittedTime = ref(new Date())

watch(submitted, () => {
  showSubmission.value = !submitted.value
  // I don't know a better more vue centric way to hide a component from a completely different project
  // that is staticish
  if (showSubmission.value) {
    document.querySelectorAll('[data-cy="button-control-right-button"]')[0].style.display = 'block'
  } else {
    document.querySelectorAll('[data-cy="button-control-right-button"]')[0].style.display = 'none'
    submittedTime.value = new Date()
  }
})
</script>

<template>
  <div class="w-full">
    <div class="max-w-[987px]">
      <div data-cy="request-to-omit-header">
        <h3 class="text-xl font-bold mb-2.5">
          {{ $t('general.regName') }}
        </h3>
        <template v-if="showSubmission">
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
        </template>
        <template v-if="!showSubmission">
          <h1 class="text-2xl font-bold mb-4" data-cy="request-to-omit-title">
            {{ $t('labels.requestOmit.submittedHeader') }}
          </h1>
          <p class="mb-3">
            {{ $t('general.submittedOn') }}:{{ ' ' }}
            {{ submittedTime.toLocaleString('default', {
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
        </template>
      </div>

      <template v-if="showSubmission">
        <BcrosSection
          data-cy="siBizInfo"
          :section-title="$t('labels.requestOmit.siBizDetails')"
          section-title-icon="i-mdi-account-circle"
          section-icon-color="text-bcGovColor-footer"
          rounded-bot
          rounded-top
          :padded-top="true"
          class="mb-10"
        >
          <BcrosSIBizInfo ref="siBizRef" v-model="omitIndividual.siBiz" />
        </BcrosSection>

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
      </template>
    </div>
  </div>
</template>
