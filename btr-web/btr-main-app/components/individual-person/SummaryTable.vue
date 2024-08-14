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

const editingIndex = ref(-1)

const t = useNuxtApp().$i18n.t
const headers = [
  { content: t('labels.name'), width: '25%' },
  { content: t('labels.details'), width: '30%' },
  { content: t('labels.control'), width: '25%' },
  { content: t('labels.effectiveDates'), width: '20%' }
]

const isEmptyState = computed(() => {
  return props.individuals.filter(individual => individual.ui.action !== FilingActionE.REMOVE).length === 0
})

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
  const individualToEdit = JSON.parse(JSON.stringify(props.individuals[editingIndex.value]))
  individualToEdit.action = FilingActionE.EDIT
  return individualToEdit
}

function removeSignificantIndividual (index: number) {
  useSignificantIndividuals().filingRemoveSI(index)
  closeEditingMode()
}

function updateSignificantIndividual (index: number | undefined, updatedSI: SiSchemaType) {
  if (index !== undefined) {
    useSignificantIndividuals().filingUpdateSI(index, updatedSI)
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

    <template #table-row="{ item, index }">
      <tr v-if="item.ui.action != FilingActionE.REMOVE && editingIndex != index">
        <td data-cy="summary-table-name">
          <PersonInfoName
            :item="{
              'legalName': item.name.fullName,
              'alternateName': item.name.preferredName,
              'birthDate': item.birthDate}"
          />
          <PersonInfoCitizenship
            :nationalities="item.citizenships"
          />
        </td>
        <!-- <td data-cy="summary-table-address">
          <BcrosInputsAddressDisplay :model-value="item.address" />
        </td> -->
        <td class="align-top" data-cy="summary-table-details">
          <PersonInfoDetails :item="item" />
        </td>

        <td data-cy="summary-table-controls">
          <PersonInfoControl :item="item" />
        </td>

        <td data-cy="summary-table-dates">
          <p v-for="date in item.effectiveDates" :key="date.startDate">
            {{
              $t('texts.dateRange', {
                start: date.startDate ? date.startDate : $t('labels.unknown'),
                end: date.endDate ? date.endDate : $t('labels.current')
              })
            }}
          </p>
        </td>
        <template v-if="edit">
          <td v-if="edit" data-cy="summary-table-buttons" class="action-button align-top">
            <div class="flex flex-nowrap justify-end overflow-hidden mt-2">
              <UButton
                :ui="{
                  rounded: 'rounded-none focus-visible:rounded-md',
                  padding: { default: 'py-0' }
                }"
                icon="i-mdi-pencil"
                :label="t('buttons.edit')"
                variant="editButton"
                :disabled="editingDisabled || isEditing"
                data-cy="edit-button"
                @click="openEditingMode(index)"
              />
              <UPopover :popper="{ placement: 'bottom-end' }">
                <UButton
                  :ui="{ padding: { default: 'py-0' } }"
                  icon="i-mdi-menu-down"
                  aria-label="show more options"
                  variant="removeButton"
                  :disabled="editingDisabled || isEditing"
                  data-cy="popover-button"
                />
                <template #panel>
                  <UButton
                    :ui="{ padding: { default: 'py-0' } }"
                    class="m-2"
                    icon="i-mdi-delete"
                    :label="t('buttons.remove')"
                    color="primary"
                    variant="removeButton"
                    data-cy="remove-button"
                    @click="removeSignificantIndividual(index)"
                  />
                </template>
              </UPopover>
            </div>
          </td>
        </template>
      </tr>

      <!--
          placeholder row for display warning message for minor SI
          the v-if is set to false until the feature is implemented;
          rules for minor: #20621
        -->
      <tr v-if="false">
        <td colspan="5">
          TBD - Message for Minor SI
        </td>
      </tr>

      <!-- to be updated in #21660 -->
      <tr v-if="item.missingInfoReason !== ''">
        <td colspan="5">
          TBD - Unable to obtain or confirm information
          {{ item.missingInfoReason }}
        </td>
      </tr>

      <!--
          placeholder row for cessation date and buttons
          the v-if is set to false until the feature is implemented
        -->
      <tr v-if="false">
        <td colspan="5">
          TBD - Component for cessation date and buttons
        </td>
      </tr>

      <tr v-if="isEditing && editingIndex === index">
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
.data-row > td:not(.action-button) {
  @apply px-3 py-4 align-text-top whitespace-normal text-sm text-gray-700
}
td {
  @apply px-3 py-4 align-top whitespace-normal text-sm text-gray-700
}

.data-wrapper {
  @apply flex flex-col gap-3
}
</style>
