<template>
  <div data-cy="addIndividualPerson">
    <!-- NB: we may be adding this back in later -->
    <!-- <div v-if="!isEditing">
      <p>
        {{ $t('texts.addIndividualPerson') }}
      </p>
    </div> -->
    <UForm
      ref="profileFormBase"
      :schema="formSchema"
      :state="significantIndividual.profile"
      @change="addBtrPayFees"
    >
      <div class="flex-col">
        <BcrosInputsNameField
          id="individual-person-full-name"
          v-model="significantIndividual.profile.fullName"
          name="fullName"
          :label="$t('labels.fullName')"
          :variant="fullNameInvalid ? 'error' : 'bcGov'"
          data-cy="testFullName"
        />
      </div>
      <div class="flex-col mt-10">
        <BcrosInputsNameField
          id="individual-person-preferred-name"
          v-model="significantIndividual.profile.preferredName"
          name="preferredName"
          :label="$t('labels.preferredName')"
          :variant="preferredNameInvalid ? 'error' : 'bcGov'"
          data-cy="testPreferredName"
        />
      </div>
      <div class="flex-col mt-10">
        <BcrosInputsEmailField
          id="individual-person-email"
          v-model="significantIndividual.profile.email"
          :label="$t('labels.emailAddress')"
          :variant="emailInvalid ? 'error' : 'bcGov'"
          data-cy="testEmail"
        />
      </div>
    </UForm>
    <!-- <div class="text-blue-700 py-5 align-middle">
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
    </div> -->
    <!-- NB: we may be adding the toggle back in later -->
    <template v-if="showAddInfoManually">
      <!-- <div class="flex-col mt-5 py-5">
        <p class="font-bold py-3">
          {{ $t('labels.beneficialOwnershipAssessment') }}
        </p>
        <p>
          {{ $t('texts.beneficialOwnershipAssessmentText1') }}
        </p>
      </div> -->
      <UForm
        ref="ownerFormBase"
        :schema="formSchema"
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
          :errors="controlOfSharesErrors"
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
          :errors="controlOfDirectorsErrors"
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
          :initial-date="significantIndividual.profile.birthDate
            ? dateStringToDate(significantIndividual.profile.birthDate) : undefined"
          :max-date="new Date()"
          :placeholder="$t('placeholders.dateSelect.birthdate')"
          :variant="birthDateErrors.length > 0 ? 'error' : 'bcGov'"
          :errors="birthDateErrors"
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
          :errors="citizenshipErrors"
          v-model:canadianCitizenship="significantIndividual.profile.citizenshipCA"
          v-model:citizenships="significantIndividual.profile.citizenshipsExCA"
        />
      </div>
      <UForm
        ref="profileFormExtended"
        :schema="formSchema"
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
      <div class="flex justify-between">
        <UButton
          class="px-10 py-4 mr-5"
          :label="t('buttons.remove')"
          color="red"
          variant="outline"
          data-cy="edit-si-remove-btn"
          :disabled="!isEditing"
          @click="$emit('remove')"
        />
        <div class="flex">
          <UButton
            class="px-10 py-4"
            :label="t('buttons.cancel')"
            color="primary"
            variant="outline"
            data-cy="new-si-cancel-btn"
            @click="$emit('cancel')"
          />
          <UButton
            class="ml-5 px-10 py-4"
            :label="t('buttons.done')"
            color="primary"
            variant="solid"
            data-cy="new-si-done-btn"
            @click="handleDoneButtonClick()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z, ZodError, ZodIssue } from 'zod'
import { CitizenshipTypeE } from '../../../btr-common-components/enums/citizenship-type-e';
import type { FormError } from '#ui/types'

const { t } = useI18n()

const emits = defineEmits<{
  add: [value: SignificantIndividualI],
  cancel: [],
  update: [value: { index: number | undefined, updatedSI: SignificantIndividualI }],
  remove: []
}>()

const props = defineProps<{
  index?: number,
  setSignificantIndividual?: SignificantIndividualI,
  startDate?: string
}>()
const defaultSI = getEmptySI(props.startDate || '')
// NOTE: not setting this as modelValue because it is a nested object so mutating it gets complicated
const significantIndividual: Ref<SignificantIndividualI> = ref(props.setSignificantIndividual || defaultSI)

const isEditing = computed(() => significantIndividual.value.action === FilingActionE.EDIT)

watch(() => props.startDate, (val) => {
  significantIndividual.value.startDate = val
})

function handleDoneButtonClick () {
  validateForm()
  if (validationResult.value.success) {
    if (isEditing.value) {
      updateSignificantIndividual()
    } else {
      addSignificantIndividual()
    }
  }
}

