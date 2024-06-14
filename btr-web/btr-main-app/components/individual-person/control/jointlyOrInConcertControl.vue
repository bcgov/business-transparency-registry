<template>
  <UFormGroup :name="name">
    <UCheckbox
      :id="actingJointlyOrInConcertId"
      v-model="actingJointlyOrInConcert"
      :label="$t('texts.control.actingJointlyOrInConcert.checkbox')"
      class="pt-5"
      :data-cy="name + '.hasJointlyOrInConcert'"
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
        :data-cy="name + '.actingJointly'"
      />
      <UCheckbox
        :id="inConcertControlId"
        v-model="inConcertControl"
        :label="$t('texts.control.actingJointlyOrInConcert.inConcert')"
        class="pl-5 pt-5"
        :data-cy="name + '.inConcertControl'"
      />
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
