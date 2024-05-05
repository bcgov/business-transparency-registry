<template>
  <UFormGroup name="isUnableToObtainOrConfirmInformationCheckBoxey" data-cy="isUnableToObtainOrConfirmInformation">
    <UCheckbox
      v-model="isUnableToObtainOrConfirmInformation"
      name="isUnableToObtainOrConfirmInformation"
      :label="$t('labels.unableToObtainOrConfirmInformation.checkboxText')"
      class="py-2 w-full"
      variant="bcGov"
      data-cy="isUnableToObtainOrConfirmInformationCheckbox"
      @change="isUnableToObtainOrConfirmInformationCheckboxChange"
    />
  </UFormGroup>
  <div v-if="isUnableToObtainOrConfirmInformation">
    <p class="py-3">
      {{ $t('labels.unableToObtainOrConfirmInformation.description') }}
    </p>
    <UFormGroup
      v-slot="{ error }"
      :name="name"
      class="py-5"
    >
      <BcrosInputsTextArea
        v-model="isUnableToObtainOrConfirmInformationDetails"
        style="min-height: 50px"
        :placeholder="$t('labels.unableToObtainOrConfirmInformation.textAreaPlaceholder')"
        class="w-full"
        :variant="error ? 'error' : 'bcGov'"
        resize
        :max-char="4000"
        :errors="error"
        data-cy="isUnableToObtainOrConfirmInformationTextArea"
        @keydown="isUnableToObtainOrConfirmInformationDetailsKeyDown"
        @change="emit('update:modelValue', isUnableToObtainOrConfirmInformationDetails || undefined)"
      />
    </UFormGroup>
    <BcrosAlertsMessage :flavour="AlertsFlavourE.INFO">
      <p class="py-2">
        <strong>{{ $t('labels.unableToObtainOrConfirmInformation.alert.important') }}</strong>
        {{ $t('labels.unableToObtainOrConfirmInformation.alert.sentence1') }}
      </p>
      <p class="py-2">
        {{ $t('labels.unableToObtainOrConfirmInformation.alert.sentence2') }}
      </p>
    </BcrosAlertsMessage>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void,
  (e: 'update:missing-info', value: boolean): void
}>()

const props = defineProps({
  modelValue: { type: String, default: undefined },
  missingInfo: { type: Boolean, default: false },
  name: { type: String, default: 'UnableToObtain' }
})

const isUnableToObtainOrConfirmInformation = ref(props.missingInfo)
const isUnableToObtainOrConfirmInformationDetails = ref(props.modelValue || '')

const isUnableToObtainOrConfirmInformationCheckboxChange = () => {
  if (!isUnableToObtainOrConfirmInformation.value) {
    isUnableToObtainOrConfirmInformationDetails.value = ''
  }
}
const isUnableToObtainOrConfirmInformationDetailsKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') {
    isUnableToObtainOrConfirmInformation.value = true
  }
}

watch(isUnableToObtainOrConfirmInformation, (newValue) => {
  emit('update:missing-info', newValue)
})

watch(isUnableToObtainOrConfirmInformationDetails, (newValue) => {
  emit('update:modelValue', newValue)
})

</script>
