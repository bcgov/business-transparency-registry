<template>
  <UFormGroup
    :name="name"
  >
    <div class="w-full flex flex-col" data-cy="effective-date-section">
      <StartEndGroup
        v-for="(dg, index) in displayList"
        :key="dg.uuid"
        v-model:is-end-date-visible="dg.isEndDateVisible"
        :name="name + '.dg.' + dg.uuid"
        :removable-end-date="index === lastElementIndex"
        :start-end-dates="dg"
        class="mb-4"
        :data-cy="'effective-date-group-' + dg.uuid"
        @update:start-end-dates="updateStartEndDates(dg.uuid, $event)"
        @remove-dates="removeDates(dg.uuid)"
      />
    </div>

    <UButton
      v-if="showAddNewButton"
      variant="outline"
      icon="i-mdi-calendar"
      :label="$t('buttons.addAnotherEffectiveDate')"
      padded
      class="mt-4 py-3 px-7"
      data-cy="add-new-group-button"
      @click="addNewGroup"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'
import StartEndGroup from '~/components/individual-person/effective-dates/startEndGroup.vue'
import { type StartEndDateGroupSchemaType } from '~/utils/si-schema/definitions'

/* eslint-disable func-call-spacing */
const emit = defineEmits<{
  (e: 'dates-updated', value: Array<StartEndDateGroupSchemaType>): void
}>()
/* eslint-enable */

const props = withDefaults(
  defineProps<{
    initialDateGroups: Array<StartEndDateGroupSchemaType>,
    name?: string,
  }>(),
  {
    name: 'dateGroups'
  }
)

const displayList = ref(
  props.initialDateGroups.map((dg) => {
    return {
      startDate: dg.startDate,
      endDate: dg.endDate,
      uuid: UUIDv4(),
      isEndDateVisible: !!dg.endDate
    }
  })
)

const lastElementIndex = computed(() => displayList.value.length - 1)
const showAddNewButton = computed(() =>
  displayList.value[lastElementIndex.value]?.isEndDateVisible ||
  displayList.value.length === 0 ||
  false
)

const notifyParent = () => {
  const updatedList =
    displayList.value
      .filter(
        dg => !!dg.startDate || !!dg.endDate
      )
      .map((dg) => {
        return {
          startDate: dg.startDate,
          endDate: dg.endDate
        }
      })
  emit('dates-updated', updatedList)
}

const updateStartEndDates = (uuid, updatedStartEndDates) => {
  const elem = displayList.value.find(d => uuid === d.uuid)
  Object.assign(elem, updatedStartEndDates)
  notifyParent()
}

const addNewGroup = () => {
  displayList.value.push({
    startDate: undefined,
    endDate: undefined,
    uuid: UUIDv4(),
    isEndDateVisible: false
  })
}

const removeDates = (uuid: string) => {
  const index = displayList.value.findIndex(d => d.uuid === uuid)
  displayList.value.splice(index, 1)
  notifyParent()
}
</script>
