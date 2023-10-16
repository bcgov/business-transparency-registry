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
      <BcrosInputsEmailField
        id="testEmail"
        v-model="state.email"
        :label="$t('labels.emailAddress')"
        data-cy="testEmail"
      />
      <br>
      <BcrosInputsDateSelect id="testDateSelect" data-cy="testDateSelect" />
      <br>
      <UButton id="exampleSubmitButton" class="bg-app-blue" type="submit" data-cy="submit-button">
        Submit
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const { t } = useI18n()
const schema = z.object({
  email: z.string().email(t('errors.validation.invalidEmail'))
})

type Schema = z.output<typeof schema>
const state = ref({
  email: undefined
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
