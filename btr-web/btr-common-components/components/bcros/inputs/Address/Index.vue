<template>
  <UForm ref="addressForm" class="flex flex-col" :schema="addressSchema" :state="address">
    <UFormGroup :error="countryError" :label="label" name="country">
      <!-- country -->
      <USelectMenu
        v-model="country"
        :ui-menu="{ label: countryError ? 'text-red-500' : 'text-gray-700' }"
        by="alpha_2"
        class="w-full"
        :placeholder="$t('labels.country')"
        :options="countries"
        :variant="countryError ? 'error' : 'bcGov'"
        option-attribute="name"
        data-cy="address-country"
        @change="changeCountry"
        @blur="countryBlurred = true"
      />
    </UFormGroup>
    <UFormGroup class="mt-4" name="line1">
      <!--  address line 1 -->
      <BcrosInputsAddressLine1Autocomplete
        v-model="address.line1"
        :country-iso3166-alpha2="address?.country.alpha_2"
        :error-version="line1Invalid"
        data-cy="address-line1-autocomplete"
        @addr-auto-completed="addrAutoCompleted"
        @blur="addressForm.validate('line1', { silent: true })"
      />
    </UFormGroup>
    <UFormGroup class="mt-4" name="line2">
      <!--  address line 2 optional -->
      <UInput
        v-model="address.line2"
        :placeholder="$t('labels.line2')"
        class="w-full flex-1"
        :variant="line2Invalid ? 'error' : 'bcGov'"
        data-cy="address-line2"
        @change="$emit('update:modelValue', address)"
      />
    </UFormGroup>
    <!--  city; region combo; postal code -->
    <div class="flex flex-col sm:flex-row mt-4">
      <UFormGroup class="sm:flex-1" name="city">
        <UInput
          v-model="address.city"
          :placeholder="$t('labels.city')"
          type="text"
          class="pr-4 w-full"
          :variant="cityInvalid ? 'error' : 'bcGov'"
          data-cy="address-city"
          @change="$emit('update:modelValue', address)"
        />
      </UFormGroup>
      <UFormGroup class="sm:flex-1" name="region">
        <USelectMenu
          v-if="address.country.alpha_2==='US' || address?.country.alpha_2==='CA'"
          v-model="address.region"
          :ui-menu="{ placeholder: regionInvalid ? 'text-red-500' : 'text-gray-700' }"
          :options="regions"
          :placeholder="$t('labels.state')"
          class="pr-4 w-full"
          :variant="regionInvalid ? 'error' : 'bcGov'"
          option-attribute="name"
          value-attribute="code"
          data-cy="address-region-select"
          @change="$emit('update:modelValue', address)"
        />
        <UInput
          v-else
          v-model="address.region"
          :placeholder="$t('labels.state')"
          class="pr-4 w-full"
          :variant="regionInvalid ? 'error' : 'bcGov'"
          data-cy="address-region-input"
          @change="$emit('update:modelValue', address)"
        />
      </UFormGroup>
      <UFormGroup class="sm:flex-1" name="postalCode">
        <UInput
          v-model="address.postalCode"
          :placeholder="$t('labels.postalCode')"
          type="text"
          class="w-full"
          :variant="postalCodeInvalid ? 'error' : 'bcGov'"
          data-cy="address-postal-code"
          @change="$emit('update:modelValue', address)"
        />
      </UFormGroup>
    </div>
    <!--  location description optional -->
    <UFormGroup class="mt-4" name="locationDescription">
      <UTextarea
        v-model="address.locationDescription"
        :placeholder="$t('labels.locationDescription')"
        class="w-full"
        :variant="descriptionInvalid ? 'error' : 'bcGov'"
        data-cy="address-location-description"
        @change="$emit('update:modelValue', address)"
      />
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { FormError } from '#ui/types'
const { t } = useI18n()

const emit = defineEmits<{ 'update:modelValue': [value: BtrAddressI] }>()
const props = defineProps({
  label: { type: String, default: '' },
  id: { type: String, required: true },
  modelValue: { type: Object as PropType<BtrAddressI>, required: true },
  errors: { type: Object as PropType<FormError[]>, default: () => ([] as FormError[]) }
})

const country: Ref<BtrCountryI | null> = ref(props.modelValue.country.name === '' ? null : props.modelValue.country)
watch(country, (newCountry: BtrCountryI, _: BtrCountryI) => {
  address.value.country = newCountry
})

const countries = iscCountriesListSortedByName
const address: Ref<BtrAddressI> = ref(props.modelValue)
const regions = computed(() => {
  switch (address.value.country.alpha_2) {
    case 'US':
      return countrySubdivisions.us
    case 'CA':
      return countrySubdivisions.ca
    default:
      return []
  }
})

const clearAddressForm = () => {
  Object.assign(
    address.value,
    { city: '', line1: '', line2: '', locationDescription: '', postalCode: '', region: '', country: country.value }
  )
}

const changeCountry = () => {
  clearAddressForm()
  emit('update:modelValue', address.value)
}

const addrAutoCompleted = (selectedAddr: BtrAddressI) => {
  Object.assign(address.value, selectedAddr)
  country.value = address.value.country
  addressForm.value.validate()
  emit('update:modelValue', address.value)
}

const addressForm = ref()
// NB for country: needed due to select menu blur / form grp not picking it up
const countryBlurred = ref(false)
const countryError = ref('')
// line1
const line1Invalid = ref(false)
// inputs
const line2Invalid = ref(false)
const cityInvalid = ref(false)
const regionInvalid = ref(false)
const postalCodeInvalid = ref(false)
const descriptionInvalid = ref(false)

watch(() => addressForm.value?.errors, (val: { path: string }[]) => {
  if (val.filter(val => val.path === 'country').length > 0 ||
  (countryBlurred.value && !address.value.country?.name)) {
    // this will be triggered after the country menu closes (unlike the actual blur event)
    countryError.value = t('errors.validation.address.country')
  } else {
    countryError.value = ''
  }
  line1Invalid.value = val.filter(val => val.path === 'line1').length > 0
  line2Invalid.value = val.filter(val => val.path === 'line2').length > 0
  cityInvalid.value = val.filter(val => val.path === 'city').length > 0
  regionInvalid.value = val.filter(val => val.path === 'region').length > 0
  postalCodeInvalid.value = val.filter(val => val.path === 'postalCode').length > 0
  descriptionInvalid.value = val.filter(val => val.path === 'locationDescription').length > 0
})

watch(() => props.errors, (val: FormError[]) => {
  addressForm.value.setErrors(val)
})

const addressSchema = z.object({
  country: z.object({}),
  line1: getAddressLine1Validator(),
  line2: z.string().optional(),
  city: getAddressCityValidator(),
  region: getAddressRegionValidator(),
  postalCode: getAddressPostalCodeValidator(),
  locationDescription: z.string().optional()
})
</script>
