<template>
  <UTooltip
    :id="id"
    ref="tooltipRef"
    :text="text"
    :popper="popper"
    tabindex="0"
    @focus="showTooltipPopup"
    @blur="closeTooltipPopup"
  >
    <slot />
    <template #text>
      <slot name="tooltip-text" />
    </template>
  </UTooltip>
</template>

<script setup lang="ts">
import { PopperOptions } from '#ui/types'

defineProps<{
  text: string
  popper: PopperOptions
}>()

const tooltipRef = ref()

function showTooltipPopup () {
  if (tooltipRef.value) {
    tooltipRef.value.onMouseOver()
  }
}

function closeTooltipPopup () {
  if (tooltipRef.value) {
    tooltipRef.value.onMouseLeave()
  }
}
</script>

<style scoped>
</style>
