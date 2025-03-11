<template>
  <div
    class="flex gap-1 px-7 py-5"
    :class="flavourContainerClass"
    :role="flavourRole"
    :data-cy="'alertsMessage:' + flavour"
  >
    <div class="flex">
      <slot name="icon">
        <UIcon
          v-if="flavourIcon"
          :class="flavourIconClass"
          class="text-xl float-right"
          :name="flavourIcon"
        />
      </slot>
    </div>
    <div class="flex-grow text-sm">
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
    flavourContainerClass.value = 'border border-red-500 bg-red-100'
    flavourRole.value = 'alert'
    break
  case AlertsFlavourE.SUCCESS:
    flavourIcon.value = 'i-mdi-success-circle'
    flavourContainerClass.value = 'border border-green-500 bg-green-100'
    flavourRole.value = 'alert'
    break
  case AlertsFlavourE.WARNING:
    flavourIcon.value = 'i-mdi-alert'
    flavourIconClass.value = 'text-orange-500'
    flavourContainerClass.value = 'border border-orange-500 bg-orange-100'
    flavourRole.value = 'alert'
    break
  case AlertsFlavourE.INFO:
    flavourIcon.value = 'i-mdi-alert'
    flavourIconClass.value = 'text-orange-500'
    flavourContainerClass.value = 'border border-yellow-500 bg-yellow-50'
    flavourRole.value = 'note'
    break
  case AlertsFlavourE.MESSAGE:
    flavourIcon.value = null
    flavourContainerClass.value = 'border-0'
    break
}

</script>
