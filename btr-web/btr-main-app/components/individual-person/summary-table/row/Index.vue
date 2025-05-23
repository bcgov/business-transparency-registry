<script setup lang="ts">
import {
  IndividualPersonSummaryTableRowActionButton,
  IndividualPersonSummaryTableRowCessationEntry
} from '#components'
import { type SiSchemaType } from '~/utils/si-schema/definitions'

type ActionBtnT = {
  action: Function,
  actionArg?: number,
  disabled: boolean,
  icon?: string,
  label: string
}

const props = defineProps<{
  si: SiSchemaType,
  index: number,
  accordionExpanded?: boolean,
  actionBtn?: ActionBtnT,
  actionDropdownBtns?: ActionBtnT[]
}>()

const t = useNuxtApp().$i18n.t

const rowBadges = computed(() => {
  if (!props.si.ui.actions?.length) {
    return
  }
  const badges = []
  if (props.si.ui.actions?.includes(FilingActionE.ADD)) {
    badges.push({ label: t('badges.new') })
  }
  if (props.si.ui.actions?.includes(FilingActionE.EDIT)) {
    badges.push({ label: t('badges.updated') })
  }
  if (
    props.si.ui.actions?.includes(FilingActionE.CEASE) ||
    props.si.ui.actions?.includes(FilingActionE.HISTORICAL)
  ) {
    badges.push({ label: t('badges.ceased'), colour: 'gray' })
  }
  return badges
})

const opacityClass = computed(() => {
  if (
    props.si.ui.actions?.includes(FilingActionE.CEASE) ||
    props.si.ui.actions?.includes(FilingActionE.HISTORICAL)
  ) {
    return 'opacity-55'
  }
  return ''
})
</script>

<template>
  <tr
    class="border-t-[1px] border-gray-400"
    data-cy="summary-table-row"
  >
    <td data-cy="summary-table-name">
      <PersonInfoName
        :badges="rowBadges"
        :item="{
          'legalName': si.name.fullName,
          'alternateName': si.name.preferredName,
          'birthDate': si.birthDate,
          'class': opacityClass}"
      />
      <PersonInfoCitizenship
        :class="opacityClass"
        :nationalities="si.citizenships.nationalities"
      />
    </td>
    <td class="align-top" :class="opacityClass" data-cy="summary-table-details">
      <PersonInfoDetails :item="si" />
    </td>

    <td :class="opacityClass" data-cy="summary-table-controls">
      <PersonInfoControl :item="si" :accordion-expanded="accordionExpanded" />
    </td>

    <td :class="opacityClass" data-cy="summary-table-dates">
      <p v-for="date in si.effectiveDates" :key="date.startDate">
        {{
          $t('texts.dateRange', {
            start: date.startDate ? date.startDate : $t('labels.unknown'),
            end: date.endDate ? date.endDate : $t('labels.current')
          })
        }}
      </p>
    </td>
    <!-- NOTE: opacityClass is not applied to the edit column on purpose -->
    <template v-if="actionBtn">
      <td data-cy="summary-table-buttons" class="action-button align-top">
        <IndividualPersonSummaryTableRowActionButton
          :button="actionBtn"
          :dropdown-items="actionDropdownBtns"
        />
      </td>
    </template>
  </tr>

  <!--
      placeholder row for display warning message for minor SI
      the v-if is set to false until the feature is implemented;
      rules for minor: #20621
    -->
  <tr v-if="isMinor(si.birthDate)" data-cy="summary-table-row-minor">
    <td colspan="5">
      <BcrosAlertsMessage
        :flavour="AlertsFlavourE.ALERT"
        data-cy="summary-table-row-minor-alert"
      >
        <template #icon>
          <UIcon
            class="text-red-500 mt-[2px] text-xl float-right"
            name="i-mdi-circle-off-outline"
          />
        </template>
        <div>{{ $t('alerts.important') }}: <BcrosI18HelperBold translation-path="alerts.siIsMinor.summaryAlert" /></div>
      </BcrosAlertsMessage>
    </td>
  </tr>

  <!-- to be updated in #21660 -->
  <tr
    v-if="si.missingInfoReason"
    class="bg-yellow-50"
    :class="opacityClass"
    data-cy="summary-table-row-missing-info"
  >
    <td>
      {{ $t('labels.unableToObtainOrConfirmInformation.title') }}
    </td>
    <td colspan="4">
      <IndividualPersonSummaryTableRowMissingInfo :missing-info="si.missingInfoReason" />
    </td>
  </tr>

  <tr v-if="si.ui.showCeaseDateInput" data-cy="summary-table-row-cease">
    <td colspan="5">
      <IndividualPersonSummaryTableRowCessationEntry :individual="si" :index="index" />
    </td>
  </tr>
</template>

<style scoped>
td {
  @apply px-3 py-4 align-top whitespace-normal text-sm text-gray-700
}
</style>
