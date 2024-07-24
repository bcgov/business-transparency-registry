<template>
  <div
    class="w-full"
    :class="[
      showSectionHasErrors ? 'border-l-[3px] border-red-500' : '',
      border ? 'border border-gray-100' : '',
      noTopBorder ? 'border-t-0' : '',
      noBotBorder ? 'border-b-0' : 'b',
      roundedTop ? 'rounded-t' : '',
      roundedBot ? 'rounded-b' : ''
    ]"
  >
    <div
      v-if="showHeader"
      class="w-full"
    >
      <slot name="header-content">
        <div
          class="flex flex-col w-full bg-white px-8 pt-2.5"
          :class="{
            'rounded-t': roundedTop,
            'rounded-b': roundedBot && !showContent,
          }"
        >
          <div class="flex flex-row w-full pt-4 items-center">
            <UIcon :name="headerIconName" class="text-bcGovColor-footer text-xl" />
            <span class="pl-2.5 font-bold min-w-[190px] text-l">{{ headerTitle }}</span>
          </div>
          <div class="border-b-[1px] pt-4 border-solid border-bcgovColor-specialityDottedLines" />
          <p class="pt-4">
            {{ headerText }}
          </p>
        </div>
      </slot>
    </div>
    <div
      v-if="showContent"
      class="px-8 py-10 mb-0.5 bg-white flex flex-row w-full"
      :class="{
        'rounded-t': roundedTop && !showHeader,
        'rounded-b': roundedBot,
      }"
    >
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
  headerTitle: { type: String, required: false, default: undefined },
  headerText: { type: String, required: false, default: undefined },

  roundedTop: { type: Boolean, required: false, default: false },
  roundedBot: { type: Boolean, required: false, default: false },

  border: { type: Boolean, required: false, default: false },
  noTopBorder: { type: Boolean, required: false, default: false },
  noBotBorder: { type: Boolean, required: false, default: false }
})

const showHeader = computed(
  () => !!slots['header-content'] || !!props.headerIconName || !!props.headerTitle || !!props.headerText
)
const showContent = computed(() => !!props.sectionTitle || !!slots.default || !!slots['section-title'])
</script>
