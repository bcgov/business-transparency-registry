<template>
  <BcrosTablesTable
    data-cy="individualsSummaryTable"
    :headers="headers"
    :items="individualsToDisplay"
    :empty-state="$t('texts.tables.emptyTexts.individualsSummaryTable')"
  >
    <template #table-row="{ item }">
      <tr>
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
          {{ $t('texts.dateRange', {
            start: item.startDate ? item.startDate : $t('labels.unknown'),
            end: item.endDate ? item.endDate : $t('labels.current') }) }}
        </td>
        <td data-cy="summary-table-controls">
          <div v-if="Object.values(item.controlType.sharesVotes).includes(true)">
            <h4 class="font-bold italic">
              {{ $t('labels.shares') }}
            </h4>
            <p>{{ getSharesControlText(item) }}</p>
            <p v-if="item.controlType.sharesVotes.inConcertControl">
              {{ $t('texts.sharesAndVotes.summary.inConcert') }}
            </p>
          </div>
          <div v-if="Object.values(item.controlType.directors).includes(true)" class="mt-3">
            <h4 class="font-bold italic">
              {{ $t('labels.directors') }}
            </h4>
            <p>{{ getDirectorsControlText(item.controlType.directors) }}</p>
            <p v-if="item.controlType.directors.inConcertControl">
              {{ $t('texts.controlOfDirectors.summary.inConcert') }}
            </p>
          </div>
          <div v-if="item.controlType.other" class="mt-3">
            <h4 class="font-bold italic">
              {{ $t('labels.other') }}
            </h4>
            <p>{{ item.controlType.other }}</p>
          </div>
        </td>
        <template v-if="edit">
          <!-- Edit Button -->
        </template>
      </tr>
    </template>
  </BcrosTablesTable>
</template>

<script setup lang="ts">
const props = defineProps({
  individuals: {
    type: Array as PropType<SignificantIndividualI[]>,
    required: true
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()
const headers = [
  t('labels.name'), t('labels.address'), t('labels.details'), t('labels.significanceDates'), t('labels.control')
]

// individuals that are marked as removed will not be displayed
const individualsToDisplay = computed(() => {
  return props.individuals.filter(
    individual => individual.action !== FilingActionE.REMOVE)
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
  if (field) {
    return t(
      `texts.sharesAndVotes.summary.${field}`,
      {
        sharePercent: significantIndividual.percentOfShares || '0',
        votePercent: significantIndividual.percentOfVotes || '0'
      })
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
</script>

<style scoped>
td {
  @apply px-3 py-4 align-text-top whitespace-normal text-sm text-gray-700
}
</style>
