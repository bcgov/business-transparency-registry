<script setup lang="ts">
import { SiSchemaType } from '~/utils/si-schema/definitions'

const emit = defineEmits(['toggle-editing-mode'])
const props = defineProps({
  individuals: {
    type: Array as PropType<SiSchemaType[]>,
    required: true
  },
  edit: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  editingDisabled: {
    type: Boolean,
    default: false
  }
})

const { allEditableSIs } = storeToRefs(useSignificantIndividuals())
const editingIndex = ref(-1)

const t = useNuxtApp().$i18n.t
const headers = [
  { content: t('labels.name'), width: '25%' },
  { content: t('labels.details'), width: '30%' },
  { content: t('labels.control'), width: '25%' },
  { content: t('labels.effectiveDates'), width: '20%' }
]

const isEmptyState = computed(() => {
  return props.individuals.filter(individual => !individual.ui.actions?.includes(FilingActionE.HISTORICAL)).length === 0
})

const getActionButton = (item: SiSchemaType, index: number) => {
  if (item.ui.actions?.includes(FilingActionE.ADD)) {
    return {
      action: openEditingMode,
      actionArg: index,
      disabled: props.editingDisabled || props.isEditing,
      icon: 'i-mdi-pencil',
      label: t('buttons.edit')
    }
  }
  if (item.ui.actions?.includes(FilingActionE.EDIT) || item.ui.actions?.includes(FilingActionE.CEASE)) {
    return {
      action: undoSIChanges,
      actionArg: index,
      disabled: props.editingDisabled || props.isEditing,
      icon: 'i-mdi-undo',
      label: t('buttons.undo')
    }
  }
  return {
    action: openEditingMode,
    actionArg: index,
    disabled: props.editingDisabled || props.isEditing,
    icon: 'i-mdi-pencil',
    label: t('buttons.update')
  }
}

const getActionDropDownItems = (item: SiSchemaType, index: number) => {
  if (item.ui.actions?.includes(FilingActionE.ADD)) {
    return [{
      action: removeSignificantIndividual,
      actionArg: index,
      disabled: props.editingDisabled || props.isEditing,
      icon: 'i-mdi-delete',
      label: t('buttons.remove')
    }]
  }
  if (item.ui.actions?.includes(FilingActionE.EDIT) || item.ui.actions?.includes(FilingActionE.CEASE)) {
    return [{
      action: openEditingMode,
      actionArg: index,
      disabled: props.editingDisabled || props.isEditing,
      icon: 'i-mdi-pencil',
      label: t('buttons.edit')
    }]
  }
  return [{
    action: triggerCeaseSI,
    actionArg: index,
    disabled: props.editingDisabled || props.isEditing,
    label: t('buttons.cease')
  }]
}

const undoSIChanges = (index: number) => {
  useSignificantIndividuals().undoSIChanges(index)
}

const triggerCeaseSI = (index: number) => {
  // show cease date input
  allEditableSIs.value[index].ui.showCeaseDateInput = true
}

function openEditingMode (index: number) {
  editingIndex.value = index
  emit('toggle-editing-mode')
}

function closeEditingMode () {
  editingIndex.value = -1
  if (props.isEditing) {
    emit('toggle-editing-mode')
  }
}

function copyIndividualToEdit () {
  const individualToEdit: SiSchemaType = JSON.parse(JSON.stringify(props.individuals[editingIndex.value]))
  return individualToEdit
}

function removeSignificantIndividual (index: number) {
  useSignificantIndividuals().filingRemoveSI(index)
  closeEditingMode()
}

function updateSignificantIndividual (index: number | undefined, updatedSI: SiSchemaType) {
  if (index !== undefined) {
    useSignificantIndividuals().filingUpdateSI(updatedSI, index)
  }
  closeEditingMode()
}

/** Capitalize the first letter in the given fullname. */
function capFirstLetterInName (fullName: string) {
  return fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <BcrosTablesTable
    data-cy="individualsSummaryTable"
    :table-name="`Significant Individuals`"
    icon="i-mdi-account-multiple-outline"
    :headers="headers"
    :items="individuals"
    :empty-state="$t('texts.tables.emptyTexts.individualsSummaryTable')"
  >
    <!-- To-Do:
      the v-if is set to false for now; it will be update in ticket #21656 so the
      warning message is displayed when there is any redacted information.
     -->
    <template v-if="false" #header-warning>
      <div class="flex flex-row ml-3">
        <UIcon name="i-mdi-alert" class="bg-orange-500 mt-0.5 mr-1" />
        <span class="text-sm">
          <strong>{{ $t('summaryTable.alert.note') }}:</strong>
          {{ $t('summaryTable.alert.hiddenInfo') }}
        </span>
      </div>
    </template>

    <template #table-row="{ item, index } : { item: SiSchemaType, index: number }">
      <IndividualPersonSummaryTableRowUpdating
        v-if="item.ui.updating && editingIndex != index"
        :si="item"
      />
      <IndividualPersonSummaryTableRow
        v-else-if="editingIndex != index"
        :si="item"
        :index="index"
        :action-btn="edit ? getActionButton(item, index) : undefined"
        :action-dropdown-btns="getActionDropDownItems(item, index)"
      />
      <tr
        v-else-if="isEditing && editingIndex === index"
        class="border-t-[1px] border-gray-400"
        data-cy="summary-table-row-edit"
      >
        <td data-cy="summary-table-edit-form" colspan="100%">
          <div class="bg-primary text-white flex items-center justify-between p-3">
            <div class="flex item-center">
              <UIcon name="i-mdi-pencil mt-1 mr-1" />
              <span class="font-bold">
                Editing {{ capFirstLetterInName(item.name.fullName) }}
              </span>
            </div>
            <UButton
              class="items-center"
              :label="`Cancel`"
              icon="i-mdi-close"
              :trailing="true"
              @click="closeEditingMode"
            />
          </div>
          <div class="bg-white rounded">
            <IndividualPersonAddNew
              :index="index"
              :set-significant-individual="copyIndividualToEdit()"
              class="text-base text-gray-900 w-full pb-5"
              :edit-mode="true"
              @cancel="closeEditingMode"
              @update="updateSignificantIndividual($event.index, $event.updatedSI)"
              @remove="removeSignificantIndividual(index)"
            />
          </div>
        </td>
      </tr>
    </template>

    <template #empty-state>
      <tr v-if="isEmptyState">
        <td colspan="100%">
          <div class="text-sm text-center text-gray-700 px-3 py-4">
            {{ $t('summaryTable.empty') }}
          </div>
        </td>
      </tr>
    </template>
  </BcrosTablesTable>
</template>

<style scoped>
td {
  @apply px-3 py-4 align-top whitespace-normal text-sm text-gray-700
}
</style>
