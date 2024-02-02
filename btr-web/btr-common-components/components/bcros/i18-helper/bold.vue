<template>
  <span :data-cy="'i18n-bold-helper-' + translationPath" v-html="textToDisplay"></span>
</template>

<script setup lang="ts">
const props = defineProps({
  translationPath: { type: String, required: true }
})

const { t } = useI18n()

const text = t(props.translationPath as string, {
  boldStart: '{b}',
  boldEnd: '{/b}'
})

const textToDisplay = text.replace(
  /\{b\}(.*?)\{\/b\}/g,
  '<strong>$1</strong>'
)
</script>
