<template>
  <div :id="id" class="flex flex-col py-5">
    <div v-for="type in types" :key="type.value">
      <UCheckbox
        v-model="controlOfDirectors[type.value]"
        :name="type.value"
        :label="type.label"
        :ui="errorTextColor"
        class="py-2"
      />
    </div>
    <div v-if="hasError" class="py-2 text-sm text-red-500">
      {{ errors[0].message }}
    </div>
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
import type { FormError } from '#ui/types'

const prop = defineProps({
  id: { type: String, required: true },
  errors: { type: Object as PropType<FormError[]>, required: true },
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
const hasError = computed<Boolean>(() => prop.errors.length > 0)
const errorTextColor = computed(() => (hasError.value ? { label: 'text-red-500' } : {}))

</script>
