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
        :name="name + '.shares.jointly'"
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
        :name="name + '.shares.inConcert'"
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
        :name="name + '.votes.jointly'"
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
        :name="name + '.votes.inConcert'"
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
    <div v-if="model.controlOfDirectors.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.director') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="individualsWithDirectorControlActingJointly"
        :name="name + '.director.jointly'"
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

    <!-- control of directors in concert -->
    <div v-if="model.controlOfDirectors.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.director') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="individualsWithDirectorControlInConcert"
        :name="name + '.director.inConcert'"
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
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { SiSchemaType } from '~/utils/si-schema/definitions'

const significantIndividuals = useSignificantIndividuals()
const { currentSIFiling } = storeToRefs(significantIndividuals)

const model = defineModel({
  type: Object as PropType<SiSchemaType>,
  required: true
})

defineProps({
  name: { type: String, default: 'name' },
  controlTypeWidth: { type: String, required: true },
  individualConnectionWidth: { type: String, required: true }
})

// Use SiSchemaType[] to create dropdown menu options with the names and UUIDs of all significant individuals that
// are active (i.e. not marked as removed), excluding the current SI (model)
const activeIndividuals = computed(() => {
  return currentSIFiling.value.significantIndividuals.filter((si) => {
    return si.uuid !== model.value.uuid && si.ui.action !== FilingActionE.REMOVE
  }).map((si) => {
    return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
  })
})

// selected inviduals that have shares acting jointly with the current SI
const individualsWithSharesActingJointly = computed({
  get () {
    return currentSIFiling.value.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.sharesActingJointly.find(
        (value) => { return value.uuid === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.sharesActingJointly = selectedIndividuals.map((individual) => {
      return getConnectedIndividual(individual)
    })
  }
})

// selected inviduals that have shares in concert with the current SI
const individualsWithSharesInConcert = computed({
  get () {
    return currentSIFiling.value.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.sharesInConcert.find(
        (value) => { return value.uuid === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.sharesInConcert = selectedIndividuals.map((individual) => {
      return getConnectedIndividual(individual)
    })
  }
})

// selected inviduals that have votes acting jointly with the current SI
const individualsWithVotesActingJointly = computed({
  get () {
    return currentSIFiling.value.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.votesActingJointly.find(
        (value) => { return value.uuid === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.votesActingJointly = selectedIndividuals.map((individual) => {
      return getConnectedIndividual(individual)
    })
  }
})

// selected inviduals that have votes in concert with the current SI
const individualsWithVotesInConcert = computed({
  get () {
    return currentSIFiling.value.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.votesInConcert.find(
        (value) => { return value.uuid === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.votesInConcert = selectedIndividuals.map((individual) => {
      return getConnectedIndividual(individual)
    })
  }
})

// selected inviduals that have control of directors acting jointly with the current SI
const individualsWithDirectorControlActingJointly = computed({
  get () {
    return currentSIFiling.value.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.directorsActingJointly.find(
        (value) => { return value.uuid === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.directorsActingJointly = selectedIndividuals.map((individual) => {
      return getConnectedIndividual(individual)
    })
  }
})

// selected inviduals that have control of directors in concert with the current SI
const individualsWithDirectorControlInConcert = computed({
  get () {
    return currentSIFiling.value.significantIndividuals.filter((si) => {
      return si.ui.action !== FilingActionE.REMOVE && model.value.directorsInConcert.find(
        (value) => { return value.uuid === si.uuid })
    }).map((si) => {
      return { name: si.name.fullName.toUpperCase(), uuid: si.uuid }
    })
  },

  set (selectedIndividuals) {
    model.value.directorsInConcert = selectedIndividuals.map((individual) => {
      return getConnectedIndividual(individual)
    })
  }
})

const getConnectedIndividual = (individual) => {
  const si = currentSIFiling.value.significantIndividuals.find(person => person.uuid === individual.uuid)
  return { uuid: si.uuid, legalName: si.name.fullName, preferredName: si.name.preferredName }
}
</script>
