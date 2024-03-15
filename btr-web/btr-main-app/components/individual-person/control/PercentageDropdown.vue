<template>
  <UFormGroup :name="name" :error="hasError ? errors[0].message : ''" class="flex-col py-5">
    <USelectMenu
      v-model="selected"
      :ui-menu="{ label: hasError ? 'text-red-500' : 'text-gray-700' }"
      :options="options"
      option-attribute="label"
      :placeholder="placeholder"
      :variant="hasError ? 'error' : 'bcGov'"
      class="min-w-[300px] w-1/3"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { FormError } from '#ui/types'

const { t } = useI18n()

const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: '' },
  errors: { type: Object as PropType<FormError[]>, default: () => ([] as FormError[]) },
  percentageType: { type: String, required: true }
})

const options = [
  {
    range: PercentageRangeE.MORE_THAN_75,
    label: t('texts.sharesAndVotes.percentageRange.moreThan75', { sharesOrVotes: props.percentageType })
  },
  {
    range: PercentageRangeE.BETWEEN_50_AND_75,
    label: t('texts.sharesAndVotes.percentageRange.between50And75', { sharesOrVotes: props.percentageType })
  },
  {
    range: PercentageRangeE.BETWEEN_25_AND_50,
    label: t('texts.sharesAndVotes.percentageRange.between25And50', { sharesOrVotes: props.percentageType })
  },
  {
    range: PercentageRangeE.LESS_THAN_25,
    label: t('texts.sharesAndVotes.percentageRange.lessThan25', { sharesOrVotes: props.percentageType })
  }
]

const selected = ref(options.find(option => option.range === props.modelValue))

const hasError = computed<Boolean>(() => props.errors.length > 0)

watch(selected, (newSelected) => {
  emit('update:modelValue', newSelected.range)
})
</script>
