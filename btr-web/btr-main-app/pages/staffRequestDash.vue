<script setup lang="ts">

import { useOmitIndividual } from '@/stores/omit-individual'
import { RequestStatusesE } from '~/enums/request-statuses-e'

const omitIndividual = useOmitIndividual()
const { allRequests, requestCount } = storeToRefs(omitIndividual)

const DAYS_RED_THRESHOLD = 30

const statusKeys = Object.keys(RequestStatusesE)
const statusFilterOptions = []
for (let i = 0; i < statusKeys.length; i++) {
  statusFilterOptions.push({ value: statusKeys[i], label: RequestStatusesE[statusKeys[i]] })
}

const t = useNuxtApp().$i18n.t

const loading = ref(true)
const filters = ref({
  fullName: '',
  status: ''
})
const sortCol = ref('')
const sortDir = ref('desc')
const pageModel = ref({
  page: 1,
  perPage: 10
})

const callLoadAllRequests = function () {
  const s = sortCol.value ? sortCol.value : ''
  const d = sortCol.value && sortDir.value ? sortDir.value : ''
  const page = pageModel.value.page
  const limit = pageModel.value.perPage
  return omitIndividual.loadAllRequests(s, filters.value, d, page, limit)
}

const headers = [
  {
    col: 'createdAt',
    value: t('staffSiTable.days'),
    hasSort: true,
    sortApiFn: (dir: string) => {
      sortCol.value = 'createdAt'
      sortDir.value = dir
      return callLoadAllRequests()
    },
    width: '10%',
    itemFn: (item) => {
      let rv = item
      if (item && item.createdAt) {
        rv = numDaysBetweenNow(item.createdAt)
      } else if (item) {
        rv = numDaysBetweenNow(item)
      }
      if (rv > DAYS_RED_THRESHOLD) {
        return `<span class="text-red-500">${rv}</span>`
      }
      return rv
    }
  },
  {
    col: 'fullName',
    value: t('staffSiTable.si'),
    hasFilter: true,
    width: '20%',
    filter: {
      clearable: true,
      label: t('staffSiTable.si'),
      type: 'text',
      value: filters.value.fullName,
      filterApiFn: (filterVal: string) => {
        filters.value.fullName = filterVal
        return callLoadAllRequests()
      }
    }
  },
  {
    col: 'businessInfo',
    width: '20%',
    value: t('staffSiTable.business'),
    itemFn: (item) => {
      if (item.businessInfo && item.businessInfo.legalName) {
        return `<div class="underline font-bold">${item.businessInfo.legalName}</div>${item.businessIdentifier}`
      }
      return item.businessIdentifier
    }

  },
  {
    col: 'completingName',
    width: '20%',
    value: t('staffSiTable.completingParty')
  },
  {
    col: 'status',
    width: '15%',
    value: t('staffSiTable.status'),
    hasFilter: true,
    sortApiFn: (dir: string) => {
      sortCol.value = 'status'
      sortDir.value = dir
      return callLoadAllRequests()
    },
    itemFn: (item) => {
      if (typeof item === 'string') {
        item = { status: item }
      }
      const start = '<span class="text-lg text-'
      let rv = t('staffSiTable.statuses.' + item.status)
      switch (item.status.toLowerCase()) {
        case 'passed':
          rv = `${start}[#2e7d32]">&bull;</span> ${rv}`
          break
        case 'rejected':
          rv = `${start}[#dee2e6]">&bull;</span> ${rv}`
          break
        case 'awaiting_review':
          rv = `${start}[#f8661a]">&bull;</span> ${rv}`
          break
        case 'in_review':
          rv = `${start}[#1669bb]">&bull;</span> ${rv}`
          break
        case 'info_requested':
          rv = `${start}[#f8661a]">&bull;</span> ${rv}`
          break
        case 'under_appeal':
          rv = `${start}[#d3272c]">&bull;</span> ${rv}`
          break
        default:
          break
      }
      return rv
    },
    filter: {
      clearable: true,
      label: t('staffSiTable.status'),
      items: statusFilterOptions,
      itemValue: 'value',
      itemLabel: 'label',
      filterApiFn: (filterVal: string) => {
        filters.value.status = filterVal
        return callLoadAllRequests()
      },
      type: 'select'
    },
    hasSort: true
  },
  {
    col: 'uuid',
    width: '15%',
    value: t('staffSiTable.actions'),
    slotId: 'actions',
    itemFn: (item) => {
      const text = item.status.toLowerCase() === 'awaiting_review'
        ? t('staffSiTable.actionLabels.review')
        : t('staffSiTable.actionLabels.open')
      return buildButton(text, '/' + item.uuid)
    }
  }
]

const buildButton = function (text: string, link: string) {
  let rv = `<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><a href="${link}" class="`
  rv += 'focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 ' +
    'flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm ' +
    'text-white dark:text-gray-900 bg-primary-500 disabled:bg-primary-500 ' +
    'dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
    'focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 ' +
    'hover:bg-opacity-[.92] hover:bg-primary-500 inline-flex items-center'
  rv += `">${text}</a>`
  return rv
}

loading.value = true
callLoadAllRequests().then(() => {
  loading.value = false
})

const numDaysBetweenNow = function (d) {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round((new Date() - new Date(d)) / (oneDay))
}

const resetFiltersTrigger = ref(false)

const clearFilters = function () {
  filters.value.fullName = ''
  filters.value.status = ''
  callLoadAllRequests()
  resetFiltersTrigger.value = !resetFiltersTrigger.value
}

</script>

<template>
  <div class="w-full">
    <div class="max-w-[987px]">
      <div data-cy="staff-si-dash-header">
        <h2 class="text-2xl font-bold mb-2.5">
          {{ $t('pageHeadings.siManagement') }}
        </h2>
      </div>

      <div class="flex justify-between items-center mb-4">
        <p data-cy="staff-si-dash-text">
          {{ $t('texts.staffSIDashText') }}
        </p>
      </div>

      <BcrosSection
        data-cy="siRequestTableSection"
        section-title-icon="test"
        section-icon-color=""
        rounded-bot
        rounded-top
        :padded-top="true"
        :paddedX="false"
        class="mb-10"
      >
        <template #header-content>
          <div class="flex flex-col w-full bg-white px-8 pt-2.5">
            <span class="text-xl font-bold">
              {{ $t('sectionTitles.staffSiTableHeader') }}
            </span>
          </div>
        </template>
        <template #default>
          <div>
            <base-table
              class="rounded-t border-[1px] border-gray-200 mt-2 mb-10"
              height="100%"
              item-key="uuid"
              :loading="loading"
              :no-results-text="t('staffSiTable.noResults')"
              :reset-filters-trigger="resetFiltersTrigger"
              :set-headers="headers"
              :set-items="allRequests"
              title=""
              :total-items="allRequests.length"
              data-cy="staff-si-table"
            >
              <template #header-filter-slot-actions>
                <UButton
                  v-if="filters.fullName !== '' || filters.status !== ''"
                  variant="outline"
                  :label="$t('staffSiTable.clearFilters')"
                  icon="i-mdi-close"
                  trailing
                  @click="clearFilters"
                />
              </template>
            </base-table>
            <div class="w-full">
              <div class="float-right">
                <base-pagination
                  v-model="pageModel"
                  :total-results="requestCount"
                  @page-change="callLoadAllRequests"
                />
              </div>
            </div>
          </div>
        </template>
      </BcrosSection>
    </div>
  </div>
</template>
