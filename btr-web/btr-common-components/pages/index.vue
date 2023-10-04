<!-- BCROS INPUT FIELDS component examples-->
<template>
<div class="m-10">
  <BcrosEmailField id="bla-bla" v-model="testVal" />
  {{ testVal }}
</div>
</template>

<script setup lang="ts">
const testVal = ref()
</script>

<style scoped>

</style>
