<template>
  <div :data-cy="'details-info-box_' + name">
    <strong v-if="title" class="font-bold italic" data-cy="details-info-box_title">
      {{ title }}
    </strong>
    <slot name="content">
      <p v-if="content" data-cy="details-info-box_content">
        {{ content }}
      </p>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  content: { type: String, default: '' }
})
</script>

<style lang="scss" scoped>
</style>
