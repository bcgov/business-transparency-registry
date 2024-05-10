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

    <!--    todo: fix text here; add stuff from the ticket #20926   -->
    <UCheckbox
      :id="actingJointlyOrInConcertId"
      v-model="actingJointlyOrInConcert"
      :label="$t('texts.control.actingJointlyOrInConcert.checkbox')"
      class="pt-5"
    />
    <div v-if="actingJointlyOrInConcert">
      <p class="pt-3">
        {{ $t('texts.control.actingJointlyOrInConcert.text') }}
      </p>
      <UCheckbox
        :id="actingJointlyId"
        v-model="model.actingJointly"
        :label="$t('texts.control.actingJointlyOrInConcert.jointly')"
        class="pl-5 pt-5"
      />
      <UCheckbox
        :id="inConcertControlId"
        v-model="model.inConcertControl"
        :label="$t('texts.control.actingJointlyOrInConcert.inConcert')"
        class="pl-5 pt-5"
      />
      <BcrosAlertsMessage
        v-if="model.actingJointly || model.inConcertControl"
        class="mt-5"
        :flavour="AlertsFlavourE.INFO"
      >
        <p class="py-2">
          <strong>{{ $t('texts.control.actingJointlyOrInConcert.alert.important') }}</strong>
          <span v-if="model.actingJointly && model.inConcertControl">
            {{ $t('texts.control.actingJointlyOrInConcert.alert.combined') }}
          </span>
          <span v-else-if="model.actingJointly">
            {{ $t('texts.control.actingJointlyOrInConcert.alert.jointlyAlert') }}
          </span>
          <span v-else>
            {{ $t('texts.control.actingJointlyOrInConcert.alert.inConcertAlert') }}
          </span>
        </p>
      </BcrosAlertsMessage>
    </div>
    <BcrosHelpTip
      :title="$t('helpTitles.inConcertControl.closed')"
      :title-expanded="$t('helpTitles.inConcertControl.expanded')"
    >
      <slot name="inConcertControlHelp" />
    </BcrosHelpTip>
  </UFormGroup>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'
// todo: maybe add interface for this type can be part of 20758
const model = defineModel({
  type: Object as PropType<ControlSchemaI>,
  required: true
})

const actingJointlyOrInConcert = ref(model.value.inConcertControl || model.value.actingJointly)
watch(actingJointlyOrInConcert, (value) => {
  if (!value) {
    model.value.inConcertControl = false
    model.value.actingJointly = false
  }
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
const actingJointlyOrInConcertId = UUIDv4()
const inConcertControlId = UUIDv4()
const actingJointlyId = UUIDv4()

defineProps({
  name: { type: String, default: 'name' }
})
</script>
