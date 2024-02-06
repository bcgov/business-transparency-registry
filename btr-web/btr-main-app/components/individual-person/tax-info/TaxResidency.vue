<template>
  <UFormGroup :label="label" name="taxResidency" class="flex flex-col py-5">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="flex items-center mb-2 py-1"
      :class="{ 'text-bcGovRed-500': hasError}"
    >
      <URadio
        :id="`radio-${option.value}`"
        v-model="selectedValue"
        name="taxResidency"
        :value="option.value"
      />
      <label :for="`radio-${option.value}`" class="ml-5">
        {{ option.label }}
      </label>
    </div>
    <div v-if="hasError" class="text-sm text-bcGovRed-500">
      {{ errors[0].message }}
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormError } from '#ui/types'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: [String], default: '' },
  modelValue: { type: Boolean, default: undefined },
  errors: { type: Object as PropType<FormError[]>, required: true }
})

const emit = defineEmits<{(e: 'update:modelValue', value: boolean): void}>()

const selectedValue = ref(props.modelValue)

const { t } = useI18n()
const options = [
  { value: true, label: t('labels.isTaxResident') },
  { value: false, label: t('labels.notTaxResident') }
]

watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue as boolean)
})

const hasError = computed<Boolean>(() => props.errors.length > 0)
</script>
