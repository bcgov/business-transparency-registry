<template>
  <div>
    <BcrosHeader />
    <BcrosBreadcrumb v-if="crumbConstructors.length > 0" :crumb-constructors="crumbConstructors" />
    <BcrosBusinessDetails />
    <div class="mx-auto p-4 w-full max-w-bcroslg flex justify-center items-start">
      <div class="max-w-bcrosmd p-4">
        <slot />
      </div>
      <div class="hidden bcroslg:block p-4">
        <BcrosWidgetsFee :fees="fees" />
      </div>
    </div>
    <BcrosFooter :app-version="version" />
  </div>
</template>

<script setup lang="ts">
import { FeesI } from '../../btr-common-components/interfaces/fees-i'

const fees: FeesI[] = [
  { name: 'Significant Individual Change', amount: 0 },
  { name: 'Service Charge', amount: 2.04 }
]
const route = useRoute()
const crumbConstructors = computed(() => (route?.meta?.breadcrumbs || []) as (() => BreadcrumbI)[])

const version = useRuntimeConfig().public.version
</script>
