<script setup lang="ts">
import { getDefaultInputFormOmitObscure } from '~/utils/omit-schema/defaults'
import {
  type OmitObscureSchemaType,
  OmitObscureSchema
} from '~/utils/omit-schema/definitions'
import { InfoToOmitE } from '~/enums/omit/info-to-omit-e'
import { IndividualsAtRiskE } from '~/enums/omit/individuals-at-risk-e'
import { useOmitIndividual } from '@/stores/omit-individual'

const t = useNuxtApp().$i18n.t

const omitIndividual = useOmitIndividual()
const { siBizName, siBiz, submitting } = storeToRefs(omitIndividual)

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
const nameP = 'First Last'
const dateP = d.getFullYear()
const citizenP = ''
const infoPlaceholders = ref([nameP, dateP, citizenP])
for (const key in InfoToOmitE) {
  if (key !== 'ALL') {
    infoToOmitOptions.push({ value: key, label: t('labels.requestOmit.omitInfoOpt.' + key) })
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

watch(siBiz, () => {
  if (siBiz.value.name === '') {
    infoPlaceholders.value[0] = nameP
  } else {
    infoPlaceholders.value[0] = siBiz.value.name
  }

  const fYear = new Date(siBiz.value.birthdate).getFullYear()
  infoPlaceholders.value[1] = fYear + ''
  if (Number.isNaN(fYear)) {
    infoPlaceholders.value[1] = dateP
  }
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
        {{ $t('labels.requestOmit.omitObscureIntro') }}
        <span class="font-bold">
          {{ siBizName ? ` ${siBizName} (${siBiz.businessId})` : ` ${businessPlaceholder}` }}
        </span>
      </p>
      <BcrosSection
        :show-section-has-errors="hasErrors(['infoToOmit'])"
        :section-title="$t('labels.requestOmit.omitInfo')"
        :border="false"
        :padded-x="false"
        :padded-y="false"
        class="pt-9 -ml-8 pl-8"
      >
        <div class="flex-col w-full">
          <UFormGroup name="infoToOmit">
            <template #default>
              <div class="block text-base mb-5">
                <UCheckbox
                  v-model="infoToOmitSelected[0]"
                  :disabled="submitting"
                  name="omitAll"
                >
                  <template #label>
                    {{ $t('labels.requestOmit.omitInfoOpt.ALL') }}
                  </template>
                </UCheckbox>
              </div>
              <div class="flex flex-row gap-1 text-base">
                <UCheckbox
                  v-for="(option, index) in infoToOmitOptions"
                  :id="`omit${option.value}`"
                  :key="`omit${option.value}`"
                  v-model="infoToOmitSelected[index+1]"
                  :name="`omit${option.value}`"
                  :disabled="submitting"
                  class="mr-3"
                >
                  <template #label>
                    <p>{{ option.label }}</p>
                    <!--TODO: fill in with the existing info-->
                    <span class="font-bold">{{ infoPlaceholders[index] }}</span>
                  </template>
                </UCheckbox>
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
              :disabled="submitting"
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
              :disabled="submitting"
              class="border-b-1 bg-gray-200"
              :ui="{
                variant: {
                  none: 'bg-gray-200 focus:ring-0 focus:shadow-none dark:placeholder-gray-700 placeholder-gray-700'
                }
              }"
            />
          </template>
        </UFormGroup>
      </BcrosSection>
    </div>
  </UForm>
</template>
