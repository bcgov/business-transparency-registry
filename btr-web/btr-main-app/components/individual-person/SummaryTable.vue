<template>
  <BcrosTablesTable
    data-cy="individualsSummaryTable"
    :headers="headers"
    :items="individuals"
    :empty-state="$t('texts.tables.emptyTexts.individualsSummaryTable')"
  >
    <template #table-row="{ item, index }">
      <tr v-if="item.ui.action != FilingActionE.REMOVE && editingIndex != index">
        <td data-cy="summary-table-name">
          <span class="font-bold">{{ item.name.fullName.toUpperCase() }}</span><br>
          <span v-if="item.name.preferredName">{{ item.name.preferredName }}<br></span>
          <span>{{ item.email }}</span>
        </td>
        <td data-cy="summary-table-address">
          <BcrosInputsAddressDisplay :model-value="item.address" />
        </td>
        <td data-cy="summary-table-details">
          <span>{{ item.birthDate }}</span><br>
          <span v-if="item.tax.taxNumber">{{ item.tax.taxNumber }}<br></span>
          <span v-else>{{ $t('texts.noCRATaxNumber') }}<br></span><br>
          <label>{{ $t('labels.citizenships') }}:</label><br>
          <span v-for="country in item.citizenships" :key="country.alpha_2">
            {{ country.name }}<br>
          </span><br>
          <span>{{ getTaxResidentText(item.name.isTaxResident) }}</span>
        </td>
        <td data-cy="summary-table-dates">
          {{
            $t('texts.dateRange', {
              start: item.startDate ? item.startDate : $t('labels.unknown'),
              end: item.endDate ? item.endDate : $t('labels.current')
            })
          }}
        </td>
        <td data-cy="summary-table-controls">
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
          <div v-if="Object.values(item.controlOfDirectors).includes(true)" class="mt-3">
            <span class="font-bold italic">
              {{ $t('labels.directors') }}
            </span>
            <p>{{ getDirectorsControlText(item.controlOfDirectors) }}</p>
            <p v-if="item.controlOfDirectors.inConcertControl">
              {{ $t('texts.controlOfDirectors.summary.inConcert') }}
            </p>
          </div>
          <div v-if="item.controlOther" class="mt-3">
            <span class="font-bold italic">
              {{ $t('labels.other') }}
            </span>
            <p>{{ item.controlOther }}</p>
          </div>
        </td>
        <template v-if="edit">
          <td data-cy="summary-table-buttons">
            <div class="flex flex-nowrap justify-end">
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
      <tr v-if="isEditing && editingIndex === index">
        <td data-cy="summary-table-edit-form" colspan="100%">
          <div class="bg-white rounded flex flex-row">
            <label class="font-bold text-base text-gray-900 min-w-[190px] mt-3">
              {{ $t('labels.editIndividual') }}
            </label>
            <IndividualPersonAddNew
              :index="index"
              :set-significant-individual="copyIndividualToEdit()"
              class="ml-8 text-base text-gray-900"
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
  t('labels.name'), t('labels.address'), t('labels.details'), t('labels.significanceDates'), t('labels.control')
]

const isEmptyState = computed(() => {
  return props.individuals.filter(individual => individual.ui.action !== FilingActionE.REMOVE).length === 0
})

function getTaxResidentText (isTaxResident: boolean) {
  if (isTaxResident) {
    return t('texts.isTaxResident')
  }
  return t('texts.isNotTaxResident')
}

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
</script>

<style scoped>
td {
  @apply px-3 py-4 align-text-top whitespace-normal text-sm text-gray-700
}
</style>
