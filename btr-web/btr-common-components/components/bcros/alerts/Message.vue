<template>
  <div class="grid grid-cols-12 gap-2 p-3 m-3" :class="flavourContainerClass" :role="flavour">
    <div class="p-2">
      <slot name="icon">
        <UIcon :class="flavourIconClass" v-if="flavourIcon" class="mt-[2px] text-2xl" :name="flavourIcon" />
      </slot>
    </div>
    <div class="p-2">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { AlertsFlavourE } from '~/enums/alerts-e'

const props = defineProps<{
  flavour: { type: AlertsFlavourE, default: AlertsFlavourE.MESSAGE }
}>()

const flavourIcon: Ref<string | null> = ref(null)
const flavourContainerClass = ref('')
const flavourIconClass = ref('')

switch (props.flavour) {
  case AlertsFlavourE.ALERT:
    flavourIcon.value = 'i-mdi-alert'
    flavourIconClass.value = 'bcGovRed-500 '
    flavourContainerClass.value = 'border-2 border-bcGovRed-500 bg-bcGovRed-200'
    break
  case AlertsFlavourE.SUCCESS:
    flavourIcon.value = 'i-mdi-success-circle'
    flavourContainerClass.value = 'border-2 border-bcGovGreen-500 bg-bcGovGreen-200'
    break
  case AlertsFlavourE.WARNING:
    flavourIcon.value = 'i-mdi-warning-circle'
    flavourContainerClass.value = 'border-2 border-bcGovOrange-500 bg-bcGovOrange-200'
    break
  case AlertsFlavourE.INFO:
    flavourIcon.value = 'i-mdi-warning-circle'
    flavourContainerClass.value = 'border-2 border-solid border-bcGovBlue-500 bg-bcGovBlue-200'
    break
  case AlertsFlavourE.MESSAGE:
    flavourIcon.value = null
    flavourContainerClass.value = 'border-2 border-solid border-black'
    break
}

</script>
