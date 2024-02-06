<template>
  <UFormGroup :name="name" class="flex-col py-5">
    <div class="flex items-center">
      <UInput
        :id="id"
        type="text"
        v-bind="$attrs"
        :value="modelValue"
        :variant="variant"
        :placeholder="placeholder"
        class="min-w-[140px] w-1/5"
      />
      <span class="ml-2" :class="percentColour">%</span>
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'name' },
  placeholder: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'bcGov' }
})

const percentColour = computed(() => props.variant === 'error' ? 'text-bcGovRed-500' : 'text-gray-500')
</script>
