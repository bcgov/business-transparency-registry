<template>
  <!-- eslint-disable-next-line -->
  <span :data-cy="'i18n-link-helper-' + translationPath" v-html="textToDisplay" />
</template>

<script setup lang="ts">
const props = defineProps({
  translationPath: { type: String, required: true }
})

const t = useNuxtApp().$i18n.t

const text = t(props.translationPath as string, {
  linkStart: '{a}',
  linkEnd: '{/a}'
})

const textToDisplay = text.replace(
  /\{a\}text="(.*?)" url="(.*?)"\{\/a\}/g,
  '<a href="$2" style="text-decoration: underline" target="_blank">$1</a>'
)
</script>
