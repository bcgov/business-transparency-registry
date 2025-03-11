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
        v-if="!editMode"
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

      <BcrosSectionDivider v-if="!editMode" />

      <!--  section: individuals full name  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['name.'])"
        :section-title="$t('sectionTitles.individualsFullName')"
        rounded-bot
        :rounded-top="!editMode"
        :border="editMode"
        no-top-border
      >
        <div class="flex-col w-full">
          <div
            class="flex-col w-full"
            :class="{['bg-bcGovColor-gray2 rounded']:isShowReasonForChange}"
          >
            <BcrosInputsNameField
              id="individual-person-full-name"
              v-model="inputFormSi.name.fullName"
              name="name.fullName"
              :placeholder="$t('placeholders.individualsFullName')"
              data-cy="testFullName"
              :is-disabled="inputFormSi.name.isYourOwnInformation"
              :class="{['p-2']:isShowReasonForChange}"
              @focus="onNameFocus"
              @change="setNewOrChanged([InputFieldsE.FULL_NAME])"
              @blur="onBlurFullNameHandler"
            />
            <div v-if="isShowReasonForChange" class="w-full flex-wrap p-4">
              <p class="font-bold py-2">
                {{ $t('labels.nameChangeReason.title') }}
              </p>
              <UFormGroup name="name.nameChangeReason" class="pb-2" />
              <UFormGroup name="name.nameChangeReason">
                <template #error>
                  <!-- could not move the error above the items-->
                </template>
                <template #default="{ error }">
                  <div class="flex items-center mb-2">
                    <URadio
                      id="nameChangeReason-legalChange"
                      v-model="inputFormSi.name.nameChangeReason"
                      :value="NameChangeReasonE.LEGAL_CHANGE"
                      name="name-change-reason-radio"
                      data-cy="name-change-reason-radio-other"
                    />
                    <label for="nameChangeReason-legalChange" class="px-2" :class="{['text-red-500']:error}">
                      {{ $t('labels.nameChangeReason.legalChange') }}
                    </label>
                    <URadio
                      id="nameChangeReason-other"
                      v-model="inputFormSi.name.nameChangeReason"
                      :value="NameChangeReasonE.OTHER"
                      name="name-change-reason-radio"
                      data-cy="name-change-reason-radio-other"
                    />
                    <label for="nameChangeReason-other" class="px-2" :class="{['text-red-500']:error}">
                      {{ $t('labels.nameChangeReason.other') }}
                    </label>

                    <UButton
                      class="order:99 ml-auto pl-10 pr-0"
                      icon="i-mdi-close"
                      :trailing="true"
                      :label="t('buttons.cancel')"
                      color="primary"
                      variant="ghost"
                      data-cy="cancel-name-change-btn"
                      @click="cancelNameChange"
                    />
                  </div>
                </template>
              </UFormGroup>
            </div>
          </div>
          <div class="pt-5" />
          <UFormGroup name="doNothing">
            <UCheckbox
              v-model="inputFormSi.name.isUsePreferredName"
              :label="$t('texts.preferredName.checkbox')"
              data-cy="usePreferredName"
              @click="usePreferredNameCheckboxClickHandler"
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
                @change="setNewOrChanged([InputFieldsE.PREFERRED_NAME])"
              />
            </div>
          </div>
        </div>
      </BcrosSection>

      <BcrosSectionDivider />

      <!--  section-header: type of interest or control of shares/votes-->
      <BcrosSection
        id="control"
        header-icon-name="i-mdi-plus-circle-multiple-outline"
        :header-title="$t('sectionHeaders.controlOf')"
        :header-text="$t('sectionIntroText.controlOf')"
        rounded-top
        :border="editMode"
        no-bot-border
      />
      <BcrosSection
        :show-section-has-errors="hasErrors(['isControlSelected'])"
        :padded-y="false"
        :margin-bot="false"
      >
        <template #section-title>
          <UFormGroup class="-ml-1" name="isControlSelected" />
        </template>
      </BcrosSection>

      <BcrosSection
        id="control-of-shares"
        :show-section-has-errors="hasErrors(['isControlSelected', 'controlOfShares.'])"
        :section-title="$t('sectionTitles.controlOfShares')"
        :border="editMode"
        no-top-border
      >
        <IndividualPersonControlOfSharesVotes
          v-model="inputFormSi.controlOfShares"
          name="controlOfShares"
          @change="setNewOrChanged([InputFieldsE.CONTROL_OF_SHARES])"
        />
      </BcrosSection>

      <!--  section: type of interest or control of votes -->
      <BcrosSection
        id="control-of-votes"
        :show-section-has-errors="hasErrors(['isControlSelected', 'controlOfVotes.'])"
        :section-title="$t('sectionTitles.controlOfVotes')"
        :border="editMode"
        no-top-border
      >
        <IndividualPersonControlOfSharesVotes
          v-model="inputFormSi.controlOfVotes"
          name="controlOfVotes"
          @change="setNewOrChanged([InputFieldsE.CONTROL_OF_VOTES])"
        />
      </BcrosSection>

      <!--  section: control of majority of directors  -->
      <BcrosSection
        id="control-of-directors"
        :show-section-has-errors="hasErrors(['isControlSelected', 'controlOfDirectors'])"
        :section-title="$t('sectionTitles.controlOfMajorityOfDirectors')"
        :border="editMode"
        no-top-border
      >
        <IndividualPersonControlOfDirectors
          v-model="inputFormSi.controlOfDirectors"
          name="controlOfDirectors"
          @change="setNewOrChanged([InputFieldsE.CONTROL_OF_DIRECTORS])"
        />
      </BcrosSection>

      <BcrosSectionDivider />
      <!--  section-header: effective dates -->
      <BcrosSection
        header-icon-name="i-mdi-calendar"
        :header-title="$t('sectionHeaders.effectiveDates')"
        :header-text="$t('sectionIntroText.effectiveDates')"
        rounded-top
        :border="editMode"
        no-bot-border
      />

      <!--  section: effective dates -->
      <BcrosSection
        id="effective-dates"
        :show-section-has-errors="hasErrors(['effectiveDates'])"
        :section-title="$t('sectionTitles.effectiveDates')"
        rounded-bot
        :border="editMode"
        no-top-border
      >
        <div class="w-full">
          <IndividualPersonEffectiveDates
            :initial-date-groups="inputFormSi.effectiveDates"
            name="effectiveDates"
            data-cy="effectiveDates"
            :is-editing="isEditing"
            @dates-updated="inputFormSi.effectiveDates = $event;
                            setNewOrChanged([InputFieldsE.EFFECTIVE_DATES])"
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
        :border="editMode"
        no-bot-border
      />
      <!--  section: email address  -->
      <BcrosSection
        :show-section-has-errors="hasErrors(['email'])"
        :section-title="$t('sectionTitles.emailAddress')"
        :border="editMode"
        no-top-border
      >
        <div class="flex-col w-full">
          <BcrosInputsEmailField
            id="individual-person-email"
            v-model="inputFormSi.email"
            name="email"
            :placeholder="$t('labels.emailAddress')"
            data-cy="testEmail"
            @focus="clearEmailFieldOnEdit"
            @change="setNewOrChanged([InputFieldsE.EMAIL])"
            @blur="revertUnchangedEmailField"
          />
        </div>
      </BcrosSection>

      <!--  section: individual details address, mailing address  -->
      <BcrosSection
        id="address"
        :show-section-has-errors="hasErrors(['address.'])"
        :section-title="$t('labels.physicalAddress')"
        :border="editMode"
        :section-title-tooltip="$t('helpTexts.physicalAddress.tooltip')"
        no-top-border
      >
        <div class="flex-col w-full">
          <BcrosInputsAddress
            v-model="inputFormSi.address"
            name="address"
            :is-editing="isEditing"
            @country-change="countryChange"
            @postal-code-change="setNewOrChanged([InputFieldsE.ADDRESS_POSTAL_CODE])"
            @line1-change="setNewOrChanged([InputFieldsE.ADDRESS_LINE1])"
            @line2-change="setNewOrChanged([InputFieldsE.ADDRESS_LINE2])"
            @city-change="setNewOrChanged([InputFieldsE.ADDRESS_CITY])"
            @region-change="setNewOrChanged([InputFieldsE.ADDRESS_REGION])"
            @location-description-change="setNewOrChanged([InputFieldsE.ADDRESS_LOCATION_DESCRIPTION])"
          />
          <UFormGroup name="anotherDoNothingJustWatch" class="mt-6">
            <UCheckbox
              v-model="inputFormSi.mailingAddress.isDifferent"
              :label="$t('labels.mailingAddressIsDifferent')"
              data-cy="mailingAddressIsDifferent-checkbox"
              @change="() => {
                setNewOrChanged([InputFieldsE.MAILING_ADDRESS_IS_DIFFERENT]);
                isMailingAddressIsDifferentCheck()
              }"
            />
          </UFormGroup>
        </div>
      </BcrosSection>
      <BcrosSection
        v-if="showMailingAddress"
        id="mailing-address"
        class="-mt-1 pt-0"
        :show-section-has-errors="hasErrors(['address.'])"
        :section-title="$t('labels.mailingAddress')"
        :border="editMode"
        no-top-border
      >
        <div class="flex-col w-full">
          <BcrosInputsAddress
            v-model="inputFormSi.mailingAddress.address"
            name="mailingAddress.address"
            :is-editing="isEditing"
            data-cy="mailingAddress"
            @country-change="setNewOrChanged([InputFieldsE.MAILING_ADDRESS_COUNTRY])"
            @postal-code-change="setNewOrChanged([InputFieldsE.MAILING_ADDRESS_POSTAL_CODE])"
            @line1-change="setNewOrChanged([InputFieldsE.MAILING_ADDRESS_LINE1])"
            @line2-change="setNewOrChanged([InputFieldsE.MAILING_ADDRESS_LINE2])"
            @city-change="setNewOrChanged([InputFieldsE.MAILING_ADDRESS_CITY])"
            @region-change="setNewOrChanged([InputFieldsE.MAILING_ADDRESS_REGION])"
            @location-description-change="setNewOrChanged([InputFieldsE.MAILING_ADDRESS_LOCATION_DESCRIPTION])"
          />
        </div>
      </BcrosSection>

      <!--  section: individual details phoneNumber; phone number  -->
      <BcrosSection
        id="phone-number"
        :show-section-has-errors="hasErrors(['phoneNumber'])"
        :section-title="$t('sectionTitles.phoneNumber')"
        :border="editMode"
        no-top-border
      >
        <BcrosInputsPhoneNumber
          v-model="inputFormSi.phoneNumber"
          name="phoneNumber"
          data-cy="phoneNumberInput"
          :is-editing="isEditing"
          @country-change="() => {
            countryCallingCodeSelected = inputFormSi.phoneNumber.countryCallingCode !== undefined
          }"
          @change="setNewOrChanged([InputFieldsE.PHONE_NUMBER])"
        />
      </BcrosSection>
      <BcrosSection
        id="birth-date"
        :show-section-has-errors="hasErrors([InputFieldsE.BIRTH_DATE])"
        :section-title="$t('labels.birthdate')"
        :border="editMode"
        no-top-border
      >
        <div class="flex-col w-full">
          <BcrosInputsDateSelect
            id="addNewPersonBirthdate"
            name="birthDate"
            :initial-date="!!inputFormSi.birthDate ? dateStringToDate(inputFormSi.birthDate) || undefined : undefined"
            :max-date="new Date()"
            :placeholder="$t('placeholders.dateSelect.birthdate') + ' (YYYY-MM-DD)'"
            :is-editing="isEditing"
            @selection="
              inputFormSi.birthDate = dateToString($event, 'YYYY-MM-DD');
              setNewOrChanged([InputFieldsE.BIRTH_DATE])"
            @change="setNewOrChanged([InputFieldsE.BIRTH_DATE])"
          />

          <BcrosAlertsMessage
            v-if="isMinor(inputFormSi.birthDate)"
            class="mt-9"
            :flavour="AlertsFlavourE.INFO"
            data-cy="form-minor-warning"
          >
            <div>{{ $t('alerts.important') }}: {{ $t('alerts.siIsMinor.message') }}</div>
          </BcrosAlertsMessage>
        </div>
      </BcrosSection>

      <!--  section: citizenship or PR  -->
      <BcrosSection
        id="citizenships"
        :show-section-has-errors="hasErrors(['citizenships'])"
        :section-title="$t('sectionTitles.citizenshipOrPR')"
        :border="editMode"
        no-top-border
      >
        <div class="flex flex-col w-full">
          <IndividualPersonCitizenship
            v-model="inputFormSi.citizenships"
            @citizenship-updated="setNewOrChanged([InputFieldsE.CITIZENSHIPS])"
            @clear-errors="clearErrors($event)"
          />
        </div>
      </BcrosSection>

      <!--  section: tax details  -->
      <BcrosSection
        id="tax-details"
        :show-section-has-errors="hasErrors(['tax.'])"
        :section-title="$t('sectionTitles.taxDetails')"
        :border="editMode"
        no-top-border
      >
        <div class="w-full flex flex-col">
          <p>
            {{ $t('texts.taxNumber') }}
          </p>
          <IndividualPersonTaxInfoTaxNumber
            id="addNewPersonTaxNumber"
            v-model:has-tax-number="inputFormSi.tax.hasTaxNumber"
            v-model:tax-number="inputFormSi.tax.taxNumber"
            name="tax"
            variant="bcGov"
            :is-editing="isEditing"
            data-cy="testTaxNumber"
            @clear-errors="clearErrors($event)"
            @tax-number-changed="setNewOrChanged([InputFieldsE.TAX, InputFieldsE.TAX_NUMBER])"
            @has-tax-number-changed="setNewOrChanged([InputFieldsE.TAX])"
          />
        </div>
      </BcrosSection>
      <bcrosSection
        id="tax-residency"
        :show-section-has-errors="hasErrors(['isTaxResident'])"
        :section-title="$t('labels.taxResidency')"
        :border="editMode"
        no-top-border
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
            @change="setNewOrChanged([InputFieldsE.IS_TAX_RESIDENT])"
          />
        </div>
      </bcrosSection>

      <BcrosSection
        :show-section-has-errors="hasErrors(['determinationOfIncapacity'])"
        :section-title="$t('sectionTitles.determinationOfIncapacity')"
        rounded-bot
        :border="editMode"
        no-top-border
      >
        <DeterminationOfIncapacity
          v-model="inputFormSi.determinationOfIncapacity"
          name="determinationOfIncapacity"
          @change="setNewOrChanged([InputFieldsE.DETERMINATION_OF_INCAPACITY])"
        />
      </BcrosSection>

      <BcrosSectionDivider />

      <!--  section: unable to obtain or confirm  -->
      <BcrosSection
        id="missing-info"
        :show-section-has-errors="hasErrors(['missingInfo'])"
        :section-title="$t('sectionTitles.unableToObtainOrConfirmInformation')"
        rounded-top
        rounded-bot
        :border="editMode"
      >
        <div class="w-full">
          <IndividualPersonControlUnableToObtainOrConfirmInformation
            v-model="inputFormSi.missingInfoReason"
            name="missingInfoReason"
            :missing-info="inputFormSi.couldNotProvideMissingInfo"
            @update:missing-info="inputFormSi.couldNotProvideMissingInfo = $event"
            @update:model-value="setNewOrChanged([InputFieldsE.MISSING_INFO_REASON])"
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
import { RefinementCtx, z } from 'zod'
import type { FormError } from '#ui/types'
import { BtrCountryI } from '../../../../btr-common-components/interfaces/btr-address-i'
import { validateEmailRfc6532Regex } from '../../../../btr-common-components/utils'
import {
  validateControlSelectionForSharesAndVotes,
  validateNameSuperRefineAddForm,
  validateTaxNumberInfo,
  validateCitizenshipSuperRefine
} from '~/utils/validation'
import {
  AddressSchema,
  SiControlOfDirectorsSchema, CountrySchema,
  SiControlOfSchema,
  SiNameSchema,
  CitizenshipSchema,
  SiSchema, SiSchemaType,
  TaxSchema
} from '~/utils/si-schema/definitions'
import { getDefaultInputFormSi, getEmptyAddress } from '~/utils/si-schema/defaults'
import { CustomSiSchemaErrorMap } from '~/utils/si-schema/errorMessagesMap'
import DeterminationOfIncapacity from '~/components/individual-person/DeterminationOfIncapacity.vue'
import { NameChangeReasonE } from '~/enums/significant-individual/name-change-reason-e'
import { InputFieldsE, isMinor } from '#imports'

