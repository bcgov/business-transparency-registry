<template>
  <UFormGroup :label="label" name="taxResidency" class="flex flex-col py-5">
    <div v-for="(option, index) in options" :key="index" class="flex items-center mb-2 py-1">
      <URadio
        :id="`${id}-${option.value}`"
        v-model="selectedValue"
        name="taxResidency"
        :value="option.value"
      />
      <label class="ml-5"> {{ option.label }} </label>
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: [String], default: '' },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()

const selectedValue = ref(props.modelValue)

const { t } = useI18n()
const options = [
  { value: 'true', label: t('labels.isTaxResident') },
  { value: 'false', label: t('labels.notTaxResident') }
]

watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
