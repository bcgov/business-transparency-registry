<template>
  <div :id="id" class="flex flex-col py-5">
    <div v-for="type in types" :key="type.value">
      <UCheckbox
        v-model="controlOfDirectors[type.value]"
        :name="type.value"
        :label="type.label"
        class="py-2"
      />
    </div>
    <UCheckbox
      v-model="controlOfDirectors.inConcertControl"
      name="inConcertControl"
      class="py-2 mt-5"
    >
      <template #label>
        {{ $t('texts.controlOfDirectors.inConcertControl.text') }}
        <UTooltip
          class="underline underline-offset-4 decoration-dotted"
          :popper="{
            placement: 'top',
            arrow: true
          }"
          data-cy="testControlOfDirectorsTooltip"
        >
          <template #text>
            <span class="whitespace-normal place-content: center">
              {{ $t('texts.controlOfDirectors.inConcertControl.tooltipContent') }}
            </span>
          </template>
          {{ $t('texts.controlOfDirectors.inConcertControl.tooltip') }}
        </UTooltip>
      </template>
    </UCheckbox>
  </div>
</template>

<script setup lang="ts">

const prop = defineProps({
  id: { type: String, required: true },
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

const { t } = useI18n()
const types = [
  { value: 'directControl', label: t('texts.controlOfDirectors.directControl') },
  { value: 'indirectControl', label: t('texts.controlOfDirectors.indirectControl') },
  { value: 'significantInfluence', label: t('texts.controlOfDirectors.significantInfluence') }
]

const controlOfDirectors: Ref<ControlOfDirectorsI> = ref(prop.modelValue)
</script>
