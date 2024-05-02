<template>
  <div data-cy="addIndividualPerson" class="w-full">
    <UForm
      ref="addIndividualForm"
      :schema="formSchema"
      :state="si"
      class="w-full"
      @change="formChange"
    >
      <!--      todo: remove this debug errors line -->
      {{ addIndividualForm?.errors }}
      <!--      todo: deal with section errors -->
      <!--  section: your information  -->
      <BcrosSection
        :section-title="$t('sectionHeadings.isYourOwnInformation')"
        data-cy="isYourOwnInformation-section"
      >
        <div class="flex-col w-full">
          <p class="py-3">
            {{ $t('texts.isYourOwnInformation') }}
          </p>
          <UCheckbox
            v-model="si.name.isYourOwnInformation"
            :label="$t('labels.isYourOwnInformation')"
            data-cy="isYourOwnInformation-checkbox"
            @change="setIsYourOwnInformation($event)"
          />
        </div>
      </BcrosSection>
      <!--  section: individuals full name  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['name.'])"
        :section-title="$t('sectionHeadings.individualsFullName')"
      >
        <div class="flex-col w-full">
          <BcrosInputsNameField
            id="individual-person-full-name"
            v-model="si.name.fullName"
            name="name.fullName"
            :label="$t('labels.fullName')"
            :placeholder="$t('placeholders.fullName')"
            data-cy="testFullName"
            :is-disabled="si.name.isYourOwnInformation"
          />
          <div class="pt-5" />
          <UFormGroup name="doNothing">
            <UCheckbox
              v-model="si.name.isUsePreferredName"
              :label="$t('texts.preferredName.checkbox')"
              data-cy="usePreferredName"
              @click="si.name.preferredName = ''"
            />
          </UFormGroup>
          <div v-if="si.name.isUsePreferredName" class="pt-3 w-full">
            <p>
              {{ $t('texts.preferredName.note') }}
            </p>
            <div class="pt-5">
              <BcrosInputsNameField
                id="individual-person-preferred-name"
                v-model="si.name.preferredName"
                name="name.preferredName"
                :placeholder="$t('placeholders.preferredName')"
                data-cy="testPreferredName"
                :help="$t('texts.preferredName.hint')"
              />
            </div>
          </div>
        </div>
      </BcrosSection>

      <!--  section: type of interest or control  -->
      <BcrosSection
        :show-section-has-errors="sectionErrors?.typeOfInterestOrControl?.length > 0"
        :section-title="$t('sectionHeadings.typeOfInterestOrControl')"
      >
        <div class="flex-col w-full">
          <p class="font-bold py-3">
            {{ $t('labels.sharesAndVotes') }}
          </p>
          <p>
            {{ $t('texts.sharesAndVotes.controlPercentage') }}
          </p>
          <IndividualPersonControl
            v-model="si.controlOfShares"
            :name="'controlOfShares'"
          />
          <IndividualPersonControl
            v-model="si.controlOfVotes"
            :name="'controlOfVotes'"
          />
          <!--          todo: add section control of majority of directors-->
          <!--          todo: add others section -->
        </div>
      </BcrosSection>

      <!--  section: control of majority of directors  -->
      <BcrosSection
        :show-section-has-errors="sectionErrors?.controlOfMajorityOfDirectors?.length > 0"
        :section-title="$t('sectionHeadings.controlOfMajorityOfDirectors')"
      >
        <UFormGroup name="containTheErrorChecks" class="w-full flex flex-col">
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
            v-model="si.controlOfDirectors"
            name="controlOfDirectors"
            data-cy="testControlOfDirectors"
          />
          <p>
            <span class="font-bold">{{ $t('texts.note') }}</span>
            {{ $t('texts.controlOfDirectors.note') }}
          </p>
        </UFormGroup>
      </BcrosSection>


      <!--  section: other reasons  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['otherReasons'])"
        :section-title="$t('sectionHeadings.otherReasons')"
      >
        <div class="pt-3 w-full">
          <IndividualPersonControlOtherReasons
            id="otherReasons"
            v-model="si.controlOther"
            name="otherReasons"
            data-cy="otherReasons"
          />
        </div>
      </BcrosSection>

      <!--  section: email address  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['email'])"
        :section-title="$t('sectionHeadings.emailAddress')"
      >
        <div class="flex-col w-full pt-3">
          <BcrosInputsEmailField
            id="individual-person-email"
            v-model="si.email"
            name="email"
            :placeholder="$t('labels.emailAddress')"
            data-cy="testEmail"
          />
        </div>
      </BcrosSection>


      <!--  section: individual details  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['birthDate', 'address.'])"
        :section-title="$t('sectionHeadings.individualDetails')"
      >
        <div class="flex-col w-full">
          <BcrosInputsAddress
            id="addNewPersonLastKnownAddress"
            v-model="si.address"
            :label="$t('labels.lastKnownAddress')"
            name="address"
          />
          <div class="flex-col py-5" />
          <p class="font-bold py-3">
            {{ $t('labels.birthdate') }}
          </p>
          <BcrosInputsDateSelect
            id="addNewPersonBirthdate"
            name="birthDate"
            class="mt-3"
            :initial-date="!!si.birthDate ? dateStringToDate(si.birthDate) : null"
            :max-date="new Date()"
            :placeholder="$t('placeholders.dateSelect.birthdate')"
            @selection="si.birthDate = dateToString($event, 'YYYY-MM-DD')"
          />
        </div>
      </BcrosSection>

      <!--  section: citizenship or PR  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['citizenships'])"
        :section-title="$t('sectionHeadings.citizenshipOrPR')"
      >
        <div class="flex-col w-full">
          <BcrosInputsCountriesOfCitizenship
            name="citizenships"
            id="countriesOfCitizenship"
            v-model="si.citizenships"
            :help="$t('labels.countryOfCitizenship.hint')"
          />
          <p>
            {{ $t('labels.countryOfCitizenship.note') }}
          </p>
        </div>
      </BcrosSection>

      <!--  section: tax details  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['tax.'])"
        :section-title="$t('sectionHeadings.taxDetails')"
      >
        <div class="w-full flex flex-col">
          <p class="font-bold py-3">
            {{ $t('labels.taxNumber') }}
          </p>
          <p>
            {{ $t('texts.taxNumber') }}
          </p>
          <IndividualPersonTaxInfoTaxNumber
            id="addNewPersonTaxNumber"
            v-model:hasTaxNumber="si.tax.hasTaxNumber"
            v-model:taxNumber="si.tax.taxNumber"
            name="tax"
            variant="bcGov"
            data-cy="testTaxNumber"
          />
          <div>
            <p class="font-bold py-3">
              {{ $t('labels.taxResidency') }}
            </p>
            <p>
              {{ $t('texts.taxResidency') }}
            </p>
            <IndividualPersonTaxInfoTaxResidency
              v-model="si.isTaxResident"
              name="isTaxResident"
              variant="bcGov"
              data-cy="testTaxResidency"
            />
          </div>
        </div>
      </BcrosSection>
      <!--  section: unable to obtain or confirm  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['missingInfo'])"
        :section-title="$t('sectionHeadings.unableToObtainOrConfirmInformation')"
      >
        <div class="w-full">
          <IndividualPersonControlUnableToObtainOrConfirmInformation
            name="missingInfo.missingInfoReason"
            v-model="si.missingInfo.reason"
            :missing-info="si.missingInfo.couldNotProvideSomeInfo"
            @update:missingInfo="si.missingInfo.couldNotProvideSomeInfo = $event"
          />
        </div>
      </BcrosSection>

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
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { undefined, z } from 'zod'
import { SignificantIndividualAddNewErrorsI } from '~/interfaces/significant-individual/add-new-errors-i'
import {
  validateControlSelectionForSharesAndVotes,
  validateFullNameSuperRefine
} from '~/utils/validation'
import { PercentageRangeE } from '~/enums/percentage-range-e'

