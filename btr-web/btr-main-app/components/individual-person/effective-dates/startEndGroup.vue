<template>
  <div class="w-full flex flex-row items-center gap-4">
    <div class="grow grid grid-cols-2 items-center gap-4 relative ">
      <div class="absolute inset-0 bg-black bg-opacity-25 z-50 rounded" v-if="highlightRow"></div>
      <div class="flex-grow">
        <BcrosInputsDateSelect
          :name="name + '.startDate'"
          :initial-date="dateStringToDate(dates.startDate || '') || undefined"
          :max-date="new Date()"
          :placeholder="$t('placeholders.dateSelect.startDate')"
          @selection="selectStartDate($event)"
        />
      </div>
      <div class="flex-grow">
        <BcrosInputsDateSelect
          :class="{'bg-blue-500': highlightRow}"
          v-if="isEndDateVisible"
          :name="name + '.endDate'"
          :initial-date="dateStringToDate(dates.endDate || '') || undefined"
          :min-date="dates.startDate"
          :max-date="new Date()"
          :removable="removableEndDate"
          :placeholder="$t('placeholders.dateSelect.endDate')"
          @remove-control="showEndDate(false)"
          @selection="selectEndDate($event)"
        />
        <UButton
          v-else
          icon="i-mdi-plus-box-outline"
          variant="ghost"
          :label="$t('labels.addEndDate')"
          @click="showEndDate(true)"
        />
      </div>
    </div>
    <div class="grow-0 z-100">
      <UButton
        class="text-2xl text-bcGovColor-lightGray"
        icon="i-mdi-delete"
        variant="ghost"
        @mouseover="highlightRow=true"
        @mouseleave="highlightRow=false"
        @click.stop.prevent="$emit('remove-dates')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { dateToString } from '../../../../btr-common-components/utils/date'
import { StartEndDateGroupSchemaType } from '~/utils/si-schema/definitions'

const dates = defineModel<StartEndDateGroupSchemaType>('startEndDates', { required: true })
const isEndDateVisible = defineModel('isEndDateVisible')

const emit = defineEmits<{
  (e: 'remove-dates', value: void): void
}>()

const selectStartDate = (date: Date | null) => {
  dates.value.startDate = dateToString(date, 'YYYY-MM-DD') || undefined
  emit('update:startEndDates', dates.value)
}

const selectEndDate = (date: Date | null) => {
  dates.value.endDate = dateToString(date,  'YYYY-MM-DD') || undefined
  emit('update:startEndDates', dates.value)
}

const showEndDate = (isVisible: boolean) => {
  if (!isVisible) {
    dates.value.endDate = ''
  }
  isEndDateVisible.value = isVisible
}

const highlightRow = ref(false)

const props = defineProps<{
  name: string,
  removableEndDate: boolean
}>()
</script>

<style lang="scss" scoped>
.transp {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, .5);
  width: 100%;
  height: 100%;
}
</style>
