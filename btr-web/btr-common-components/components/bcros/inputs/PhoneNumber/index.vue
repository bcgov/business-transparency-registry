<template>
  <div class="flex flex-row gap-4 w-full">
    <UFormGroup :name="name + '.countryCode'" class="w-1/4">
      <BcrosInputsPhoneNumberCountryCode
        v-model:country-calling-code="phoneNumber.countryCallingCode"
        v-model:country-code2letter-iso="phoneNumber.countryCode2letterIso"
        data-cy="phoneNumber.countryCode"
        :placeholder="$t('placeholder.phoneNumber.countryCode')"
      />
    </UFormGroup>
    <UFormGroup :name="name + '.number'" class="w-1/2">
      <template #help>
        <BcrosTooltip
          :popper="{
            placement: 'bottom',
            arrow: true,
            resize: true
          }"
        >
          <template #tooltip-text>
            <span class="whitespace-normal place-content: center">
              {{ $t('helpTexts.phoneNumber.mustBe10DigitsLongTooltip') }}
            </span>
          </template>
          <span class="text-xs">
            {{ $t('helpTexts.phoneNumber.mustBe10DigitsLong') }}
          </span>
        </BcrosTooltip>
      </template>
      <UInput
        v-model="maskedPhoneNumber"
        v-maska:unmaskedvalue.unmasked
        variant="bcGov"
        data-cy="phoneNumber.number"
        :data-maska="inputMask"
        :placeholder="$t('placeholder.phoneNumber.number')"
        @focus="clearPhoneNumberOnEdit"
        @change="phoneNumberUpdated=true"
        @blur="revertUnchangedPhoneNumber"
      />
    </UFormGroup>
    <UFormGroup :name="name + '.extension'" class="w-1/4">
      <UInput
        v-model="phoneNumber.extension"
        :placeholder="$t('placeholder.phoneNumber.extension')"
        variant="bcGov"
        data-cy="phoneNumber.extensionCode"
      />
      <template #help>
        <span class="text-xs">
          {{ $t('general.optional') }}
        </span>
      </template>
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { Mask } from 'maska'

import { PhoneSchemaType } from '~/interfaces/zod-schemas-t'

const phoneNumber = defineModel<PhoneSchemaType>({ required: true })

const props = defineProps({
  name: { type: String, default: 'phoneNumber' },
  isEditing: { type: Boolean, required: true }
})

const northAmericaMask = '(###) ###-####'
const otherMask = '##############'

const unmaskedvalue = ref()
const maskedPhoneNumber = ref(phoneNumber.value.number)
const inputMask = computed(() => phoneNumber.value.countryCallingCode === '1' ? northAmericaMask : otherMask)

watchEffect(
  () => {
    const mask = new Mask({ mask: inputMask.value })
    phoneNumber.value.number = unmaskedvalue.value || mask.unmasked(maskedPhoneNumber.value || '')
  }
)

const phoneNumberUpdated = ref(false)
const phoneFieldUuid = getRandomUuid()
const clearPhoneNumberOnEdit = () => {
  if (props.isEditing) {
    setFieldOriginalValue(phoneFieldUuid, maskedPhoneNumber)
    maskedPhoneNumber.value = ''
  }
}
const revertUnchangedPhoneNumber = () => {
  const originalValue = getFieldOriginalValue(phoneFieldUuid)
  if (props.isEditing && !phoneNumberUpdated.value && originalValue) {
    maskedPhoneNumber.value = originalValue
  }
}
</script>
