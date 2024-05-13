<template>
  <div
    class="w-full"
    :class="showSectionHasErrors ? 'border-l-[3px] border-red-500' : ''"
  >
    <div v-if="showHeader" class="w-full">
      <slot name="header-content">
        <div class="flex flex-col w-full bg-white px-8">
          <div class="flex flex-row w-full pt-2.5 items-center">
            <UIcon :name="headerIconName" class="text-bcGovColor-footer text-xl" />
            <span class="pl-2.5 font-bold min-w-[190px] text-l">{{ headerText }}</span>
          </div>
          <div class="border-b-[1px] border-solid border-bcgovColor-specialityDottedLines" />
        </div>
      </slot>
    </div>
    <div v-if="showContent" class="px-8 py-10 mb-0.5 bg-white rounded flex flex-row w-full">
      <slot name="section-title">
        <div class="flex-none w-40 mr-7">
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
  sectionTitle: { type: String, required: false, default: undefined },
  headerIconName: { type: String, required: false, default: undefined },
  headerText: { type: String, required: false, default: undefined }
})
const showHeader = computed(() => !!slots['header-content'] || !!props.headerIconName || !!props.headerText)
const showContent = computed(() => !!props.sectionTitle || !!slots.default || !!slots['section-title'])
</script>
