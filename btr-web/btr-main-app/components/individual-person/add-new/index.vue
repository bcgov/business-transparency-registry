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
        rounded-bot
        rounded-top
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
        rounded-bot
        rounded-top
      >
        <div class="flex-col w-full">
          <BcrosInputsNameField
            id="individual-person-full-name"
            v-model="inputFormSi.name.fullName"
            name="name.fullName"
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

      <!--  section-header: type of interest or control of shares/votes-->
      <BcrosSection
        header-icon-name="i-mdi-plus-circle-multiple-outline"
        :header-title="$t('sectionHeaders.controlOf')"
        :header-text="$t('sectionIntroText.controlOf')"
        rounded-top
      />

      <!--  section: type of interest or control of shares -->
      <BcrosSection
        :show-section-has-errors="false"
        :section-title="$t('sectionTitles.controlOfShares')"
      >
        <IndividualPersonControlOfSharesVotes v-model="inputFormSi.controlOfShares" name="controlOfShares" />
      </BcrosSection>

      <!--  section: type of interest or control of votes -->
      <BcrosSection
        :show-section-has-errors="false"
        :section-title="$t('sectionTitles.controlOfVotes')"
      >
        <IndividualPersonControlOfSharesVotes v-model="inputFormSi.controlOfVotes" name="controlOfVotes" />
      </BcrosSection>

      <!--  section: control of majority of directors  -->
      <BcrosSection
        :show-section-has-errors="false"
        :section-title="$t('sectionTitles.controlOfMajorityOfDirectors')"
      >
        <IndividualPersonControlOfDirectors v-model="inputFormSi.controlOfDirectors" name="controlOfDirectors" />
      </BcrosSection>

      <!--  section: other reasons  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['otherReasons'])"
        :section-title="$t('sectionTitles.otherReasons')"
        rounded-bot
      >
        <div class="w-full">
          <IndividualPersonControlOtherReasons
            id="otherReasons"
            v-model="inputFormSi.controlOther"
            name="otherReasons"
            data-cy="otherReasons"
          />
        </div>
      </BcrosSection>

      <BcrosSectionDivider />

      <!--  section-header: effective dates -->
      <BcrosSection
        header-icon-name="i-mdi-calendar"
        :header-title="$t('sectionHeaders.effectiveDates')"
        :header-text="$t('sectionIntroText.effectiveDates')"
        rounded-top
      />

      <!--  section: effective dates -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['effectiveDates'])"
        :section-title="$t('sectionTitles.effectiveDates')"
        rounded-bot
      >
        <div class="w-full">
          <IndividualPersonEffectiveDates
            :initial-date-groups="inputFormSi.effectiveDates"
            name="effectiveDates"
            data-cy="effectiveDates"
            @dates-updated="inputFormSi.effectiveDates = $event"
          />
        </div>
      </BcrosSection>

      <BcrosSectionDivider />
      <!--  section-header: individuals details -->
      <BcrosSection
        header-icon-name="i-mdi-user-circle"
        :header-title="$t('sectionHeaders.individualsDetails')"
        :header-text="$t('sectionIntroText.individualsDetails')"
        rounded-top
      />
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
        :show-section-has-errors="hasErrors(['address.'])"
        :section-title="$t('labels.lastKnownAddress')"
      >
        <div class="flex-col w-full">
          <BcrosInputsAddress
            id="addNewPersonLastKnownAddress"
            v-model="inputFormSi.address"
            name="address"
          />
        </div>
      </BcrosSection>
      <BcrosSection
        :show-section-has-errors="hasErrors(['phoneNumber'])"
        :section-title="$t('sectionTitles.phoneNumber')"
      >
        <BcrosInputsPhoneNumber
          v-model="inputFormSi.phoneNumber"
          name="phoneNumber"
        />
      </BcrosSection>
      <BcrosSection
        :show-section-has-errors="hasErrors(['birthDate'])"
        :section-title="$t('labels.birthdate')"
      >
        <div class="flex-col w-full">
          <BcrosInputsDateSelect
            id="addNewPersonBirthdate"
            name="birthDate"
            :initial-date="!!inputFormSi.birthDate ? dateStringToDate(inputFormSi.birthDate) || undefined : undefined"
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
          <BcrosInputsCombobox
            id="countriesOfCitizenship"
            v-model="inputFormSi.citizenships"
            name="citizenships"
            :help="$t('labels.countryOfCitizenship.hint')"
            :label-function="(c) => c.name"
            :items="citizenshipOptions"
            :search-placeholder="$t('labels.countryOfCitizenship.findCountry')"
            :label-placeholder="$t('labels.countryOfCitizenship.placeholder')"
            key-attribute="alpha_2"
            :search-attributes="['name', 'alpha_2']"
          />
          <p class="pt-3">
            {{ $t('labels.countryOfCitizenship.note') }}
          </p>
        </div>
      </BcrosSection>

      <!--  section: tax details  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['tax.'])"
        :section-title="$t('sectionTitles.taxDetails')"
      >
        <div class="w-full flex flex-col">
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
            @clear-errors="clearErrors($event)"
          />
        </div>
      </BcrosSection>
      <bcrosSection
        :show-section-has-errors="hasErrors(['isTaxResident'])"
        :section-title="$t('labels.taxResidency')"
      >
        <div class="flex flex-col w-full">
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
      </bcrosSection>

      <BcrosSection
        :show-section-has-errors="hasErrors(['determinationOfIncapacity'])"
        :section-title="$t('sectionTitles.determinationOfIncapacity')"
        rounded-bot
      >
        <DeterminationOfIncapacity
          v-model="inputFormSi.determinationOfIncapacity"
          name="determinationOfIncapacity"
        />
      </BcrosSection>

      <BcrosSectionDivider />

      <!--  section: unable to obtain or confirm  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['missingInfo'])"
        :section-title="$t('sectionTitles.unableToObtainOrConfirmInformation')"
        rounded-top
        rounded-bot
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

    <div class="grid mt-6 w-full">
      <div class="flex justify-between">
        <UButton
          class="px-10 py-3 mr-5"
          :label="t('buttons.remove')"
          color="red"
          variant="outline"
          data-cy="edit-si-remove-btn"
          :disabled="!isEditing"
          @click="$emit('remove')"
        />
        <div class="flex">
          <UButton
            class="px-10 py-3"
            :label="t('buttons.cancel')"
            color="primary"
            variant="outline"
            data-cy="new-si-cancel-btn"
            @click="$emit('cancel')"
          />
          <UButton
            class="ml-5 px-10 py-3"
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
import {
  validateControlSelectionForSharesAndVotes,
  validateFullNameSuperRefine,
  validateTaxNumberInfo
} from '~/utils/validation'
import {
  AddressSchema,
  SiControlOfDirectorsSchema, CountrySchema,
  SiControlOfSchema,
  SiNameSchema,
  SiSchema, SiSchemaType,
  TaxSchema
} from '~/utils/si-schema/definitions'
import { getDefaultInputFormSi } from '~/utils/si-schema/defaults'
import { CustomSiSchemaErrorMap } from '~/utils/si-schema/errorMessagesMap'
import DeterminationOfIncapacity from '~/components/individual-person/DeterminationOfIncapacity.vue'

