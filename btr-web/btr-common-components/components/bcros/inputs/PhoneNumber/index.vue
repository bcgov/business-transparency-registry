<template>
  <div class="flex flex-row gap-4">
    <UFormGroup v-slot="{ error }" :name="name + '.countryCode'" class="w-1/4">
      <BcrosInputsPhoneNumberCountryCode
        v-model:country-calling-code="phoneNumber.countryCallingCode"
        v-model:country-code2letter-iso="phoneNumber.countryCode2letterIso"
        data-cy="phoneNumber.countryCode"
        :placeholder="$t('placeholder.phoneNumber.countryCode')"
      />
    </UFormGroup>
    <UFormGroup v-slot="{ error }" :name="name + '.number'" class="w-1/2">
      <UInput
        v-model="phoneNumber.number"
        variant="bcGov"
        data-cy="phoneNumber.number"
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
import { PhoneSchemaType } from '~/interfaces/zod-schemas-t'
import x from '#components'
const phoneNumber = defineModel<PhoneSchemaType>({ default: undefined })
// const emit = defineEmits<{ (e: 'update:modelValue', value: string | undefined): void }>()

const props = defineProps({
  name: { type: String, default: 'name.fullName' }
})

// watch(model, () => {
//   formBus?.emit({ type: 'blur', path: props.name })
//   formBus?.emit({ type: 'change', path: props.name })
// }, { deep: true })
</script>
