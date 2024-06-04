<template>
  <div class="relative w-full" data-cy="countryOfCitizenshipDropdown">
    <Combobox
      v-slot="{ open }"
      v-model="citizenships"
      as="div"
      :by="compareItems"
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
        errorState ? 'border-b-red-500' : '']"
      :disabled="disabled"
    >
      <ComboboxButton
        class="w-full min-h-[56px] px-[10px] text-left"
        data-cy="countryOfCitizenshipDropdownButton"
        tabindex="0"
        @click="filterCountries('')"
      >
        <span
          v-if="citizenships && citizenships.length === 0"
          class="w-full"
          :class="{
            'text-red-500': errorState,
            'text-primary-500': open,
            'text-gray-700': !open && !disabled,
            'text-gray-500': disabled,
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
  </div>
</template>

<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { BtrCountryI } from '~/interfaces/btr-address-i'

const emit = defineEmits<{ 'update:modelValue': [value: Array<BtrCountryI>] }>()
const props = defineProps({
  errorState: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  modelValue: { type: Array<BtrCountryI>, required: true }
})

const citizenships = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const countryOptions = ref(citizenshipOptions)

// the comparison function can be passed in as a prop
// when we make this component a general-purpose dropdown in future tickets
const compareItems = (a: BtrCountryI, b: BtrCountryI) => {
  return a.alpha_2 === b.alpha_2
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
</script>