const emits = defineEmits<{
  add: [value: SiSchemaType],
  cancel: [],
  update: [value: { index: number | undefined, updatedSI: SiSchemaType }],
  remove: []
}>()

const props = defineProps<{
  index?: number,
  setSignificantIndividual?: SiSchemaType,
  startDate?: string,
  editMode?: boolean
}>()

const t = useNuxtApp().$i18n.t
const bcrosAccount = useBcrosAccount()
const inputFormSi: SiSchemaType = reactive(getDefaultInputFormSi())
const { scrollToAnchor } = useAnchorScroll({
  toAnchor: {
    target: document.documentElement,
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: -20 // Add extra space above the anchor
    }
  }
})

const siStore = useSignificantIndividuals()

const isEditing = ref(false)

const emailFieldUuid = getRandomUuid()
const clearEmailFieldOnEdit = () => {
  if (isEditing) {
    setFieldOriginalValue(emailFieldUuid, inputFormSi.email)
    inputFormSi.email = ''
  }
}
const revertUnchangedEmailField = () => {
  const originalValue = getFieldOriginalValue(emailFieldUuid)
  if (isEditing && !hasFieldChanged(inputFormSi, InputFieldsE.EMAIL) && originalValue) {
    inputFormSi.email = originalValue
  }
}
const usePreferredNameCheckboxClickHandler = () => {
  inputFormSi.name.preferredName = ''
  clearErrors('name.preferredName')
}

