<template>
  <UFormGroup :label="label" name="email" :error="emailErrors">
    <UInput
        type="email"
        v-bind="$attrs"
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @change="validate"
        class="rounded-0"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { email, object, parse, string } from 'valibot';
const { t } = useI18n()

defineEmits(['update:modelValue'])
const props = defineProps({
  label: { type: [String], default: '' },
  id: { type: String, required: true },
  modelValue: { type: String, default: '' }
})

const EmailSchema = object({
  email: string([email(t('errors.invalidEmail'))])
})

const emailErrors = ref()

const validate = () => {
  try {
    parse(EmailSchema, { email: props.modelValue })
    emailErrors.value = ""
  } catch (valiError) {
    emailErrors.value = valiError.message
    console.log(emailErrors.value)
  }
}


</script>

<style scoped>
</style>
