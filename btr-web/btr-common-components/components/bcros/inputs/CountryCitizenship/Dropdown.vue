<template>
  <div class="relative w-full">
    <Listbox
      v-model="nonCaCitizenships"
      as="div"
      multiple
      :class="[
        'w-full',
        'cursor-default',
        'overflow-hidden',
        'bg-gray-100',
        'text-left',
        'border-b-2',
        'border-gray-500',
        'focus:outline-none',
        'sm:text-sm',
        'h-[46px]']"
    >
      <ListboxButton class="w-full h-11">
        <span v-if="nonCaCitizenships.length === 0">
          {{ placeholder }}
        </span>
        <span v-else class="align-middle">
          <BcrosChips
            v-for="country in nonCaCitizenships"
            :key="country.alpha_2"
            :label="country.name"
            class="float-left z-20"
            :has-close="true"
            @chipCloseClicked="removeCitizenship(country)"
          />
        </span>
        <UIcon class="float-right text-2xl " name="i-mdi-chevron-down" />
      </ListboxButton>
      <ListboxOptions
        :class="[
          'absolute',
          'mt-1',
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
          'z-10']"
      >
        <ListboxOption
          v-for="country in countriesWithoutCa"
          :key="country.alpha_2"
          v-slot="{ active, selected }"
          :value="country"
          as="ul"
        >
          <li
            class="cursor-default select-none py-2 pl-10 pr-4"
            :class="{
              'bg-primary text-white': active,
              'text-gray-900': !active,
            }"
          >
            <div>
              <span v-if="selected" class="float-right text-outcomes-approved">
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
          </li>
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

import { BtrCountryI } from '~/interfaces/btr-address-i'
import { iscCountriesListSortedByName } from '~/utils/isoCountriesList'

const emit = defineEmits<{ 'update:modelValue': [value: Array<BtrCountryI>] }>()
const props = defineProps({
  placeholder: { type: String, default: '' },
  modelValue: { type: Array<BtrCountryI>, required: true }
})

// const nonCaCitizenships: Ref<Array<BtrCountryI>> = ref(props.modelValue)
const nonCaCitizenships = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
const countriesWithoutCa = iscCountriesListSortedByName.filter(country => country.alpha_2 !== 'CA')

const removeCitizenship = (country: BtrCountryI) => {
  const index = nonCaCitizenships.value.indexOf(country)
  if (index > -1) {
    nonCaCitizenships.value.splice(index, 1)
  }
}

// watch(() => props.modelValue, () => { emit('update:modelValue', nonCaCitizenships.value) })
</script>
