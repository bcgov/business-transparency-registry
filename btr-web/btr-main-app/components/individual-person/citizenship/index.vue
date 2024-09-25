<script setup lang="ts">
import type { UseEventBusReturn } from '@vueuse/core'

const citizenships = defineModel({ type: Array<BtrCountryI>, required: true })

const props = defineProps({ name: { type: String, default: 'citizenships' } })

const emit = defineEmits<(e: 'citizenship-updated') => void>()

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

enum CitizenshipSelector {
  OTHER = 'OTHER',
  CITIZEN = 'CITIZEN',
  PERMANENT_RESIDENT = 'PERMANENT_RESIDENT'
}

const isCitizen = citizenships.value.findIndex((country: BtrCountryI) => country.alpha_2 === 'CA') !== -1
const isPr = citizenships.value.findIndex((country: BtrCountryI) => country.alpha_2 === 'CA_PR') !== -1
const isOther = !isCitizen && !isPr && citizenships.value.length > 0

let prepopulated: CitizenshipSelector | undefined
if (isCitizen) {
  prepopulated = CitizenshipSelector.CITIZEN
} else if (isPr) {
  prepopulated = CitizenshipSelector.PERMANENT_RESIDENT
} else if (isOther) {
  prepopulated = CitizenshipSelector.OTHER
}

const citizenshipSelector: Ref<undefined | CitizenshipSelector> = ref(prepopulated)
const otherCitizenships: Ref<BtrCountryI[]> = ref(isOther ? structuredClone(toRaw(citizenships.value)) : [])

const updateCitizenship = () => {
  switch (citizenshipSelector.value) {
    case CitizenshipSelector.OTHER:
      citizenships.value = otherCitizenships.value
      break
    case CitizenshipSelector.CITIZEN:
      otherCitizenships.value = []
      citizenships.value = [{ name: 'Canada (Citizen)', alpha_2: 'CA' }]
      break
    case CitizenshipSelector.PERMANENT_RESIDENT:
      otherCitizenships.value = []
      citizenships.value = [{ name: 'Canada (Permanent Resident)', alpha_2: 'CA_PR' }]
      break
    default:
    // do nothing, I am not here :/
  }
  emit('citizenship-updated')
  formBus?.emit({ type: 'blur', path: props.name })
  formBus?.emit({ type: 'change', path: props.name })
}

</script>

<template>
  <UFormGroup v-slot="{ error }" :name="name">
    <div class="flex flex-row items-center mb-2 py-2">
      <URadio
        id="citizenships-ca-citizen"
        v-model="citizenshipSelector"
        :value="CitizenshipSelector.CITIZEN"
        :variant="error ? 'error' : variant"
        data-cy="citizenships-ca-citizen-radio"
        @change="updateCitizenship"
      />
      <label for="citizenships-ca-citizen" class="ml-5" :class="{ 'text-red-500': error}">
        {{ $t('labels.countryOfCitizenship.citizen') }}
      </label>
    </div>
    <div class="flex flex-row items-center mb-2 py-2">
      <URadio
        id="citizenships-ca-pr"
        v-model="citizenshipSelector"
        :value="CitizenshipSelector.PERMANENT_RESIDENT"
        :variant="error ? 'error' : variant"
        data-cy="citizenships-ca-pr-radio"
        @change="updateCitizenship"
      />
      <label for="citizenships-ca-pr" class="ml-5" :class="{ 'text-red-500': error}">
        {{ $t('labels.countryOfCitizenship.pr') }}
      </label>
    </div>
    <div class="flex flex-row mb-2 py-1 w-full gap-4">
      <URadio
        id="citizenships-other"
        v-model="citizenshipSelector"
        :aria-label="$t('labels.countryOfCitizenship.others')"
        class="mt-3"
        :value="CitizenshipSelector.OTHER"
        data-cy="citizenships-other-radio"
        @change="updateCitizenship"
      />
      <BcrosInputsCombobox
        id="citizenships-other-combobox"
        v-model="otherCitizenships"
        name="citizenships"
        :is-in-error-state="error"
        :help="$t('labels.countryOfCitizenship.hint')"
        :label-function="(c:BtrCountryI) => c.name"
        :items="citizenshipOptions"
        :search-placeholder="$t('labels.countryOfCitizenship.findCountry')"
        :label-placeholder="$t('labels.countryOfCitizenship.placeholder')"
        key-attribute="alpha_2"
        :search-attributes="['name', 'alpha_2']"
        class="grow"
        @click="citizenshipSelector = CitizenshipSelector.OTHER"
        @value-changed="citizenships = otherCitizenships"
      />
    </div>
  </UFormGroup>
</template>
