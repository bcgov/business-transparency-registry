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
      v-model="controlOfDirectors.noControl"
      name="noControl"
      class="py-2 mt-5"
    >
      <template #label>
        {{ $t('texts.controlOfDirectors.noControl.text') }}
        <UTooltip
          class="underline underline-offset-4 decoration-dotted"
          :popper="{
            placement: 'top',
            arrow: true
          }"
        >
          <template #text>
            <span class="whitespace-normal">
              {{ $t('texts.controlOfDirectors.noControl.tooltipContent') }}
            </span>
          </template>
          {{ $t('texts.controlOfDirectors.noControl.tooltip') }}
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
      noControl: true
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
