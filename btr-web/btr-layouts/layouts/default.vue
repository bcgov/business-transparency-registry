<template>
  <div>
    <BcrosHeader />
    <slot />
    <BcrosFooter :app-version="appVersion" />
  </div>
</template>

<script setup lang="ts">
import pkg from '../../package.json'

const appVersion = pkg.version
</script>

<style scoped>

</style>