const isNameChanging = ref(false)
const isShowReasonForChange = computed(() => {
  return props.editMode && isNameChanging.value && !inputFormSi.ui?.actions?.includes(FilingActionE.ADD)
})

const cancelNameChange = () => {
  isNameChanging.value = false

  if (props.index !== undefined) {
    inputFormSi.name.fullName = siStore.savedSIs[props.index]?.name?.fullName || ''
  }
  const index = inputFormSi.ui?.newOrUpdatedFields?.indexOf(InputFieldsE.FULL_NAME)
  if (index > -1) { // only splice array when item is found
    inputFormSi.ui.newOrUpdatedFields.splice(index, 1)
  }
  inputFormSi.name.isNameChanged = false
  inputFormSi.name.nameChangeReason = undefined
  clearErrors('name.nameChangeReason')
}
const onNameFocus = () => {
  isNameChanging.value = true
  if (isShowReasonForChange.value) {
    inputFormSi.name.isNameChanged = true
  }
}

// extend existing schema with
const SiControlOfExtended = SiControlOfSchema.superRefine(validateControlSelectionForSharesAndVotes)
const SiNameExtended = SiNameSchema.superRefine(validateNameSuperRefineAddForm)

const AddressSchemaExtended = AddressSchema.extend({
  country: CountrySchema
    .optional()
    .refine((val: BtrCountryI | undefined) => {
      return val && val.name !== ''
    }, t('errors.validation.address.country'))
})

