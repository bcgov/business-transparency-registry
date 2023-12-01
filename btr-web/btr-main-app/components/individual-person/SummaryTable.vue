<template>
  <div data-cy="individualsSummaryTable" class="bg-white rounded-[5px] px-10 py-5">
    <UTable
      :columns="headers"
      :rows="individuals"
      :empty-state="{ icon: '', label: $t('texts.tables.emptyTexts.individualsSummaryTable') }"
    >
      <template #name-data="{ row }">
        <div data-cy="summary-table-name">
          <span class="font-bold">{{ row.profile.fullName.toUpperCase() }}</span><br>
          <span v-if="row.profile.preferredName">{{ row.profile.preferredName }}<br></span>
          <span>{{ row.profile.email }}</span>
        </div>
      </template>

      <template #address-data="{ row }">
        <BcrosInputsAddressDisplay :model-value="row.profile.address" data-cy="summary-table-address" />
      </template>

      <template #details-data="{ row }">
        <div data-cy="summary-table-details">
          <span>{{ displayDate(row.profile.birthDate) }}</span><br>
          <span v-if="row.profile.taxNumber">{{ row.profile.taxNumber }}<br></span>
          <label>{{ $t('labels.citizenships') }}:</label><br>
          <span v-if="row.profile.citizenshipCA !== 'other'">{{ $t('countries.ca') }}<br></span>
          <span v-for="country in row.profile.citizenshipsExCA" :key="country.name">
            {{ country.name }}<br>
          </span>
          <span>{{ getTaxResidentText(row.profile.isTaxResident) }}</span>
        </div>
      </template>

      <template #significanceDates-data="{ row }">
        <div data-cy="summary-table-dates">
          {{ $t('texts.dateRange', { start: displayDate(row.startDate) || $t('labels.unknown'),
                                     end: displayDate(row.endDate) || $t('labels.current') }) }}
        </div>
      </template>

      <template #controls-data="{ row }">
        <div data-cy="summary-table-controls">
          <div v-if="Object.values(row.controlType.sharesVotes).includes(true)">
            <h4 class="font-bold italic">
              {{ $t('labels.shares') }}
            </h4>
            <p>{{ getSharesControlText(row) }}</p>
            <p v-if="row.controlType.sharesVotes.inConcertControl">
              {{ $t('texts.sharesAndVotes.summary.inConcert') }}
            </p>
          </div>
          <div v-if="Object.values(row.controlType.directors).includes(true)" class="mt-3">
            <h4 class="font-bold italic">
              {{ $t('labels.directors') }}
            </h4>
            <p>{{ getDirectorsControlText(row.controlType.directors) }}</p>
            <p v-if="row.controlType.directors.inConcertControl">
              {{ $t('texts.controlOfDirectors.summary.inConcert') }}
            </p>
          </div>
          <div v-if="row.controlType.other" class="mt-3">
            <h4 class="font-bold italic">
              {{ $t('labels.other') }}
            </h4>
            <p>{{ row.controlType.other }}</p>
          </div>
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
defineProps<{ individuals: SignificantIndividualI[] }>()

const { t } = useI18n()
const headers = [
  { key: 'name', label: t('labels.name') },
  { key: 'address', label: t('labels.address') },
  { key: 'details', label: t('labels.details') },
  { key: 'significanceDates', label: t('labels.significanceDates') },
  { key: 'controls', label: t('labels.controls') }
]

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

</style>
