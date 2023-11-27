<template>
  <div v-if="significantIndividual" data-test="addIndividualPerson" class="flex-col w-full">
    <div>
      <p class="text-justify">
        {{ $t('texts.addIndividualPerson') }}
      </p>
    </div>
    <UForm
      :schema="profileSchema"
      :state="significantIndividual.profile"
    >
      <div class="flex-col py-5">
        <BcrosInputsNameField
          id="individual-person-full-name"
          v-model="significantIndividual.profile.fullName"
          name="fullName"
          :label="$t('labels.fullName')"
          data-cy="testFullName"
        />
      </div>
      <div class="flex-col py-5">
        <BcrosInputsNameField
          id="individual-person-preferred-name"
          v-model="significantIndividual.profile.preferredName"
          name="preferredName"
          :label="$t('labels.preferredName')"
          data-cy="testPreferredName"
        />
      </div>
      <div class="flex-col py-5">
        <BcrosInputsEmailField
          id="individual-person-email"
          v-model="significantIndividual.profile.email"
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
        :schema="ownershipSchema"
        :state="significantIndividual"
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
            v-model="significantIndividual.percentOfShares"
            name="percentOfShares"
            placeholder="Percent of Shares"
            data-cy="testPercentOfShares"
          />
          <IndividualPersonControlPercentage
            id="percentageOfVotes"
            v-model="significantIndividual.percentOfVotes"
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
          v-model="significantIndividual.controlType.sharesVotes"
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
          v-model="significantIndividual.controlType.directors"
          name="controlOfDirectors"
          data-cy="testControlOfDirectors"
        />
        <p class="text-justify">
          <span class="font-bold">{{ $t('texts.note') }}</span>
          {{ $t('texts.controlOfDirectors.note') }}
        </p>
      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-3">
          {{ $t('labels.birthdate') }}
        </p>
        <BcrosInputsDateSelect
          class="mt-3"
          :max-date="new Date()"
          @selection="significantIndividual.profile.birthDate = $event"
        />
      </div>
      <div class="flex-col py-5">
        <BcrosInputsAddress
          id="addNewPersonLastKnownAddress"
          v-model="significantIndividual.profile.address"
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
          v-model:canadianCitizenship="significantIndividual.profile.citizenshipCA"
          v-model:citizenships="significantIndividual.profile.citizenshipsExCA"
        />
      </div>
      <UForm
        :schema="profileSchema"
        :state="significantIndividual.profile"
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
          v-model="significantIndividual.profile.isTaxResident"
          data-cy="testTaxResidency"
        />
      </div>
      <div data-cy="isUnableToObtainOrConfirmInformation">
        <p class="font-bold py-3">
          {{ $t('labels.unableToObtainOrConfirmInformation.title') }}
        </p>
        <UCheckbox
          v-model="isUnableToObtainOrConfirmInformation"
          name="isUnableToObtainOrConfirmInformation"
          :label="$t('labels.unableToObtainOrConfirmInformation.checkboxText')"
          class="py-2 w-full"
          variant="bcGov"
          data-cy="isUnableToObtainOrConfirmInformationCheckbox"
        />
        <p class="py-3">
          {{ $t('labels.unableToObtainOrConfirmInformation.description') }}
        </p>
        <UTextarea
          v-model="isUnableToObtainOrConfirmInformationDetails"
          :placeholder="$t('labels.unableToObtainOrConfirmInformation.textAreaPlaceholder')"
          class="py-2 w-full"
          variant="bcGov"
          data-cy="isUnableToObtainOrConfirmInformationTextArea"
          @change="isUnableToObtainOrConfirmInformationDetailsChange"
        />
        <BcrosAlertsMessage v-if="isUnableToObtainOrConfirmInformation" :flavour="AlertsFlavourE.ALERT">
          <p class="py-2">
            <strong>{{ $t('labels.unableToObtainOrConfirmInformation.alert.important') }}</strong>
            {{ $t('labels.unableToObtainOrConfirmInformation.alert.sentence1') }}
          </p>
          <p class="py-2">
            {{ $t('labels.unableToObtainOrConfirmInformation.alert.sentence2') }}
          </p>
        </BcrosAlertsMessage>
      </div>
    </template>
    <!-- temporary button section -->
    <div class="grid mt-10 w-full">
      <UButton
        class="justify-self-end px-10 py-4"
        label="Done"
        color="primary"
        valriant="solid"
        @click="addSignificantIndividual()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const props = defineProps<{ setSignificantIndividual?: SignificantIndividualI }>()
const defaultSI = {
  profile: {
    fullName: '',
    preferredName: '',
    address: {
      city: '',
      country: { name: '', alpha_2: '' },
      line1: '',
      postalCode: '',
      region: '',
      line2: '',
      locationDescription: ''
    },
    competency: {
      decisionMaking: false,
      financialAffairs: false
    },
    birthDate: null,
    citizenshipCA: '',
    citizenshipsExCA: [],
    email: '',
    isTaxResident: undefined,
    hasTaxNumber: undefined,
    taxNumber: undefined
  },
  controlType: {
    sharesVotes: {
      registeredOwner: false,
      beneficialOwner: false,
      indirectControl: false
    },
    directors: {
      directControl: false,
      indirectControl: false,
      significantInfluence: false,
      noControl: false
    },
    other: ''
  },
  missingInfoReason: undefined,
  percentOfShares: '',
  percentOfVotes: '',
  action: 'added'
}
// NOTE: not setting this as modelValue because it is a nested object so mutating it gets complicated
const significantIndividual: Ref<SignificantIndividualI> = ref(props.setSignificantIndividual || defaultSI)

function addSignificantIndividual () {
  // FUTURE: validate form / scroll to 1st error
  // add to filing
  useSignificantIndividuals().filingAddSI(significantIndividual.value) // if prop: significantIndividuals.filingAddSI(significantIndividual)
  // FUTURE: collapse 'add new'
}

const showAddInfoManually = ref(false)
const showAddInfoManuallyText = computed(() => {
  if (showAddInfoManually.value) {
    return 'Cancel transparent register information'
  }
  return 'Add transparency register information manually'
})

const profileSchema = z.object({
  fullName: getFullNameValidator(),
  preferredName: getPreferredNameValidator(),
  email: getEmailValidator(),
  hasTaxNumber: z.boolean(),
  taxNumber: getTaxNumberValidator()
})

const ownershipSchema = z.object({
  percentOfShares: getPercentageValidator(),
  percentOfVotes: getPercentageValidator()
})

// tax number input
const taxInfoModel = computed({
  get () {
    return {
      hasTaxNumber: significantIndividual.value.profile.hasTaxNumber,
      taxNumber: significantIndividual.value.profile.taxNumber
    }
  },
  set (value) {
    significantIndividual.value.profile.hasTaxNumber = value.hasTaxNumber
    significantIndividual.value.profile.taxNumber = value.taxNumber
  }
})

// tax residency
const isTaxResident: Ref<string | undefined> = ref(undefined)

const isUnableToObtainOrConfirmInformation = ref(false)
const isUnableToObtainOrConfirmInformationDetails = ref('')
const isUnableToObtainOrConfirmInformationDetailsChange = () => {
  if (isUnableToObtainOrConfirmInformationDetails.value) {
    isUnableToObtainOrConfirmInformation.value = true
  }
}
</script>

<style scoped></style>
