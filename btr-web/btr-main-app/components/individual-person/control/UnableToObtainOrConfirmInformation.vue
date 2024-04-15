<template>
  <div data-cy="isUnableToObtainOrConfirmInformation">
    <UCheckbox
      v-model="isUnableToObtainOrConfirmInformation"
      name="isUnableToObtainOrConfirmInformation"
      :label="$t('labels.unableToObtainOrConfirmInformation.checkboxText')"
      class="py-2 w-full"
      variant="bcGov"
      data-cy="isUnableToObtainOrConfirmInformationCheckbox"
      @change="isUnableToObtainOrConfirmInformationCheckboxChange"
    />
    <div v-if="isUnableToObtainOrConfirmInformation">
      <p class="py-3">
        {{ $t('labels.unableToObtainOrConfirmInformation.description') }}
      </p>
      <BcrosInputsTextArea
        v-model="isUnableToObtainOrConfirmInformationDetails"
        style="min-height: 50px"
        :placeholder="$t('labels.unableToObtainOrConfirmInformation.textAreaPlaceholder')"
        class="py-2 w-full"
        :variant="hasError ? 'error' : 'bcGov'"
        resize
        :max-char="4000"
        :errors="errors"
        data-cy="isUnableToObtainOrConfirmInformationTextArea"
        @keydown="isUnableToObtainOrConfirmInformationDetailsKeyDown"
        @change="emit('update:modelValue', isUnableToObtainOrConfirmInformationDetails || undefined)"
      />
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
  </div>
</template>

<script setup lang="ts">
import { FormError } from '#ui/types'

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void,
  (e: 'update:missing-info', value: boolean): void
}>()

const props = defineProps({
  modelValue: { type: String, default: undefined },
  missingInfo: { type: Boolean, default: false },
  errors: { type: Object as PropType<FormError[]>, required: true }
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

const hasError = computed<Boolean>(() => props.errors.length > 0)
</script>
