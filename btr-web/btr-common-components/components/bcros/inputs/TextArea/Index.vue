<template>
  <div>
    <UTextarea
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="w-full h-[1rem]">
      <span v-if="maxChar" class="float-right text-sm">{{ `${modelValue.length} / ${maxChar}` }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['update:modelValue'])
defineProps({
  modelValue: { type: String, default: '' },
  maxChar: { type: Number, default: 0 }
})
</script>
