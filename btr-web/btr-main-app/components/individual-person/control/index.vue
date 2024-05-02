<template>
  <!--    todo: update stuff from the ticket #20758   -->
  <!--  todo: note: depending on where the error messaging needs to be, we might need to update/add  UFromGroup -->
  <UFormGroup v-slot="{ error }" :name="name">
    <IndividualPersonControlPercentageDropdown
      id="percentageOfShares"
      v-model="model.percentage"
      :placeholder="'% of shares'"
      percentage-type="shares"
      data-cy="testPercentOfShares"
      class="py-5"
    />

    <UCheckbox
      v-model="model.registeredOwner"
      :id="registeredOwnerId"
      :label="$t('texts.sharesAndVotes.registeredOwner')"
      class="pt-5"
    />
    <UCheckbox
      v-model="model.beneficialOwner"
      :id="beneficialOwnerId"
      :label="$t('texts.sharesAndVotes.beneficialOwner')"
      class="pt-5"
    />
    <UCheckbox
      v-model="model.indirectControl"
      :id="indirectControlId"
      :label="$t('texts.sharesAndVotes.indirectControl')"
      class="pt-5"
    />
    <!--    todo: fix text here; add stuff from the ticket #20926   -->
    <UCheckbox
      v-model="model.inConcertControl"
      :id="inConcertControlId"
      :label="$t('texts.sharesAndVotes.inConcertControl.part1')"
      class="pt-5"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'

// todo: maybe add interface for this type can be part of 20758
const model = defineModel({ required: true })
// const percentage = defineModel('percentage', { required: true })
// const registeredOwner = defineModel('registeredOwner', { required: true })
// const beneficialOwner = defineModel('beneficialOwner', { required: true })
// const indirectControl = defineModel('indirectControl', { required: true })
// const inConcertControl = defineModel('inConcertControl', { required: true })

// if no unique ids added on checkboxes, labels get messed up
const registeredOwnerId = UUIDv4()
const beneficialOwnerId = UUIDv4()
const indirectControlId = UUIDv4()
const inConcertControlId = UUIDv4()

defineProps({
  name: { type: String, default: 'name' }
})

</script>
