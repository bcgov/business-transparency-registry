<template>
  <div class="relative w-full z-10">
    <Combobox v-model="selectedAddress">
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden bg-gray-100 text-left border-b-2 border-gray-500 focus:outline-none sm:text-sm"
        >
          <ComboboxInput
            class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-gray-100 text-gray-900 focus:ring-0"
            :displayValue="(addr) => addr ? addr.Text: ''"
            @keyup="doTheSearch($event.target.value)"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <UIcon class="ml-1 self-center text-xl" name="i-mdi-chevron-down" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions class="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            <ComboboxOption
              v-for="address in suggestedAddresses"
              :key="address.Id"
              as="template"
              :value="address"
              v-slot="{ selected, active }"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
                @click="expandWhenMoreAddresses(address, $event)"
              >
                <span
                  class="block"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ address.Text }} &nbsp; {{ address.Description }}
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
import { ref, Ref } from 'vue'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot
} from '@headlessui/vue'
import type { BtrAddress } from '~/interfaces/btrAddress'
import { CanadaPostApiFindResponseItem, CanadaPostRetrieveItem } from '~/utils'

const runtimeConfig = useRuntimeConfig()

const emit = defineEmits<{
  addrAutoCompleted: [value: BtrAddress]
  addrLine1Update: [value: string]
}>()
const props = defineProps({
  countryIso3166Alpha2: { type: String, required: false, default: 'CA' },
  maxSuggestions: { type: Number, required: false, default: 7 },
  langCode: { type: String, required: false, default: 'ENG' }
})

const canadaPostApiKey = runtimeConfig.public.addressCompleteKey
const selectedAddress: Ref<CanadaPostApiFindResponseItem | null> = ref(null)
const suggestedAddresses: Ref<Array<CanadaPostApiFindResponseItem>> = ref([])
const query = ref('')
const expandWhenMoreAddresses = async (address: CanadaPostApiFindResponseItem, event: Event) => {
  if (address?.Next === 'Find') {
    event.stopPropagation()
    event.preventDefault()

    suggestedAddresses.value = await findAddress(query, address.Id, props, canadaPostApiKey)
  }
}

const convertToBtrAddress = (addr: CanadaPostRetrieveItem): BtrAddress => {
  return {
    country: { alpha_2: addr.CountryIso2, name: addr.CountryName },
    line1: addr.Line1,
    line2: addr.Line2,
    city: addr.City,
    region: addr.Province,
    postalCode: addr.PostalCode,
    locationDescription: ''
  }
}

const doTheSearch = async (searchTerm) => {
  // todo: add debounce
  query.value = searchTerm
  // append currently typed value as first item to allow usage of this as a value
  const typedAddress: CanadaPostApiFindResponseItem = { Cursor: 0, Description: undefined, Highlight: undefined, Id: undefined, Next: undefined, Text: searchTerm }
  const found = await findAddress(searchTerm, '', props, canadaPostApiKey)
  suggestedAddresses.value = [typedAddress].concat(found)
}

watch(selectedAddress, async (newAddress: CanadaPostApiFindResponseItem, oldAddress: CanadaPostApiFindResponseItem) => {
  if (newAddress?.Id !== oldAddress?.Id) {
    const retrievedAddresses = await retrieveAddress(newAddress.Id, canadaPostApiKey)
    let addrForLang = retrievedAddresses.find(addr => addr.Language === props.langCode)
    if (!addrForLang && retrievedAddresses) {
      addrForLang =
        retrievedAddresses.find(addr => addr.Language === 'ENG') ||
        retrievedAddresses[0]
    }

    const addr: CanadaPostRetrieveItem = addrForLang

    if (addr) {
      const btrAddr: BtrAddress = convertToBtrAddress(addr)
      emit('addrAutoCompleted', btrAddr)
    }
  } else if (!newAddress?.Id) {
    emit('addrLine1Update', newAddress.Text)
  }
})
</script>
