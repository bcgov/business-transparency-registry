<template>
  <div data-test="addIndividualPerson" class="flex-col w-full text-gray-900">
    <div>
      <!-- todo: move this to lang file -->
      <p class="text-justify">
        To add a person to the transparency register of this business,
        enter their name and email address. A request will be sent to the person at
        their email address and they will have the ability to accept or decline the addition
        of their information to the transparency register of the business.
        If they accept, their information will automatically be added to the transparency register.
        If you don’t want to send an invitation, you can add the person’s transparency information manually.
      </p>
    </div>
    <UForm
      :schema="schema"
      :state="state"
    >
      <div class="flex-col py-5">
        <BcrosInputsNameField
          id="individual-person-full-name"
          v-model="state.fullName"
          name="fullName"
          :label="$t('labels.fullName')"
          data-cy="testFullName"
        />
      </div>
      <div class="flex-col py-5">
        <BcrosInputsNameField
          id="individual-person-preferred-name"
          v-model="state.preferredName"
          name="preferredName"
          :label="$t('labels.preferredName')"
          data-cy="testPreferredName"
        />
      </div>
      <div class="flex-col py-5">
        <BcrosInputsEmailField
          id="individual-person-email"
          v-model="state.email"
          :label="$t('labels.emailAddress')"
          data-cy="testEmail"
        />
      </div>
    </UForm>
    <div class="text-blue-700 py-5 align-middle">
      <a
        id="add-person-manually-toggle"
        href=""
        data-cy="showAddIndividualPersonManually"
        class="p-1 underline"
        @click.prevent="showAddInfoManually=!showAddInfoManually"
      >
        <UIcon v-if="showAddInfoManually" name="i-mdi-close" />
        {{ showAddInfoManuallyText }}
      </a>
    </div>
    <template v-if="showAddInfoManually">
      <div class="flex-col py-5">
        <p class="font-bold py-3">
          <!-- todo: move this to lang file -->
          Beneficial Ownership Assessment
        </p>
        <p class="text-justify">
          <!-- todo: move this to lang file -->
          Beneficial Ownership is determined by the control of of shares and/or votes at general meetings,
          and control of the right to elect, appoint, or remove directors of the business.

          Complete following assessment to determine this person’s beneficial ownership status.
        </p>
      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-3">
          Control of Shares and Votes
        </p>
        <p class="text-justify">
          Enter the percentage of shares and/or shares entitled to votes at general meetings
          this person owns or ultimately controls (or can exercise ultimate effective control over).
        </p>
      </div>
      <div class="flex-col py-5">
        <UInput
          v-model="percentOfShares"
          placeholder="Percent of Shares"
          type="text"
          variant="bcGov"
          class="w-1/5"
        >
          <template #trailing>
            <span class="text-gray-500 text-xs">%</span>
          </template>
        </UInput>
        <UInput
          v-model="percentOfVotes"
          placeholder="Percent of Votes"
          type="text"
          variant="bcGov"
          class="w-1/5 mt-5"
        >
          <template #trailing>
            <span class="text-gray-500 text-xs">%</span>
          </template>
        </UInput>
      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-3">
          {{ $t('labels.birthdate') }}
        </p>
        <BcrosInputsDateSelect class="mt-3" :max-date="maxDate" @selection="birthdate = $event" />
      </div>
      <div class="flex-col py-5">
        <BcrosInputsAddress
          id="addNewPersonLastKnownAddress"
          v-model="lastKnownAddress"
          :label="$t('labels.lastKnownAddress')"
        />
      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-3">
          {{ $t('labels.citizenshipPermanentResidency') }}
        </p>
        <p class="text-justify">
          {{ $t('texts.citizenshipPermanentResidency') }}
        </p>
        <BcrosInputsCountriesOfCitizenship
          id="countriesOfCitizenship"
          v-model:canadianCitizenship="citizenshipOrPermanentResidency"
          v-model:citizenships="citizenships"
        />
      </div>
      <UForm
        :schema="schema"
        :state="state"
      >
        <div>
          <p class="font-bold py-3">
            {{ $t('labels.taxNumber') }}
          </p>
          <p class="text-justify">
            {{ $t('texts.taxNumber') }}
          </p>
          <IndividualPersonTaxInfoTaxNumber
            id="addNewPersonTaxNumber"
            v-model="taxInfoModel"
            name="taxNumber"
            data-cy="testTaxNumber"
          />
        </div>
      </UForm>
      <div>
        <p class="font-bold py-3">
          {{ $t('labels.taxResidency') }}
        </p>
        <p class="text-justify">
          {{ $t('texts.taxResidency') }}
        </p>
        <IndividualPersonTaxInfoTaxResidency
          id="addNewPersonTaxResidency"
          v-model="isTaxResident"
          data-cy="testTaxResidency"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, computed } from 'vue'
import { z } from 'zod'

const showAddInfoManually = ref(false)
const showAddInfoManuallyText = computed(() => {
  if (showAddInfoManually.value) {
    return 'Cancel transparent register information'
  }
  return 'Add transparency register information manually'
})
const percentOfShares: Ref<number | undefined> = ref(undefined)
const percentOfVotes: Ref<number | undefined> = ref(undefined)

// birthdate
const maxDate = new Date()
const birthdate: Ref<Date | null> = ref(null)
const lastKnownAddress: Ref<BtrAddressI> = ref({
  city: '',
  country: { name: '', alpha_2: '' },
  line1: '',
  postalCode: '',
  region: '',
  line2: '',
  locationDescription: ''
})

// citizenships or permanent residency
const citizenshipOrPermanentResidency = ref('')
const citizenships = ref([])

// full name
const minNameLength = 1
const maxNameLength = 150

const { t } = useI18n()
const schema = z.object({
  fullName: z.preprocess(normalizeName,
    z.string()
      .min(minNameLength, t('errors.validation.fullName.empty'))
      .max(maxNameLength, t('errors.validation.fullName.maxLengthExceeded'))
      .refine(validateNameCharacters, t('errors.validation.fullName.specialCharacter'))
  ),
  preferredName: z.preprocess(normalizeName,
    z.string()
      .max(maxNameLength, t('errors.validation.preferredName.maxLengthExceeded'))
      .refine(validatePreferredName, t('errors.validation.preferredName.specialCharacter'))
  ),
  email: z.string()
    .min(1, t('errors.validation.email.empty'))
    .max(254, 'errors.validation.email.maxLengthExceeded')
    .refine(validateEmailRfc6532Regex, t('errors.validation.email.invalid')),
  hasTaxNumber: z.boolean(),
  taxNumber: z.union([
    z.undefined(),
    z.string()
      .refine(checkSpecialCharacters, t('errors.validation.taxNumber.specialCharacter'))
      .refine(checkTaxNumberLength, t('errors.validation.taxNumber.invalidLength'))
      .refine(validateTaxNumber, t('errors.validation.taxNumber.invalidNumber'))
  ])
})

const state = reactive({
  email: undefined,
  fullName: undefined,
  preferredName1: undefined,
  hasTaxNumber: undefined,
  taxNumber: undefined
})

// tax number input
const taxInfoModel = computed({
  get () {
    return {
      hasTaxNumber: state.hasTaxNumber,
      taxNumber: state.taxNumber
    }
  },
  set (value) {
    state.hasTaxNumber = value.hasTaxNumber
    state.taxNumber = value.taxNumber
  }
})

// tax residency
const isTaxResident: Ref<string | undefined> = ref(undefined)
</script>

<style scoped></style>
