<script setup lang="ts">
import { DeclarationTypeE } from '@/enums/declaration-type-e'

/* eslint-disable func-call-spacing */
const emit = defineEmits<{
  (e: 'declarationChange', declaration: DeclarationTypeE): void,
  (e: 'declarationError', error: boolean): void
}>()

const props = defineProps<{
  declarationInitValue: DeclarationTypeE,
  error: boolean
}>()

const declaration = ref(props.declarationInitValue)
const inError = ref(props.error)

watch(() => props.error, (newVal) => {
  if (newVal) {
    inError.value = true
  }
})

const setDeclaration = (declarationType: DeclarationTypeE) => {
  if (declaration.value === declarationType) {
    declarationType = DeclarationTypeE.not_selected
  }

  inError.value = false
  if (declaration.value !== DeclarationTypeE.not_selected && declarationType === DeclarationTypeE.not_selected) {
    inError.value = true
  }

  declaration.value = declarationType
  emit('declarationError', inError.value)
  emit('declarationChange', declaration.value)
}

</script>

<template>
  <div>
    <p class="pb-5">
      {{ $t('texts.declaration') }}
    </p>
    <p class="pb-5">
      {{ $t('texts.declaration2') }}
    </p>
    <p v-if="inError" class="text-red-500">
      {{ $t('errors.validation.declaration') }}
    </p>
    <UButtonGroup orientation="vertical" class="space-y-2" :ui="{ rounded: 'rounded-none' }">
      <UButton
        :color="declaration === DeclarationTypeE.self ? 'primary' : 'gray'"
        variant="solid"
        class="px-6 py-3"
        data-cy="declaration-button-me"
        :ui="{ rounded: 'rounded-none' }"
        @click="setDeclaration(DeclarationTypeE.self)"
      >
        <div class="flex items-center">
          <div class="inline mr-2">
            <UIcon name="i-mdi-account-circle" class="w-[40px] h-[40px]" />
          </div>
          <span>{{ $t('buttons.declaration.self') }}</span>
        </div>
      </UButton>
      <UButton
        :color="declaration === DeclarationTypeE.parent ? 'primary' : 'gray'"
        variant="solid"
        data-cy="declaration-button-parent"
        class="px-6 py-3"
        :ui="{ rounded: 'rounded-none' }"
        @click="setDeclaration(DeclarationTypeE.parent)"
      >
        <div class="flex items-center justify-start">
          <div class="inline mr-2">
            <UIcon name="i-mdi-human-male-child" class="w-[40px] h-[40px]" />
          </div>
          <span>{{ $t('buttons.declaration.parent') }}</span>
        </div>
      </UButton>
      <UButton
        :color="declaration === DeclarationTypeE.lawyer ? 'primary' : 'gray'"
        variant="solid"
        data-cy="declaration-button-lawyer"
        class="px-6 py-3"
        :ui="{ rounded: 'rounded-none' }"
        @click="setDeclaration(DeclarationTypeE.lawyer)"
      >
        <div class="flex items-center">
          <div class="inline mr-2">
            <UIcon name="i-mdi-scale-balance" class="w-[40px] h-[40px]" />
          </div>
          <span>{{ $t('buttons.declaration.lawyer') }}</span>
        </div>
      </UButton>
      <UButton
        :color="declaration === DeclarationTypeE.none ? 'primary' : 'gray'"
        variant="solid"
        data-cy="declaration-button-none"
        class="px-6 py-3"
        :ui="{ rounded: 'rounded-none' }"
        @click="setDeclaration(DeclarationTypeE.none)"
      >
        <div class="flex items-center">
          <div class="inline mr-2">
            <UIcon name="i-mdi-domain" class="w-[40px] h-[40px]" />
          </div>
          <span>{{ $t('buttons.declaration.none') }}</span>
        </div>
      </UButton>
    </UButtonGroup>
  </div>
</template>
