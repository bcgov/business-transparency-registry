<template>
  <div data-cy="isUnableToObtainOrConfirmInformation">
    <p class="font-bold py-3">
      {{ $t('labels.unableToObtainOrConfirmInformation.title') }}
    </p>
    <UCheckbox
      v-model="isUnableToObtainOrConfirmInformation"
      name="isUnableToObtainOrConfirmInformation"
      :label="$t('labels.unableToObtainOrConfirmInformation.checkboxText')"
      class="py-2 w-full"
      variant="bcGov"
      data-cy="isUnableToObtainOrConfirmInformationCheckbox"
      @change="isUnableToObtainOrConfirmInformationCheckboxChange"
    />
    <p class="py-3">
      {{ $t('labels.unableToObtainOrConfirmInformation.description') }}
    </p>
    <BcrosInputsTextArea
      v-model="isUnableToObtainOrConfirmInformationDetails"
      :placeholder="$t('labels.unableToObtainOrConfirmInformation.textAreaPlaceholder')"
      class="py-2 w-full"
      variant="bcGov"
      resize
      :max-char="4000"
      data-cy="isUnableToObtainOrConfirmInformationTextArea"
      @keydown="isUnableToObtainOrConfirmInformationDetailsKeyDown"
      @change="emit('update:modelValue', isUnableToObtainOrConfirmInformationDetails || undefined)"
    />
    <BcrosAlertsMessage v-if="isUnableToObtainOrConfirmInformation" :flavour="AlertsFlavourE.ALERT">
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
const emit = defineEmits<{(e: 'update:modelValue', value: string | undefined): void }>()
defineProps({
  modelValue: { type: String, default: undefined }
})

const isUnableToObtainOrConfirmInformation = ref(false)
const isUnableToObtainOrConfirmInformationDetails = ref('')

const isUnableToObtainOrConfirmInformationCheckboxChange = () => {
  if (!isUnableToObtainOrConfirmInformation.value) {
    isUnableToObtainOrConfirmInformationDetails.value = ''
  }
}
const isUnableToObtainOrConfirmInformationDetailsKeyDown = () => {
  isUnableToObtainOrConfirmInformation.value = true
}
</script>
