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
      class="mb-0.5 bg-white flex w-full"
      :class="{
        'rounded-t': roundedTop && !showHeader,
        'rounded-b': roundedBot,
        'flex-col': sectionTitleFull,
        'flex-row': !sectionTitleFull,
        'px-8': paddedX,
        'py-10': paddedY && !paddedTop,
        'pt-10': paddedTop
      }"
    >
      <slot name="section-title">
        <div
          class="flex-none mr-7"
          :class="{
            'w-40': !sectionTitleFull,
            'w-full': sectionTitleFull
          }"
        >
          <span class="font-bold min-w-[190px] mt-3" :class="showSectionHasErrors ? 'text-red-500' : ''">
            <UIcon
              v-if="sectionTitleIcon"
              class="text-2xl align-bottom"
              :name="sectionTitleIcon"
              :class="sectionIconColor ? sectionIconColor : ''"
            />
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
  sectionTitleIcon: { type: String, required: false, default: undefined },
  sectionIconColor: { type: String, required: false, default: '' },

  headerIconName: { type: String, required: false, default: undefined },
  headerTitle: { type: String, required: false, default: undefined },
  headerText: { type: String, required: false, default: undefined },

  roundedTop: { type: Boolean, required: false, default: false },
  roundedBot: { type: Boolean, required: false, default: false },

  border: { type: Boolean, required: false, default: false },
  noTopBorder: { type: Boolean, required: false, default: false },
  noBotBorder: { type: Boolean, required: false, default: false },
  paddedX: { type: Boolean, required: false, default: true },
  paddedY: { type: Boolean, required: false, default: true },
  paddedTop: { type: Boolean, required: false, default: false }
})

const sectionTitleFull = computed(
  () => typeof props.sectionTitleIcon === 'string' && props.sectionTitleIcon !== ''
)

const showHeader = computed(
  () => !!slots['header-content'] || !!props.headerIconName || !!props.headerTitle || !!props.headerText
)
const showContent = computed(() => !!props.sectionTitle || !!slots.default || !!slots['section-title'])
</script>
