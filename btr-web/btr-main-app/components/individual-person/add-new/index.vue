<template>
  <div data-cy="addIndividualPerson" class="w-full">
    <UForm
      ref="addIndividualForm"
      :schema="formSchema"
      :state="inputFormSi"
      class="w-full"
      @change="formChange"
    >
      <!--  section: your information  -->
      <BcrosSection
        :section-title="$t('sectionTitles.isYourOwnInformation')"
        data-cy="isYourOwnInformation-section"
      >
        <div class="flex-col w-full">
          <p class="pb-5">
            {{ $t('texts.isYourOwnInformation') }}
          </p>
          <UFormGroup name="workaroundForTriggeringValidationOnEntireForm">
            <UCheckbox
              v-model="inputFormSi.name.isYourOwnInformation"
              :label="$t('labels.isYourOwnInformation')"
              data-cy="isYourOwnInformation-checkbox"
              @change="setIsYourOwnInformation($event)"
            />
          </UFormGroup>
        </div>
      </BcrosSection>

      <BcrosSectionDivider />

      <!--  section: individuals full name  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['name.'])"
        :section-title="$t('sectionTitles.individualsFullName')"
      >
        <div class="flex-col w-full">
          <BcrosInputsNameField
            id="individual-person-full-name"
            v-model="inputFormSi.name.fullName"
            name="name.fullName"
            :label="$t('labels.fullName')"
            :placeholder="$t('placeholders.fullName')"
            data-cy="testFullName"
            :is-disabled="inputFormSi.name.isYourOwnInformation"
          />
          <div class="pt-5" />
          <UFormGroup name="doNothing">
            <UCheckbox
              v-model="inputFormSi.name.isUsePreferredName"
              :label="$t('texts.preferredName.checkbox')"
              data-cy="usePreferredName"
              @click="inputFormSi.name.preferredName = ''"
            />
          </UFormGroup>
          <div v-if="inputFormSi.name.isUsePreferredName" class="pt-3 w-full">
            <p>
              {{ $t('texts.preferredName.note') }}
            </p>
            <div class="pt-5">
              <BcrosInputsNameField
                id="individual-person-preferred-name"
                v-model="inputFormSi.name.preferredName"
                name="name.preferredName"
                :placeholder="$t('placeholders.preferredName')"
                data-cy="testPreferredName"
                :help="$t('texts.preferredName.hint')"
              />
            </div>
          </div>
        </div>
      </BcrosSection>

      <BcrosSectionDivider />

      <!--  section-header: type of interest or control -->
      <BcrosSection
        :header-text="$t('sectionHeaders.controlOf')"
        header-icon-name="i-mdi-plus-circle-multiple-outline"
      >
      </BcrosSection>

      <!--  section: type of interest or control  -->
      <BcrosSection
        :show-section-has-errors="false"
        :section-title="$t('sectionTitles.controlOfShares')"
      >
        <IndividualPersonControlOfSharesVotes name="controlOfShares" v-model="inputFormSi.controlOfShares" />
      </BcrosSection>

      <BcrosSection
        :show-section-has-errors="false"
        :section-title="$t('sectionTitles.controlOfVotes')"
      >
        <IndividualPersonControlOfSharesVotes name="controlOfVotes" v-model="inputFormSi.controlOfVotes" />
      </BcrosSection>

      <!--  section: control of majority of directors  -->
      <BcrosSection
        :show-section-has-errors="false"
        :section-title="$t('sectionTitles.controlOfMajorityOfDirectors')"
      >
        <UFormGroup name="containTheErrorChecks" class="w-full flex flex-col">
          <p class="font-bold pb-5">
            {{ $t('labels.controlOfDirectors') }}
          </p>
          <p>
            {{ $t('texts.controlOfDirectors.text.part1') }}
            <span class="font-bold">{{ $t('texts.controlOfDirectors.text.part2') }}</span>
            {{ $t('texts.controlOfDirectors.text.part3') }}
          </p>
          <IndividualPersonControlOfDirectors
            id="controlOfDirectors"
            v-model="inputFormSi.controlOfDirectors"
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
        :section-title="$t('sectionTitles.otherReasons')"
      >
        <div class="pt-3 w-full">
          <IndividualPersonControlOtherReasons
            id="otherReasons"
            v-model="inputFormSi.controlOther"
            name="otherReasons"
            data-cy="otherReasons"
          />
        </div>
      </BcrosSection>

      <BcrosSectionDivider />

      <!--  section-header: type of interest or control -->
      <BcrosSection
        :header-text="$t('sectionHeaders.individualsDetails')"
        header-icon-name="i-mdi-user-circle"
      >
      </BcrosSection>
      <!--  section: email address  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['email'])"
        :section-title="$t('sectionTitles.emailAddress')"
      >
        <div class="flex-col w-full">
          <BcrosInputsEmailField
            id="individual-person-email"
            v-model="inputFormSi.email"
            name="email"
            :placeholder="$t('labels.emailAddress')"
            data-cy="testEmail"
          />
        </div>
      </BcrosSection>

      <!--  section: individual details  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['birthDate', 'address.'])"
        :section-title="$t('sectionTitles.individualDetails')"
      >
        <div class="flex-col w-full">
          <BcrosInputsAddress
            id="addNewPersonLastKnownAddress"
            v-model="inputFormSi.address"
            :label="$t('labels.lastKnownAddress')"
            name="address"
          />
          <!--          todo: replace this with divider ?-->
          <div class="flex-col py-5" />
          <p class="font-bold pb-5">
            {{ $t('labels.birthdate') }}
          </p>
          <BcrosInputsDateSelect
            id="addNewPersonBirthdate"
            name="birthDate"
            class="mt-3"
            :initial-date="!!inputFormSi.birthDate ? dateStringToDate(inputFormSi.birthDate) : null"
            :max-date="new Date()"
            :placeholder="$t('placeholders.dateSelect.birthdate')"
            @selection="inputFormSi.birthDate = dateToString($event, 'YYYY-MM-DD')"
          />
        </div>
      </BcrosSection>

      <!--  section: citizenship or PR  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['citizenships'])"
        :section-title="$t('sectionTitles.citizenshipOrPR')"
      >
        <div class="flex-col w-full">
          <BcrosInputsCountriesOfCitizenship
            id="countriesOfCitizenship"
            v-model="inputFormSi.citizenships"
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
        :section-title="$t('sectionTitles.taxDetails')"
      >
        <div class="w-full flex flex-col">
          <p class="font-bold pb-5">
            {{ $t('labels.taxNumber') }}
          </p>
          <p>
            {{ $t('texts.taxNumber') }}
          </p>
          <IndividualPersonTaxInfoTaxNumber
            id="addNewPersonTaxNumber"
            v-model:hasTaxNumber="inputFormSi.tax.hasTaxNumber"
            v-model:taxNumber="inputFormSi.tax.taxNumber"
            name="tax"
            variant="bcGov"
            data-cy="testTaxNumber"
          />
          <div>
            <p class="font-bold pb-5">
              {{ $t('labels.taxResidency') }}
            </p>
            <p>
              {{ $t('texts.taxResidency') }}
            </p>
            <IndividualPersonTaxInfoTaxResidency
              v-model="inputFormSi.isTaxResident"
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
        :section-title="$t('sectionTitles.unableToObtainOrConfirmInformation')"
      >
        <div class="w-full">
          <IndividualPersonControlUnableToObtainOrConfirmInformation
            v-model="inputFormSi.missingInfoReason"
            name="missingInfoReason"
            :missing-info="inputFormSi.couldNotProvideMissingInfo"
            @update:missing-info="inputFormSi.couldNotProvideMissingInfo = $event"
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
import { getDefaultInputFormSi } from '~/utils/si-schema/defaults'
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
  name: SiNameExtended,
  controlOfShares: SiControlOfExtended,
  controlOfVotes: SiControlOfExtended,
  controlOfDirectors: ControlOfDirectorsSchema.refine(validateControlOfDirectors, getMissingControlOfDirectorsError()),
  email: getEmailValidator(),
  address: AddressSchemaExtended,
  tax: TaxSchema.superRefine(validateTaxNumberInfo),
  isTaxResident: z.boolean()
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
  const res = formSchema.safeParse(inputFormSi)
  let errors: FormError[] = []
  addIndividualForm.value.clear()
  if (!res.success) {
    errors = res.error.issues.map(issue => ({ message: issue.message, path: issue.path.join('.') }))
    console.error(errors)
    addIndividualForm.value.setErrors(errors)
  } else {
    const sii: SignificantIndividualI = convertSchemaToSi(inputFormSi, props.startDate || '', isEditing.value)
    if (isEditing.value) {
      emits('update', { index: props.index, updatedSI: sii })
    } else {
      emits('add', sii)
    }
  }
}

const setIsYourOwnInformation = (event: any) => {
  if (event.target.checked) {
    inputFormSi.name.fullName = bcrosAccount.userFullName
  } else {
    inputFormSi.name.fullName = ''
  }
}

const inputFormSi: SiSchemaType = reactive(getDefaultInputFormSi())

if (props.setSignificantIndividual) {
  isEditing.value = FilingActionE.EDIT === props.setSignificantIndividual.action
  const propsSi = convertSiToSchema(props.setSignificantIndividual)
  Object.assign(inputFormSi, propsSi)
}

// needed because dropdown is not built out of NuxtUI components so it does not trigger validation automatically
watch(() => inputFormSi.citizenships, (newValue) => {
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
