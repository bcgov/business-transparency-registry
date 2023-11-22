<template>
  <UFormGroup :name="name" class="flex-col py-5">
    <UInput
      :id="id"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      variant="bcGov"
      :placeholder="placeholder"
      class="w-1/5"
    >
      <template #trailing>
        <span class="text-gray-500 text-xs">%</span>
      </template>
    </UInput>
  </UFormGroup>
</template>

<script setup lang="ts">
defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  placeholder: { type: String, default: '' },
  modelValue: { type: String, default: '' }
})
</script>