const emits = defineEmits<{
  add: [value: SiSchemaType],
  cancel: [],
  update: [value: { index: number | undefined, updatedSI: SiSchemaType }],
  remove: []
}>()

const props = defineProps<{
  index?: number,
  setSignificantIndividual?: SiSchemaType,
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
  country: CountrySchema
    .optional()
    .refine((val: BtrCountryI | undefined) => {
      return val && val.name !== ''
    }, t('errors.validation.address.country'))
})

const SiSchemaExtended = SiSchema.extend({
  couldNotProvideMissingInfo: z.literal(false),
  name: SiNameExtended,
  controlOfShares: SiControlOfExtended,
  controlOfVotes: SiControlOfExtended,
  controlOfDirectors:
    SiControlOfDirectorsSchema.refine(validateControlOfDirectors, getMissingControlOfDirectorsError()),
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

const clearErrors = (errorPath: string) => {
  addIndividualForm.value.clear(errorPath)
}

function handleDoneButtonClick () {
  const res = formSchema.safeParse(inputFormSi)
  let errors: FormError[] = []
  addIndividualForm.value.clear()
  if (!res.success) {
    errors = res.error.issues.map(issue => ({ message: issue.message, path: issue.path.join('.') }))
    console.error(errors)
    addIndividualForm.value.setErrors(errors)
  } else if (isEditing.value) {
    emits('update', { index: props.index, updatedSI: inputFormSi })
  } else {
    emits('add', inputFormSi)
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
  isEditing.value = (props.index !== undefined)
  Object.assign(inputFormSi, props.setSignificantIndividual)
}

watch(inputFormSi.controlOfShares, (control) => {
  if (!control.inConcertControl) {
    inputFormSi.sharesInConcert = []
  }
  if (!control.actingJointly) {
    inputFormSi.sharesActingJointly = []
  }
})

watch(inputFormSi.controlOfVotes, (control) => {
  if (!control.inConcertControl) {
    inputFormSi.votesInConcert = []
  }
  if (!control.actingJointly) {
    inputFormSi.votesActingJointly = []
  }
})

watch(inputFormSi.controlOfDirectors, (control) => {
  if (!control.inConcertControl) {
    inputFormSi.directorsInConcert = []
  }
  if (!control.actingJointly) {
    inputFormSi.directorsActingJointly = []
  }
})
</script>
