<template>
  <div class="flex flex-col w-full">
    <p class="pb-6">
      <BcrosI18HelperBold translation-path="texts.control.controlOfDirectors" />
    </p>
    <UFormGroup
      v-slot="{ error }"
      :name="name"
      data-cy="testControlOfDirectors"
    >
      <UCheckbox
        :id="directControlId"
        v-model="model.directControl"
        :label="$t('texts.controlOfDirectors.directControl')"
        class="pl-5 pt-2"
        :class="{ 'text-red-500': !!error }"
        :variant="error ? 'error' : 'bcGov'"
        :data-cy="name + '.directControl'"
      />
      <UCheckbox
        :id="indirectControlId"
        v-model="model.indirectControl"
        :label="$t('texts.controlOfDirectors.indirectControl')"
        class="pl-5 pt-5"
        :variant="error ? 'error' : 'bcGov'"
        :data-cy="name + '.indirectControl'"
      />
      <UCheckbox
        :id="significantInfluenceId"
        v-model="model.significantInfluence"
        :label="$t('texts.controlOfDirectors.significantInfluence')"
        class="pl-5 py-5"
        :variant="error ? 'error' : 'bcGov'"
        :data-cy="name + '.significantInfluence'"
      />
    </UFormGroup>
    <BcrosHelpTip
      :title="$t('helpTitles.controlOfDirectors.closed')"
      :title-expanded="$t('helpTitles.controlOfDirectors.expanded')"
    >
      <slot name="typesOfControlHelp">
        <div class="flex flex-col gap-2">
          <p>{{ $t('helpTexts.controlOfDirectors.p1') }}</p>
        </div>
      </slot>
    </BcrosHelpTip>
    <IndividualPersonControlJointlyOrInConcertControl
      v-model:actingJointly="model.actingJointly"
      v-model:inConcertControl="model.inConcertControl"
      :name="name + '.jointlyOrInConcert'"
    >
      <template #inConcertControlHelp>
        <span>{{ $t('helpTexts.significantIndividuals.helpPlaceholder1') }}</span>
      </template>
    </IndividualPersonControlJointlyOrInConcertControl>
  </div>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'
import { type UseEventBusReturn } from '@vueuse/core'
import { SiControlOfDirectorsSchemaType } from '~/utils/si-schema/definitions'

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

const model = defineModel({
  type: Object as PropType<SiControlOfDirectorsSchemaType>,
  required: true
})

const props = defineProps({
  name: { type: String, default: 'name' }
})

watch(() => model.value, () => {
  if (formBus) {
    formBus.emit({ type: 'blur', path: [props.name] })
    formBus.emit({ type: 'change', path: [props.name] })
  }
}, { deep: true })

const directControlId = UUIDv4()
const indirectControlId = UUIDv4()
const significantInfluenceId = UUIDv4()
</script>
