<template>
  <div data-cy="person-layout">
    <BcrosHeader :person-mode="true" />
    <BcrosBreadcrumb v-if="crumbConstructors.length > 0" :crumb-constructors="crumbConstructors" />
    <BcrosPersonDetails />
    <div class="mx-auto px-4 w-full max-w-[1360px]">
      <slot />
    </div>
    <BcrosFooter :app-version="version" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const crumbConstructors = computed(() => (route?.meta?.breadcrumbs || []) as (() => BreadcrumbI)[])

const version = useRuntimeConfig().public.version
</script>

<style scoped>

</style>
