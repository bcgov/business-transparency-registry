<!-- BCROS INPUT FIELDS component examples-->
<template>
  <div class="m-10">
    <h1>Common components Form example</h1>
    <hr>
    <!-- example using custom tailwind colors -->
    <div class="bg-bcGovColor-error h-5" />
    <!-- example using custom tailwind colors -->
    <div class="bg-bcGovGray-200 h-5" />
    <!-- example using custom tailwind colors by using theme in class -->
    <div class="bgBlueAPp h-5" />
    <UForm
      :schema="schema"
      :state="state"
      @submit="submit"
    >
      <BcrosInputsNameField
        id="testFullName"
        v-model="state.fullName"
        name="fullName"
        :label="$t('labels.fullName')"
        data-cy="testFullName"
      />

      <BcrosInputsNameField
        id="testPreferredName"
        v-model="state.preferredName"
        name="preferredName"
        :label="$t('labels.preferredName')"
        data-cy="testPreferredName"
      />
      <BcrosInputsEmailField
        id="testEmail"
        v-model="state.email"
        :label="$t('labels.emailAddress')"
        data-cy="testEmail"
      />
      <br>
      <BcrosInputsDateSelect id="testDateSelect" data-cy="testDateSelect" />
      <br>
      <BcrosInputsAddress
        id="testDateAddress"
        v-model="addr"
        :label="$t('labels.address') + ':'"
        data-cy="testDateAddress"
      />
      <br>
      {{
        addr.line1 + ', '
          + addr.line2 + ', '
          + addr.country.name + ', '
          + addr.postalCode + ', '
          + addr.city + ', '
          + addr.region
      }}
      <br>
      {{ citizenships }}
      <br>
      <BcrosInputsCombobox
        v-model="citizenships"
        name="testCombobox"
        :label-function="(c) => c.name"
        :items="citizenshipOptions"
        :search-placeholder="$t('labels.countryOfCitizenship.findCountry')"
        :label-placeholder="$t('labels.countryOfCitizenship.placeholder')"
        key-attribute="alpha_2"
        :search-attributes="['name', 'alpha_2']"
      />
      <UButton id="exampleSubmitButton" type="submit" data-cy="submit-button">
        Submit
      </UButton>
      <BcrosAlertsMessage flavour="alert">
        Hi
      </BcrosAlertsMessage>
      <BcrosAlertsMessage flavour="warning">
        Hi
      </BcrosAlertsMessage>
      <BcrosAlertsMessage flavour="success">
        Hi
      </BcrosAlertsMessage>
      <BcrosAlertsMessage flavour="info">
        Hi
      </BcrosAlertsMessage>
      <BcrosAlertsMessage flavour="message">
        Hi
      </BcrosAlertsMessage>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'
import { BtrAddressI } from '~/interfaces/btr-address-i'
import { validateEmailRfc5322Regex } from '~/utils/validation/form_inputs'

const minNameLength = 1
const maxNameLength = 150

const t = useNuxtApp().$i18n.t
const schema = z.object({
  fullName: z.preprocess(normalizeName,
    z.string()
      .min(minNameLength, t('errors.validation.fullName.empty'))
      .max(maxNameLength, t('errors.validation.fullName.maxLengthExceeded'))
      .refine(validateNameCharacters, t('errors.validation.fullName.specialCharacter'))
  ),
  preferredName: z.preprocess(normalizeName,
    z.string()
      .max(maxNameLength, t('errors.validation.preferredName.maxLengthExceeded'))
      .refine(validatePreferredName, t('errors.validation.preferredName.specialCharacter'))
  ),
  email: z.string()
    .max(254, 'errors.validation.email.maxLengthExceeded')
    .refine(validateEmailRfc5322Regex, t('errors.validation.email.invalid'))
})

type Schema = z.output<typeof schema>
const state = ref({
  email: undefined,
  fullName: undefined,
  preferredName: undefined
})

const citizenships = ref([])

const addr: Ref<BtrAddressI> = ref({
  city: '',
  country: { name: '', alpha_2: '' },
  line1: '',
  postalCode: '',
  region: '',
  line2: undefined,
  locationDescription: undefined
})

function submit (event: FormSubmitEvent<Schema>) {
  // eslint-disable-next-line no-console
  console.log(event.data)
}
</script>

<style lang="scss">
@import 'tailwindcss/base.css';
@import 'tailwindcss/components.css';
@import 'tailwindcss/utilities.css';

.bgBlueAPp {
  // example using tailwind colors inside scss
  background-color: theme('colors.bcGovColor.footer');
}

</style>
