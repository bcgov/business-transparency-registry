<template>
  <div>
    <UCheckbox
      v-model="typeOfControl[IN_CONCERT_CONTROL]"
      :name="IN_CONCERT_CONTROL"
      class="pb-5"
    >
      <template #label>
        {{ $t('texts.sharesAndVotes.inConcertControl.part1') }}
        <BcrosTooltip
          class="underline underline-offset-4 decoration-dotted"
          :popper="{
            placement: 'top',
            arrow: true
          }"
          data-cy="testInConcertControlTooltip"
        >
          <template #tooltip-text>
            <span class="whitespace-normal place-content: center">
              {{ $t('texts.sharesAndVotes.inConcertControl.tooltipContent') }}
            </span>
          </template>
          {{ $t('texts.sharesAndVotes.inConcertControl.tooltip') }}
        </BcrosTooltip>
        {{ $t('texts.sharesAndVotes.inConcertControl.part2') }}
      </template>
    </UCheckbox>
    <p class="pb-5">
      <span class="font-bold">{{ $t('texts.note') }}</span>
      {{ $t('texts.sharesAndVotes.note1') }}
    </p>
    <p>
      {{ $t('texts.sharesAndVotes.typeOfControl') }}
    </p>
    <div :id="id" class="flex flex-col py-5">
      <div v-for="type in types" :key="type.value">
        <UCheckbox
          v-model="typeOfControl[type.value]"
          :name="type.value"
          :label="type.label"
          :ui="errorTextColor"
          class="py-2"
        />
      </div>
      <div v-if="hasError" class="py-2 text-sm text-red-500">
        {{ errors[0].message }}
      </div>
    </div>
    <p class="pb-5">
      <span class="font-bold">{{ $t('texts.note') }}</span>
      {{ $t('texts.sharesAndVotes.note2') }}
    </p>
    <p>
      <span class="font-bold">{{ $t('texts.note') }}</span>
      {{ $t('texts.sharesAndVotes.note3') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

const prop = defineProps({
  id: { type: String, required: true },
  errors: { type: Object as PropType<FormError[]>, required: true },
  modelValue: {
    type: Object as PropType<ControlOfSharesI>,
    default: () => ({
      registeredOwner: false,
      beneficialOwner: false,
      indirectControl: false,
      inConcertControl: false
    })
  }
})

const IN_CONCERT_CONTROL = 'inConcertControl'
const { t } = useI18n()
const types = [
  { value: 'registeredOwner', label: t('texts.sharesAndVotes.registeredOwner') },
  { value: 'beneficialOwner', label: t('texts.sharesAndVotes.beneficialOwner') },
  { value: 'indirectControl', label: t('texts.sharesAndVotes.indirectControl') }
]

const typeOfControl: Ref<ControlOfSharesI> = ref(prop.modelValue)
const hasError = computed<Boolean>(() => prop.errors.length > 0)
const errorTextColor = computed(() => (hasError.value ? { label: 'text-red-500' } : {}))

</script>
