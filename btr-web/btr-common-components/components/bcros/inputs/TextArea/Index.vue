<template>
  <div>
    <UTextarea
      v-bind="$attrs"
      :value="modelValue"
      :variant="variant"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="w-full h-[1rem] flex justify-between">
      <div v-if="hasError" class="text-sm text-red-500">
        {{ errors[0].message }}
      </div>
      <span v-if="maxChar" class="ml-auto text-sm" :class="maxCharColour">
        {{ `${modelValue.length} / ${maxChar}` }}&nbsp;{{ $t('labels.characters') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormError } from '#ui/types'

defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: String, default: '' },
  maxChar: { type: Number, default: 0 },
  variant: { type: String, default: 'bcGov' },
  errors: { type: Object as PropType<FormError[]>, default: () => ([] as FormError[]) }
})

const maxCharColour = computed(() => props.modelValue.length > props.maxChar ? 'text-red-500' : 'text-gray-700')
const hasError = computed<Boolean>(() => props.errors.length > 0)
</script>
