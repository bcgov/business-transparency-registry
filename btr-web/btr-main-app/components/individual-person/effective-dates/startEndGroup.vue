<template>
  <div class="w-full flex flex-row items-center gap-4 relative">
    <div class="absolute inset-0 bg-black bg-opacity-25 z-50 rounded" v-if="highlightRow"></div>
    <div class="grow grid grid-cols-2 items-center gap-4">
      <div class="flex-grow">
        <BcrosInputsDateSelect
          :name="name + '.startDate'"
          :initial-date="dateStringToDate(startDate || '') || undefined"
          :max-date="new Date()"
          :placeholder="$t('placeholders.dateSelect.startDate')"
        />
      </div>
      <div class="flex-grow">
        <BcrosInputsDateSelect
          :class="{'bg-blue-500': highlightRow}"
          v-if="isShow2ndDate"
          :name="name + '.endDate'"
          :initial-date="dateStringToDate(endDate || '') || undefined"
          :min-date="startDate"
          :max-date="new Date()"
          :removable="isLast"
          :placeholder="$t('placeholders.dateSelect.endDate')"
          @remove-control="removeEndDate"
        />
        <UButton
          v-else
          icon="i-mdi-plus-box-outline"
          variant="ghost"
          :label="$t('labels.addEndDate')"
          @click="show2ndDate()"
        />
      </div>
    </div>
    <div class="grow-0 z-100">
      <UButton
        class="text-2xl text-bcGovColor-lightGray"
        icon="i-mdi-delete"
        variant="ghost"
        @mouseover="highlightRow=true"
        @mouseleave="highlightRow=false"
        @click.stop.prevent="$emit('remove-dates')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const startDate = defineModel<string | undefined>('startDate')
const endDate = defineModel<string | undefined>('endDate')

defineEmits<{ (e: 'remove-dates', value: void): void }>()

const isAdd2ndDate = ref(false)

const show2ndDate = () => { isAdd2ndDate.value = true}
const removeEndDate = () => {
  isAdd2ndDate.value = false;
  endDate.value = undefined
}

const isShow2ndDate = computed(() => isAdd2ndDate.value || !!endDate.value)

const highlightRow = ref(false)

defineProps<{
  name: string,
  isLast: boolean
}>()
</script>

<style lang="scss" scoped>
.transp {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, .5);
  width: 100%;
  height: 100%;
}
</style>
