<template>
  <div
    class="w-full"
    :class="showSectionHasErrors ? 'border-l-[3px] border-red-500' : ''"
  >
    <div v-if="showHeader" class="w-full">
      <slot name="header-content" />
    </div>
    <div v-if="showContent" class="px-8 py-10 bg-white rounded flex flex-row w-full">
      <slot name="section-title">
        <div class="flex-none w-40">
          <span class="font-bold min-w-[190px] mt-3" :class="showSectionHasErrors ? 'text-red-500' : ''">
            {{ sectionTitle }}
          </span>
        </div>
      </slot>
      <slot name="default" />
    </div>
  </div>
</template>

<script setup lang="ts">
const slots = useSlots()
const props = defineProps({
  showSectionHasErrors: { type: Boolean, required: false, default: false },
  sectionTitle: { type: String, required: false, default: undefined }
})

const showHeader = computed(() => !!slots['header-content'])
const showContent = computed(() => !!props.sectionTitle || !!slots['default'] || !!slots['section-title'])
</script>
