<script setup lang="ts">
type NameInfoT = {
  legalName?: string
  alternateName?: string
  birthDate?: string
}
defineProps<{ icon?: string, item: NameInfoT }>()
</script>

<template>
  <div class="flex space-x-1">
    <div>
      <UIcon v-if="icon" class="text-xl" :name="icon" />
    </div>
    <div class="flex flex-col">
      <span v-if="item.legalName">{{ item.legalName }}</span>
      <BcrosDetailsInfoBox
        v-if="item.alternateName"
        class="info-section"
        title="Preferred Name"
        :content="item.alternateName"
      />
      <BcrosDetailsInfoBox
        v-if="item.birthDate"
        class="info-section"
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
