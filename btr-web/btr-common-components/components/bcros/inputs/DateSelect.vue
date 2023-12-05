<template>
  <Popover v-slot="{ close }" class="bcros-date-select flex relative">
    <PopoverButton class="bcros-date-select__btn bg-gray-100 grow cursor-text">
      <UInput
        :model-value="selectedDateDisplay"
        icon="i-mdi-calendar"
        :placeholder="$t('placeholders.dateSelect')"
        trailing
        type="text"
        variant="bcGov"
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
      <PopoverPanel class="absolute z-20 mt-12">
        <BcrosDatePicker
          :default-selected-date="selectedDate"
          :set-max-date="maxDate"
          @selected-date="updateDate($event); close()"
        />
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref, watch } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import moment from 'moment'

defineProps<{ maxDate?: Date }>()

const emit = defineEmits<{(e: 'selection', value: Date | null): void }>()

const selectedDate: Ref<Date | null> = ref(null)
watch(() => selectedDate.value, val => emit('selection', val))

const updateDate = (val: Date | null) => {
  selectedDate.value = val
}

const selectedDateDisplay: ComputedRef<string> = computed(
  () => selectedDate.value ? moment(selectedDate.value).format('YYYY-MM-DD') : ''
)

</script>