const emits = defineEmits<{
  add: [value: SignificantIndividualI],
  cancel: [],
  update: [value: { index: number | undefined, updatedSI: any }], // todo: fix this any
  remove: []
}>()

const props = defineProps<{
  index?: number,
  sectionErrors?: SignificantIndividualAddNewErrorsI,
  setSignificantIndividual?: SignificantIndividualI,
  startDate?: string
}>()

const t = useNuxtApp().$i18n.t
const bcrosAccount = useBcrosAccount()

const addIndividualForm = ref()
const isEditing = ref(false)

watch(() => addIndividualForm.value?.errors, (val: { path: string }[]) => {
  console.log("AAAAA", val)
})

const formChange = async () => {
  await addBtrPayFees()
  emits('update', { index: props.index, updatedSI: si })
}

function hasErrors (sectionErrorPaths: string[]): boolean {
  if (!addIndividualForm.value?.errors) {
    return false
  }
  for (const errorPath of sectionErrorPaths) {
    const errors = addIndividualForm.value.errors
    if (!errors || errors.length === 0) {
      return false
    }

    const hasErrors = errors.filter(errObj => errObj.path.includes(errorPath)).length > 0
    if (hasErrors) {
      return true
    }
  }

  return false
}

function handleDoneButtonClick () {
  isEditing.value = false
  try {
    addIndividualForm.value.validate()
  } catch (e) {
    console.log(e)
    return false
  }
  // todo: try to see if I can convert this so that input form emits SI and then ownerChange saves it
  // todo: fixme
  // validateForm()
  // if (validationResult.value.success) {
  //   if (isEditing.value) {
  //     updateSignificantIndividual()
  //   } else {
  //     addSignificantIndividual()
  //   }
  // }
}

