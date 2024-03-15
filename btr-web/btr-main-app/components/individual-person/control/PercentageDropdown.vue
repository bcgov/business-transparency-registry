<template>
  <UFormGroup :name="name" :error="hasError ? errors[0].message : ''" class="flex-col py-5">
    {{ errors }}
    {{ hasError }}
    <USelectMenu
      v-model="selected"
      :ui-menu="{ placeholder: hasError ? 'text-red-500' : 'text-gray-700' }"
      :options="rangeOptions"
      option-attribute="label"
      :placeholder="placeholder"
      :variant="hasError ? 'error' : 'bcGov'"
      class="min-w-[300px] w-1/3"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { FormError } from '#ui/types'
const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  errors: { type: Object as PropType<FormError[]>, default: () => ([] as FormError[]) },
  type: { type: String, default: '' }
})

const rangeOptions = [
  { option: PercentageRangeE.MORE_THAN_75, label: 'More than 75% of ' + props.type },
  { option: PercentageRangeE.BETWEEN_50_AND_75, label: 'At least 50% and up to 75% of ' + props.type },
  { option: PercentageRangeE.BETWEEN_25_AND_50, label: 'At least 25% and up to 50% of ' + props.type },
  { option: PercentageRangeE.LESS_THAN_25, label: 'Less than 25% of ' + props.type }
]

const selected = ref()

const hasError = computed<Boolean>(() => props.errors.length > 0)

watch(selected, (newSelected) => {
  emit('update:modelValue', newSelected.option)
})
</script>
