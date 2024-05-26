<template>
  <UFormGroup
    v-slot="{ error }"
    :name="name"
  >
    <UInput
      :ui="{ icon: { base: showDatePicker && !error ? 'text-primary-500' : iconClass, trailing: { pointer: '' } } }"
      :model-value="selectedDateDisplay"
      :placeholder="placeholder || ''"
      type="text"
      :variant="!!error ? 'error' : variant || 'bcGov'"
      data-cy="date-select"
      @click="showDatePicker = true"
      @keydown.enter="showDatePicker = true"
      @update:model-value="handleManualDateEntry($event)"
    >
      <template #trailing>
        <UButton
          v-if="removable"
          color="gray"
          variant="link"
          icon="i-mdi-close"
          :padded="false"
          @click="$emit('remove-control')"
        />
        <UButton
          variant="link"
          icon="i-mdi-calendar"
          class=""
          @click="showDatePicker = true"
          :padded="false"
        />
      </template>
    </UInput>

    <BcrosDatePicker
      v-if="showDatePicker"
      ref="dateSelectPickerRef"
      class="absolute z-20"
      :default-selected-date="selectedDate"
      :set-max-date="maxDate"
      @selected-date="updateDate($event); showDatePicker = false"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref, watch } from 'vue'
import { MaybeElementRef, onClickOutside } from '@vueuse/core'

const props = defineProps<{
  name: string
  initialDate?: Date,
  maxDate?: Date,
  placeholder?: string,
  variant?: string
  removable?: boolean
}>()

const emit = defineEmits<{
  (e: 'selection', value: Date | null): void,
  (e: 'remove-control', value: void): void
}>()

// @ts-ignore
const dateSelectPickerRef: MaybeElementRef = ref(null)
const showDatePicker = ref(false)

onClickOutside(dateSelectPickerRef, () => { showDatePicker.value = false })

const selectedDate: Ref<Date | null> = ref(props.initialDate || null)
watch(() => selectedDate.value, val => emit('selection', val))

const updateDate = (val: Date | null) => {
  selectedDate.value = val
}

const selectedDateDisplay: ComputedRef<string> = computed(
  () => selectedDate.value ? dateToString(selectedDate.value, 'YYYY-MM-DD') : ''
)

const handleManualDateEntry = (input: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  const inputDate = dateStringToDate(input)
  const validDate = inputDate && (!props.maxDate || inputDate < props.maxDate)
  if (!input || (input.match(dateRegex) !== null && validDate)) {
    updateDate(inputDate)
    showDatePicker.value = false
  }
}

// colouring
const iconClass = computed(() => {
  if (props.variant === 'primary') {
    return 'text-primary-500'
  }
  if (props.variant === 'error') {
    return 'text-red-500'
  }
  return 'text-gray-700'
})
</script>
