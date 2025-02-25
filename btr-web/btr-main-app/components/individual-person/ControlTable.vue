<template>
  <BcrosTablesTable
    :table-name="$t('controlTable.tableName')"
    icon="i-mdi-account-multiple-plus-outline"
    data-cy="individualsControlTable"
    :headers="headers"
    :items="siControlStore.allActiveAndHaveControlSis"
    :has-error="hasError"
  >
    <template #warning>
      <tr v-if="numberOfRows === 1">
        <td colspan="3">
          <BcrosAlertsMessage
            :flavour="AlertsFlavourE.ALERT"
          >
            <p class="py-2">
              <strong>{{ $t('controlTable.body.alert.important') }}</strong>
              <BcrosI18HelperBold translation-path="controlTable.body.alert.message" />
            </p>
          </BcrosAlertsMessage>
        </td>
      </tr>
    </template>
    <template #table-row="{ item, index }">
      <tr class="border-t border-gray-200">
        <td data-cy="control-table-name">
          <span>{{ item.name.fullName.toUpperCase() }}</span><br>
          <BcrosTablesDetailsInfoBox
            v-if="item.name.preferredName"
            class="mt-3"
            :title="$t('controlTable.body.name.preferredName')"
            :content="item.name.preferredName"
          />
          <BcrosTablesDetailsInfoBox
            v-if="item.name.preferredName"
            class="mt-3"
            :title="$t('controlTable.body.name.birthYear')"
            :content="item.birthDate.slice(0, 4)"
          />
        </td>
        <td data-cy="control-table-individual-connection" colspan="2">
          <IndividualPersonIndividualConnection
            :si="item"
            :name="'individualConnection' + index"
            class="pt-0 pl-2"
            :control-type-width="String(controlTypeWidthPercentage)"
            :individual-connection-width="String(100-controlTypeWidthPercentage)"
            :editing-disabled="editingDisabled"
          />
        </td>
      </tr>
    </template>
    <template #empty-state>
      <tr v-if="numberOfRows === 0">
        <td colspan="100%">
          <div class="text-sm text-center text-gray-700 px-3 py-4">
            {{ $t('controlTable.body.empty') }}
          </div>
        </td>
      </tr>
    </template>
  </BcrosTablesTable>
</template>

<script setup lang="ts">
import { useSiControlStore } from '~/stores/si-control-store'

const siControlStore = useSiControlStore()

defineProps({
  numberOfRows: { type: Number, required: true },
  hasError: { type: Boolean, required: false },
  editingDisabled: { type: Boolean, default: false }
})

const t = useNuxtApp().$i18n.t
const headers = [
  { content: t('controlTable.header.name'), width: '20%' },
  { content: t('controlTable.header.controlType'), width: '20%', customStyle: 'text-right' },
  { content: t('controlTable.header.individualConnection'), width: '60%' }
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
