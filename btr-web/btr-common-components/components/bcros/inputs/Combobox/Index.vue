<template>
  <UFormGroup
    v-slot="{ error }"
    :name="name"
    :help="help"
    class="flex flex-col min-h-fit"
    :data-cy="name + '.select'"
  >
    <USelectMenu
      v-model="model"
      searchable
      selected-icon=""
      :searchable-placeholder="searchPlaceholder"
      class="w-full"
      :options="items"
      multiple
      :by="keyAttribute"
      :search-attributes="searchAttributes"
      @change="$emit('value-changed', model)"
    >
      <UButton
        class="w-full min-h-[56px] h-fit flex items-center relative"
        variant="combobox"
        :data-cy="name + `ComboboxButton`"
      >
        <span
          v-if="model && model.length === 0"
          class="w-full text-left"
          :class="`text-${ !!error ? 'red-500' : 'gray-700' }`"
        >
          {{ labelPlaceholder }}
        </span>
        <div v-else class="flex flex-col">
          <span v-if="floatingLabel !== ''" class="text-left pl-2">{{ floatingLabel }}</span>
          <div>
            <BcrosChips
              v-for="(item, index) in model"
              :key="index"
              :label="labelFunction(item)"
              class="float-left z-20"
              :has-close="true"
              :data-cy="name + `ComboboxChip`"
              @chipCloseClicked="removeItem(item)"
            />
          </div>
        </div>
        <UIcon
          name="i-heroicons-chevron-down-20-solid"
          class="w-5 h-5 text-gray-700 ml-auto flex-shrink-0"
        />
      </UButton>
      <template #option="{ option: item }">
        <div class="w-full pl-2 pr-2">
          <span>{{ labelFunction(item) }}</span>
          <span v-if="isInSelected(item)" class="float-right">
            <UIcon name="i-mdi-check" />
            {{ $t('labels.combobox.selected') }}
          </span>
          <span v-else class="float-right">
            <UIcon name="i-mdi-add" />
            {{ $t('labels.combobox.select') }}
          </span>
        </div>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>

<script setup lang="ts">
import { type UseEventBusReturn } from '@vueuse/core'

const formBus = inject<UseEventBusReturn<any, string> | undefined>('form-events', undefined)

defineEmits<{(e: 'value-changed', value: any): void}>()
const model = defineModel({ type: Array as PropType<any[]>, required: true })
const props = defineProps({
  name: { type: String, default: 'name' },
  help: { type: String, default: '' },
  labelFunction: { type: Function as PropType<(arg: any) => string>, default: (arg: any) => String(arg) },
  items: { type: Array as PropType<any[]>, required: true },
  searchPlaceholder: { type: String, default: '' },
  labelPlaceholder: { type: String, default: '' },
  floatingLabel: { type: String, default: '' },
  keyAttribute: { type: String, required: true },
  searchAttributes: { type: Array<String>, required: true }
})
watch(model, () => {
  formBus?.emit({ type: 'blur', path: props.name })
  formBus?.emit({ type: 'change', path: props.name })
}, { deep: true })

const isInSelected = (item: any) => {
  return model.value?.findIndex(selectedItem => selectedItem[props.keyAttribute] === item[props.keyAttribute]) !== -1
}
const removeItem = (item: any) => {
  const index = model.value.indexOf(item)
  if (index > -1) {
    model.value.splice(index, 1)
    model.value = [...model.value]
  }
}
</script>
