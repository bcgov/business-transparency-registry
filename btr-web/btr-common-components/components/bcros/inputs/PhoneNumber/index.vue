<template>
  <div class="flex flex-row gap-4">
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
      />
    </UFormGroup>
    <UFormGroup :name="name + '.extension'" class="w-1/4">
      <UInput
        v-model="phoneNumber.extension"
        :placeholder="$t('placeholder.phoneNumber.extension') + ' (' + $t('general.optional') + ')'"
        variant="bcGov"
        data-cy="phoneNumber.extensionCode"
      />
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { Mask } from 'maska'

import { PhoneSchemaType } from '~/interfaces/zod-schemas-t'

const phoneNumber = defineModel<PhoneSchemaType>({ required: true })

defineProps({
  name: { type: String, default: 'phoneNumber' }
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
</script>
