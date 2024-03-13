<template>
  <UFormGroup :name="name" class="flex-col py-5">
    <USelectMenu
      v-model="selected"
      :options="rangeOptions"
      :placeholder="'% of Shares'"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>()
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  modelValue: { type: String, default: ''}
})

const rangeOptions = [
  'More than 75% of shares',
  'More than 50% and up to 75% of shares',
  'At least 25% and up to 50% of shares',
  'Less than 25% of shares'
]

const selected = ref()

watch(selected, (newSelected: string) => {
  emit('update:modelValue', newSelected)
})
</script>