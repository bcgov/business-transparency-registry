<template>
  <div data-cy="addIndividualPerson">
    <div>
      <p>
        {{ $t('texts.addIndividualPerson') }}
      </p>
    </div>
    <UForm
      ref="profileFormBase"
      :schema="profileSchema"
      :state="significantIndividual.profile"
      @change="addBtrPayFees"
    >
      <div class="flex-col py-5">
        <BcrosInputsNameField
          id="individual-person-full-name"
          v-model="significantIndividual.profile.fullName"
          name="fullName"
          :label="$t('labels.fullName')"
          :variant="fullNameInvalid ? 'error' : 'bcGov'"
          data-cy="testFullName"
        />
      </div>
      <div class="flex-col py-5">
        <BcrosInputsNameField
          id="individual-person-preferred-name"
          v-model="significantIndividual.profile.preferredName"
          name="preferredName"
          :label="$t('labels.preferredName')"
          :variant="preferredNameInvalid ? 'error' : 'bcGov'"
          data-cy="testPreferredName"
        />
      </div>
      <div class="flex-col py-5">
        <BcrosInputsEmailField
          id="individual-person-email"
          v-model="significantIndividual.profile.email"
          :label="$t('labels.emailAddress')"
          :variant="emailInvalid ? 'error' : 'bcGov'"
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
        ref="ownerFormBase"
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
            :variant="percentOfSharesInvalid ? 'error' : 'bcGov'"
            data-cy="testPercentOfShares"
          />
          <IndividualPersonControlPercentage
            id="percentageOfVotes"
            v-model="significantIndividual.percentOfVotes"
            name="percentOfVotes"
            placeholder="Percent of Votes"
            :variant="percentOfVotesInvalid ? 'error' : 'bcGov'"
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
        <IndividualPersonControlOtherReasons
          id="otherReasons"
          v-model="significantIndividual.controlType.other"
          name="otherReasons"
          data-cy="otherReasons"
        />
      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-3">
          {{ $t('labels.birthdate') }}
        </p>
        <BcrosInputsDateSelect
          id="addNewPersonBirthdate"
          class="mt-3"
          :max-date="new Date()"
          :placeholder="$t('placeholders.dateSelect.birthdate')"
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
        ref="profileFormExtended"
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
            :variant="taxNumebrInvalid ? 'error' : 'bcGov'"
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
const props = defineProps<{ setSignificantIndividual?: SignificantIndividualI, startDate?: string }>()
const defaultSI = getEmptySI(props.startDate || '')
// NOTE: not setting this as modelValue because it is a nested object so mutating it gets complicated
const significantIndividual: Ref<SignificantIndividualI> = ref(props.setSignificantIndividual || defaultSI)

watch(() => props.startDate, (val) => {
  significantIndividual.value.startDate = val
})

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

const profileFormBase = ref()
const profileFormExtended = ref()
const ownerFormBase = ref()

const fullNameInvalid = ref(false)
const preferredNameInvalid = ref(false)
const emailInvalid = ref(false)
const taxNumebrInvalid = ref(false)

const percentOfSharesInvalid = ref(false)
const percentOfVotesInvalid = ref(false)

watch(() => profileFormBase.value?.errors, (val: { path: string }[]) => {
  fullNameInvalid.value = val.filter(val => val.path === 'fullName').length > 0
  preferredNameInvalid.value = val.filter(val => val.path === 'preferredName').length > 0
  emailInvalid.value = val.filter(val => val.path === 'email').length > 0
})
watch(() => profileFormExtended.value?.errors, (val: { path: string }[]) => {
  taxNumebrInvalid.value = val.filter(val => val.path === 'taxNumber').length > 0
})
watch(() => ownerFormBase.value?.errors, (val: { path: string }[]) => {
  percentOfSharesInvalid.value = val.filter(val => val.path === 'percentOfShares').length > 0
  percentOfVotesInvalid.value = val.filter(val => val.path === 'percentOfVotes').length > 0
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
