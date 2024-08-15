<script setup lang="ts">
type BadgeT = {
  label: string
  class?: string
  colour?: string
}
type NameInfoT = {
  legalName?: string
  alternateName?: string
  birthDate?: string
  class?: string
}
defineProps<{ badges?: BadgeT[], icon?: string, item: NameInfoT }>()
</script>

<template>
  <div class="flex space-x-1">
    <div v-if="icon">
      <UIcon class="text-xl" :name="icon" />
    </div>
    <div class="flex flex-col">
      <span v-if="item.legalName" :class="item.class">{{ item.legalName }}</span>
      <div v-if="!!badges" class="flex space-x-2" data-cy="name-badge">
        <UBadge
          v-for="badge in badges"
          :key="badge.label"
          class="flex-none font-semibold mt-3"
          :class="badge.class"
          :label="badge.label"
          :color="badge.colour || 'primary'"
          variant="solid"
        />
      </div>
      <BcrosDetailsInfoBox
        v-if="item.alternateName"
        class="info-section"
        :class="item.class"
        title="Preferred Name"
        :content="item.alternateName"
      />
      <BcrosDetailsInfoBox
        v-if="item.birthDate"
        class="info-section"
        :class="item.class"
        title="Born"
        :content="item.birthDate"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-section {
  margin-top: 10px;
}

.birthdate {
  font-size: smaller;
}
</style>
