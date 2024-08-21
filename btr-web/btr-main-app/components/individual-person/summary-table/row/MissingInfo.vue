<script setup lang="ts">
const props = defineProps<{ missingInfo: string }>()

const isExpanded = ref(false)
const isExpandable = computed(() => props.missingInfo.length > 200)
const missingInfoDisplay = computed(() => {
  if (isExpanded.value) {
    return props.missingInfo
  }
  return props.missingInfo.substring(0, 200)
})
</script>

<template>
  <BcrosDetailsInfoBox :title="$t('labels.unableToObtainOrConfirmInformation.stepsTaken')">
    <template #content>
      <p>
        <span data-cy="missing-info-text">{{ missingInfoDisplay }}</span>
        <span v-if="isExpandable && !isExpanded">...</span>
        <UButton
          v-if="isExpandable"
          class="ml-1 font-semibold align-self-bottom"
          color="primary"
          :label="isExpanded ? $t('buttons.less') : $t('buttons.more')"
          :padded="false"
          variant="link"
          data-cy="missing-info-toggle-btn"
          @click="isExpanded = !isExpanded"
        />
      </p>
    </template>
  </BcrosDetailsInfoBox>
</template>
