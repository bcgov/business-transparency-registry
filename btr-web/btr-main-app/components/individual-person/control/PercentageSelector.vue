<template>
  <div class="flex w-full space-x-1">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="w-1/4 h-16 flex items-center justify-center"
      :class="index === selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
      tabindex="0"
      @click="selectOption(index)"
      @keydown.enter="selectOption(index)"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
const t = useNuxtApp().$i18n.t
const emit = defineEmits<{(e: 'update:modelValue', value: PercentageRangeE): void }>()

const options = [
  {
    range: PercentageRangeE.LESS_THAN_25,
    label: t('texts.control.percentageSelectorOptions.lessThan25')
  },
  {
    range: PercentageRangeE.AT_LEAST_25_TO_50,
    label: t('texts.control.percentageSelectorOptions.atLeast25To50')
  },
  {
    range: PercentageRangeE.MORE_THAN_50_TO_75,
    label: t('texts.control.percentageSelectorOptions.moreThan50To75')
  },
  {
    range: PercentageRangeE.MORE_THAN_75,
    label: t('texts.control.percentageSelectorOptions.moreThan75')
  }
]
const selected = ref(-1)
const selectOption = (index) => {
  selected.value = index
  emit('update:modelValue', options[index].range)
}
</script>
