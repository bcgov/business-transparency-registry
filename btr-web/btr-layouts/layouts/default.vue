<template>
  <div>
    <BcrosHeader />
    <BcrosBreadcrumb v-if="crumbConstructors.length > 0" :crumb-constructors="crumbConstructors" />
    <div class="mx-auto px-4 w-full max-w-[1360px]">
      <slot />
    </div>
    <BcrosButtonControl :left-buttons="leftButtons" :right-buttons="rightButtons" />
    <BcrosFooter :app-version="version" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const crumbConstructors = computed(() => (route?.meta?.breadcrumbs || []) as (() => BreadcrumbI)[])
const leftButtons = computed(() => (route?.meta?.buttonControl?.leftButtons || []) as (() => ButtonControlI)[])
const rightButtons = computed(() => (route?.meta?.buttonControl?.rightButtons || []) as (() => ButtonControlI)[])

const version = useRuntimeConfig().public.version
</script>

<style scoped>

</style>
