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
      @focus="clearDateFieldOnEdit"
      @change="hasDateChanged=true"
      @blur="revertUnchangedDateField"
    >
      <template #trailing>
        <UIcon
          v-if="removable"
          name="i-mdi-close"
          :padded="false"
          class="text-gray-600 text-xl cursor-pointer"
          @click="$emit('remove-control')"
        />
        <UIcon
          name="i-mdi-calendar"
          :padded="false"
          class="text-blue-500 text-xl cursor-pointer"
          @click="showDatePicker = true"
        />
      </template>
    </UInput>

    <BcrosDatePicker
      v-if="showDatePicker"
      ref="dateSelectPickerRef"
      class="absolute z-20"
      :default-selected-date="selectedDate"
      :set-min-date="minDate"
      :set-max-date="maxDate"
      @selected-date="updateDate($event); showDatePicker = false; hasDateChanged = true"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref, watch } from 'vue'
import { MaybeElementRef, onClickOutside } from '@vueuse/core'
import { type UseEventBusReturn } from '@vueuse/core'

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

const props = defineProps<{
  name: string
  initialDate?: Date,
  minDate?: Date,
  maxDate?: Date,
  placeholder?: string,
  variant?: string
  removable?: boolean,
  isEditing: boolean
}>()

/* eslint-disable func-call-spacing */
const emit = defineEmits<{
  (e: 'selection', value: Date | null): void,
  (e: 'remove-control', value: void): void
}>()
/* eslint-enable */

// @ts-ignore
const dateSelectPickerRef: MaybeElementRef = ref(null)
const showDatePicker = ref(false)

onClickOutside(dateSelectPickerRef, () => { showDatePicker.value = false })

const selectedDate: Ref<Date | null> = ref(props.initialDate || null)
watch(() => selectedDate.value, val => emit('selection', val))

const updateDate = (val: Date | null) => {
  selectedDate.value = val
  formBus?.emit({ type: 'blur', path: props.name })
  formBus?.emit({ type: 'change', path: props.name })
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

const dateFieldUuid = getRandomUuid()
const hasDateChanged = ref(false)
const clearDateFieldOnEdit = () => {
  if (props.isEditing) {
    setFieldOriginalValue(dateFieldUuid, selectedDate.value)
    selectedDate.value = null
  }
}
const revertUnchangedDateField = () => {
  const originalValue = getFieldOriginalValue(dateFieldUuid)
  if (props.isEditing && !hasDateChanged.value && originalValue) {
    selectedDate.value = originalValue
  }
}
</script>
