<template>
  <BcrosTablesTable
    data-cy="individualsSummaryTable"
    :headers="headers"
    :items="individuals"
    :empty-state="$t('texts.tables.emptyTexts.individualsSummaryTable')"
  >
    <template #table-row="{ item, index }">
      <tr v-if="item.action != FilingActionE.REMOVE && editingIndex != index">
        <td data-cy="summary-table-name">
          <span class="font-bold">{{ item.profile.fullName.toUpperCase() }}</span><br>
          <span v-if="item.profile.preferredName">{{ item.profile.preferredName }}<br></span>
          <span>{{ item.profile.email }}</span>
        </td>
        <td data-cy="summary-table-address">
          <BcrosInputsAddressDisplay :model-value="item.profile.address" />
        </td>
        <td data-cy="summary-table-details">
          <span>{{ item.profile.birthDate }}</span><br>
          <span v-if="item.profile.taxNumber">{{ item.profile.taxNumber }}<br></span>
          <span v-else>{{ $t('texts.noCRATaxNumber') }}<br></span>
          <span v-if="item.profile.citizenshipCA === CitizenshipTypeE.PR">
            {{ $t('labels.countryOfCitizenship.pr') }}<br>
          </span>
          <div v-else>
            <label>{{ $t('labels.citizenships') }}:</label><br>
            <span v-if="item.profile.citizenshipCA === CitizenshipTypeE.CITIZEN">
              {{ $t('countries.ca') }}<br>
            </span>
            <span v-for="country in item.profile.citizenshipsExCA" :key="country.name">
              {{ country.name }}<br>
            </span>
          </div>
          <span>{{ getTaxResidentText(item.profile.isTaxResident) }}</span>
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
          <div v-if="Object.values(item.controlType.sharesVotes).includes(true)">
            <span class="font-bold italic">
              {{ $t('labels.shares') }}
            </span>
            <p>{{ getSharesControlText(item) }}</p>
            <p v-if="item.controlType.sharesVotes.inConcertControl">
              {{ $t('texts.sharesAndVotes.summary.inConcert') }}
            </p>
          </div>
          <div v-if="Object.values(item.controlType.directors).includes(true)" class="mt-3">
            <span class="font-bold italic">
              {{ $t('labels.directors') }}
            </span>
            <p>{{ getDirectorsControlText(item.controlType.directors) }}</p>
            <p v-if="item.controlType.directors.inConcertControl">
              {{ $t('texts.controlOfDirectors.summary.inConcert') }}
            </p>
          </div>
          <div v-if="item.controlType.other" class="mt-3">
            <span class="font-bold italic">
              {{ $t('labels.other') }}
            </span>
            <p>{{ item.controlType.other }}</p>
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
      <!-- standard class or css style without !important was not working -->
      <tr
        v-if="item.action != FilingActionE.REMOVE && editingIndex != index"
        style="border-top-width: 0!important"
        data-cy="summary-table-external-influence"
      >
        <td colspan="6">
          <p v-if="item.externalInfluence === ExternalInfluenceE.CAN_BE_INFLUENCED">
            {{ $t('labels.externalInfluence.canBeInfluenced') }}
          </p>
          <p v-else-if="item.externalInfluence === ExternalInfluenceE.CAN_INFLUENCE">
            {{ $t('labels.externalInfluence.canInfluence') }}
          </p>
          <p v-else>
            {{ $t('labels.externalInfluence.noExternalInfluence') }}
          </p>
        </td>
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
import { ExternalInfluenceE } from '~/enums/external-influence-e'
import { SignificantIndividualI } from '~/interfaces/significant-individual-i'

const emit = defineEmits(['toggle-editing-mode'])
const props = defineProps({
  individuals: {
    type: Array as PropType<SignificantIndividualI[]>,
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
  return props.individuals.every(individual => individual.action === FilingActionE.REMOVE)
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

function getSharesControlText (significantIndividual: SignificantIndividualI) {
  const field = getControlTextField([
    { value: significantIndividual.controlType.sharesVotes.registeredOwner, field: 'registered' },
    { value: significantIndividual.controlType.sharesVotes.beneficialOwner, field: 'beneficial' },
    { value: significantIndividual.controlType.sharesVotes.indirectControl, field: 'indirect' }
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

  const voteRanges: Map<PercentageRangeE, string> = new Map([
    [PercentageRangeE.MORE_THAN_75, t('texts.sharesAndVotes.percentageRange.moreThan75', { sharesOrVotes: 'votes' })],
    [PercentageRangeE.MORE_THAN_50_TO_75, t('texts.sharesAndVotes.percentageRange.moreThan50To75',
      { sharesOrVotes: 'votes' })],
    [PercentageRangeE.AT_LEAST_25_TO_50, t('texts.sharesAndVotes.percentageRange.atLeast25To50',
      { sharesOrVotes: 'votes' })],
    [PercentageRangeE.LESS_THAN_25, t('texts.sharesAndVotes.percentageRange.lessThan25', { sharesOrVotes: 'votes' })],
    [PercentageRangeE.NO_SELECTION, '']
  ])

  let sharesAndVotes: string = shareRanges.get(significantIndividual.percentOfShares) || ''
  if (sharesAndVotes !== '') {
    sharesAndVotes += '; '
  }
  sharesAndVotes += voteRanges.get(significantIndividual.percentOfVotes)

  if (field) {
    return t(
      `texts.sharesAndVotes.summary.${field}`, { sharesAndVotes })
  }
  return ''
}

function getDirectorsControlText (directorsConstrol: ControlOfDirectorsI) {
  const field = getControlTextField([
    { value: directorsConstrol.directControl, field: 'direct' },
    { value: directorsConstrol.indirectControl, field: 'indirect' },
    { value: directorsConstrol.significantInfluence, field: 'significantinfluence' }
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

function updateSignificantIndividual (index: number, updatedSI: SignificantIndividualI) {
  useSignificantIndividuals().filingUpdateSI(index, updatedSI)
  closeEditingMode()
}
</script>

<style scoped>
td {
  @apply px-3 py-4 align-text-top whitespace-normal text-sm text-gray-700
}
</style>
