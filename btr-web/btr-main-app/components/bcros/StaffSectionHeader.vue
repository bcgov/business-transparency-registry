<script setup type="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="flex-none mr-7 w-full mb-2">
    <div class="font-bold min-w-[190px] px-8 py-4 bg-bcGovColor-gray2">
      <UIcon
        class="text-2xl align-bottom text-bcGovColor-footer"
        :name="icon"
      />
      <span>&nbsp;{{ title }}</span>
    </div>
  </div>
</template>
