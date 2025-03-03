<script setup lang="ts">

export type PaginationProps = {
  page: number,
  perPage: number
}

const perPageOptions = [1, 5, 10, 25, 50, 100]
const model = defineModel({ type: Object as PropType<PaginationProps>, required: true })

const emit = defineEmits<{(e: 'pageChange'): void }>()

defineProps({
  totalResults: { type: Number, required: true }
})

const changePage = function (increment: Number) {
  model.value.page += increment
  emit('pageChange')
}

</script>

<template>
  <div class="flex space-x-4 leading-[40px]">
    <div class="leading-[40px] align-middle">
      Rows per page:
    </div>

    <USelect
      v-model="model.perPage"
      size="sm"
      :options="perPageOptions"
      :ui="{
        base: 'h-[40px] mb-[8px] align-middle'
      }"
      @update:model-value="emit('pageChange')"
    />

    <div class="leading-[40px] align-middle">
      {{ (model.page * model.perPage)-model.perPage+1 }} - {{ model.page*model.perPage }} of {{ totalResults }}
    </div>
    <div class="leading-[40px] align-middle">
      <UButton
        :disabled="model.page === 1"
        variant="ghost"
        icon="i-mdi-chevron-left"
        @click="changePage(-1)"
      />
    </div>
    <div class="leading-[40px] align-middle">
      <UButton
        :disabled="model.page*model.perPage >= totalResults"
        icon="i-mdi-chevron-right"
        variant="ghost"
        @click="changePage(1)"
      />
    </div>
  </div>
</template>
