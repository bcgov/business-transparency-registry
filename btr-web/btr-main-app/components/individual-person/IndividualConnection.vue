<template>
  <div class="flex flex-col space-y-3">
    <!-- shares acting jointly -->
    <div v-if="model.controlOfShares.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.shares') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="individualsWithSharesActingJointly"
        :name="name"
        :label-function="(si) => si.name"
        :items="activeIndividuals"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.jointly')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.jointly`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- shares in concert -->
    <div v-if="model.controlOfShares.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.shares') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="individualsWithSharesInConcert"
        :name="name"
        :label-function="(si) => si.name"
        :items="activeIndividuals"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.inConcert')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.inConcert`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- votes acting jointly -->
    <div v-if="model.controlOfVotes.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.votes') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="individualsWithVotesActingJointly"
        :name="name"
        :label-function="(si) => si.name"
        :items="activeIndividuals"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.jointly')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.jointly`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- votes in concert -->
    <div v-if="model.controlOfVotes.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.votes') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="individualsWithVotesInConcert"
        :name="name"
        :label-function="(si) => si.name"
        :items="activeIndividuals"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.inConcert')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.inConcert`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- control of directors acting jointly -->
    <!-- control of directors in concert -->
  </div>
</template>

<script setup lang="ts">
import { SiSchemaType } from '~/utils/si-schema/definitions'

const model = defineModel({
  type: Object as PropType<SiSchemaType>,
  required: true
})

const props = defineProps({
  name: { type: String, default: 'name' },
  significantIndividuals: { type: Array as PropType<SiSchemaType[]>, required: true },
  controlTypeWidth: { type: String, required: true },
  individualConnectionWidth: { type: String, required: true }
})

// Use SiSchemaType[] to create dropdown menu options with the names and UUIDs of all significant individuals that
// are active (i.e. not marked as removed), excluding the current SI (model)
const activeIndividuals = computed(() => {
  return props.significantIndividuals.filter((si) => {
    return si.uuid !== model.value.uuid && si.ui.action !== FilingActionE.REMOVE
  }).map((si) => {
    return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
  })
})

// selected inviduals that have shares acting jointly with the current SI
const individualsWithSharesActingJointly = computed({
  get () {
    return props.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.sharesActingJointly.find(
        (value) => { return value === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.sharesActingJointly = selectedIndividuals.map((individual) => { return individual.uuid })
  }
})

// selected inviduals that have shares in concert with the current SI
const individualsWithSharesInConcert = computed({
  get () {
    return props.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.sharesInConcert.find(
        (value) => { return value === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.sharesInConcert = selectedIndividuals.map((individual) => { return individual.uuid })
  }
})

// selected inviduals that have votes acting jointly with the current SI
const individualsWithVotesActingJointly = computed({
  get () {
    return props.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.votesActingJointly.find(
        (value) => { return value === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.votesActingJointly = selectedIndividuals.map((individual) => { return individual.uuid })
  }
})

// selected inviduals that have votes in concert with the current SI
const individualsWithVotesInConcert = computed({
  get () {
    return props.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.votesInConcert.find(
        (value) => { return value === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.votesInConcert = selectedIndividuals.map((individual) => { return individual.uuid })
  }
})
</script>
