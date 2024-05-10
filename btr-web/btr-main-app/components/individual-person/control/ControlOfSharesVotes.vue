<template>
  <!--    todo: update stuff from the ticket #20758   -->
  <!--  todo: note: depending on where the error messaging needs to be, we might need to update/add  UFromGroup -->
  <UFormGroup :name="name">
    <p class="py-3">
      <BcrosI18HelperBold :translation-path="percentageText" />
    </p>

    <IndividualPersonControlPercentageSelector
      :id="name + 'Percentage'"
      v-model="model.percentage"
      :data-cy="'test-' + name"
    />
    <BcrosHelpTip
      :title="$t('helpTitles.sharesAndVotes.closed')"
      :title-expanded="$t('helpTitles.sharesAndVotes.expanded')"
    >
      <slot name="sharesAndVotesHelp" />
    </BcrosHelpTip>

    <p class="py-3">
      <BcrosI18HelperBold :translation-path="controlText" />
    </p>
    <UCheckbox
      :id="registeredOwnerId"
      v-model="model.registeredOwner"
      :label="$t('texts.sharesAndVotes.registeredOwner')"
      class="pl-5 pt-2"
    />
    <UCheckbox
      :id="beneficialOwnerId"
      v-model="model.beneficialOwner"
      :label="$t('texts.sharesAndVotes.beneficialOwner')"
      class="pl-5 pt-5"
    />
    <UCheckbox
      :id="indirectControlId"
      v-model="model.indirectControl"
      :label="$t('texts.sharesAndVotes.indirectControl')"
      class="pl-5 py-5"
    />
    <BcrosHelpTip
      :title="$t('helpTitles.typesOfControl.closed')"
      :title-expanded="$t('helpTitles.typesOfControl.expanded')"
    >
      <slot name="typesOfControlHelp" />
    </BcrosHelpTip>
    <IndividualPersonControlJointlyOrInConcertControl
      v-model:actingJointly="model.actingJointly"
      v-model:inConcertControl="model.inConcertControl"
      name="jointlyOrInConcertControlShares"
    >
      <template #inConcertControlHelp>
        <span>{{ $t('helpTexts.significantIndividuals.helpPlaceholder1') }}</span>
      </template>
    </IndividualPersonControlJointlyOrInConcertControl>
  </UFormGroup>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'
// todo: maybe add interface for this type can be part of 20758
const model = defineModel({
  type: Object as PropType<ControlSchemaI>,
  required: true
})

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

defineProps({
  name: { type: String, default: 'name' }
})
</script>
