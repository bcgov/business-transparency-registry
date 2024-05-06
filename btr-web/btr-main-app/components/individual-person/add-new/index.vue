<template>
  <div data-cy="addIndividualPerson" class="w-full">
    <UForm
      ref="addIndividualForm"
      :schema="formSchema"
      :state="si"
      class="w-full"
      @change="formChange"
    >
      <!--  section: your information  -->
      <BcrosSection
        :section-title="$t('sectionHeadings.isYourOwnInformation')"
        data-cy="isYourOwnInformation-section"
      >
        <div class="flex-col w-full">
          <p class="py-3">
            {{ $t('texts.isYourOwnInformation') }}
          </p>
          <UFormGroup name="workaroundForTriggeringValidationOnEntireForm">
            <UCheckbox
              v-model="si.name.isYourOwnInformation"
              :label="$t('labels.isYourOwnInformation')"
              data-cy="isYourOwnInformation-checkbox"
              @change="setIsYourOwnInformation($event)"
            />
          </UFormGroup>
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
        :show-section-has-errors="false"
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
        :show-section-has-errors="false"
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
            id="countriesOfCitizenship"
            v-model="si.citizenships"
            name="citizenships"
            :help="$t('labels.countryOfCitizenship.hint')"
          />
          <p>
            {{ $t('labels.countryOfCitizenship.note') }}
          </p>
        </div>
      </BcrosSection>

      <!--  section: tax details  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['tax.', 'isTaxResident'])"
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
            v-model="si.missingInfoReason"
            name="missingInfoReason"
            :missing-info="si.couldNotProvideMissingInfo"
            @update:missing-info="si.couldNotProvideMissingInfo = $event"
          />
        </div>
      </BcrosSection>
    </UForm>

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
import { z } from 'zod'
import type { FormError } from '#ui/types'
import { BtrCountryI } from '../../../../btr-common-components/interfaces/btr-address-i'
import { validateControlSelectionForSharesAndVotes, validateFullNameSuperRefine } from '~/utils/validation'
import { SignificantIndividualI } from '~/interfaces/significant-individual-i'
import { FilingActionE } from '~/enums/filing-action-e'
import {
  AddressSchema,
  ControlOfDirectorsSchema,
  SiControlOfSchema,
  SiNameSchema,
  SiSchema, SiSchemaType,
  TaxSchema
} from '~/utils/si-schema/definitions'
import { convertSchemaToSi, convertSiToSchema } from '~/utils/si-schema/converters'
import { defaultInputFormSi } from '~/utils/si-schema/defaults'
import { CustomSiSchemaErrorMap } from '~/utils/si-schema/errorMessagesMap'

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

const t = useNuxtApp().$i18n.t
const bcrosAccount = useBcrosAccount()

const isEditing = ref(false)

// extend existing schema with
const SiControlOfExtended = SiControlOfSchema.superRefine(validateControlSelectionForSharesAndVotes)
const SiNameExtended = SiNameSchema
  .extend({ preferredName: getPreferredNameValidator() })
  .superRefine(validateFullNameSuperRefine)

const AddressSchemaExtended = AddressSchema.extend({
  country: z.union([z.null(), z.object({ name: z.string(), alpha_2: z.string() })])
    .refine((val: BtrCountryI | null) => { return val?.name !== '' }, t('errors.validation.address.country'))
})

const SiSchemaExtended = SiSchema.extend({
  couldNotProvideMissingInfo: z.literal(false),
  controlOfShares: SiControlOfExtended,
  controlOfVotes: SiControlOfExtended,
  controlOfDirectors: ControlOfDirectorsSchema.refine(validateControlOfDirectors, getMissingControlOfDirectorsError()),
  email: getEmailValidator(),
  address: AddressSchemaExtended,
  tax: TaxSchema.superRefine(validateTaxNumberInfo)
})

z.setErrorMap(CustomSiSchemaErrorMap)

const formSchema = z.discriminatedUnion('couldNotProvideMissingInfo', [
  z.object({
    couldNotProvideMissingInfo: z.literal(true),
    missingInfoReason: z.string().transform(s => s.trim()).pipe(z.string().min(1)),
    name: SiNameExtended
  }),
  SiSchemaExtended
])

const addIndividualForm = ref()

const formChange = async () => {
  await addBtrPayFees()
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
  const res = formSchema.safeParse(si)
  let errors: FormError[] = []
  addIndividualForm.value.clear()
  if (!res.success) {
    errors = res.error.issues.map(issue => ({ message: issue.message, path: issue.path.join('.') }))
    console.error(errors)
    addIndividualForm.value.setErrors(errors)
  } else {
    const sii: SignificantIndividualI = convertSchemaToSi(si, props.startDate || '', isEditing.value)
    if (isEditing.value) {
      emits('update', { index: props.index, updatedSI: sii })
    } else {
      emits('add', sii)
    }
  }
}

const setIsYourOwnInformation = (event: any) => {
  if (event.target.checked) {
    si.name.fullName = bcrosAccount.userFullName
  } else {
    si.name.fullName = ''
  }
}

let sii = null
if (props.setSignificantIndividual) {
  isEditing.value = FilingActionE.EDIT === props.setSignificantIndividual.action
  sii = convertSiToSchema(props.setSignificantIndividual)
}

const si: SiSchemaType = reactive(sii || defaultInputFormSi)

// needed because dropdown is not built out of NuxtUI components so it does not trigger validation automatically
watch(() => si.citizenships, (newValue) => {
  const val = validateCitizenshipValidator().safeParse(newValue)
  let errors: { path: string, message: string }[] = []
  if (!val.success) {
    errors = val.error.issues.map(
      (issue: z.ZodIssue) => ({ message: issue.message, path: 'citizenships' })
    )
  }
  addIndividualForm.value.setErrors(errors, 'citizenships')
}, { deep: true })
</script>
