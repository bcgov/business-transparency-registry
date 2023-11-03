<template>
  <div class="relative w-full">
    <Combobox v-model="line1">
      <div class="mt-1">
        <div
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
            'h-[46px]'
          ]"
        >
          <ComboboxInput
            :placeholder="$t('labels.line1')"
            class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-gray-100 text-gray-900 focus:ring-0"
            @keyup="doTheSearch($event.target.value)"
          />
        </div>
        <ComboboxOptions
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
            'z-10']"
        >
          <ComboboxOption
            v-for="address in suggestedAddresses"
            :key="address.Id"
            v-slot="{ selected, active }"
            as="template"
            :value="address"
          >
            <li
              class="cursor-default select-none py-2 pl-10 pr-4"
              :class="{
                'bg-teal-600 text-white': active,
                'text-gray-900': !active,
              }"
              @click="selectFromDropdown(address, $event)"
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
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { CanadaPostApiFindResponseItemI, CanadaPostRetrieveItemI } from '~/utils'
import { BtrAddressI } from '~/interfaces/btr-address-i'

const runtimeConfig = useRuntimeConfig()

const emit = defineEmits<{
  addrAutoCompleted: [value: BtrAddressI]
  'update:modelValue': [value: string]
}>()
const props = defineProps({
  countryIso3166Alpha2: { type: String, required: false, default: 'CA' },
  maxSuggestions: { type: Number, required: false, default: 7 },
  langCode: { type: String, required: false, default: 'ENG' },
  modelValue: { type: String, required: true }
})

const canadaPostApiKey = runtimeConfig.public.addressCompleteKey
const suggestedAddresses: Ref<Array<CanadaPostApiFindResponseItemI>> = ref([])
// @ts-ignore
const line1: Ref<string> = ref(props.modelValue)
const selectFromDropdown = async (address: CanadaPostApiFindResponseItemI, event: Event) => {
  if (address?.Next === 'Find') {
    event.stopPropagation()
    event.preventDefault()

    suggestedAddresses.value = await findAddress(line1, address.Id, props, canadaPostApiKey)
  } else {
    const address1 = await getExactAddress(address.Id)
    line1.value = address1.Line1
    const btrAddr: BtrAddressI = convertToBtrAddress(address1)
    emit('addrAutoCompleted', btrAddr)
  }
}

const convertToBtrAddress = (addr: CanadaPostRetrieveItemI): BtrAddressI => {
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
  line1.value = searchTerm
  suggestedAddresses.value = await findAddress(searchTerm, '', props, canadaPostApiKey)
}

const getExactAddress = async (searchAddressId: string): Promise<CanadaPostRetrieveItemI> => {
  const retrievedAddresses = await retrieveAddress(searchAddressId, canadaPostApiKey)
  let addrForLang = retrievedAddresses.find(addr => addr.Language === props.langCode)
  if (!addrForLang && retrievedAddresses) {
    addrForLang =
      retrievedAddresses.find(addr => addr.Language === 'ENG') ||
      retrievedAddresses[0]
  }
  return addrForLang
}

watch(line1, (newLine1: string, _: string) => {
  emit('update:modelValue', newLine1)
})

watch(() => props.modelValue, (newValue: string) => {
  line1.value = newValue
})

</script>
