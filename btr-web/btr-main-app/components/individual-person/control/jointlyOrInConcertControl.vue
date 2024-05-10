<template>
  <UFormGroup :name="name">
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
        v-model="actingJointly"
        :label="$t('texts.control.actingJointlyOrInConcert.jointly')"
        class="pl-5 pt-5"
      />
      <UCheckbox
        :id="inConcertControlId"
        v-model="inConcertControl"
        :label="$t('texts.control.actingJointlyOrInConcert.inConcert')"
        class="pl-5 pt-5"
      />
      <BcrosAlertsMessage
        v-if="actingJointly || inConcertControl"
        class="mt-5"
        :flavour="AlertsFlavourE.INFO"
      >
        <p class="py-2">
          <strong>{{ $t('texts.control.actingJointlyOrInConcert.alert.important') }}</strong>
          <span v-if="actingJointly && inConcertControl">
            {{ $t('texts.control.actingJointlyOrInConcert.alert.combined') }}
          </span>
          <span v-else-if="actingJointly">
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

const actingJointly = defineModel('actingJointly', { type: Boolean, required: true })
const inConcertControl = defineModel('inConcertControl', { type: Boolean, required: true })

const actingJointlyOrInConcert = ref(inConcertControl.value || actingJointly.value)

watch(actingJointlyOrInConcert, (value) => {
  if (!value) {
    inConcertControl.value = false
    actingJointly.value = false
  }
})

const actingJointlyOrInConcertId = UUIDv4()
const inConcertControlId = UUIDv4()
const actingJointlyId = UUIDv4()

defineProps({
  name: { type: String, default: 'name' }
})
</script>
