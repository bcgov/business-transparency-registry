<template>
  <div class="grid grid-cols-1 shadowIt">
    <div v-if="hasHeader">
      <slot name="header" />
    </div>
    <div v-if="hasDefault">
      <slot name="default" />
    </div>
    <div v-if="hasFooter">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const slots = useSlots()
const hasHeader = !!slots.header
const hasDefault = !!slots.default
const hasFooter = computed(() => {
  const footerSlot = slots.footer?.()
  return footerSlot && footerSlot.length > 0
})
</script>

<style scoped lang="scss">
.shadowIt {
  box-shadow: rgba(0, 0, 0, 0.2) 0 3px 1 px - 2 px, rgba(0, 0, 0, 0.14) 0 2px 2px 0, rgba(0, 0, 0, 0.12) 0 1px 5px 0;
}
</style>
