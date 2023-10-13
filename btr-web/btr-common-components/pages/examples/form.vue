<!-- BCROS INPUT FIELDS component examples-->
<template>
  <div class="m-10">
    <h1>Common components Form example</h1>
    <hr>
    <br>
    <UForm
      :schema="schema"
      :state="state"
      @submit="submit"
    >
      <BcrosEmailField id="testEmail" v-model="state.email" :label="$t('labels.emailAddress')" data-cy="testEmail" />
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
