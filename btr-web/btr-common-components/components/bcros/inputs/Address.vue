<template>
  <UFormGroup :label="label" name="address" class="flex flex-col">
    <!--  label -->
    <div class="flex py-2">
      <!--  country -->
      <USelectMenu
        v-model="address.country"
        class="w-full flex-1"
        :placeholder="$t('labels.country')"
        :options="countries"
        variant="bcGov"
        @change="$emit('update:modelValue', address)"
      />
    </div>
    <div class="flex py-2">
      <!--  address line 1 -->
      <UInput
        v-model="address.line1"
        class="w-full flex-1"
        variant="bcGov"
        @change="$emit('update:modelValue', address)"
      />
    </div>
    <div class="flex py-2">
      <!--  address line 2 optional -->
      <UInput v-model="address.line2" class="w-full flex-1" variant="bcGov" @change="$emit('update:modelValue', address)" />
    </div>
    <!--  city; region combo; postal code -->
    <div class="flex flex-col sm:flex-row py-2">
      <UInput v-model="address.city" type="text" class="pr-4 w-full" variant="bcGov" @change="$emit('update:modelValue', address)" />
      <USelectMenu
        v-model="address.region"
        :placeholder="$t('labels.state')"
        class="pr-4 w-full"
        variant="bcGov"
        @change="$emit('update:modelValue', address)"
      />
      <UInput v-model="address.postalCode" type="text" class="w-full" variant="bcGov" @change="$emit('update:modelValue', address)" />
    </div>
    <!--  location description optional -->
  </UFormGroup>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import type { PropType } from 'vue'
import type { BtrAddress } from '~/interfaces/btrAddress'

defineEmits<{ 'update:modelValue': [value: string] }>()
const props = defineProps({
  label: { type: String, default: '' },
  id: { type: String, required: true },
  modelValue: { type: Object as PropType<BtrAddress>, required: true }
})

const countries: string[] = ['Canada', 'US', '3']
const address: Ref<BtrAddress> = ref(props.modelValue)


//validations

</script>
