<template>
  <UFormGroup v-slot="{ error }" :name="name">
    <div class="flex flex-row gap-4">
      <UInput
        :value="phoneNumber.countryCode"
        variant="bcGov"
        data-cy="phoneNumber.CountryCode"
      >
        COUNTRY CODE
      </UInput>
      <UInput
        :value="phoneNumber.number"
        variant="bcGov"
        data-cy="phoneNumber.Number"
      />
      <UInput
        :value="phoneNumber.extension"
        variant="bcGov"
        data-cy="phoneNumber.ExtensionCode"
      />
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
import { PhoneSchemaType } from '~/interfaces/zod-schemas-t'

const phoneNumber = defineModel<PhoneSchemaType>({ default: undefined })
// const emit = defineEmits<{ (e: 'update:modelValue', value: string | undefined): void }>()

const props = defineProps({
  name: { type: String, default: 'name.fullName' },
})

// watch(model, () => {
//   formBus?.emit({ type: 'blur', path: props.name })
//   formBus?.emit({ type: 'change', path: props.name })
// }, { deep: true })
</script>
