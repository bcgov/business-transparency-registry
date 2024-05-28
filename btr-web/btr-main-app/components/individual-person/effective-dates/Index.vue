<template>
  <UFormGroup
    :name="name"
  >
    <div class="w-full flex flex-col">
      <StartEndGroup
        v-for="(dg, index) in displayList"
        :key="dg.uuid"
        :name="name + '.dg.' + dg.uuid"
        :removable-end-date="index === lastElementIndex"
        :start-end-dates="dg"
        @update:start-end-dates="updateStartEndDates(dg.uuid, $event)"
        v-model:is-end-date-visible="dg.isEndDateVisible"
        @remove-dates="removeDates(dg.uuid)"
        class="mb-4"
      />
    </div>

    <UButton
      v-if="showAddNewButton"
      variant="outline"
      icon="i-mdi-calendar"
      :label="$t('buttons.addAnotherEffectiveDate')"
      padded
      class="mt-4 py-3 px-7"
      @click="addNewGroup"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'
import StartEndGroup from '~/components/individual-person/effective-dates/startEndGroup.vue'
import { StartEndDateGroupSchemaType } from '~/utils/si-schema/definitions'

const emit = defineEmits<{
  (e: 'dates-updated', value: Array<StartEndDateGroupSchemaType>): void,
}>()

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
  props.initialDateGroups.map(dg => {
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
  const updatedList = displayList.value.map(dg => {
    if (!!dg.startDate || !!dg.endDate) {
      return {
        startDate: dg.startDate,
        endDate: dg.endDate
      }
    }
  })
  emit('dates-updated', updatedList)
}

const updateStartEndDates = (uuid, updatedStartEndDates) => {
  const elem = displayList.value.find(d => uuid == d.uuid)
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