function validateForm () {
  const data: FormInputI = {
    fullName: significantIndividual.value.profile.fullName,
    preferredName: significantIndividual.value.profile.preferredName,
    email: significantIndividual.value.profile.email,
    percentOfShares: significantIndividual.value.percentOfShares,
    percentOfVotes: significantIndividual.value.percentOfVotes,
    controlOfShares: significantIndividual.value.controlType.sharesVotes,
    otherReasons: significantIndividual.value.controlType.other,
    controlOfDirectors: significantIndividual.value.controlType.directors,
    birthDate: significantIndividual.value.profile.birthDate,
    citizenshipCA: significantIndividual.value.profile.citizenshipCA,
    citizenshipsExCA: significantIndividual.value.profile.citizenshipsExCA,
    hasTaxNumber: significantIndividual.value.profile.hasTaxNumber,
    taxNumber: significantIndividual.value.profile.taxNumber,
    taxResidency: significantIndividual.value.profile.isTaxResident,
    missingInfoReason: significantIndividual.value.missingInfoReason
  }

  validationResult.value = formSchema.safeParse(data)
}

function addSignificantIndividual () {
  // FUTURE: validate form / scroll to 1st error
  // emit significantIndividual so it gets added to the filing
  emits('add', significantIndividual.value)
}

function updateSignificantIndividual () {
  emits('update', { index: props.index, updatedSI: significantIndividual.value })
}

// NB: we may be adding the toggle functionality back in later
const showAddInfoManually = ref(true)
// const showAddInfoManuallyText = computed(() => {
//   if (showAddInfoManually.value) {
//     return t('buttons.addIndividualPerson.cancel')
//   }
//   return t('buttons.addIndividualPerson.add')
// })

const profileFormBase = ref()
const profileFormExtended = ref()
const ownerFormBase = ref()

const fullNameInvalid = ref(false)
const preferredNameInvalid = ref(false)
const emailInvalid = ref(false)
const taxNumebrInvalid = ref(false)

const percentOfSharesInvalid = ref(false)
const percentOfVotesInvalid = ref(false)

const controlOfSharesErrors: Ref<FormError[]> = ref([])
const controlOfDirectorsErrors: Ref<FormError[]> = ref([])
const birthDateErrors: Ref<FormError[]> = ref([])
const citizenshipErrors: Ref<FormError[]> = ref([])

const validationResult = ref()

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

watch(() => validationResult.value, (val: ZodError) => {
  if (!val.success) {
    const errors: FormError[] = []
    val.error.issues.forEach((issue: ZodIssue[]) => {
      issue.path.forEach((pathName: string) => {
        errors.push({
          path: pathName,
          message: issue.message
        })
      })
    })

    ownerFormBase.value.setErrors(errors)
    profileFormBase.value.setErrors(errors)
    profileFormExtended.value.setErrors(errors)

    controlOfSharesErrors.value = errors.filter((error: FormError) => error.path === 'controlOfShares')
    controlOfDirectorsErrors.value = errors.filter((error: FormError) => error.path === 'controlOfDirectors')
    birthDateErrors.value = errors.filter((error: FormError) => error.path === 'birthDate')
    citizenshipErrors.value = errors.filter(
      (error: FormError) => (error.path === 'citizenshipCA' || error.path === 'citizenshipsExCA')
    )
  }
})

// When the percentOfShares and percentOfVotes are changed, re-assess the confition and remove errors if necessary
watch(
  [() => significantIndividual.value.percentOfShares, () => significantIndividual.value.percentOfVotes],
  (values: string[]) => {
    // If the percenOfShares and percentOfVotes are not empty, remove the empty value errors
    if (values[0] !== '' || values[1] !== '') {
      const currentErrors = ownerFormBase.value.getErrors()
      const updatedErrors = currentErrors.filter((error: FormError) => {
        return !(error.path === missingSharesAndVotes.path[0] && error.message === missingSharesAndVotes.message) &&
          !(error.path === missingSharesAndVotes.path[1] && error.message === missingSharesAndVotes.message)
      })
      ownerFormBase.value.setErrors(updatedErrors)
    }

    // If the percentOfShares and percentOfVotes are < 25%, and the "in-concert control" checkbox is not checked,
    // the type of control error should be remove as this field is now optional
    const shares = parseInt(values[0])
    const votes = parseInt(values[1])
    if ((Number.isNaN(shares) || shares < 25) && (Number.isNaN(votes) || votes < 25) &&
      !significantIndividual.value.controlType.sharesVotes.inConcertControl) {
      controlOfSharesErrors.value = []
    }
  }
)

