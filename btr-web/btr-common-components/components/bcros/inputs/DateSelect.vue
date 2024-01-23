<template>
  <Popover v-slot="{ close, open }" class="bcros-date-select flex relative focus:ring-0">
    <PopoverButton
      class="bcros-date-select__btn bg-gray-100 grow cursor-text focus:ring-0 rounded-t-md"
      as="div"
    >
      <UInput
        :ui="{ icon: { base: open ? 'text-primary-500' : iconClass } }"
        :model-value="selectedDateDisplay"
        icon="i-mdi-calendar"
        :placeholder="placeholder || ''"
        trailing
        type="text"
        :variant="open ? 'primary' : variant || 'bcGov'"
        data-cy="date-select"
      />
    </PopoverButton>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        class="absolute z-20 mt-14"
        :as="DatePicker"
        :default-selected-date="selectedDate"
        :set-max-date="maxDate"
        @selected-date="updateDate($event); close()"
      />
    </transition>
  </Popover>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref, watch } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
// NB: need to import it directly otherwise the PopoverPanel does not recognize it
import DatePicker from '../DatePicker.vue'

const props = defineProps<{ initialDate?: Date, maxDate?: Date, placeholder?: string, variant?: string }>()

const emit = defineEmits<{(e: 'selection', value: Date | null): void }>()

const selectedDate: Ref<Date | null> = ref(props.initialDate || null)
watch(() => selectedDate.value, val => emit('selection', val))

const updateDate = (val: Date | null) => {
  selectedDate.value = val
}

const selectedDateDisplay: ComputedRef<string> = computed(
  () => selectedDate.value ? dateToString(selectedDate.value, 'YYYY-MM-DD') : ''
)

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
