<template>
  <div
    class="grid grid-cols-12 gap-1 p-4"
    :class="flavourContainerClass"
    :role="flavourRole"
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

const props = withDefaults(
  defineProps<{
    flavour: AlertsFlavourE
  }>(),
  {
    flavour: AlertsFlavourE.MESSAGE
  }
)

const flavourIcon: Ref<string | null> = ref(null)
const flavourContainerClass = ref('')
const flavourIconClass = ref('')
const flavourRole = ref('none')

switch (props.flavour) {
  case AlertsFlavourE.ALERT:
    flavourIcon.value = 'i-mdi-alert'
    flavourIconClass.value = 'text-red-500'
    flavourContainerClass.value = 'border-2 border-red-500 bg-red-100'
    flavourRole.value = 'alert'
    break
  case AlertsFlavourE.SUCCESS:
    flavourIcon.value = 'i-mdi-success-circle'
    flavourContainerClass.value = 'border-2 border-green-500 bg-green-100'
    flavourRole.value = 'alert'
    break
  case AlertsFlavourE.WARNING:
    flavourIcon.value = 'i-mdi-alert'
    flavourIconClass.value = 'text-orange-500'
    flavourContainerClass.value = 'border-2 border-orange-500 bg-orange-100'
    flavourRole.value = 'alert'
    break
  case AlertsFlavourE.INFO:
    flavourIcon.value = 'i-mdi-alert'
    flavourIconClass.value = 'text-orange-500'
    flavourContainerClass.value = 'border-2 border-yellow-500 bg-yellow-50'
    flavourRole.value = 'note'
    break
  case AlertsFlavourE.MESSAGE:
    flavourIcon.value = null
    flavourContainerClass.value = 'border-0'
    break
}

</script>
