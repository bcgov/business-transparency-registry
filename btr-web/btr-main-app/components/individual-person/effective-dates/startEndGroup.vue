<template>
  <div class="w-full flex flex-row items-center gap-4">
    <div class="grow grid grid-cols-2 items-center gap-4 relative ">
      <div v-if="highlightRow" class="absolute inset-0 bg-bcGovColor-activeBlue/[0.2] z-50 rounded" />
      <div class="flex-grow">
        <!-- isEditing is set to false, as we dont want to clear these dates on focus -->
        <!-- if additional logic for editing is needed, we need to update this logic -->
        <BcrosInputsDateSelect
          :name="name + '.startDate'"
          :initial-date="dateStringToDate(dates.startDate || '') || undefined"
          :max-date="dates.endDate ? dateStringToDate(dates.endDate) || new Date() : new Date()"
          :placeholder="$t('placeholders.dateSelect.startDate')"
          data-cy="start-date-select"
          :is-editing="false"
          @selection="selectStartDate($event)"
        />
      </div>
      <div class="flex-grow">
        <!-- isEditing is set to false, as we dont want to clear these dates on focus -->
        <!-- if additional logic for editing is needed, we need to update this logic -->
        <BcrosInputsDateSelect
          v-if="isEndDateVisible"
          :class="{'bg-blue-500': highlightRow}"
          :name="name + '.endDate'"
          :initial-date="dates.endDate ? dateStringToDate(dates.endDate) as Date: undefined"
          :min-date="dates.startDate ? dateStringToDate(dates.startDate) as Date: undefined"
          :max-date="new Date()"
          :removable="removableEndDate"
          :placeholder="$t('placeholders.dateSelect.endDate')"
          data-cy="end-date-select"
          :is-editing="false"
          @remove-control="showEndDate(false)"
          @selection="selectEndDate($event)"
        />
        <UButton
          v-else
          icon="i-mdi-plus-box-outline"
          variant="ghost"
          :label="$t('labels.addEndDate')"
          data-cy="show-end-date-button"
          @click="showEndDate(true)"
        />
      </div>
    </div>
    <div class="grow-0 z-100">
      <UIcon
        class="text-2xl text-bcGovColor-lightGray cursor-pointer hover:"
        name="i-mdi-delete"
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
const isEndDateVisible = defineModel<boolean>('isEndDateVisible')

/* eslint-disable func-call-spacing */
const emit = defineEmits<{
  (e: 'remove-dates', value: void): void,
  (e: 'update:startEndDates', value: StartEndDateGroupSchemaType): void
}>()
/* eslint-enable */

defineProps<{
  name: string,
  removableEndDate: boolean
}>()

const selectStartDate = (date: Date) => {
  dates.value.startDate = dateToString(date, 'YYYY-MM-DD')
  emit('update:startEndDates', dates.value)
}

const selectEndDate = (date: Date) => {
  dates.value.endDate = dateToString(date, 'YYYY-MM-DD')
  emit('update:startEndDates', dates.value)
}

const showEndDate = (isVisible: boolean) => {
  if (!isVisible) {
    dates.value.endDate = ''
  }
  isEndDateVisible.value = isVisible
}

const highlightRow = ref(false)

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
