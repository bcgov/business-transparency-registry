<template>
  <div class="flex w-full space-x-1">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="w-1/4 h-16 flex items-center justify-center cursor-pointer"
      :class="index === selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
      tabindex="0"
      :data-cy="name + '.' + index"
      @click="selectOption(index)"
      @keydown.enter="selectOption(index)"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { type UseEventBusReturn } from '@vueuse/core'

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

const t = useNuxtApp().$i18n.t
const model = defineModel({ type: String })
const props = defineProps({ name: { type: String, required: true } })
const emit = defineEmits(['change'])
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
if (model.value) {
  selected.value = options.findIndex(option => option.range === model.value)
}

const selectOption = (index: number) => {
  if (selected.value === index) {
    selected.value = -1
    model.value = 'noSelection'
    emit('change')
    return
  }
  selected.value = index
  model.value = options[index].range
  formBus?.emit({ type: 'blur', path: props.name })
  formBus?.emit({ type: 'change', path: props.name })
  emit('change')
}
</script>
