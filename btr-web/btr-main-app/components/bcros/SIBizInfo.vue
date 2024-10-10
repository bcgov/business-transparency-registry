<script setup lang="ts">
import { z } from 'zod'
import { getDefaultInputFormSiBiz } from '~/utils/omit-schema/defaults'
import {
  SiBizInfoSchemaType,
  SiBizInfoSchema,
  UseTranslateErrorMap
} from '~/utils/omit-schema/definitions'

const model = defineModel({ type: Object, default: getDefaultInputFormSiBiz() })

defineProps({
  editMode: {
    type: Boolean,
    required: false,
    default: true
  }
})

const siBizForm = ref()

const validate = async function () {
  await siBizForm.value.validate(null, { silent: true })
}

defineExpose({
  validate,
  siBizForm
})

function hasErrors (sectionErrorPaths: string[]): boolean {
  if (!siBizForm.value?.errors) {
    return false
  }
  for (const errorPath of sectionErrorPaths) {
    const errors = siBizForm.value.errors
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

const formSchema: SiBizInfoSchemaType = SiBizInfoSchema
z.setErrorMap(UseTranslateErrorMap)

</script>

<template>
  <UForm
    ref="siBizForm"
    :schema="formSchema"
    :state="model"
    class="w-full"
  >
    <div class="mt-2 w-full border-t border-solid pt-4 space-y-2">
      <p>
        {{ $t('labels.requestOmit.siBizIntro') }}
      </p>
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
            id="si-biz-info-full-name"
            v-model="model.name"
            name="name"
            :placeholder="$t('placeholders.fullName')"
          />
        </div>
      </BcrosSection>
      <BcrosSection
        :show-section-has-errors="hasErrors(['birthdate'])"
        :section-title="$t('placeholders.dateSelect.birthdate')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8"
      >
        <div class="flex-col w-full">
          <BcrosInputsDateSelect
            id="si-biz-info-birthdate"
            name="birthdate"
            :initial-date="undefined"
            :max-date="new Date()"
            :placeholder="$t('placeholders.dateSelect.birthdate')"
            :is-editing="editMode"
            @selection="model.birthdate = dateToString($event, 'YYYY-MM-DD')"
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
            id="si-biz-info-email"
            v-model="model.email"
            name="email"
            :placeholder="$t('registriesDetailsLabels.emailAddressLC')"
          />
        </div>
      </BcrosSection>

      <BcrosSection
        :show-section-has-errors="hasErrors(['businessId'])"
        :section-title="$t('labels.requestOmit.businessName')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8 pb-10"
      >
        <div class="flex-col w-full">
          <BcrosBusinessSearch
            id="si-biz-info-businessId"
            v-model="model.businessId"
            name="businessId"
            :placeholder="$t('labels.requestOmit.businessNamePlaceholder')"
          />
        </div>
      </BcrosSection>
    </div>
  </UForm>
</template>
