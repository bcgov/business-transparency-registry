<script setup lang="ts">
const t = useNuxtApp().$i18n.t

const options = [{
  value: 'significantIndividual',
  label: t('labels.requestOmit.significantIndividual')
}, {
  value: 'representative',
  label: t('labels.requestOmit.representative')
}
]
const selected = ref()
const certify = ref(false)
const name = ref('')
const email = ref('')
</script>

<template>
  <div class="mt-2 w-full border-t border-solid pt-4">
    <p>
      {{ $t('labels.requestOmit.completingPartyIntro') }}
    </p>
    <div class="mt-10">
      <div class="mr-7 inline-block w-[131px] h-[44px] leading-[44px] align-top" :class="{ 'text-red-500': error}">
        {{ $t('labels.requestOmit.completingParty') }}
      </div>
      <URadioGroup
        id="completingParty"
        v-model="selected"
        name="completingParty.type"
        class="inline-block"
        :options="options"
      />
    </div>

    <div class="mt-10">
      <div class="mr-7 inline-block w-[131px] h-[44px] leading-[44px] align-top" :class="{ 'text-red-500': error}">
        {{ $t('placeholders.fullName') }}
      </div>
      <div class="inline-block w-[59em]">
        <BcrosInputsNameField
          id="completing-party-full-name"
          v-model="name"
          name="completingParty.fullName"
          :placeholder="$t('placeholders.fullName')"
        />
      </div>
    </div>

    <div class="mt-10">
      <div class="mr-7 inline-block w-[131px] h-[44px] leading-[44px] align-top" :class="{ 'text-red-500': error}">
        {{ $t('registriesDetailsLabels.emailAddress') }}
      </div>
      <div class="inline-block w-[59em]">
        <BcrosInputsEmailField
          id="completing-party-email"
          v-model="email"
          name="completingParty.email"
          :placeholder="$t('registriesDetailsLabels.emailAddressLC')"
        />
      </div>
    </div>

    <div class="mt-10">
      <div class="mr-7 inline-block w-[131px] h-[44px] leading-[44px] align-top" :class="{ 'text-red-500': error}">
        {{ $t('labels.certifySection') }}
      </div>
      <div class="inline-block w-[59em]">
        <ReviewConfirmCertify
          v-model="certify"
          :name="name ? name : `[${$t('placeholders.fullName')}]`"
          :part-2-text="$t('labels.requestOmit.certifyPart2')"
          data-cy="certify-section"
          :show-label="false"
        />
      </div>
    </div>
  </div>
</template>
