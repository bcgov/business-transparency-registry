<template>
  <div data-cy="addIndividualPerson">
    <div>
      <p>
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
        <p>
          {{ $t('texts.beneficialOwnershipAssessmentText1') }}
        </p>
        <br>
        <p>
          {{ $t('texts.beneficialOwnershipAssessmentText2') }}
        </p>
      </div>
      <UForm
        :schema="ownershipSchema"
        :state="significantIndividual"
      >
        <div class="flex-col pt-5">
          <p class="font-bold py-3">
            {{ $t('labels.sharesAndVotes') }}
          </p>
          <p>
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
      <div class="flex-col py-5">
        <IndividualPersonControlTypeOfControl
          id="typeOfControl"
          v-model="significantIndividual.controlType.sharesVotes"
          name="typeOfControl"
          data-cy="testTypeOfControl"
        />
      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-3">
          {{ $t('labels.controlOfDirectors') }}
        </p>
        <p>
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
        <p>
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
          @selection="significantIndividual.profile.birthDate = dateToString($event, 'YYYY-MM-DD')"
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
        <p>
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
          <p>
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
        <p>
          {{ $t('texts.taxResidency') }}
        </p>
        <IndividualPersonTaxInfoTaxResidency
          id="addNewPersonTaxResidency"
          v-model="significantIndividual.profile.isTaxResident"
          data-cy="testTaxResidency"
        />
      </div>
      <IndividualPersonControlUnableToObtainOrConfirmInformation v-model="significantIndividual.missingInfoReason" />
    </template>
    <div class="grid mt-10 w-full">
      <div class="justify-self-end flex">
        <UButton
          class="px-10 py-4"
          :label="t('buttons.cancel')"
          color="primary"
          variant="outline"
          data-cy="new-si-cancel-btn"
          @click="$emit('cancel', true)"
        />
        <UButton
          class="ml-5 px-10 py-4"
          :label="t('buttons.done')"
          color="primary"
          valriant="solid"
          data-cy="new-si-done-btn"
          @click="addSignificantIndividual()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const { t } = useI18n()
const emits = defineEmits<{ add: [value: SignificantIndividualI], cancel: [value: any]}>()
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
      indirectControl: false,
      inConcertControl: false
    },
    directors: {
      directControl: false,
      indirectControl: false,
      significantInfluence: false,
      inConcertControl: false
    },
    other: ''
  },
  missingInfoReason: undefined,
  percentOfShares: '',
  percentOfVotes: '',
  startDate: useSignificantIndividuals().currentSIFiling?.effectiveDate || '',
  action: FilingActionE.ADD
}
// NOTE: not setting this as modelValue because it is a nested object so mutating it gets complicated
const significantIndividual: Ref<SignificantIndividualI> = ref(props.setSignificantIndividual || defaultSI)

function addSignificantIndividual () {
  // FUTURE: validate form / scroll to 1st error
  // emit significantIndividual so it gets added to the filing
  emits('add', significantIndividual.value)
}

const showAddInfoManually = ref(false)
const showAddInfoManuallyText = computed(() => {
  if (showAddInfoManually.value) {
    return t('buttons.addIndividualPerson.cancel')
  }
  return t('buttons.addIndividualPerson.add')
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
</script>

<style scoped></style>
