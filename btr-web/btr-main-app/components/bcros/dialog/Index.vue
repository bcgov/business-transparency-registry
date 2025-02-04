<script setup lang="ts">
const dialogOpen = defineModel<boolean>()
const props = defineProps<{
  name?: string,
  attach?: string,

  title?: string,
}>()
const emit = defineEmits<{(e: 'close'): void }>()
const close = () => {
  dialogOpen.value = false
  emit('close')
}
const dataCyName = props.name ? `-${props.name}` : ''
</script>

<template>
  <UModal
    v-model="dialogOpen"
    :data-cy="'bcros-dialog' + dataCyName"
  >
    <div class=" bg-white rounded-lg shadow-lg p-10 flex-col w-[600px]">
      <slot name="header">
        <div :data-cy="'bcros-dialog-header' + dataCyName" class="flex w-full text-[24px] pb-10">
          <span class="font-bold">
            {{ title }}
          </span>
          <UButton
            size="xl"
            color="primary"
            class="ml-auto"
            icon="i-heroicons-x-mark-20-solid"
            variant="ghost"
            :data-cy="'bcros-dialog-header' + dataCyName + '-close-btn'"
            @click="close"
          />
        </div>
      </slot>

      <div class="w-full text-[16px]">
        <slot name="default">
          <div :data-cy="'bcros-dialog-body' + dataCyName" class="flex-1 w-full" />
        </slot>
      </div>

      <slot name="footer">
        <div class="flex w-full pt-10">
          <div :data-cy="'bcros-dialog-footer' + dataCyName" class="flex mx-auto mt-1">
            <UButton
              size="xl"
              class="px-10 py-3 font-bold text-[16px]"
              color="primary"
              :label="$t('buttons.close')"
              @click="close"
            />
          </div>
        </div>
      </slot>
    </div>
  </UModal>
</template>
