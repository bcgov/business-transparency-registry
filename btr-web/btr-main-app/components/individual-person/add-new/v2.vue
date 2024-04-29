<template>
  <div data-cy="addIndividualPerson" class="w-full">
    <UForm
      ref="addIndividualForm"
      :schema="formSchema"
      :state="si"
      class="w-full"
      @change="formChange"
    >
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
        :show-section-has-errors="
        addIndividualForm?.errors?.filter(errObj=>{ return errObj.path.indexOf('name.') !== -1}).length > 0"
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
          <UCheckbox
            v-model="si.name.isUsePreferredName"
            :label="$t('texts.preferredName.checkbox')"
            data-cy="usePreferredName"
            @click="si.name.preferredName = ''"
          />
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
        <div class="w-full flex flex-col">
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
        </div>
      </BcrosSection>


      <!--  section: other reasons  -->
      <BcrosSection
        :show-section-has-errors="sectionErrors?.otherReasons?.length > 0"
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
        :show-section-has-errors="sectionErrors?.emailAddress?.length > 0"
        :section-title="$t('sectionHeadings.emailAddress')"
      >
        <div class="flex-col w-full pt-3">
          <BcrosInputsEmailField
            id="individual-person-email"
            v-model="si.email"
            :placeholder="$t('labels.emailAddress')"
            variant="bcGov"
            data-cy="testEmail"
          />
        </div>
      </BcrosSection>


      <!--  section: individual details  -->
      <BcrosSection
        :show-section-has-errors="sectionErrors?.individualDetails?.length > 0"
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
            name="profile.birthDate"
            class="mt-3"
            :initial-date="si.birthDate
            ? dateStringToDate(si.birthDate) : undefined"
            :max-date="new Date()"
            :placeholder="$t('placeholders.dateSelect.birthdate')"
            @selection="si.birthDate = dateToString($event, 'YYYY-MM-DD')"
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
import { undefined, z, ZodError, ZodIssue } from 'zod'
import { SignificantIndividualAddNewErrorsI } from '~/interfaces/significant-individual/add-new-errors-i'
import {
  validateControlOfSharesFunc,
  validateControlOfVotesFunc,
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
  emits('update', { index: props.index, updatedSI: si.value })
}

function handleDoneButtonClick () {
  isEditing.value = false
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
    line1: getAddressLine1Validator(),
    line2: z.union([z.string(), z.null()]),
    city: getAddressCityValidator(),
    region: getAddressRegionValidator(),
    postalCode: getAddressPostalCodeValidator(),
    locationDescription: z.union([z.string(), z.null()])
  }),
  birthDate: z.union([z.string(), z.null()]).refine(validateBirthDate, getMissingBirthDateError())
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
  birthDate: null
})


</script>
