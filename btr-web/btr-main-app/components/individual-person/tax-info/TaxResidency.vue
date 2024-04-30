<template>
<!--  todo: make name part of the props -->
  <UFormGroup v-slot="{ error }"  :label="label" name="taxResidency" class="flex flex-col py-5">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="flex items-center mb-2 py-1"
      :class="{ 'text-red-500': !!error }"
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
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormError } from '#ui/types'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: [String], default: '' },
  modelValue: { type: Boolean, default: undefined }
})

const emit = defineEmits<{(e: 'update:modelValue', value: boolean): void}>()

const selectedValue = ref(props.modelValue)

const t = useNuxtApp().$i18n.t
const options = [
  { value: true, label: t('labels.isTaxResident') },
  { value: false, label: t('labels.notTaxResident') }
]

watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue as boolean)
})
</script>
