<template>
  <div class="mt-5 p-10 bg-white rounded flex align-middle" data-cy="significantIndividualChangeFolioNumber">
    <label
      for="significantIndividualChangeFolioNumber"
      class="text-lg w-[190px] font-bold"
      data-cy="significantIndividualChangeFolioNumberLabel"
    >
      {{ $t('labels.folioNumber') }}
    </label>
    <div class="ml-8 flex-auto">
      <UFormGroup label="" name="folioNumber">
        <UInput
          id="significantIndividualChangeFolioNumber"
          v-bind="$attrs"
          v-model="folioNumber"
          name="significantIndividualChangeFolioNumber"
          class="my-0"
          type="text"
          variant="bcGov"
          :placeholder="`${$t('labels.folioNumber')} (${$t('labels.optional')})`"
          data-cy="significantIndividualChangeFolioNumberTextArea"
        />
      </UFormGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const props = defineProps({
  maxFolioNumberLength: { type: Number, default: 30 },
  modelValue: { type: String, required: true }
})

const folioNumber = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>
