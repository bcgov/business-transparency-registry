<script setup lang="ts">
import { SiSchemaType } from '~/utils/si-schema/definitions'
import { useSiControlStore } from '~/stores/si-control-store'
import { JointlyOrInConcertConnectionsI } from '~/interfaces/jointly-or-in-concert'

const siControlStore = useSiControlStore()
const { allActiveSIs, actingJointlyAndInConcert }: {
  allActiveSIs: Ref<SiSchemaType[]>,
  actingJointlyAndInConcert: Ref<Map<string, JointlyOrInConcertConnectionsI>>
} = storeToRefs(siControlStore)

defineEmits(['value-changed'])

const props = defineProps({
  si: { type: Object as PropType<SiSchemaType>, required: true },
  name: { type: String, default: 'name' },
  controlTypeWidth: { type: String, required: true },
  individualConnectionWidth: { type: String, required: true },
  editingDisabled: { type: Boolean, default: false }
})

const allActiveSisExceptMe = computed(() =>
  allActiveSIs.value.filter((asi: SiSchemaType) => asi.uuid !== props.si.uuid).map(
    (si: SiSchemaType) => ({
      uuid: si.uuid,
      legalName: si.name.fullName,
      preferredName: si.name.preferredName
    })
  )
)
const siControl = computed(() => actingJointlyAndInConcert.value.get(props.si.uuid))
</script>

<template>
  <div class="flex flex-col space-y-3">
    <!-- shares acting jointly -->
    <div v-if="si.controlOfShares.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTable.body.controlType.shares') }}</span>
        <span class="italic text-sm">{{ $t('controlTable.body.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-if="siControl"
        v-model="siControl.sharesJointly"
        :name="name + '.shares.jointly'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTable.body.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTable.body.individualConnection.placeholder.jointly')"
        :floating-label="$t(`controlTable.body.individualConnection.floatingLabel.jointly`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
        :editing-disabled="editingDisabled"
        @value-changed="$emit('value-changed', 'controlOfShares')"
      />
    </div>

    <!-- shares in concert -->
    <div v-if="si.controlOfShares.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTable.body.controlType.shares') }}</span>
        <span class="italic text-sm">{{ $t('controlTable.body.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-if="siControl"
        v-model="siControl.sharesInConcert"
        :name="name + '.shares.inConcert'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTable.body.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTable.body.individualConnection.placeholder.inConcert')"
        :floating-label="$t(`controlTable.body.individualConnection.floatingLabel.inConcert`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
        :editing-disabled="editingDisabled"
        @value-changed="$emit('value-changed', 'controlOfShares')"
      />
    </div>

    <!-- votes acting jointly -->
    <div v-if="si.controlOfVotes.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTable.body.controlType.votes') }}</span>
        <span class="italic text-sm">{{ $t('controlTable.body.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-if="siControl"
        v-model="siControl.votesJointly"
        :name="name + '.votes.jointly'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTable.body.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTable.body.individualConnection.placeholder.jointly')"
        :floating-label="$t(`controlTable.body.individualConnection.floatingLabel.jointly`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
        :editing-disabled="editingDisabled"
        @value-changed="$emit('value-changed', 'controlOfVotes')"
      />
    </div>

    <!-- votes in concert -->
    <div v-if="si.controlOfVotes.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTable.body.controlType.votes') }}</span>
        <span class="italic text-sm">{{ $t('controlTable.body.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-if="siControl"
        v-model="siControl.votesInConcert"
        :name="name + '.votes.inConcert'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTable.body.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTable.body.individualConnection.placeholder.inConcert')"
        :floating-label="$t(`controlTable.body.individualConnection.floatingLabel.inConcert`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
        :editing-disabled="editingDisabled"
        @value-changed="$emit('value-changed', 'controlOfVotes')"
      />
    </div>

    <!-- control of directors acting jointly -->
    <div v-if="si.controlOfDirectors.actingJointly" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTable.body.controlType.director') }}</span>
        <span class="italic text-sm">{{ $t('controlTable.body.controlType.jointly') }}</span>
      </div>
      <BcrosInputsCombobox
        v-if="siControl"
        v-model="siControl.directorsJointly"
        :name="name + '.director.jointly'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTable.body.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTable.body.individualConnection.placeholder.jointly')"
        :floating-label="$t(`controlTable.body.individualConnection.floatingLabel.jointly`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
        :editing-disabled="editingDisabled"
        @value-changed="$emit('value-changed', 'controlOfDirectors')"
      />
    </div>

    <!-- control of directors in concert -->
    <div v-if="si.controlOfDirectors.inConcertControl" class="flex w-full">
      <div class="flex flex-col text-right pr-4" :style="`width: ${controlTypeWidth}%`">
        <span>{{ $t('controlTable.body.controlType.director') }}</span>
        <span class="italic text-sm">{{ $t('controlTable.body.controlType.inConcert') }}</span>
      </div>
      <BcrosInputsCombobox
        v-if="siControl"
        v-model="siControl.directorsInConcert"
        :name="name + '.director.inConcert'"
        :label-function="(si) => si.legalName.toUpperCase()"
        :items="allActiveSisExceptMe"
        :search-placeholder="$t('controlTable.body.individualConnection.placeholder.searchInput')"
        :label-placeholder="$t('controlTable.body.individualConnection.placeholder.inConcert')"
        :floating-label="$t(`controlTable.body.individualConnection.floatingLabel.inConcert`)"
        key-attribute="uuid"
        :search-attributes="['name']"
        :style="`width: ${individualConnectionWidth}%`"
        :editing-disabled="editingDisabled"
        @value-changed="$emit('value-changed', 'controlOfDirectors')"
      />
    </div>
  </div>
</template>