const AddressSchemaExtendedEdit = AddressSchemaExtended.extend({
  line1: z.string().optional(),
  postalCode: z.string().optional(),
  locationDescription: z.string().optional()
})

z.setErrorMap(CustomSiSchemaErrorMap)

const MailingAddressSchema = z.discriminatedUnion(
  'isDifferent',
  [
    z.object({
      isDifferent: z.literal(false),
      address: AddressSchemaExtended.optional()
    }),
    z.object({
      isDifferent: z.literal(true),
      address: AddressSchemaExtended
    })
  ]
)

const MailingAddressSchemaEdit = z.discriminatedUnion(
  'isDifferent',
  [
    z.object({
      isDifferent: z.literal(false),
      address: AddressSchemaExtendedEdit.optional()
    }),
    z.object({
      isDifferent: z.literal(true),
      address: AddressSchemaExtendedEdit
    })
  ]
)

const SiSchemaExtended = SiSchema.extend({
  couldNotProvideMissingInfo: z.literal(false),
  name: SiNameExtended,
  isControlSelected: z.boolean().refine(val => val, t('errors.validation.control')),
  controlOfShares: SiControlOfExtended,
  controlOfVotes: SiControlOfExtended,
  controlOfDirectors:
    SiControlOfDirectorsSchema.refine(validateControlOfDirectors, getMissingControlOfDirectorsError()),
  email: getEmailValidator(),
  address: AddressSchemaExtended,
  citizenships: CitizenshipSchema.superRefine(validateCitizenshipSuperRefine),
  mailingAddress: MailingAddressSchema,
  tax: TaxSchema.superRefine(validateTaxNumberInfo),
  isTaxResident: z.boolean()
})

