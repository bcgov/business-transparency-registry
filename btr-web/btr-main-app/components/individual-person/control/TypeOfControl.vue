<template>
  <div :id="id" class="flex flex-col py-5">
    <div v-for="type in types" :key="type.value">
      <UCheckbox
        v-model="typeOfControl[type.value]"
        :name="type.value"
        :label="type.label"
        class="py-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const prop = defineProps({
  id: { type: String, required: true },
  modelValue: {
    type: Object as PropType<ControlTypeI>,
    default: () => ({
      registeredOwner: false,
      beneficialOwner: false,
      indirectControl: false
    })
  }
})

const { t } = useI18n()
const types = [
  { value: 'registeredOwner', label: t('labels.registeredOwner') },
  { value: 'beneficialOwner', label: t('labels.beneficialOwner') },
  { value: 'indirectControl', label: t('labels.indirectControl') }
]

const typeOfControl: Ref<ControlTypeI> = ref(prop.modelValue)

</script>
