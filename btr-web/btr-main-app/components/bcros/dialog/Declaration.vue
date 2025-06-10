<script setup lang="ts">
import { DeclarationTypeE } from '@/enums/declaration-type-e'

const t = useI18n().t

/* eslint-disable func-call-spacing */
const emit = defineEmits<{
  (e: 'declarationSet', declaration: DeclarationTypeE): void
  (e: 'update:showDeclarationModal', value: boolean): void
}>()
/* eslint-enable func-call-spacing */

const props = defineProps<{
  declarationInitialValue: DeclarationTypeE,
  showDeclarationModal: boolean
}>()

const modalDeclarationValue = ref<DeclarationTypeE>(props.declarationInitialValue)
const declarationError = ref<boolean>(false)

const localModalState = computed({
  get: () => props.showDeclarationModal,
  set: value => emit('update:showDeclarationModal', value)
})

const submitDeclarationValue = () => {
  const correctValues = [
    DeclarationTypeE.self,
    DeclarationTypeE.parent,
    DeclarationTypeE.lawyer,
    DeclarationTypeE.none
  ]

  const isValidDeclaration = correctValues.includes(modalDeclarationValue.value)
  declarationError.value = !isValidDeclaration

  if (declarationError.value) {
    // if errors do not allow to submit
    return
  }
  emit('declarationSet', modalDeclarationValue.value)
  localModalState.value = false
}
</script>

<template>
  <BcrosDialog
    v-model="localModalState"
    :title="$t('sectionTitles.declaration')"
    prevent-close
  >
    <div class="flex-col" data-cy="declaration-modal">
      <div class="pb-10" data-cy="declaration-modal-title">
        {{ $t('sectionTitles.declaration') }}
      </div>
      <IndividualPersonDeclaration
        :error="declarationError"
        :declaration-init-value="declarationInitialValue"
        @declaration-change="modalDeclarationValue=$event"
        @declaration-error="declarationError=$event"
      />
    </div>
    <template #footer>
      <div class="flex w-full pt-10">
        <div data-cy="declaration-modal-buttons" class="flex mx-auto mt-1 gap-3">
          <UButton
            size="xl"
            class="px-10 py-3 font-bold text-[16px]"
            variant="outline"
            color="primary"
            data-cy="declaration-modal-button-cancel"
            @click="localModalState=false"
          >
            {{ t('buttons.cancel') }}
          </UButton>
          <UButton
            size="xl"
            class="px-10 py-3 font-bold text-[16px]"
            color="primary"
            data-cy="declaration-modal-button-confirm"
            @click="submitDeclarationValue"
          >
            {{ t('buttons.submit') }}
          </UButton>
        </div>
      </div>
    </template>
  </BcrosDialog>
</template>

<style scoped>

</style>
