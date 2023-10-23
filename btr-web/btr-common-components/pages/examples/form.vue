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
      <BcrosInputsFullNameField
        id="testFullName"
        v-model="state.fullName"
        :label="$t('labels.fullName')"
        data-cy="testFullName"
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
      <BcrosInputsAddress v-model="address" :label="$t('labels.address')" id="testDateAddress" data-cy="testDateAddress" />
      <br>
      {{ addr.line1 + ', ' + addr.line2 + ', ' + addr.country + ', ' + addr.postalCode + ', ' + addr.city + ', ' + addr.region }}
      <br>
      <UButton id="exampleSubmitButton" type="submit" data-cy="submit-button">
        Submit
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'
import { BtrAddress } from '~/interfaces/btrAddress'
import { validateEmailRfc5322Regex } from '~/utils/validation/form_inputs'

const minNameLength = 1
const maxNameLength = 150

const { t } = useI18n()
const schema = z.object({
  email: z.string()
    .max(254, 'errors.validation.email.maxLengthExceeded')
    .refine(validateEmailRfc5322Regex, t('errors.validation.email.invalid')),
  fullName: z.preprocess(normalizeName,
    z.string()
      .min(minNameLength, t('errors.validation.fullName.empty'))
      .max(maxNameLength, t('errors.validation.fullName.maxLengthExceeded'))
      .refine(validateNameCharacters, t('errors.validation.fullName.specialCharacter'))
  )
})

type Schema = z.output<typeof schema>
const state = ref({
  email: undefined,
  fullName: undefined
})

const addr: BtrAddress = {
  city: '', country: '', line1: '', postalCode: '', region: '', line2: undefined, locationDescription: undefined
}
const address: Ref<BtrAddress> = ref(addr)

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
