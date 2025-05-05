<template>
  <div data-cy="business-layout">
    <BcrosCustomHeader />
    <BcrosBreadcrumb v-if="crumbConstructors.length > 0" :crumb-constructors="crumbConstructors" />
    <BcrosBusinessDetails />
    <div class="mx-auto px-4 w-full max-w-bcroslg flex">
      <div>
        <slot />
      </div>
      <div class="flex-none ml-8 mt-10">
        <BcrosWidgetsFee
          class="sticky top-10"
          :fees="payFeesWidget.fees"
          :annual-filing-year="currentSIFiling.submissionForYear"
          data-cy="pay-fees-widget"
        >
          <template #emptyFees>
            <div
              class="bg-white p-3 border-gray-300 border-b-[1px] flex"
              data-cy="pay-fees-widget-empty-fees"
            >
              <span class="font-bold text-sm mr-auto">
                <template v-if="isAnnualFiling && currentSIFiling.submissionForYear">
                  {{ $t('widgets.feeSummary.itemLabels.fileTR_Annual') }} {{ currentSIFiling.submissionForYear }}
                </template>
                <template v-else>
                  {{ $t('widgets.feeSummary.itemLabels.fileTR') }}
                </template>
              </span>
              <span class="font-bold text-2xl float-right ml-2 overflow-hidden whitespace-nowrap">
                -
              </span>
            </div>
          </template>
        </BcrosWidgetsFee>
      </div>
    </div>
    <BcrosButtonControl
      :left-button-constructors="leftButtonConstructors"
      :right-button-constructors="rightButtonConstructors"
    />
    <BcrosCustomFooter :app-version="version" />
  </div>
</template>

<script setup lang="ts">
import { usePayFeesWidget } from '../../btr-common-components/stores/pay-fees-widget'
import { FilingDataI } from '../../btr-common-components/interfaces/filling-data-i'

const payFeesWidget = usePayFeesWidget()
const filingData: FilingDataI[] = [
  {
    entityType: 'BTR',
    filingTypeCode: 'REGSIGIN',
    futureEffective: false,
    priority: false,
    waiveFees: false
  }
]

// todo: update getting folio number from store when there is this data available
payFeesWidget.loadFeeTypesAndCharges('custom', filingData)

const route = useRoute()
const crumbConstructors = computed(() => (route?.meta?.breadcrumbs || []) as (() => BreadcrumbI)[])
const leftButtonConstructors = computed(() => {
  return route?.meta?.buttonControl?.leftButtons || [] as (() => ButtonControlI)[]
})
const rightButtonConstructors = computed(() => {
  return route?.meta?.buttonControl?.rightButtons || [] as (() => ButtonControlI)[]
})

const { currentSIFiling, isAnnualFiling } = storeToRefs(useSignificantIndividuals())

const version = useRuntimeConfig().public.version
</script>

<style scoped>

</style>
