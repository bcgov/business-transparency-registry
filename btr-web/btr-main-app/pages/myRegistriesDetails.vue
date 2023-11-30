<template>
  <div>
    <h1 class="font-bold text-2xl" data-cy="myRegDetailsHeader">
      {{ $t('pageHeadings.myRegDetails') }}
    </h1>
    <p class="pt-3 text-sm" data-cy="myRegDetailsHeaderSub">
      {{ $t('texts.myRegDetails') }}
    </p>
    <div class="max-w-[750px] pt-10">
      <div class="bg-bcGovBlue-50 flex p-5 rounded-t-[5px]">
        <UIcon class="text-bcGovBlue-400 text-2xl" name="i-mdi-account-details" />
        <h3 class="font-bold ml-2" data-cy="myRegDetailsSectionHeader">
          {{ $t('sectionHeadings.profileDetails') }}
        </h3>
      </div>
      <div class="bg-white rounded-b-[5px] pl-2 pb-5">
        <BcrosTablesInfoTable :items="items" data-cy="myRegDetailsTable">
          <template #label-citizenship="{ row }">
            <!-- NOTE: slot override only needed due to special whitespace break for this label only -->
            <p class="font-bold text-gray-800 max-w-[200px] whitespace-normal">
              {{ row.label }}
            </p>
            <p class="text-gray-700 text-xs">
              {{ row.subLabel }}
            </p>
          </template>
          <template #info-address="{ row }">
            <BcrosInputsAddressDisplay :model-value="row.info" />
          </template>
          <template #info-competency>
            <!-- FUTURE: add in not competent version -->
            <span>{{ $t('texts.isCompetent') }}</span>
          </template>
        </BcrosTablesInfoTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const items: InfoTableItemI = [
  { label: t('labels.fullName'), info: 'Wallaby Wobbles' },
  { label: t('labels.birthdate'), info: 'September 25, 1993' },
  {
    label: t('labels.addressResidential'),
    info: {
      country: { name: 'Canada', alpha_2: 'CA' },
      line1: '123 Fake St',
      city: 'Victoria',
      region: 'BC',
      postalCode: 'V2L 3T6'
    },
    slot: 'address'
  },
  { label: t('labels.emailAddress'), info: '1@1.com' },
  { label: t('labels.taxNumber'), subLabel: t('labels.socialInsuranceNumber'), info: '123 456 789' },
  { label: t('labels.citizenshipPR'), subLabel: t('labels.citizenship'), info: 'Canada', slot: 'citizenship' },
  { label: t('labels.taxResidency'), info: 'Canada' },
  { label: t('labels.competency'), info: true, slot: 'competency' }
]
</script>

<style scoped>
</style>
