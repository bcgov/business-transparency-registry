<template>
  <div>
    <BcrosHeader />
    <div class="mx-auto px-4 w-full max-w-[1360px]">
      <slot />
    </div>
    <BcrosFooter :app-version="appVersion" />
  </div>
</template>

<script setup lang="ts">
import pkg from '../../package.json'

const appVersion = pkg.version
</script>

<style scoped>

</style>