const isControlSelected = computed(() => {
  const isSelected = (control: any) => {
    for (const key in control) {
      if (key === 'controlName') {
        continue
      }
      if (key === 'percentage' && control[key] !== PercentageRangeE.NO_SELECTION) {
        return true
      } else if (control[key] === true) {
        return true
      }
    }
    return false
  }
  return isSelected(inputFormSi.controlOfShares) ||
    isSelected(inputFormSi.controlOfVotes) ||
    isSelected(inputFormSi.controlOfDirectors)
})

watch(isControlSelected, (newValue) => {
  inputFormSi.isControlSelected = newValue
  if (!newValue) {
    addIndividualForm.value?.setErrors([{
      message: t('errors.validation.control'),
      path: 'isControlSelected'
    }], 'isControlSelected')
  } else {
    addIndividualForm.value?.clear('isControlSelected')
  }
})

let formSchema: any = z.discriminatedUnion('couldNotProvideMissingInfo', [
  z.object({
    couldNotProvideMissingInfo: z.literal(true),
    missingInfoReason: z.string().transform(s => s.trim()).pipe(z.string().min(1)),
    name: SiNameExtended,
    ui: z.object({
      newOrUpdatedFields: z.array(z.string())
    })

  }),
  SiSchemaExtended
])

if (props.editMode) {
  const SiSchemaExtendedEdit = SiSchemaExtended.extend({
    birthDate: z.string().optional(),
    name: SiNameExtended,
    address: AddressSchemaExtendedEdit,
    mailingAddress: MailingAddressSchemaEdit,
    tax: TaxSchema,
    email: z.string().optional()
  })

  formSchema = z.discriminatedUnion('couldNotProvideMissingInfo', [
    z.object({
      couldNotProvideMissingInfo: z.literal(true),
      missingInfoReason: z.string().transform(s => s.trim()).pipe(z.string().min(1)),
      name: SiNameExtended,

      ui: z.object({
        newOrUpdatedFields: z.array(z.string())
      })
    }),
    SiSchemaExtendedEdit
  ]).superRefine((schema: SiSchemaType, ctx: RefinementCtx): never => {
    // this superRefine is to work out through the redacted data fields and validate them only on change
    // birthdate check
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.BIRTH_DATE)) {
      if (!schema.birthDate || schema.birthDate.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['birthDate'],
          message: t('errors.validation.birthDate.required')
        })
      }
    }
    // phone check // its already optional nothing to do here

    // street address
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.ADDRESS_LINE1)) {
      if (!schema.address || !schema.address.line1 || schema.address.line1.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address', 'line1'],
          message: t('errors.validation.address.line1')
        })
      }
    }
    // postal code
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.ADDRESS_POSTAL_CODE)) {
      if (!schema.address || !schema.address.postalCode || schema.address.postalCode.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['address', 'postalCode'],
          message: t('errors.validation.address.postalCode')
        })
      }
    }
    // location description // its already optional nothing to do here
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.MAILING_ADDRESS_LINE1)) {
      if (!schema.mailingAddress.address ||
        !schema.mailingAddress.address.line1 ||
        schema.mailingAddress.address.line1.trim() === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mailingAddress', 'address', 'line1'],
          message: t('errors.validation.address.line1')
        })
      }
    }
    // postal code
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.MAILING_ADDRESS_POSTAL_CODE)) {
      if (!schema.mailingAddress.address ||
        !schema.mailingAddress.address.postalCode ||
        schema.mailingAddress.address.postalCode.trim() === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mailingAddress', 'address', 'postalCode'],
          message: t('errors.validation.address.postalCode')
        })
      }
    }

    // SIN
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.TAX_NUMBER)) {
      // add tax to path, so that subsequent tax validator creates erroro messages with path
      ctx.path.push('tax')
      validateTaxNumberInfo(schema.tax, ctx)
      // remove tax from path so it does not add it in next ctx errors
      const taxPath = ctx.path.findIndex(v => v === 'tax')
      if (taxPath !== -1) {
        ctx.path.splice(taxPath, 1)
      }
    }

    // email
    if (schema.ui.newOrUpdatedFields.includes(InputFieldsE.EMAIL)) {
      if (!schema.email || schema.email.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: t('errors.validation.email.empty')
        })
      }
      if (!validateEmailRfc6532Regex(schema.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: t('errors.validation.email.invalid')
        })
      }
    }
    return z.NEVER
  })
}
// extend schema end

