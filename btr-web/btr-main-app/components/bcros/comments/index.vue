<script setup lang='ts'>
import { watch } from 'vue'
import { formatDate } from '~/utils/date-utils'
const props = defineProps<{ comments: [object] }>()

const displayComments = ref([])

watch(() => props.comments, () => {
  try {
    const sortedComments = [...props.comments]
    sortedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    displayComments.value = []
    let date = null
    for (const comment of sortedComments) {
      if (!date || new Date(comment.createdAt) < date) {
        date = new Date(comment.createdAt).setHours(0, 0, 0, 0)
        displayComments.value.push(formatDate(date, false))
      }
      displayComments.value.push(comment)
    }
  } catch (e) {
    displayComments.value = []
  }
})

</script>

<template>
  <div v-for="(comment, index) in displayComments" :key="comment.id">
    <hr v-if="index > 0 && typeof comment === 'string'" class="mb-8"></hr>
    <BcrosCommentsComment
      :comment="comment"
    />
  </div>
</template>
