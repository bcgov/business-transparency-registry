<template>
  <div data-cy="omit-layout">
    <BcrosHeader />
    <BcrosBreadcrumb v-if="crumbConstructors.length > 0" :crumb-constructors="crumbConstructors" />
    <div class="mx-auto px-4 w-full max-w-bcroslg">
      <slot />
    </div>
    <BcrosButtonControl
      :left-button-constructors="leftButtonConstructors"
      :right-button-constructors="rightButtonConstructors"
    />
    <BcrosFooter :app-version="version" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const crumbConstructors = computed(() => (route?.meta?.breadcrumbs || []) as (() => BreadcrumbI)[])

const version = useRuntimeConfig().public.version

const leftButtonConstructors = computed(() => {
  return route?.meta?.buttonControl?.leftButtons || [] as (() => ButtonControlI)[]
})
const rightButtonConstructors = computed(() => {
  return route?.meta?.buttonControl?.rightButtons || [] as (() => ButtonControlI)[]
})
</script>

<style scoped>

</style>