const addIndividualForm = ref()

const formChange = async () => {
  await addBtrPayFees()
}

const countryCallingCodeSelected = ref(inputFormSi.phoneNumber.countryCallingCode !== undefined)

const countryChange = () => {
  if (
    !countryCallingCodeSelected.value &&
    !inputFormSi.phoneNumber.number &&
    undefined !== inputFormSi.address?.country?.alpha_2
  ) {
    inputFormSi.phoneNumber.countryCode2letterIso = inputFormSi.address.country.alpha_2
  }
  setNewOrChanged([InputFieldsE.ADDRESS_COUNTRY])
}

const isMailingAddressIsDifferentCheck = () => {
  if (!inputFormSi.mailingAddress.isDifferent) {
    inputFormSi.mailingAddress.address = undefined
    showMailingAddress.value = false
  } else {
    inputFormSi.mailingAddress.address = getEmptyAddress()
    showMailingAddress.value = true
  }
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

    // find the top section with error
    const topErrorSection = errors.reduce((topSection, error) => {
      const path = error.path.split('.')
      let section: string = path[0]
      if (section === 'name') {
        section += '.' + path[1]
      } else if (section === 'phoneNumber') {
        section += '.' + path[1]
      }

      if (!topSection) {
        return section
      }

      return errorSectionMap[topSection]?.position < errorSectionMap[section]?.position ? topSection : section
    }, null as string | null)

    // autoscroll to the top error
    const topId = errorSectionMap[topErrorSection as string]?.sectionId

    if (topId) {
      scrollToAnchor(topId)
    }
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

const onBlurFullNameHandler = () => {
  if (!inputFormSi.ui.newOrUpdatedFields.includes(InputFieldsE.FULL_NAME)) {
    isNameChanging.value = false
    inputFormSi.name.isNameChanged = false
    inputFormSi.name.nameChangeReason = undefined
    clearErrors('name.nameChangeReason')
  }
}

const setNewOrChanged = (fieldNames: Array<string>) => {
  inputFormSi.ui.newOrUpdatedFields ??= []
  for (let i = 0; i < fieldNames.length; i++) {
    if (!inputFormSi.ui.newOrUpdatedFields.includes(fieldNames[i])) {
      inputFormSi.ui.newOrUpdatedFields.push(fieldNames[i])
    }
  }
}

if (props.setSignificantIndividual) {
  isEditing.value = (props.index !== undefined)
  Object.assign(inputFormSi, props.setSignificantIndividual)
}
const showMailingAddress = ref(inputFormSi.mailingAddress.isDifferent)

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
