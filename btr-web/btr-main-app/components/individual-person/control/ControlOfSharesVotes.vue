<template>
  <div class="flex flex-col w-full">
    <p class="pb-6">
      <BcrosI18HelperBold :translation-path="percentageText" />
    </p>
    <UFormGroup :name="percentageName">
      <IndividualPersonControlPercentageSelector
        :id="name + 'Percentage'"
        v-model="model.percentage"
        :data-cy="'test-' + name"
        class="pb-6"
        :name="name + '.percentage'"
      />
    </UFormGroup>

    <p v-if="model.percentage === PercentageRangeE.LESS_THAN_25" class="pb-3">
      <span class="font-bold">{{ $t('texts.note') }}</span>
      <BcrosI18HelperBold translation-path="texts.control.lessThan25Note" />
    </p>

    <BcrosHelpTip
      :title="$t('helpTitles.sharesAndVotes.closed')"
      :title-expanded="$t('helpTitles.sharesAndVotes.expanded')"
    >
      <slot name="sharesAndVotesHelp">
        <div class="flex flex-col gap-2">
          <p>{{ $t('helpTexts.controlOfSharesVotes.sharesAndVotes.p1') }}</p>
          <p>{{ $t('helpTexts.controlOfSharesVotes.sharesAndVotes.p2') }}</p>
          <p>{{ $t('helpTexts.controlOfSharesVotes.sharesAndVotes.p3') }}</p>
        </div>
      </slot>
    </BcrosHelpTip>

    <p class="py-3">
      <BcrosI18HelperBold :translation-path="controlText" />
    </p>
    <UFormGroup
      v-slot="{ error }"
      :name="controlTypeName"
      data-cy="testTypeOfControl"
    >
      <UCheckbox
        :id="registeredOwnerId"
        v-model="model.registeredOwner"
        :label="$t('texts.sharesAndVotes.registeredOwner')"
        class="pl-5 pt-2"
        :class="{ 'text-red-500': !!error }"
        :variant="error ? 'error' : 'bcGov'"
        :data-cy="name + '.registeredOwner'"
      />
      <UCheckbox
        :id="beneficialOwnerId"
        v-model="model.beneficialOwner"
        :label="$t('texts.sharesAndVotes.beneficialOwner')"
        class="pl-5 pt-5"
        :variant="error ? 'error' : 'bcGov'"
        :data-cy="name + '.beneficialOwner'"
      />
      <UCheckbox
        :id="indirectControlId"
        v-model="model.indirectControl"
        :label="$t('texts.sharesAndVotes.indirectControl')"
        class="pl-5 py-5"
        :variant="error ? 'error' : 'bcGov'"
        :data-cy="name + '.indirectControl'"
      />
    </UFormGroup>
    <BcrosHelpTip
      :title="$t('helpTitles.typesOfControl.closed')"
      :title-expanded="$t('helpTitles.typesOfControl.expanded')"
    >
      <slot name="typesOfControlHelp">
        <div class="flex flex-col gap-2">
          <p>{{ $t('helpTexts.controlOfSharesVotes.typesOfControl.p1') }}</p>
        </div>
      </slot>
    </BcrosHelpTip>
    <IndividualPersonControlJointlyOrInConcertControl
      v-model:actingJointly="model.actingJointly"
      v-model:inConcertControl="model.inConcertControl"
      :name="name + '.jointlyOrInConcert'"
    >
      <template #inConcertControlHelp>
        <span>{{ $t('helpTexts.significantIndividuals.helpPlaceholder1') }}</span>
      </template>
    </IndividualPersonControlJointlyOrInConcertControl>
  </div>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'
import { type UseEventBusReturn } from '@vueuse/core'
import { SiControlOfSchemaType } from '~/utils/si-schema/definitions'

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

const model = defineModel({
  type: Object as PropType<SiControlOfSchemaType>,
  required: true
})

const props = defineProps({
  name: { type: String, default: 'name' }
})

const percentageName = props.name + '.percentage'
const controlTypeName = props.name + '.controlType'

watch(() => model.value, () => {
  if (formBus) {
    formBus.emit({ type: 'blur', path: [controlTypeName, percentageName] })
    formBus.emit({ type: 'change', path: [controlTypeName, percentageName] })
  }
}, { deep: true })

let percentageText = ''
let controlText = ''
if (model.value.controlName === ControlE.SHARES) {
  percentageText = 'texts.control.shares'
  controlText = 'texts.control.controlOfShares'
} else if (model.value.controlName === ControlE.VOTES) {
  percentageText = 'texts.control.votes'
  controlText = 'texts.control.controlOfVotes'
}

// if no unique ids added on checkboxes, labels get messed up
const registeredOwnerId = UUIDv4()
const beneficialOwnerId = UUIDv4()
const indirectControlId = UUIDv4()
</script>
