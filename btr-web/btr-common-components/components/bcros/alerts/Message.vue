<template>
  <div
    class="grid grid-cols-12 gap-1 p-3 m-3"
    :class="flavourContainerClass"
    :role="flavour"
    :data-cy="'alertsMessage:' + flavour"
  >
    <div class="py-3 px-0">
      <slot name="icon">
        <UIcon
          v-if="flavourIcon"
          :class="flavourIconClass"
          class="mt-[2px] text-2xl float-right"
          :name="flavourIcon"
        />
      </slot>
    </div>
    <div class="p-2 col-span-11">
      <slot name="default" />
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
    flavourIconClass.value = 'text-bcGovRed-500'
    flavourContainerClass.value = 'border-2 border-bcGovRed-500 bg-bcGovRed-100'
    break
  case AlertsFlavourE.SUCCESS:
    flavourIcon.value = 'i-mdi-success-circle'
    flavourContainerClass.value = 'border-2 border-bcGovGreen-500 bg-bcGovGreen-100'
    break
  case AlertsFlavourE.WARNING:
    flavourIcon.value = 'i-mdi-warning-circle'
    flavourContainerClass.value = 'border-2 border-bcGovOrange-500 bg-bcGovOrange-100'
    break
  case AlertsFlavourE.INFO:
    flavourIcon.value = 'i-mdi-warning-circle'
    flavourContainerClass.value = 'border-2 border-solid border-bcGovBlue-500 bg-bcGovBlue-100'
    break
  case AlertsFlavourE.MESSAGE:
    flavourIcon.value = null
    flavourContainerClass.value = 'border-2 border-solid border-black'
    break
}

</script>