const siControlOf = z.object({
  controlName: z.enum(['controlOfShares', 'controlOfVotes']),
  registeredOwner: z.boolean(),
  beneficialOwner: z.boolean(),
  indirectControl: z.boolean(),
  inConcertControl: z.boolean(),
  percentage: z.nativeEnum(PercentageRangeE)
}).superRefine(validateControlSelectionForSharesAndVotes)

const formSchema = z.object({
  name: z.object({
    isYourOwnInformation: z.boolean(),
    isUsePreferredName: z.boolean(),
    fullName: z.string(),
    preferredName: getPreferredNameValidator()
  }).superRefine(
    validateFullNameSuperRefine
  ),
  controlOfShares: siControlOf,
  controlOfVotes: siControlOf,
  controlOfDirectors: z.object({
    directControl: z.boolean(),
    indirectControl: z.boolean(),
    significantInfluence: z.boolean(),
    inConcertControl: z.boolean()
  }).refine(validateControlOfDirectors, getMissingControlOfDirectorsError()),
  controlOther: z.union([z.string(), z.null()]),
  email: getEmailValidator(),
  address: z.object({
    country: getAddressCountryValidator(),
    line1: z.string().min(1, t('errors.validation.address.line1')),
    line2: z.union([z.string(), z.null()]),
    city: getAddressCityValidator(),
    region: getAddressRegionValidator(),
    postalCode: getAddressPostalCodeValidator(),
    locationDescription: z.union([z.string(), z.null()])
  }),
  birthDate: z.union([z.string(), z.null()]).refine(validateBirthDate, getMissingBirthDateError()),
  citizenships: validateCitizenshipValidator(),
  tax: z.object({
    hasTaxNumber: z.union([z.null(), z.boolean()]),
    taxNumber: z.union([z.null(), z.string()])
  }).superRefine(validateTaxNumberInfo),
  isTaxResident: z.union([z.null(), z.boolean()]).refine(validateTaxResidency, getMissingTaxResidencyError()),
  missingInfo: z.object({
    couldNotProvideSomeInfo: z.boolean(),
    reason: z.string()
  }).refine(validateMissingInfoReason, getNoMissingInfoReasonError())
})

const setIsYourOwnInformation = (event: any) => {
  if (event.target.checked) {
    si.name.fullName = bcrosAccount.userFullName
  } else {
    si.name.fullName = ''
  }
}

type SiT = z.infer<typeof formSchema>

const si: SiT = reactive({
  name: {
    isYourOwnInformation: false,
    isUsePreferredName: false,
    fullName: '',
    preferredName: ''
  },
  controlOfShares: {
    controlName: 'controlOfShares',
    registeredOwner: false,
    beneficialOwner: false,
    indirectControl: false,
    inConcertControl: false,
    percentage: PercentageRangeE.NO_SELECTION
  },
  controlOfVotes: {
    controlName: 'controlOfVotes',
    registeredOwner: false,
    beneficialOwner: false,
    indirectControl: false,
    inConcertControl: false,
    percentage: PercentageRangeE.NO_SELECTION
  },
  controlOfDirectors: {
    directControl: false,
    indirectControl: false,
    significantInfluence: false,
    inConcertControl: false
  },
  controlOther: '',
  email: '',
  address: {
    country: null,
    line1: '',
    line2: null,
    city: '',
    region: '',
    postalCode: '',
    locationDescription: null
  },
  birthDate: null,
  citizenships: [],
  tax: {
    hasTaxNumber: null,
    taxNumber: null,
  },
  isTaxResident: null,
  missingInfo: {
    couldNotProvideSomeInfo: false,
    reason: ''
  }
})

// needed because dropdown is not built out of NuxtUI components so it does not trigger validation automatically
watch(() => si.citizenships, (newValue) => {
  const val = validateCitizenshipValidator().safeParse(newValue)
  let errors: { path: string, message: any }[] = []
  if (!val.success) {
    errors = val.error.issues.map(
      (issue: ZodIssue[]) => ({ message: issue.message, path: 'citizenships' })
    )
  }
  addIndividualForm.value.setErrors(errors, 'citizenships')
}, { deep: true })

// // workaround for the issue that input box does not clear errors when different radio button is selected
// watch(() => si.tax, (newValue) => {
//   if (!newValue.hasTaxNuber) {
//     addIndividualForm.value.clear('tax.taxNumber')
//     addIndividualForm.value.setErrors([], 'tax.taxNumber')
//   }
// }, { deep: true })
</script>
