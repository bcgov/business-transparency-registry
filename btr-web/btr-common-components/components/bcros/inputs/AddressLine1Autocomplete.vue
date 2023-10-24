<template>
  <div class="relative w-72 z-10">
    {{ selectedAddress }}
    <Combobox v-model="selectedAddress">
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
        >
          <ComboboxInput
            class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            :displayValue="(addr) => addr ? addr.Text: ''"
            @keyup="findAddress($event.target.value)"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <UIcon class="ml-1 self-center text-xl" name="i-mdi-chevron-down" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ComboboxOption
              v-for="address in suggestedAddresses"
              as="template"
              :key="address.Id"
              :value="address"
              v-slot="{ selected, active }"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
                @click="refreshIfFind(address, $event)"
              >
                <span
                  class="block"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ address.Text }} &nbsp; {{ address.Description}}
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption, ComboboxButton, TransitionRoot
} from '@headlessui/vue'
import { BtrAddress } from '~/interfaces/btrAddress'

//https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-find/#responses
type CanadaPostApiFindResponseItem = {
  Id: string // use as LastId in find method or as id to select the item with retrieve
  Text: string // suggestion text
  Highlight: string
  Cursor: Number
  Description: string
  Next: 'Find' | 'Retrieve'
}
// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-find/#parameters
// API : Find (v2.10)
type CanadaPostApiFindParams = {
  // mandatory, error if not provided
  Key: string
  SearchTerm: string

  // with defaults if not provided
  LastId?: string // default ''
  Country?: string // default 'CAN'
  LanguagePreference?: string // default 'en'
  MaxSuggestions?: Number // default 7

  // in examples, but could not find description of it
  SearchFor?: string
  MaxResults?: Number
  Origin?: string
  Bias?: string
  Filters?: string
  GeoFence?: string
}

const props = defineProps({
  countryIso3166Alpha2: { type: String, required: false, default: 'CA' },
  maxSuggestions: { type: Number, required: false, default: 7 },
  langCode: { type: String, required: false, default: 'en' }
})

const canadaPostApiFind = 'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/Find/v2.10/json3.ws'
const canadaPostApiRetrieve = 'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/Retrieve/v2.11/json3.ws'

// const resp = {
//   "Items": [
//     {
//       "Id": "CA|CP|A|19675",
//       "Text": "A-18 Churchill St",
//       "Highlight": "0-1",
//       "Cursor": 0,
//       "Description": "Bridgewater, NS, B4V 1R7",
//       "Next": "Retrieve"
//     },
//     {
//       "Id": "CA|CP|A|18800",
//       "Text": "A-301 Main St",
//       "Highlight": "0-1",
//       "Cursor": 0,
//       "Description": "Shediac, NB, E4P 2A9",
//       "Next": "Retrieve"
//     },
//     {
//       "Id": "CA|CP|A|539",
//       "Text": "A-2340 Main St",
//       "Highlight": "0-1",
//       "Cursor": 0,
//       "Description": "Belledune, NB, E8G 2M5",
//       "Next": "Retrieve"
//     },
//     {
//       "Id": "CA|CP|A|18801",
//       "Text": "A-333 Main St",
//       "Highlight": "0-1",
//       "Cursor": 0,
//       "Description": "Shediac, NB, E4P 2B2",
//       "Next": "Retrieve"
//     },
//     {
//       "Id": "CA|CP|A|103899",
//       "Text": "A-7787 Kipling Ave",
//       "Highlight": "0-1",
//       "Cursor": 0,
//       "Description": "Woodbridge, ON, L4L 1Z1",
//       "Next": "Retrieve"
//     },
//     {
//       "Id": "CA|CP|A|19661",
//       "Text": "A-300 Anemki Pl",
//       "Highlight": "0-1",
//       "Cursor": 0,
//       "Description": "Fort William First Nation, ON, P7J 1H9",
//       "Next": "Retrieve"
//     },
//     {
//       "Id": "CA|CP|A|84687",
//       "Text": "A-813 6th St",
//       "Highlight": "0-1",
//       "Cursor": 0,
//       "Description": "Castlegar, BC, V1N 2E7",
//       "Next": "Retrieve"
//     }
//   ]
// }
//
// const searchText: Ref<string> = ref('')
const selectedAddress: Ref<CanadaPostApiFindResponseItem | null> = ref(null)
const suggestedAddresses: Ref<Array<CanadaPostApiFindResponseItem>> = ref([])
const query = ref('')

const refreshIfFind = (address: CanadaPostApiFindResponseItem, event: Event) => {
  if(address?.Next === 'Find') {
    findAddress(query, address.Id)
    event.stopPropagation()
    event.preventDefault()
  }
}

const findAddress = async (searchTerm, lastId) => {
  query.value = searchTerm
  //todo: add debounce
  const searchParams: CanadaPostApiFindParams = {
    Key: 'RH99-RN99-GB72-FW86',
    SearchTerm: searchTerm,
    LastId: lastId ? lastId: '',
    MaxSuggestions: props.maxSuggestions,
    LanguagePreference: props.langCode,
    Country: props.countryIso3166Alpha2
  }

  const urlFind = canadaPostApiFind + '?' + new URLSearchParams(searchParams)
  const resp = await $fetch(urlFind)
  suggestedAddresses.value = resp.Items
}

</script>
