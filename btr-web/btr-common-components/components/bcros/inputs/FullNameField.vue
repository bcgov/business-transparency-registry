<template>
  <UFormGroup :label="label" name="fullName">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      color="gray"
      class="border-b-[2px] bg-gray-100"
      variant="none"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </UFormGroup>
</template>

<script setup lang="ts">

defineEmits<{(e: 'update:modelValue', value: string): void}>()
defineProps({
  label: { type: [String], default: '' },
  id: { type: String, required: true },
  modelValue: { type: String, default: '' }
})
</script>
