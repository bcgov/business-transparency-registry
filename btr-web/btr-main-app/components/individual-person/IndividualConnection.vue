<template>
  <div class="flex flex-col space-y-3">
    <!-- shares acting jointly -->
    <div v-if="si.controlOfShares.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.shares') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="siControl.sharesJointly"
        :name="name + '.shares.jointly'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.jointly')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.jointly`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- shares in concert -->
    <div v-if="si.controlOfShares.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.shares') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="siControl.sharesInConcert"
        :name="name + '.shares.inConcert'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.inConcert')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.inConcert`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- votes acting jointly -->
    <div v-if="si.controlOfVotes.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.votes') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="siControl.votesJointly"
        :name="name + '.votes.jointly'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.jointly')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.jointly`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- votes in concert -->
    <div v-if="si.controlOfVotes.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.votes') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="siControl.votesInConcert"
        :name="name + '.votes.inConcert'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.inConcert')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.inConcert`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- control of directors acting jointly -->
    <div v-if="si.controlOfDirectors.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.director') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="siControl.directorsJointly"
        :name="name + '.director.jointly'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTableBody.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTableBody.individualConnection.placeholder.jointly')"
        :floating-label="$t(`controlTableBody.individualConnection.floatingLabel.jointly`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
      />
    </div>

    <!-- control of directors in concert -->
    <div v-if="si.controlOfDirectors.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTableBody.controlType.director') }}</span>
        <span class="italic text-sm">{{ $t('controlTableBody.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-model="siControl.directorsInConcert"
        :name="name + '.director.inConcert'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
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
import { SiSchemaType } from '~/utils/si-schema/definitions'
import { useSiControlStore } from '~/stores/si-control-store'
import { JointlyOrInConcertConnectionsI } from '~/interfaces/jointly-or-in-concert'

const siControlStore = useSiControlStore()
const { allActiveSis, actingJointlyAndInConcert } = storeToRefs(siControlStore)

const props = defineProps({
  si: { type: Object as PropType<SiSchemaType>, required: true },
  name: { type: String, default: 'name' },
  controlTypeWidth: { type: String, required: true },
  individualConnectionWidth: { type: String, required: true }
})

const allActiveSisExceptMe = allActiveSis.value.filter((asi: SiSchemaType) => asi.uuid !== props.si.uuid).map(
  (si: SiSchemaType) => ({
    uuid: si.uuid,
    legalName: si.name.fullName,
    preferredName: si.name.preferredName
  })
)
const siControl: JointlyOrInConcertConnectionsI = actingJointlyAndInConcert.value.get(props.si.uuid)
</script>
