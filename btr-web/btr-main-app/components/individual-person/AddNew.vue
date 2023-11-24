<template>
  <div data-test="addIndividualPerson" class="flex-col w-full">
    <div>
      <p class="text-justify">
        {{ $t('texts.addIndividualPerson') }}
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
          {{ $t('labels.beneficialOwnershipAssessment') }}
        </p>
        <p class="text-justify">
          {{ $t('texts.beneficialOwnershipAssessmentText1') }}
        </p>
        <br>
        <p class="text-justify">
          {{ $t('texts.beneficialOwnershipAssessmentText2') }}
        </p>
      </div>
      <UForm
        :schema="schema"
        :state="state"
      >
        <div class="flex-col py-5">
          <p class="font-bold py-3">
            {{ $t('labels.sharesAndVotes') }}
          </p>
          <p class="text-justify">
            {{ $t('texts.sharesAndVotes.controlPercentage') }}
          </p>
          <IndividualPersonControlPercentage
            id="percentageOfShares"
            v-model="state.percentOfShares"
            name="percentOfShares"
            placeholder="Percent of Shares"
            data-cy="testPercentOfShares"
          />
          <IndividualPersonControlPercentage
            id="percentageOfVotes"
            v-model="state.percentOfVotes"
            name="percentOfVotes"
            placeholder="Percent of Votes"
            data-cy="testPercentOfVotes"
          />
        </div>
      </UForm>
      <p class="text-justify pb-5">
        <span class="font-bold">{{ $t('texts.note') }}</span>
        {{ $t('texts.sharesAndVotes.note1') }}
      </p>
      <div>
        <p class="text-justify">
          {{ $t('texts.sharesAndVotes.typeOfControl') }}
        </p>
        <IndividualPersonControlTypeOfControl
          id="typeOfControl"
          v-model="typeOfControl"
          name="typeOfControl"
          data-cy="testTypeOfControl"
        />
        <p class="text-justify pb-5">
          <span class="font-bold">{{ $t('texts.note') }}</span>
          {{ $t('texts.sharesAndVotes.note2') }}
        </p>
        <p class="text-justify pb-5">
          <span class="font-bold">{{ $t('texts.note') }}</span>
          {{ $t('texts.sharesAndVotes.note3') }}
        </p>
      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-3">
          {{ $t('labels.controlOfDirectors') }}
        </p>
        <p class="text-justify">
          {{ $t('texts.controlOfDirectors.text.part1') }}
          <span class="font-bold">{{ $t('texts.controlOfDirectors.text.part2') }}</span>
          {{ $t('texts.controlOfDirectors.text.part3') }}
        </p>
        <IndividualPersonControlOfDirectors
          id="controlOfDirectors"
          v-model="controlOfDirectors"
          name="controlOfDirectors"
          data-cy="testControlOfDirectors"
        />
        <p> {{ controlOfDirectors }} </p>
        <p class="text-justify">
          <span class="font-bold">{{ $t('texts.note') }}</span>
          {{ $t('texts.controlOfDirectors.note') }}
        </p>
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

// birthdate
const maxDate = new Date()
const birthdate: Ref<Date | null> = ref(null)

// last known address
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
  ]),
  percentOfShares: z.string()
    .refine(validatePercentageWholeNumber, t('errors.validation.controlPercentage.specialCharacter'))
    .refine(validatePercentageFormat, t('errors.validation.controlPercentage.invalidFormat'))
    .refine(validatePercentageValue, t('errors.validation.controlPercentage.maxValueReached')),
  percentOfVotes: z.string()
    .refine(validatePercentageWholeNumber, t('errors.validation.controlPercentage.specialCharacter'))
    .refine(validatePercentageFormat, t('errors.validation.controlPercentage.invalidFormat'))
    .refine(validatePercentageValue, t('errors.validation.controlPercentage.maxValueReached'))
})

const state = reactive({
  email: undefined,
  fullName: undefined,
  preferredName1: undefined,
  hasTaxNumber: undefined,
  taxNumber: undefined,
  percentOfShares: '',
  percentOfVotes: ''
})

// type of control
const typeOfControl: Ref<ControlTypeI> = ref({
  registeredOwner: false,
  beneficialOwner: false,
  indirectControl: false
})

// control of directors
const controlOfDirectors: Ref<ControlOfDirectorsI> = ref({
  directControl: false,
  indirectControl: false,
  significantInfluence: false,
  noControl: true
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
