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
        @change="$emit('change')"
      />
    </UFormGroup>

    <p v-if="model.percentage === PercentageRangeE.LESS_THAN_25" class="pb-3">
      <span class="font-bold">{{ $t('texts.note') }}</span>
      <BcrosI18HelperBold translation-path="texts.control.lessThan25Note" />
    </p>

    <BcrosHelpTip
      :title="$t(helpLabelClosed)"
      :title-expanded="$t(helpLabelExpanded)"
    >
      <slot name="sharesAndVotesHelp">
        <div v-if="model.controlName === ControlE.SHARES" class="flex flex-col gap-2">
          <p>{{ $t('helpTexts.controlOfSharesVotes.shares.p1') }}</p>
          <p><BcrosI18HelperLink translation-path="helpTexts.controlOfSharesVotes.shares.p2" /></p>
          <p>{{ $t('helpTexts.controlOfSharesVotes.shares.p3') }}</p>
        </div>
        <div v-if="model.controlName === ControlE.VOTES" class="flex flex-col gap-2">
          <p><BcrosI18HelperLink translation-path="helpTexts.controlOfSharesVotes.votes.p1" /></p>
          <p>{{ $t('helpTexts.controlOfSharesVotes.votes.p2') }}</p>
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
          <p>{{ $t('helpTexts.controlOfSharesVotes.typesOfControl.intro') }}</p>
          <template v-for="(control, index) in typeOfControlHelpText" :key="index">
            <strong>{{ control.title }}</strong>
            <p>{{ control.detail }}</p>
          </template>
        </div>
      </slot>
    </BcrosHelpTip>
    <IndividualPersonControlJointlyOrInConcertControl
      v-model:actingJointly="model.actingJointly"
      v-model:inConcertControl="model.inConcertControl"
      :name="name + '.jointlyOrInConcert'"
    >
      <template #inConcertControlHelp>
        <IndividualPersonControlJointlyOrInConcertControlHelp />
      </template>
    </IndividualPersonControlJointlyOrInConcertControl>
  </div>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'
import { type UseEventBusReturn } from '@vueuse/core'
import { SiControlOfSchemaType } from '~/utils/si-schema/definitions'

const t = useNuxtApp().$i18n.t

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

const model = defineModel({
  type: Object as PropType<SiControlOfSchemaType>,
  required: true
})

defineEmits(['change'])

const props = defineProps({
  name: { type: String, default: 'name' }
})

const percentageName = props.name + '.percentage'
const controlTypeName = props.name + '.controlType'

watch(() => model.value, () => {
  formBus?.emit({ type: 'blur', path: [controlTypeName, percentageName] })
  formBus?.emit({ type: 'change', path: [controlTypeName, percentageName] })
}, { deep: true })

let percentageText = ''
let controlText = ''
let helpLabelClosed = ''
let helpLabelExpanded = ''

if (model.value.controlName === ControlE.SHARES) {
  percentageText = 'texts.control.shares'
  controlText = 'texts.control.controlOfShares'
  helpLabelClosed = 'helpTitles.shares.closed'
  helpLabelExpanded = 'helpTitles.shares.expanded'
} else if (model.value.controlName === ControlE.VOTES) {
  percentageText = 'texts.control.votes'
  controlText = 'texts.control.controlOfVotes'
  helpLabelClosed = 'helpTitles.votes.closed'
  helpLabelExpanded = 'helpTitles.votes.expanded'
}

// if no unique ids added on checkboxes, labels get messed up
const registeredOwnerId = UUIDv4()
const beneficialOwnerId = UUIDv4()
const indirectControlId = UUIDv4()

// help text paragraphs
const typeOfControlHelpText = [
  {
    title: t('helpTexts.controlOfSharesVotes.typesOfControl.registeredOwner.title'),
    detail: t('helpTexts.controlOfSharesVotes.typesOfControl.registeredOwner.detail')
  },
  {
    title: t('helpTexts.controlOfSharesVotes.typesOfControl.beneficialOwner.title'),
    detail: t('helpTexts.controlOfSharesVotes.typesOfControl.beneficialOwner.detail')
  },
  {
    title: t('helpTexts.controlOfSharesVotes.typesOfControl.indirectControl.title'),
    detail: t('helpTexts.controlOfSharesVotes.typesOfControl.indirectControl.detail')
  }
]
</script>
