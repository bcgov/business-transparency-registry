<template>
  <!--  todo: make name part of the props -->
  <UFormGroup v-slot="{ error }" :label="label" :name="name" class="flex flex-col py-5">
    <div class="flex items-center mb-2 py-1" :class="{ 'text-red-500': !!error }">
      <URadio
        id="taxResidency-true"
        v-model="isTaxResident"
        name="taxResidency"
        :value="true"
      />
      <label for="taxResidency-true" class="ml-5">
        {{ $t('labels.isTaxResident') }}
      </label>
    </div>
    <div class="flex items-center mb-2 py-1" :class="{ 'text-red-500': !!error }">
      <URadio
        id="taxResidency-false"
        v-model="isTaxResident"
        name="taxResidency"
        :value="false"
      />
      <label for="taxResidency-false" class="ml-5">
        {{ $t('labels.notTaxResident') }}
      </label>
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
const isTaxResident = defineModel()
const props = defineProps({
  name: { type: String, default: 'isTaxResidency' },
  label: { type: String, default: '' }
})
</script>
