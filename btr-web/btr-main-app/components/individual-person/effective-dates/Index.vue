<template>
  <div class="w-full flex flex-col">
    <StartEndGroup
      :is-last="true"
      v-model:startDate="startDate"
      v-model:endDate="endDate"
      name="pair1"
    />
  </div>
</template>

<script setup lang="ts">
import StartEndGroup from '~/components/individual-person/effective-dates/startEndGroup.vue'

const startDate = ref()
const endDate = ref()
</script>
