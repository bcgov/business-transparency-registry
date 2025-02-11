<script setup lang="ts">
import type { UseEventBusReturn } from '@vueuse/core'
import { CitizenshipSchemaType } from '~/utils/si-schema/definitions'

const citizenships = defineModel({ type: Object as PropType<CitizenshipSchemaType>, required: true })

const props = defineProps({ name: { type: String, default: 'citizenships' } })

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'citizenship-updated'): void
  (e: 'clear-errors', path: string): void
}>()

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

const citizenshipSelector: Ref<undefined | CitizenshipTypeE> = ref(citizenships.value.citizenshipType)
const otherCitizenships: Ref<BtrCountryI[]> = ref(
  citizenships.value.citizenshipType === CitizenshipTypeE.OTHER
    ? structuredClone(toRaw(citizenships.value.nationalities))
    : []
)

const updateCitizenship = () => {
  citizenships.value.citizenshipType = citizenshipSelector.value
  switch (citizenshipSelector.value) {
    case CitizenshipTypeE.OTHER:
      citizenships.value.nationalities = otherCitizenships.value
      break
    case CitizenshipTypeE.CITIZEN:
      otherCitizenships.value = []
      citizenships.value.nationalities = [{ name: 'Canada (Citizen)', alpha_2: 'CA' }]
      emit('clear-errors', 'citizenships')
      break
    case CitizenshipTypeE.PERMANENT_RESIDENT:
      otherCitizenships.value = []
      citizenships.value.nationalities = [{ name: 'Canada (Permanent Resident)', alpha_2: 'CA_PR' }]
      emit('clear-errors', 'citizenships')
      break
    default:
    // do nothing, I am not here :/
  }
  emit('citizenship-updated')
  formBus?.emit({ type: 'blur', path: props.name })
  formBus?.emit({ type: 'change', path: props.name })
}

watch(citizenshipSelector, () => {
  updateCitizenship()
})
</script>

<template>
  <UFormGroup name="citizenships">
    <template #default="{ error }">
      <div class="flex flex-col gap-1 mb-2">
        <span>
          {{ $t('texts.citizenship.citizenOrPR') }}
        </span>
        <span v-if="error" class="text-red-500">
          {{ error }}
        </span>
      </div>
      <div class="flex flex-row items-center mb-2 py-1">
        <URadio
          id="citizenships-ca-citizen"
          v-model="citizenshipSelector"
          :value="CitizenshipTypeE.CITIZEN"
          data-cy="citizenships-ca-citizen-radio"
        />
        <label for="citizenships-ca-citizen" class="ml-5" :class="{ 'text-red-500': error }">
          {{ $t('labels.countryOfCitizenship.citizen') }}
        </label>
      </div>
      <div class="flex flex-row items-center mb-2 py-1">
        <URadio
          id="citizenships-ca-pr"
          v-model="citizenshipSelector"
          :value="CitizenshipTypeE.PERMANENT_RESIDENT"
          data-cy="citizenships-ca-pr-radio"
        />
        <label for="citizenships-ca-pr" class="ml-5" :class="{ 'text-red-500': error }">
          {{ $t('labels.countryOfCitizenship.pr') }}
        </label>
      </div>

      <div class="mb-2 py-1">
        {{ $t('texts.citizenship.other') }}
      </div>
      <div class="flex flex-row mb-2 py-1 w-full gap-4">
        <URadio
          id="citizenships-other"
          v-model="citizenshipSelector"
          :aria-label="$t('labels.countryOfCitizenship.others')"
          class="mt-3"
          :value="CitizenshipTypeE.OTHER"
          data-cy="citizenships-other-radio"
        />
        <BcrosInputsCombobox
          id="citizenships-other-combobox"
          v-model="otherCitizenships"
          name="citizenships.other"
          :is-in-error-state="!!error"
          :help="$t('labels.countryOfCitizenship.hint')"
          :label-function="(c:BtrCountryI) => c.name"
          :items="citizenshipOptions"
          :search-placeholder="$t('labels.countryOfCitizenship.findCountry')"
          :label-placeholder="$t('labels.countryOfCitizenship.placeholder')"
          key-attribute="alpha_2"
          :search-attributes="['name', 'alpha_2']"
          class="grow"
          @click="citizenshipSelector = CitizenshipTypeE.OTHER"
          @value-changed="citizenships.nationalities = otherCitizenships"
        />
      </div>
    </template>

    <template #error>
      <!-- hide the default error message displayed at the bottom of the UFormGroup -->
    </template>
  </UFormGroup>
</template>
