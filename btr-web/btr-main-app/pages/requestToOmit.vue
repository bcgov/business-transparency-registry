<script setup lang="ts">
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
      <BcrosCompletingParty />
    </BcrosSection>
  </div>
</template>
