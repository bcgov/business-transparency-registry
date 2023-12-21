<template>
  <div>
    <UTextarea
      v-bind="$attrs"
      :value="modelValue"
      :variant="variant"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="w-full h-[1rem]">
      <span v-if="maxChar" class="float-right text-sm" :class="maxCharColour">
        {{ `${modelValue.length} / ${maxChar}` }}&nbsp;{{ $t('labels.characters') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: String, default: '' },
  maxChar: { type: Number, default: 0 },
  variant: { type: String, default: 'bcGov' }
})

const maxCharColour = computed(() => props.modelValue.length > props.maxChar ? 'text-red-500' : 'text-gray-700')
</script>
