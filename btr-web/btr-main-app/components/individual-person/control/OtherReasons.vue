<template>
  <div>
    <UFormGroup v-slot="{ error }" :name="name">
      <p>
        {{ $t('texts.otherReasons.description') }}
      </p>
      <BcrosInputsTextArea
        v-model="otherReasons"
        style="min-height: 50px"
        :placeholder="$t('texts.otherReasons.textAreaPlaceholder')"
        class="py-2 w-full"
        :variant="error ? 'error' : variant"
        resize
        :max-char="1000"
        data-cy="otherReasonsTextArea"
        @change="emit('update:modelValue', otherReasons || undefined)"
      />
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'update:modelValue', value: string | undefined): void }>()
const props = defineProps({
  name: { type: String, required: false, default: 'ControlTypeOtherReason' },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'bcGov' }
})

const otherReasons = ref(props.modelValue)
</script>
