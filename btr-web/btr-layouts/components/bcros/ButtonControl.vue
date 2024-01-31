<template>
  <div id="bcros-button-control" class="bg-white pt-8 pb-[60px]" data-cy="button-control">
    <div class="grid grid-cols-2 m-auto px-4 w-full max-w-[1360px]">
      <div v-if="leftButtons" class="flex gap-4">
        <UButton
          v-for="button, i in leftButtons"
          :key="'left-button-' + i"
          class="px-4 py-3"
          :color="button.color || 'primary'"
          :icon="button.icon || ''"
          :label="button.label"
          :trailing="button.trailing || false"
          :variant="button.variant || 'solid'"
          data-cy="button-control-left-button"
          @click="button.action()"
        />
      </div>
      <div class="col-auto justify-self-end">
        <div v-if="rightButtons" class="flex gap-4">
          <UButton
            v-for="button, i in rightButtons"
            :key="'right-button-' + i"
            class="px-4 py-3"
            :class="button.class"
            :color="button.color || 'primary'"
            :icon="button.icon || ''"
            :label="button.label"
            :loading="button.loading || false"
            :trailing="button.trailing || false"
            :variant="button.variant || 'solid'"
            data-cy="button-control-right-button"
            @click="button.action()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  leftButtonConstructors?:(() => ButtonControlI)[],
  rightButtonConstructors?:(() => ButtonControlI)[]
}>()

const leftButtons = computed(() => props.leftButtonConstructors?.map(getBtn => getBtn()) || [])
const rightButtons = computed(() => props.rightButtonConstructors?.map(getBtn => getBtn()) || [])
</script>
