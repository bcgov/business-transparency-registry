<template>
  <div :id="id" class="flex flex-col py-5">
    <UFormGroup v-slot="{ error }" :name="name">
      <div v-for="type in types" :key="type.value">
        <UCheckbox
          v-model="controlOfDirectors[type.value]"
          :name="type.value"
          :label="type.label"
          :variant="error ? 'error' : 'bcGov'"
          class="py-2"
        />
      </div>
    </UFormGroup>
    <UCheckbox
      v-model="controlOfDirectors.inConcertControl"
      name="inConcertControl"
      class="py-2 mt-5"
    >
      <template #label>
        {{ $t('texts.controlOfDirectors.inConcertControl.text') }}
        <BcrosTooltip
          class="underline underline-offset-4 decoration-dotted"
          :popper="{
            placement: 'top',
            arrow: true
          }"
          data-cy="control-of-directors-tooltip"
        >
          <template #tooltip-text>
            <span
              class="whitespace-normal place-content: center"
              data-cy="control-of-directors-tooltip-content"
            >
              {{ $t('texts.controlOfDirectors.inConcertControl.tooltipContent') }}
            </span>
          </template>
          {{ $t('texts.controlOfDirectors.inConcertControl.tooltip') }}
        </BcrosTooltip>
      </template>
    </UCheckbox>
  </div>
</template>

<script setup lang="ts">
const prop = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: false, default: 'ControlOfDirectorsControlGroup' },
  modelValue: {
    type: Object as PropType<ControlOfDirectorsI>,
    default: () => ({
      directControl: false,
      indirectControl: false,
      significantInfluence: false,
      inConcertControl: false
    })
  }
})

const t = useNuxtApp().$i18n.t
const types = [
  { value: 'directControl', label: t('texts.controlOfDirectors.directControl') },
  { value: 'indirectControl', label: t('texts.controlOfDirectors.indirectControl') },
  { value: 'significantInfluence', label: t('texts.controlOfDirectors.significantInfluence') }
]

const controlOfDirectors: Ref<ControlOfDirectorsI> = ref(prop.modelValue)
</script>
