<template>
  <UCheckbox
    v-model="typeOfControl['inConcertControl']"
    name="inConcertControl"
    class="pb-5"
  >
    <template #label>
      {{ $t('texts.sharesAndVotes.inConcertControl.part1') }}
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
            {{ $t('texts.sharesAndVotes.inConcertControl.tooltipContent') }}
          </span>
        </template>
        {{ $t('texts.sharesAndVotes.inConcertControl.tooltip') }}
      </UTooltip>
      {{ $t('texts.sharesAndVotes.inConcertControl.part2') }}
    </template>
  </UCheckbox>

  <p class="text-justify pb-5">
    <span class="font-bold">{{ $t('texts.note') }}</span>
    {{ $t('texts.sharesAndVotes.note1') }}
  </p>

  <p class="text-justify">
    {{ $t('texts.sharesAndVotes.typeOfControl') }}
  </p>


  <div :id="id" class="flex flex-col py-5">
    <div v-for="type in types" :key="type.value">
      <UCheckbox
        v-model="typeOfControl[type.value]"
        :name="type.value"
        :label="type.label"
        class="py-2"
      />
    </div>
  </div>

  <p class="text-justify pb-5">
    <span class="font-bold">{{ $t('texts.note') }}</span>
    {{ $t('texts.sharesAndVotes.note2') }}
  </p>
  <p class="text-justify pb-5">
    <span class="font-bold">{{ $t('texts.note') }}</span>
    {{ $t('texts.sharesAndVotes.note3') }}
  </p>
</template>

<script setup lang="ts">
const prop = defineProps({
  id: { type: String, required: true },
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

const { t } = useI18n()
const types = [
  { value: 'registeredOwner', label: t('texts.sharesAndVotes.registeredOwner') },
  { value: 'beneficialOwner', label: t('texts.sharesAndVotes.beneficialOwner') },
  { value: 'indirectControl', label: t('texts.sharesAndVotes.indirectControl') }
]

const typeOfControl: Ref<ControlOfSharesI> = ref(prop.modelValue)

</script>
