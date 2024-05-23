<template>
  <div class="flex flex-col">
    <UFormGroup v-slot="{ error }" :name="name">
      <UCheckbox
        v-model="model"
        :name="name"
        :label="$t('labels.determinationOfIncapacity')"
        :variant="error ? 'error' : 'bcGov'"
        class="py-2"
      />
    </UFormGroup>
    <BcrosAlertsMessage v-if="model" :flavour="AlertsFlavourE.INFO">
      <BcrosI18HelperBold translation-path="alerts.determinationOfIncapacity.omitted" />
    </BcrosAlertsMessage>
    <BcrosAlertsMessage :flavour="AlertsFlavourE.MESSAGE">
      <template #icon>
        <UIcon
          class="text-orange-500 mt-[2px] text-2xl float-right"
          name="i-mdi-alert"
        />
      </template>
      <BcrosI18HelperBold translation-path="alerts.determinationOfIncapacity.proof" />
    </BcrosAlertsMessage>
  </div>
</template>

<script setup lang="ts">
const model = defineModel({ type: Boolean, required: true })
defineProps({
  name: { type: String, required: false, default: 'ControlOfDirectorsControlGroup' }
})
</script>
