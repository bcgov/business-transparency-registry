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
      the v-if is set to false for now; it will be update in ticket #21234 so the
      warning message is displayed when there is any redacted information.
     -->
    <template v-if="false" #header-warning>
      <div class="flex flex-row ml-3">
        <UIcon name="i-mdi-alert" class="bg-orange-500 mt-0.5 mr-1" />
        <span class="text-sm">
          <strong>{{ `Note` }}:</strong>
          {{ `Some information is not shown due to privacy reasons` }}
        </span>
      </div>
    </template>
    <template #table-row="{ item, index }">
      <!-- To-Do:
        The content of table data will be updated in ticket #21234 to match the new UI design;
        Re-organize the i18n file for Summary Table
      -->
      <template v-if="item.ui.action != FilingActionE.REMOVE && editingIndex != index">
        <tr class="data-row border-t border-gray-200">
          <!-- Name Column -->
          <td data-cy="summary-table-name">
            <div class="data-wrapper">
              <div>
                {{ item.name.fullName.toUpperCase() }}
                <!-- To-Do: add the tag for status, e.g., 'NEW', 'UPDATED', 'CEASED' -->
              </div>
              <BcrosTablesDetailsInfoBox
                v-if="item.name.preferredName"
                :title="`Preferred Name`"
                :content="item.name.preferredName"
              />
              <BcrosTablesDetailsInfoBox
                v-if="item.birthDate"
                :title="`Born`"
                :content="item.birthDate"
              />
              <!--
                To-Do: display country flags for countries of citizenship
                Question: how do we handle multiple citizenships?
              -->
            </div>
          </td>

          <!-- Detials Column -->
          <td data-cy="summary-table-details">
            <div class="data-wrapper">
              <div>{{ item.email }}</div>

              <BcrosInputsAddressDisplay
                :model-value="item.address"
              />

              <BcrosTablesDetailsInfoBox
                v-if="item.address.locationDescription"
                :title="`Location description`"
                :content="item.address.locationDescription"
              />

              <!-- To-Do: phone number -->

              <BcrosTablesDetailsInfoBox
                :title="`Tax Residency`"
                :content="item.isTaxResident? 'Canada' : 'Other'"
              />

              <div v-if="item.tax.taxNumber">
                {{ item.tax.taxNumber }}
              </div>
            </div>
          </td>

          <!-- Control Column -->
          <td data-cy="summary-table-controls">
            <div class="data-wrapper">
              <div v-if="item.controlOfShares.percentage !== PercentageRangeE.NO_SELECTION">
                <span class="font-bold italic">
                  {{ $t('labels.shares') }}
                </span>
                <p>{{ getSharesControlText(item) }}</p>
                <p v-if="item.controlOfShares.inConcertControl">
                  {{ $t('texts.sharesAndVotes.summary.inConcert') }}
                </p>
              </div>
              <div v-if="item.controlOfVotes.percentage !== PercentageRangeE.NO_SELECTION">
                <span class="font-bold italic">
                  {{ $t('labels.votes') }}
                </span>
                <p>{{ getVotesControlText(item) }}</p>
                <p v-if="item.controlOfVotes.inConcertControl">
                  {{ $t('texts.sharesAndVotes.summary.inConcert') }}
                </p>
              </div>
              <div v-if="Object.values(item.controlOfDirectors).includes(true)">
                <span class="font-bold italic">
                  {{ $t('labels.directors') }}
                </span>
                <p>{{ getDirectorsControlText(item.controlOfDirectors) }}</p>
                <p v-if="item.controlOfDirectors.inConcertControl">
                  {{ $t('texts.controlOfDirectors.summary.inConcert') }}
                </p>
              </div>
              <div v-if="item.controlOther">
                <span class="font-bold italic">
                  {{ $t('labels.other') }}
                </span>
                <p>{{ item.controlOther }}</p>
              </div>
            </div>
          </td>

          <!-- Effective Dates Column -->
          <td data-cy="summary-table-dates">
            <div class="data-wrapper">
              {{
                $t('texts.dateRange', {
                  start: item.startDate ? item.startDate : $t('labels.unknown'),
                  end: item.endDate ? item.endDate : $t('labels.current')
                })
              }}<br>
              {{ item.startDate }}<br>
              {{ item.endDate }}
            </div>
          </td>
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
      </template>

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
            {{ $t('texts.tables.emptyTexts.individualsSummaryTable') }}
          </div>
        </td>
      </tr>
    </template>
  </BcrosTablesTable>
