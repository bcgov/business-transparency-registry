<template>
  {{ phoneNumber }}
  <div class="flex flex-row gap-4">
    <UFormGroup v-slot="{ error }" :name="name + '.countryCode'" class="w-1/4">
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
          :text="$t('helpTexts.phoneNumber.mustBe10DigitsLongTooltip')"
          :popper="{
              placement: 'bottom',
              arrow: true,
              resize: true
            }"
        >
          <span class="text-xs">
            {{ $t('helpTexts.phoneNumber.mustBe10DigitsLong') }}
          </span>
        </BcrosTooltip>
      </template>
      <UInput
        v-model="masked_phone_number"
        variant="bcGov"
        data-cy="phoneNumber.number"
        v-maska:unmaskedvalue.unmasked
        :data-maska="inputMask"
        :placeholder="$t('placeholder.phoneNumber.number')"
      />
    </UFormGroup>
    <UFormGroup v-slot="{ error }" :name="name + '.extension'" class="w-1/4">
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
import { vMaska } from "maska/vue"
import { PhoneSchemaType } from '~/interfaces/zod-schemas-t'
import { watch } from 'vue'

const phoneNumber = defineModel<PhoneSchemaType>({ required: true })

const northAmericaMask = '(###) ###-####'
const otherMask = '##############'

const unmaskedvalue = ref()
const masked_phone_number = ref()
const inputMask = computed(() => phoneNumber.value.countryCallingCode === '1' ? northAmericaMask : otherMask)

watch(
  () => unmaskedvalue,
  () => {
    phoneNumber.value.number = unmaskedvalue.value
  },
  { immediate: false, deep: true }
)

defineProps({
  name: { type: String, default: 'phoneNumber' }
})

// watch(model, () => {
//   formBus?.emit({ type: 'blur', path: props.name })
//   formBus?.emit({ type: 'change', path: props.name })
// }, { deep: true })
</script>
