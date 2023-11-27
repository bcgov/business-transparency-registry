<template>
  <UFormGroup :name="name" class="flex-col py-5">
    <div class="flex items-center">
      <UInput
        :id="id"
        type="text"
        v-bind="$attrs"
        :value="modelValue"
        variant="bcGov"
        :placeholder="placeholder"
        class="w-1/5"
      />
      <span class="ml-2 text-gray-500">%</span>
    </div>
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