</template>

<script setup lang="ts">
import { SiControlOfDirectorsSchemaType, SiSchemaType } from '~/utils/si-schema/definitions'
import { PercentageRangeE } from '~/enums/percentage-range-e'

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
  { content: t('labels.details'), width: '25%' },
  { content: t('labels.control'), width: '30%' },
  { content: t('labels.effectiveDates'), width: '20%' }
]

const isEmptyState = computed(() => {
  return props.individuals.filter(individual => individual.ui.action !== FilingActionE.REMOVE).length === 0
})

function getControlTextField (items: { value: boolean, field: string }[]) {
  const activeLabels = items.filter(item => item.value).map(item => item.field)
  return activeLabels.join('') || ''
}

function getSharesControlText (si: SiSchemaType) {
  const field = getControlTextField([
    { value: si.controlOfShares.registeredOwner || si.controlOfVotes.registeredOwner, field: 'registered' },
    { value: si.controlOfShares.beneficialOwner || si.controlOfVotes.beneficialOwner, field: 'beneficial' },
    { value: si.controlOfShares.indirectControl || si.controlOfVotes.indirectControl, field: 'indirect' }
  ])

  const shareRanges: Map<PercentageRangeE, string> = new Map([
    [PercentageRangeE.MORE_THAN_75, t('texts.sharesAndVotes.percentageRange.moreThan75', { sharesOrVotes: 'shares' })],
    [PercentageRangeE.MORE_THAN_50_TO_75, t('texts.sharesAndVotes.percentageRange.moreThan50To75',
      { sharesOrVotes: 'shares' })],
    [PercentageRangeE.AT_LEAST_25_TO_50, t('texts.sharesAndVotes.percentageRange.atLeast25To50',
      { sharesOrVotes: 'shares' })],
    [PercentageRangeE.LESS_THAN_25, t('texts.sharesAndVotes.percentageRange.lessThan25', { sharesOrVotes: 'shares' })],
    [PercentageRangeE.NO_SELECTION, '']
  ])

  let shares: string = ''
  if (si.controlOfShares.percentage) {
    shares = shareRanges.get(si.controlOfShares.percentage) || ''
  }

  if (field) {
    return t(
      `texts.sharesAndVotes.summary.${field}`, { sharesAndVotes: shares })
  }
  return ''
}

function getVotesControlText (si: SiSchemaType) {
  const field = getControlTextField([
    { value: si.controlOfVotes.registeredOwner, field: 'registered' },
    { value: si.controlOfVotes.beneficialOwner, field: 'beneficial' },
    { value: si.controlOfVotes.indirectControl, field: 'indirect' }
  ])

  const voteRanges: Map<PercentageRangeE, string> = new Map([
    [PercentageRangeE.MORE_THAN_75, t('texts.sharesAndVotes.percentageRange.moreThan75', { sharesOrVotes: 'votes' })],
    [PercentageRangeE.MORE_THAN_50_TO_75, t('texts.sharesAndVotes.percentageRange.moreThan50To75',
      { sharesOrVotes: 'votes' })],
    [PercentageRangeE.AT_LEAST_25_TO_50, t('texts.sharesAndVotes.percentageRange.atLeast25To50',
      { sharesOrVotes: 'votes' })],
    [PercentageRangeE.LESS_THAN_25, t('texts.sharesAndVotes.percentageRange.lessThan25', { sharesOrVotes: 'votes' })],
    [PercentageRangeE.NO_SELECTION, '']
  ])

  let votes: string = ''
  if (si.controlOfVotes.percentage) {
    votes += voteRanges.get(si.controlOfVotes.percentage)
  }
  if (field) {
    return t(
      `texts.sharesAndVotes.summary.${field}`, { sharesAndVotes: votes })
  }

  return ''
}

function getDirectorsControlText (controlOfDirectors: SiControlOfDirectorsSchemaType) {
  const field = getControlTextField([
    { value: controlOfDirectors.directControl, field: 'direct' },
    { value: controlOfDirectors.indirectControl, field: 'indirect' },
    { value: controlOfDirectors.significantInfluence, field: 'significantinfluence' }
  ])
  if (field) {
    return t(`texts.controlOfDirectors.summary.${field}`)
  }
  return ''
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

<style scoped>
.data-row > td:not(.action-button) {
  @apply px-3 py-4 align-text-top whitespace-normal text-sm text-gray-700
}

.data-wrapper {
  @apply flex flex-col gap-3
}
</style>
