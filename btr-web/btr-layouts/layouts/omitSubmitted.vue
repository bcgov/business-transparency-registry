<template>
  <div class="h-screen flex flex-col" data-cy="omit-layout-submitted">
    <BcrosCustomHeader />
    <BcrosBreadcrumb v-if="crumbConstructors.length > 0" :crumb-constructors="crumbConstructors" />
    <div class="mx-auto px-4 w-full max-w-bcroslg flex-grow">
      <slot />
    </div>
    <BcrosCustomFooter :app-version="version" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const crumbConstructors = computed(() => (route?.meta?.breadcrumbs || []) as (() => BreadcrumbI)[])

const version = useRuntimeConfig().public.version
</script>

<style scoped>

</style>
