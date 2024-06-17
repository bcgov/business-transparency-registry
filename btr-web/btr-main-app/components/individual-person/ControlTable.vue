<template>
  <BcrosTablesTable
    data-cy="individualsControlTable"
    :headers="headers"
    :items="siControlStore.allActiveAndHaveControlSis"
  >
    <template #warning>
      <tr v-if="numberOfRows === 1">
        <td colspan="3">
          <BcrosAlertsMessage
            :flavour="AlertsFlavourE.ALERT"
          >
            <p class="py-2">
              <strong>{{ $t('controlTableBody.alert.important') }}</strong>
              <BcrosI18HelperBold translation-path="controlTableBody.alert.message" />
            </p>
          </BcrosAlertsMessage>
        </td>
      </tr>
    </template>
    <template #table-row="{ item, index }">
      <tr>
        <td data-cy="control-table-name">
          <span>{{ item.name.fullName.toUpperCase() }}</span><br>
          <div v-if="item.name.preferredName" class="flex flex-col mt-2">
            <span class="font-bold italic">{{ `Preferred name` }}</span>
            <span>{{ item.name.preferredName }}</span>
          </div>
          <div class="flex flex-col mt-2">
            <span class="font-bold italic">{{ `Birth year` }}</span>
            <span>{{ item.birthDate.slice(0, 4) }}</span>
          </div>
        </td>
        <td data-cy="control-table-individual-connection" colspan="2">
          <IndividualPersonIndividualConnection
            :si="item"
            :name="'individualConnection' + index"
            class="pt-0 pl-2"
            :control-type-width="String(controlTypeWidthPercentage)"
            :individual-connection-width="String(100-controlTypeWidthPercentage)"
          />
        </td>
      </tr>
    </template>
    <template #empty-state>
      <tr v-if="numberOfRows === 0">
        <td colspan="100%">
          <div class="text-sm text-center text-gray-700 px-3 py-4">
            {{ $t('controlTableBody.empty') }}
          </div>
        </td>
      </tr>
    </template>
  </BcrosTablesTable>
</template>

<script setup lang="ts">
import { useSiControlStore } from '~/stores/si-control-store'

const siControlStore = useSiControlStore()

console.log('active and in control', siControlStore.allActiveAndHaveControlSis)

defineProps({
  numberOfRows: { type: Number, required: true }
})

const t = useNuxtApp().$i18n.t
const headers = [
  { content: t('controlTableHeader.name'), width: '20%' },
  { content: t('controlTableHeader.controlType'), width: '20%', customStyle: 'text-right' },
  { content: t('controlTableHeader.individualConnection'), width: '60%' }
]

const controlTypeWidth = parseFloat(headers[1].width.replace('%', ''))
const individualConnectionWidth = parseFloat(headers[2].width.replace('%', ''))
const controlTypeWidthPercentage = controlTypeWidth / (controlTypeWidth + individualConnectionWidth) * 100
</script>

<style scoped>
td {
  @apply px-3 py-4 align-text-top whitespace-normal text-sm text-gray-700
}
</style>