// When the control type checkboxes are changed, re-assess the condition and remove errors if necessary
watch(
  [() => significantIndividual.value.controlType.sharesVotes.registeredOwner,
    () => significantIndividual.value.controlType.sharesVotes.beneficialOwner,
    () => significantIndividual.value.controlType.sharesVotes.indirectControl,
    () => significantIndividual.value.controlType.sharesVotes.inConcertControl
  ],
  (values: boolean[]) => {
    // if any of the control type is selected, remove the type of control error
    if (values[0] || values[1] || values[2]) {
      controlOfSharesErrors.value = []
    }

    // if the "in-concert control" checkbox is unchecked, and the percentOfShares and percentOfVotes are < 25%,
    // remove the type of control error as this field is now optional
    if (!values[3]) {
      const shares = parseInt(significantIndividual.value.percentOfShares)
      const votes = parseInt(significantIndividual.value.percentOfVotes)
      if ((Number.isNaN(shares) || shares < 25) && (Number.isNaN(votes) || votes < 25)) {
        controlOfSharesErrors.value = []
      }
    }
  }
)

// When the type of director control checkboxes are changed, re-assess the condition and remove errors if necessary
watch(
  [() => significantIndividual.value.controlType.directors.directControl,
    () => significantIndividual.value.controlType.directors.indirectControl,
    () => significantIndividual.value.controlType.directors.significantInfluence,
    () => significantIndividual.value.controlType.directors.inConcertControl
  ],
  (values: boolean[]) => {
    // if any of the control type is selected, or if the "in-concert control" checkbox is unchecked
    // remove the type of control error
    if (values[0] || values[1] || values[2] || !values[3]) {
      controlOfDirectorsErrors.value = []
    }
  }
)

// When the birth date is entered, remove the empty birth date error
watch(() => significantIndividual.value.profile.birthDate, (val: string) => {
  if (val !== '') {
    birthDateErrors.value = []
  }
})

// When a type of citizenship is selected, remove the empty citizenship error
watch(() => significantIndividual.value.profile.citizenshipCA, (val: CitizenshipTypeE) => {
  if ([CitizenshipTypeE.CITIZEN, CitizenshipTypeE.PR, CitizenshipTypeE.OTHER].includes(val)) {
    citizenshipErrors.value = citizenshipErrors.value.filter((error: FormError) => error.path !== 'citizenshipCA')
  }
})

// When a country is selected for other citizenships, remove the error
watch(() => significantIndividual.value.profile.citizenshipsExCA, (val: { name: string, alpha_2: string }[]) => {
  if (val.length > 0) {
    citizenshipErrors.value = citizenshipErrors.value.filter((error: FormError) => error.path !== 'citizenshipsExCA')
  }
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

const formSchema = z.object({
  fullName: getFullNameValidator(),
  preferredName: getPreferredNameValidator(),
  email: getEmailValidator(),
  percentOfShares: getPercentageValidator(),
  percentOfVotes: getPercentageValidator(),
  controlOfShares: z.object({
    registeredOwner: z.boolean(),
    beneficialOwner: z.boolean(),
    indirectControl: z.boolean(),
    inConcertControl: z.boolean()
  }),
  otherReasons: z.string(),
  controlOfDirectors: z.object({
    directControl: z.boolean(),
    indirectControl: z.boolean(),
    significantInfluence: z.boolean(),
    inConcertControl: z.boolean()
  }),
  birthDate: z.union([z.string(), z.null()]),

  // TO-DO: validating address field on form submit

  citizenshipCA: z.union([z.nativeEnum(CitizenshipTypeE), z.literal('')]),
  citizenshipsExCA: z.array(
    z.object({ name: z.string(), alpha_2: z.string() })
  ),
  hasTaxNumber: z.boolean().optional(),
  taxNumber: getTaxNumberValidator(),
  taxResidency: z.boolean().optional(),
  missingInfoReason: z.string()
}).refine(
  validateSharesAndVotes, missingSharesAndVotes
).refine(
  validateControlOfShares, missingControlOfShares
).refine(
  validateControlOfDirectors, missingControlOfDirectors
).refine(
  validateOtherReason
).refine(
  validateBirthDate, missingBirthDate
).refine(
  validateCitizenship, missingCitizenship
).refine(
  validateOtherCountrySelection, missingOtherCountry
).refine(
  validateTaxNumberInfo, missingTaxNumberInfo
).refine(
  validateTaxResidency, missingTaxResidency
).refine(
  validateMissingInfoReasonTextarea
)
</script>
