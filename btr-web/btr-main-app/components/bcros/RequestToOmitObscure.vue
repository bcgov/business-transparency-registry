<script setup lang="ts">
import { getDefaultInputFormOmitObscure } from '~/utils/omit-schema/defaults'
import {
  OmitObscureSchemaType,
  OmitObscureSchema
} from '~/utils/omit-schema/definitions'
import { InfoToOmitE } from '~/enums/omit/info-to-omit-e'
import { IndividualsAtRiskE } from '~/enums/omit/individuals-at-risk-e'
const t = useNuxtApp().$i18n.t

const model = defineModel({ type: Object, default: getDefaultInputFormOmitObscure() })

defineProps({
  editMode: {
    type: Boolean,
    required: false,
    default: true
  }
})

const omitObscureForm = ref()
const businessPlaceholder = t('labels.requestOmit.businessPlaceholder')

const validate = async function () {
  await omitObscureForm.value.validate(null, { silent: true })
}

defineExpose({
  validate,
  omitObscureForm
})

const infoToOmitOptions: { value: string, label: string }[] = []
const infoToOmitSelected = ref([false])
const d = new Date()
const infoPlaceholders = ['First Last', d.getFullYear(), 'Canada Citizen']
for (const key in InfoToOmitE) {
  const width = key === 'CITIZENSHIP_PR' ? '307px' : '159px'
  if (key !== 'ALL') {
    infoToOmitOptions.push({ value: key, label: t('labels.requestOmit.omitInfoOpt.' + key), width })
    infoToOmitSelected.value.push(false)
  }
}

watch(infoToOmitSelected, () => {
  const rv = []
  for (let i = 0; i < infoToOmitSelected.value.length; i++) {
    if (infoToOmitSelected.value[i]) {
      rv.push(i === 0 ? 'ALL' : infoToOmitOptions[i - 1].value)
    }
  }
  model.value.infoToOmit = rv
}, { deep: true })

const individualsAtRiskOptions: { value: string, label: string } = []
const individualAtRiskSelected = ref([])
for (const key in IndividualsAtRiskE) {
  individualsAtRiskOptions.push({
    value: key,
    label: t('labels.requestOmit.individualAtRisk.' + IndividualsAtRiskE[key])
  })
  individualAtRiskSelected.value.push(false)
}

watch(individualAtRiskSelected, () => {
  const rv = []
  for (let i = 0; i < individualAtRiskSelected.value.length; i++) {
    if (individualAtRiskSelected.value[i]) {
      rv.push(individualsAtRiskOptions[i].value)
    }
  }
  model.value.individualsAtRisk = rv
}, { deep: true })

function hasErrors (sectionErrorPaths: string[]): boolean {
  if (!omitObscureForm.value?.errors) {
    return false
  }
  for (const errorPath of sectionErrorPaths) {
    const errors = omitObscureForm.value.errors
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

const formSchema: OmitObscureSchemaType = OmitObscureSchema

</script>

<template>
  <UForm
    ref="omitObscureForm"
    :schema="formSchema"
    :state="model"
    class="w-full"
  >
    <div class="mt-2 w-full border-t border-solid pt-4 space-y-2">
      <p>
        {{ $t('labels.requestOmit.omitObscureIntro') }} <span class="font-bold">{{ businessPlaceholder }}</span>
      </p>
      <BcrosSection
        :show-section-has-errors="hasErrors(['omitInfo'])"
        :section-title="$t('labels.requestOmit.omitInfo')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8"
      >
        <div class="flex-col w-full">
          <UFormGroup name="infoToOmit">
            <template #default>
              <div class="block w-[159px] text-base mb-5">
                <UCheckbox
                  v-model="infoToOmitSelected[0]"
                  name="omitAll"
                  class="inline-block"
                />
                <div class="inline-block mr-2">
                  {{ $t('labels.requestOmit.omitInfoOpt.ALL') }}
                </div>
              </div>
              <div
                v-for="option, index in infoToOmitOptions"
                :key="`omit${option.value}`"
                class="inline-block mr-1 text-base"
                :class="`w-[${option.width}]`"
              >
                <UCheckbox
                  :id="`omit${option.value}`"
                  v-model="infoToOmitSelected[index+1]"
                  :name="`omit${option.value}`"
                  class="inline-block height-[48px] align-super"
                />
                <div class="inline-block mr-2">
                  {{ option.label }}
                  <br></br>
                  <!--TODO: fill in with the existing info-->
                  <span class="font-bold">{{ infoPlaceholders[index] }}</span>
                </div>
              </div>
            </template>
          </UFormGroup>
        </div>
      </BcrosSection>

      <BcrosSection
        :show-section-has-errors="hasErrors(['individualsAtRisk'])"
        :section-title="$t('labels.requestOmit.atRisk')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8"
      >
        <UFormGroup name="individualsAtRisk">
          <template #default>
            <UCheckbox
              v-for="option, index in individualsAtRiskOptions"
              :id="`omit${option.value}`"
              :key="`atRisk${option.value}`"
              v-model="individualAtRiskSelected[index]"
              :name="`atRisk${option.value}`"
              :label="option.label"
            />
          </template>
        </UFormGroup>
      </BcrosSection>

      <BcrosSection
        :show-section-has-errors="hasErrors(['reasons'])"
        :section-title="$t('labels.requestOmit.reasons')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8 pb-10"
      >
        <UFormGroup name="reasons">
          <template #default>
            <p>{{ $t('labels.requestOmit.reasonsIntro') }}</p>
            <UTextarea
              v-model="model.reasons"
              :placeholder="$t('labels.requestOmit.reasonsPlaceholder')"
              variant="none"
              class="border-b-1 bg-gray-200"
              :ui="{ variant: { none: 'bg-gray-200 focus:ring-0 focus:shadow-none' }}"
            />
          </template>
        </UFormGroup>
      </BcrosSection>
    </div>
  </UForm>
</template>
