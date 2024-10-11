<script setup lang="ts">
import { z } from 'zod'
import { getDefaultInputFormCompletingParty } from '~/utils/omit-schema/defaults'
import {
  CompletingPartySchemaType,
  CompletingPartySchema,
  UseTranslateErrorMap
} from '~/utils/omit-schema/definitions'
import { CompletingIndividualTypeE, CompletingIndividualTranslationsE } from '~/enums/omit/completing-individual-type-e'
import { useOmitIndividual } from '@/stores/omit-individual'
const omitIndividual = useOmitIndividual()
const { submitting } = storeToRefs(omitIndividual)

const t = useNuxtApp().$i18n.t

const model = defineModel({ type: Object, default: getDefaultInputFormCompletingParty() })

defineProps({
  editMode: {
    type: Boolean,
    required: false,
    default: true
  }
})

const completingPartyForm = ref()

const validate = async function () {
  await completingPartyForm.value.validate(null, { silent: true })
}

defineExpose({
  validate,
  completingPartyForm
})

const individualTypeOptions = []
for (const key in CompletingIndividualTypeE) {
  individualTypeOptions.push({ value: key, label: t(CompletingIndividualTranslationsE[key]) })
}

function hasErrors (sectionErrorPaths: string[]): boolean {
  if (!completingPartyForm.value?.errors) {
    return false
  }
  for (const errorPath of sectionErrorPaths) {
    const errors = completingPartyForm.value.errors
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

const formSchema: CompletingPartySchemaType = CompletingPartySchema
z.setErrorMap(UseTranslateErrorMap)

</script>

<template>
  <UForm
    ref="completingPartyForm"
    :schema="formSchema"
    :state="model"
    class="w-full"
  >
    <div class="mt-2 w-full border-t border-solid pt-4">
      <p>
        {{ $t('labels.requestOmit.completingPartyIntro') }}
      </p>
      <BcrosSection
        :show-section-has-errors="hasErrors(['invididualType'])"
        :section-title="$t('labels.requestOmit.completingParty')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8"
      >
        <div class="flex-col w-full">
          <UFormGroup name="invididualType" eager-validation>
            <template #default>
              <URadioGroup
                id="completingParty"
                v-model="model.invididualType"
                name="invididualType"
                class="inline-block"
                :disabled="submitting"
                :options="individualTypeOptions"
                :ui-radio="{wrapper: 'relative flex items-start mb-4'}"
              />
            </template>
          </UFormGroup>
        </div>
      </BcrosSection>

      <BcrosSection
        :show-section-has-errors="hasErrors(['name'])"
        :section-title="$t('placeholders.fullName')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8"
      >
        <div class="flex-col w-full">
          <BcrosInputsNameField
            id="completing-party-full-name"
            v-model="model.name"
            name="name"
            :is-disabled="submitting"
            :placeholder="$t('placeholders.fullName')"
          />
        </div>
      </BcrosSection>

      <BcrosSection
        :show-section-has-errors="hasErrors(['email'])"
        :section-title="$t('registriesDetailsLabels.emailAddress')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8"
      >
        <div class="flex-col w-full">
          <BcrosInputsEmailField
            id="completing-party-email"
            v-model="model.email"
            name="email"
            :is-disabled="submitting"
            :placeholder="$t('registriesDetailsLabels.emailAddressLC')"
          />
        </div>
      </BcrosSection>

      <BcrosSection
        :show-section-has-errors="hasErrors(['certify'])"
        :section-title="$t('labels.certifySection')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8 pb-10"
      >
        <div class="flex-col w-full">
          <UFormGroup name="certify" eager-validation>
            <template #default="{ error }">
              <ReviewConfirmCertify
                v-model="model.certify"
                :name="model.name ? model.name : `[${$t('placeholders.fullName')}]`"
                :part-2-text="$t('labels.requestOmit.certifyPart2')"
                data-cy="certify-section"
                :class="error ? 'text-red-500 dark:text-red-400' : ''"
                :show-label="false"
                :alt-note="true"
                :is-disabled="submitting"
              />
            </template>
          </UFormGroup>
        </div>
      </BcrosSection>
    </div>
  </UForm>
</template>
