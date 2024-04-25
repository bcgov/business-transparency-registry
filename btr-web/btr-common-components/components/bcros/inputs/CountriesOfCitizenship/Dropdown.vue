<template>
  <div class="relative w-full" data-cy="countryOfCitizenshipDropdown">
    <Combobox
      v-slot="{ open }"
      v-model="citizenships"
      as="div"
      multiple
      :class="[
        'w-full',
        'cursor-default',
        'overflow-hidden',
        'bg-gray-100',
        'text-left',
        'border-b-[1px]',
        'focus:outline-none',
        'sm:text-sm',
        'min-h-fit',
        'rounded-t-md',
        disabled ? 'border-gray-500' : 'border-gray-700 hover:bg-gray-200',
        hasError ? 'border-b-red-500' : '']"
      :disabled="disabled"
    >
      <ComboboxButton
        class="w-full min-h-[56px] px-[10px] text-left"
        data-cy="countryOfCitizenshipDropdownButton"
        tabindex="0"
      >
        <span
          v-if="citizenships && citizenships.length === 0"
          class="w-full"
          :class="{
            'text-primary-500': open,
            'text-gray-700': !open && !disabled,
            'text-gray-500': disabled
          }"
        >
          {{ $t('labels.countryOfCitizenship.placeholder') }}
        </span>
        <span v-else class="align-middle">
          <BcrosChips
            v-for="country in citizenships"
            :key="country.alpha_2"
            :label="country.name"
            class="float-left z-20"
            :has-close="true"
            data-cy="countryOfCitizenshipDropdownChip"
            @chipCloseClicked="removeCitizenship(country)"
          />
        </span>
        <UIcon class="float-right text-2xl " name="i-mdi-chevron-down" />
      </ComboboxButton>
      <div v-show="open" class="absolute z-10 w-full">
        <ComboboxInput
          :placeholder="$t('labels.countryOfCitizenship.findCountry')"
          :class="[
            'w-full',
            'focus:outline-none',
            'sm:text-sm',
            'p-3',
            'bg-gray-100',
            'border-b-2',
            'border-primary-500',
            'placeholder-primary-500'
          ]"
          data-cy="countryOfCitizenshipDropdownFilter"
          @change="filterCountries($event.target.value)"
        />
        <ComboboxOptions
          :class="[
            'relative',
            'max-h-60',
            'w-full',
            'overflow-auto',
            'bg-white',
            'py-1',
            'text-base',
            'shadow-lg',
            'focus:outline-none',
            'sm:text-sm',
            'bg-gray-500',
            'z-10'
          ]"
          as="div"
        >
          <ComboboxOption
            v-for="country in countryOptions"
            :key="country.alpha_2"
            v-slot="{ active }"
            :value="country"
            as="template"
          >
            <div
              class="cursor-default select-none py-2 pl-10 pr-4"
              :class="{ 'bg-gray-100': active }"
              data-cy="countryOfCitizenshipDropdownOption"
            >
              <span v-if="isInSelected(country)" class="float-right text-outcomes-success">
                <UIcon name="i-mdi-check" />
                {{ $t('labels.countryOfCitizenship.selected') }}
              </span>
              <span v-else class="float-right text-primary">
                <UIcon name="i-mdi-add" />
                {{ $t('labels.countryOfCitizenship.select') }}
              </span>
              <span>
                {{ country.name }}
              </span>
            </div>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
    <div v-if="hasError" class="text-sm text-red-500 pt-2">
      {{ errors[0].message }}
    </div>
    <div v-if="!hasError && citizenships && citizenships.length === 0" class="text-sm pt-2 ml-2">
      {{ $t('labels.countryOfCitizenship.hint') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import type { FormError } from '#ui/types'
import { BtrCountryI } from '~/interfaces/btr-address-i'

const emit = defineEmits<{ 'update:modelValue': [value: Array<BtrCountryI>] }>()
const props = defineProps({
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  modelValue: { type: Array<BtrCountryI>, required: true },
  errors: { type: Object as PropType<FormError[]>, required: true }
})

const citizenships = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    value.sort(sortByPriority)
    emit('update:modelValue', value)
  }
})

const countryOptions = ref(citizenshipOptions)

// To confirm: do we want to prioritize 'USA' in the selected citizenships
const priorityOrder = ['CA', 'CA_PR', 'US']

const sortByPriority = (a: BtrCountryI, b: BtrCountryI) => {
  const priorityA = priorityOrder.indexOf(a.alpha_2)
  const priorityB = priorityOrder.indexOf(b.alpha_2)

  if (priorityA > -1 && priorityB > -1) {
    return priorityA - priorityB
  } else if (priorityA > -1) {
    return -1
  } else if (priorityB > -1) {
    return 1
  }

  return 0
}

const removeCitizenship = (country: BtrCountryI) => {
  const index = citizenships.value.indexOf(country)
  if (index > -1) {
    citizenships.value.splice(index, 1)
  }
}

const filterCountries = (searchText: string) => {
  const text = searchText.toLowerCase()
  if (text) {
    countryOptions.value =
      citizenshipOptions.filter(
        value => value.name.toLowerCase().includes(text)
      )
  } else {
    countryOptions.value = citizenshipOptions
  }
}

const isInSelected = (country: BtrCountryI) => {
  return citizenships.value?.findIndex(c => c.alpha_2 === country.alpha_2) !== -1
}

const hasError = computed<Boolean>(() => props.errors?.length > 0)
</script>
