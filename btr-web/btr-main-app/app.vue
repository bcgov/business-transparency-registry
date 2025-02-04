<script setup lang="ts">
const { globalErrors } = storeToRefs(useGlobalErrorsStore())
const { removeLastGlobalError } = useGlobalErrorsStore()
const showModal = ref(false)
const displayedError: Ref<GlobalErrorI> = ref(SomethingWentWrongError())

watch(globalErrors.value, (val) => {
  if (val.length > 0) {
    displayedError.value = val[val.length - 1]
    showModal.value = true
  }
})

const onErrorModalClose = () => {
  removeLastGlobalError()
}

</script>

<template>
  <div>
    <BcrosDialog
      v-model="showModal"
      :title="displayedError.title"
      prevent-close
      @close="onErrorModalClose"
    >
      <div class="flex-col">
        <div class="pb-10">
          {{ displayedError.message }}
        </div>
        <BcrosContactInfo
          v-if="displayedError.contactsInfo.length > 0"
          :contacts="displayedError.contactsInfo"
        />
      </div>
    </BcrosDialog>
  </div>
  <div class="bg-gray-100">
    <NuxtLayout>
      <NuxtPage class="my-10 text-gray-900 text-left" />
    </NuxtLayout>
  </div>
</template>
