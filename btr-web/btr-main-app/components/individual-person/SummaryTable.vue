<template>
  <div data-cy="individualsSummaryTable" class="bg-white rounded-[5px] px-10 py-5">
    <UTable
      :columns="headers"
      :rows="individuals"
      :empty-state="{ icon: '', label: 'No significant individuals added yet' }"
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
          <label>Citizenship(s):</label><br>
          <span v-if="row.profile.citizenshipCA !== 'other'">Canada<br></span>
          <span v-for="country in row.profile.citizenshipsExCA" :key="country.name">
            {{ country.name }}<br>
          </span>
          <span>{{ getTaxResidentText(row.profile.isTaxResident) }}</span>
        </div>
      </template>

      <template #significanceDates-data="{ row }">
        <div data-cy="summary-table-dates">
          {{ displayDate(row.startDate) || 'Unknown' }} to<br>
          {{ row.endDate || 'Current' }}
        </div>
      </template>

      <template #controls-data="{ row }">
        <div data-cy="summary-table-controls">
          <div v-if="Object.values(row.controlType.sharesVotes).includes(true)">
            <h4 class="font-bold italic">
              Shares
            </h4>
            <p>{{ getSharesControlText(row) }}</p>
            <p v-if="row.controlType.sharesVotes.inConcertControl">
              25% or more of shares or votes exercised in concert
            </p>
          </div>
          <div v-if="Object.values(row.controlType.directors).includes(true)" class="mt-3">
            <h4 class="font-bold italic">
              Directors
            </h4>
            <p>{{ getDirectorsControlText(row.controlType.directors) }}</p>
            <p v-if="row.controlType.directors.noControl">
              Control of directors exercised in concert
            </p>
          </div>
          <div v-if="row.controlType.other" class="mt-3">
            <h4 class="font-bold italic">
              Other
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

const headers = [
  { key: 'name', label: 'Name' },
  { key: 'address', label: 'Address' },
  { key: 'details', label: 'Details' },
  { key: 'significanceDates', label: 'Significance Dates' },
  { key: 'controls', label: 'Controls' }
]

function getTaxResidentText (isTaxResident: boolean) {
  if (isTaxResident) {
    return 'Tax Resident of Canada'
  }
  return 'Not a Tax Resident of Canada'
}

function getControlText (items: { value: boolean, label: string }[]) {
  let text = ''
  const activeLabels = items.filter(item => item.value).map(item => item.label)
  if (activeLabels.length === 1) {
    text = activeLabels[1]
  } else if (activeLabels.length === 2) {
    // 'this and that'
    text = activeLabels.join(' and ')
  } else {
    // 'this, this, ..., and that'
    activeLabels[activeLabels.length - 1] = `and ${activeLabels[activeLabels.length - 1]}`
    text = activeLabels.join(', ')
  }
  return text
}

function getSharesControlText (significantIndividual: SignificantIndividualI) {
  let text = getControlText([
    { value: significantIndividual.controlType.sharesVotes.registeredOwner, label: 'Registered owner' },
    { value: significantIndividual.controlType.sharesVotes.beneficialOwner, label: 'Beneficial owner' },
    { value: significantIndividual.controlType.sharesVotes.indirectControl, label: 'Indirect control' }
  ])
  if (text) {
    text += ` of ${significantIndividual.percentOfShares}% of shares, ${significantIndividual.percentOfVotes}% of votes`
  }
  return text
}

function getDirectorsControlText (directorsConstrol: ControlOfDirectorsI) {
  let text = getControlText([
    { value: directorsConstrol.directControl, label: 'Direct control' },
    { value: directorsConstrol.indirectControl, label: 'Indirect control' },
    { value: directorsConstrol.significantInfluence, label: 'Significant influence control' }
  ])
  if (text) {
    text += ' of the majority of directors'
  }
  return text
}
</script>

<style scoped>

</style>
