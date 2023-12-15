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
          <span>{{ row.profile.birthDate }}</span><br>
          <span v-if="row.profile.taxNumber">{{ row.profile.taxNumber }}<br></span>
          <span v-else>{{ $t('texts.noCRATaxNumber') }}<br></span>
          <span v-if="row.profile.citizenshipCA === CitizenshipTypeE.PR">
            {{ $t('labels.countryOfCitizenship.pr') }}<br>
          </span>
          <div v-else>
            <label>{{ $t('labels.citizenships') }}:</label><br>
            <span v-if="row.profile.citizenshipCA === CitizenshipTypeE.CITIZEN">{{ $t('countries.ca') }}<br></span>
            <span v-for="country in row.profile.citizenshipsExCA" :key="country.name">
              {{ country.name }}<br>
            </span>
          </div>
          <span>{{ getTaxResidentText(row.profile.isTaxResident) }}</span>
        </div>
      </template>

      <template #significanceDates-data="{ row }">
        <div data-cy="summary-table-dates">
          {{ $t('texts.dateRange', {
            start: row.startDate ? row.startDate : $t('labels.unknown'),
            end: row.endDate ? row.endDate : $t('labels.current') }) }}
        </div>
      </template>

      <template #control-data="{ row }">
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
      

      <template #actions-data="{ row, index }">
        <div>
          <UButton 
            label="Edit"
            color="white"
            @click="()=>{
              currentEditIndex = index
              filingEditSIOpen(index)
            }"
          />
          <UPopover>
            <UButton 
              color="white" 
              icon="i-heroicons-chevron-down-20-solid"
            />
            <template #panel>
              <div class="p-4">
                <UButton 
                  label="Remove"
                  color="white"
                  @click="()=>{console.log('remove button clicked')}"
                />
              </div>
            </template>
          </UPopover>
        </div>
      </template>
      
      <template #editForm-data="{ row }">
        <div v-if="currentEditIndex != -1" class="mt-10 bg-white rounded flex flex-row">
          <label class="font-bold text-lg min-w-[190px]">Edit an Individual</label>
          <IndividualPersonAddNew
            :setSignificantIndividual="row"
            @cancel="() => {
              filingEditSIClose()
            }"
            @add="()=>{console.log('add button clicked')}"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
const {filingEditSIOpen, filingEditSIClose} = useSignificantIndividuals()

defineProps<{ individuals: SignificantIndividualI[] }>()
//TO-DO: a model value so the parent component knows if the user is editing a SI. 

const currentEditIndex = ref(-1)

const { t } = useI18n()
const headers = [
  { key: 'name', label: t('labels.name') },
  { key: 'address', label: t('labels.address') },
  { key: 'details', label: t('labels.details') },
  { key: 'significanceDates', label: t('labels.significanceDates') },
  { key: 'control', label: t('labels.control') },
  { key: 'actions'},
  { key: 'editForm'}
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

<style>
/* Ensure the table row has a relative position to act as a container for absolute positioning */
tr.editing {
  background-color: lightblue;
}

/* Hide all <td> elements in a row with class 'editing' */
tr.editing td {
  display: none;
}

/* Absolute positioning for the last <td> */
tr.editing td:last-child {
  display: block;
  position: relative;
  width: 100%;
}

/* tr.removed {
  display: none;
} */

/* Hide the last <td> element in rows without class 'editing' */
tr:not(.editing) td:last-child {
  display: none;
}
</style>
