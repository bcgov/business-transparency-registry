<template>
  <UFormGroup :label="label" :name="name">
    <template #default="{ error }">
      <UInput
        :id="id"
        type="text"
        v-bind="$attrs"
        :value="modelValue"
        :variant="!!error ? 'error' : variant || 'bcGov'"
        :placeholder="placeholder"
        :class="{ 'text-red-500': !!error}"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </template>

    <template #error="{ error }">
      <p class="mt-2 text-red-500 dark:text-red-400 text-sm">
        {{ translate && error ? $t(error) : error ? error : '' }}
      </p>
    </template>
  </UFormGroup>
</template>

<script setup lang="ts">
defineEmits<{(e: 'update:modelValue', value: string): void }>()
defineProps({
  label: { type: [String], default: '' },
  name: { type: String, default: 'email' },
  placeholder: { type: [String], default: '' },
  id: { type: String, required: true },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'bcGov' },
  translate: { type: Boolean, default: false }
})
</script>
