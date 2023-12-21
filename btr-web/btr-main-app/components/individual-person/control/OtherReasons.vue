<template>
  <div>
    <p class="font-bold py-3">
      {{ $t('labels.other') }}
    </p>
    <p class="py-3">
      {{ $t('texts.otherReasons.description') }}
    </p>
    <BcrosInputsTextArea
      v-model="otherReasons"
      style="min-height: 50px"
      :placeholder="$t('texts.otherReasons.textAreaPlaceholder')"
      class="py-2 w-full"
      :variant="variant"
      resize
      :max-char="1000"
      data-cy="otherReasonsTextArea"
      @change="emit('update:modelValue', otherReasons || undefined)"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{(e: 'update:modelValue', value: string | undefined): void }>()
defineProps({
  modelValue: { type: String, default: undefined },
  variant: { type: String, default: 'bcGov' }
})

const otherReasons = ref('')
</script>
