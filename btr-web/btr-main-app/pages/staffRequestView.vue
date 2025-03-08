<script setup lang="ts">

import { useOmitIndividual } from '@/stores/omit-individual'
import { RequestStatusesE } from '~/enums/request-statuses-e'

const omitIndividual = useOmitIndividual()
const MAX_COMMENT_SIZE = 2000
const { activeRequest, activeComments, staffComment, changeState } = storeToRefs(omitIndividual)

const t = useNuxtApp().$i18n.t

const loading = ref(true)
const identifier = ref('')

const statusKeys = Object.keys(RequestStatusesE)
const statusFilterOptions = []
for (let i = 0; i < statusKeys.length; i++) {
  statusFilterOptions.push({ value: statusKeys[i], label: RequestStatusesE[statusKeys[i]] })
}

const formatDate = function (date: string, includeTime?: boolean) {
  let options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  if (typeof includeTime !== 'boolean' || includeTime === true) {
    options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'long'
    }
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

onBeforeMount(() => {
  identifier.value = useRoute().params.identifier as string
  callLoadRequest()
})

const callLoadRequest = async function () {
  loading.value = true
  if (identifier.value) {
    await omitIndividual.loadSavedOmitIndividual(identifier.value)
  }
  loading.value = false
}

const numDaysBetweenNow = function (d) {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round((new Date() - new Date(d)) / (oneDay))
}

const individualAtRiskDisplay = computed(() => {
  const rv = []
  for (let i = 0; i < activeRequest?.value?.individualAtRisk?.length; i++) {
    rv.push(t('staffSiView.labels.' + activeRequest?.value?.individualAtRisk[i]))
  }
  return rv.join(' & ')
})

const informationToOmitDisplay = computed(() => {
  return activeRequest?.value?.informationToOmit?.join(', ').toLowerCase().replaceAll('_', ' ')
})

const completingPartyDisplay = computed(() => {
  if (activeRequest?.value?.completingParty) {
    return t('staffSiView.labels.' + activeRequest?.value?.completingParty)
  }
  return ''
})
</script>

<template>
  <div class="w-full items-center">
    <div class="max-w-[987px]">
      <div data-cy="staff-request-header">
        <h2 class="text-2xl font-bold mb-2.5">
          {{ $t('pageHeadings.siManagementView') }}
        </h2>
      </div>

      <div class="flex justify-between items-center mb-4">
        <p data-cy="staff-si-dash-text" />
      </div>

      <BcrosSection
        data-cy="siRequestBizInfoSection"
        :section-title="$t('staffSiView.headers.bizInfo')"
        section-title-icon="i-mdi-domain"
        section-icon-color="text-bcGovColor-footer"
        rounded-bot
        rounded-top
        :padded-top="false"
        :padded-x="false"
        :padded-y="false"
        class="mb-10"
      >
        <template #section-title>
          <BcrosStaffSectionHeader
            datacy="bizInfo"
            :title="$t('staffSiView.headers.bizInfo')"
            icon="i-mdi-domain"
          />
        </template>

        <template #default>
          <div class="px-8 py-4">
            <BcrosInfoLine
              datacy="bizName"
              :label="$t('staffSiView.labels.bizName')"
              :value="activeRequest?.business?.legalName"
            />
            <BcrosInfoLine
              datacy="corpNo"
              :label="$t('staffSiView.labels.corpNo')"
              :value="activeRequest?.businessIdentifier"
            />
            <BcrosInfoLine
              datacy="filingDate"
              :label="$t('staffSiView.labels.siFilingDate')"
              :value="formatDate(activeRequest?.createdAt)"
            />
            <BcrosInfoLine
              datacy="days"
              :label="$t('staffSiTable.days')"
              :value="numDaysBetweenNow(activeRequest?.createdAt)"
            />
          </div>
        </template>
      </BcrosSection>

      <BcrosSection
        data-cy="siRequestSISection"
        :section-title="$t('staffSiView.headers.si')"
        section-title-icon="i-mdi-account-cog"
        section-icon-color="text-bcGovColor-footer"
        rounded-bot
        rounded-top
        :padded-top="false"
        :padded-x="false"
        :padded-y="false"
        class="mb-10"
      >
        <template #section-title>
          <BcrosStaffSectionHeader
            :title="$t('staffSiView.headers.si')"
            icon="i-mdi-account-cog"
          />
        </template>

        <template #default>
          <div class="px-8 py-4">
            <BcrosInfoLine
              datacy="fullName"
              :label="$t('staffSiView.labels.fullName')"
              :value="activeRequest?.fullName"
            />
            <BcrosInfoLine
              datacy="born"
              :label="$t('staffSiView.labels.born')"
              :value="formatDate(activeRequest?.birthdate, false)"
            />
            <!-- <BcrosInfoLine
              :label="$t('staffSiView.labels.citizenship')"
              :value="activeRequest?.birthdate"
            /> -->

            <hr></hr>

            <BcrosInfoLine
              datacy="infoToOmit"
              :label="$t('staffSiView.labels.informationToOmit')"
              :value="informationToOmitDisplay"
              value-class="capitalize"
            />

            <BcrosInfoLine
              datacy="atRisk"
              :label="$t('staffSiView.labels.individualAtRisk')"
              :value="individualAtRiskDisplay"
              value-class="capitalize"
            />

            <BcrosInfoLine
              datacy="reasons"
              :label="$t('staffSiView.labels.reasons')"
              :value="activeRequest?.reasons"
            />
          </div>
        </template>
      </BcrosSection>

      <BcrosSection
        data-cy="siRequestSISection"
        :section-title="$t('staffSiView.headers.completingParty')"
        section-title-icon="i-mdi-account-supervisor-circle-outline"
        section-icon-color="text-bcGovColor-footer"
        rounded-bot
        rounded-top
        :padded-top="false"
        :padded-x="false"
        :padded-y="false"
        class="mb-10"
      >
        <template #section-title>
          <BcrosStaffSectionHeader
            :title="$t('staffSiView.headers.completingParty')"
            icon="i-mdi-account-supervisor-circle-outline"
          />
        </template>

        <template #default>
          <div class="px-8 py-4">
            <BcrosInfoLine
              datacy="cp"
              :label="$t('staffSiView.labels.completingParty')"
              :value="completingPartyDisplay"
            />
            <BcrosInfoLine
              datacy="cpName"
              :label="$t('staffSiView.labels.fullName')"
              :value="activeRequest?.completingName"
            />
            <BcrosInfoLine
              datacy="email"
              :label="$t('staffSiView.labels.email')"
              :value="activeRequest?.completingEmail"
            />
          </div>
        </template>
      </BcrosSection>

      <BcrosSection
        data-cy="siRequestSISection"
        :section-title="$t('staffSiView.headers.comment')"
        section-title-icon="i-mdi-comment-text-outline"
        section-icon-color="text-bcGovColor-footer"
        rounded-bot
        rounded-top
        :padded-top="false"
        :padded-x="false"
        :padded-y="false"
        class="mb-10"
      >
        <template #section-title>
          <BcrosStaffSectionHeader
            :title="$t('staffSiView.headers.comment')"
            icon="i-mdi-comment-text-outline"
          />
        </template>

        <template #default>
          <div class="px-8 py-4 flex">
            <div class="basis-1/3 font-bold">
              {{ $t('staffSiView.labels.enterComments') }}
            </div>
            <div class="basis-2/3">
              <UTextarea
                v-model="staffComment"
                data-cy="staff-comment-box"
                :maxlength="MAX_COMMENT_SIZE"
                :placeholder="$t('staffSiView.labels.enterComments')"
              />
              <div
                class="flex justify-end text-xs text-gray-500"
                :class="{
                  'text-red-500': staffComment?.length >= MAX_COMMENT_SIZE,
                }"
              >
                {{ staffComment?.length || 0 }} / {{ MAX_COMMENT_SIZE }}
              </div>
            </div>
          </div>
        </template>
      </BcrosSection>

      <BcrosSection
        data-cy="siRequestSISection"
        :section-title="$t('staffSiView.headers.status')"
        section-title-icon="i-mdi-list-status"
        section-icon-color="text-bcGovColor-footer"
        rounded-bot
        rounded-top
        :padded-top="false"
        :padded-x="false"
        :padded-y="false"
        class="mb-10"
      >
        <template #section-title>
          <BcrosStaffSectionHeader
            :title="$t('staffSiView.headers.status')"
            icon="i-mdi-list-status"
          />
        </template>

        <template #default>
          <div class="px-8 py-4 flex">
            <div class="basis-1/3 font-bold">
              {{ $t('staffSiView.labels.changeStatus') }}
            </div>
            <div class="basis-2/3">
              <USelect
                v-model="changeState"
                data-cy="stateSelect"
                :placeholder="$t('staffSiView.labels.changeStatus')"
                :options="statusFilterOptions"
              />
            </div>
          </div>
        </template>
      </BcrosSection>

      <BcrosSection
        data-cy="siRequestSISection"
        :section-title="$t('staffSiView.headers.timeline')"
        section-title-icon="i-mdi-forum"
        section-icon-color="text-bcGovColor-footer"
        rounded-bot
        rounded-top
        :padded-top="false"
        :padded-x="false"
        :padded-y="false"
        class="mb-10"
      >
        <template #section-title>
          <BcrosStaffSectionHeader
            :title="$t('staffSiView.headers.timeline')"
            icon="i-mdi-forum"
          />
        </template>

        <template #default>
          <div class="px-8 py-4" datacy="comments">
            <BcrosComments
              :comments="activeComments"
            />
          </div>
        </template>
      </BcrosSection>
    </div>
  </div>
</template>
