<script setup lang='ts'>
defineProps<{ comment: object | string }>()

const formatDate = function (date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'long'
  }
  return new Date(date).toLocaleDateString('en-US', options)
}
</script>

<template>
  <div v-if="typeof comment === 'string'">
    <p class="my-2 font-bold">
      {{ comment }}
    </p>
  </div>
  <div v-else class="px-8 my-8 py-10 bg-bcGovColor-lightBlue">
    <div class="italic mb-6">
      <UIcon name="i-mdi-message-text-outline" class="mr-8 w-6 h-6" />
      <span class="h-6 align-super leading-6">
        {{ comment.user?.first }} {{ comment.user?.last }} - {{ formatDate(comment.createdAt) }}
      </span>
    </div>
    <p class="mb-2 ml-8 pl-6">
      {{ comment.text }}
    </p>
  </div>
</template>
