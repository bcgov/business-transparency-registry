<template>
  <div id="bcros-business-details" class="bg-white h-[150px]" data-cy="business-details">
    <div class="grid grid-cols-2 m-auto px-4 pt-5 w-full max-w-[1360px] text-bcGovGray-900">
      <div class="col-auto" data-cy="business-details-name">
        <h2 class="font-bold text-xl">
          {{ currentBusinessName }}
        </h2>
        <span class="text-sm">{{ $t(`business.legalTypes.${currentBusiness.legalType}`) }}</span>
      </div>
      <div class="col-auto justify-self-end" data-cy="business-details-info">
        <dl class="text-sm">
          <template v-for="info in businessInfo" :key="info.term">
            <div class="flex mb-1">
              <dt class="font-bold mr-2">
                {{ info.term }}:
              </dt>
              <dd>{{ info.value }}</dd>
            </div>
          </template>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const route = useRoute()
const t = useNuxtApp().$i18n.t
const business = useBcrosBusiness()
const { currentBusiness, currentBusinessContact, currentBusinessName } = storeToRefs(business)

const businessInfo = ref([] as { term: string, value: string }[])
function updateBusinessDetails () {
  const isFirm = [BusinessTypeE.GP, BusinessTypeE.SP].includes(currentBusiness.value.legalType as BusinessTypeE)
  const identifierLabel = isFirm ? t('business.registrationNum') : t('business.incorporationNum')
  businessInfo.value = [
    { term: 'Business Number', value: currentBusiness.value.taxId || 'Not Available' },
    { term: identifierLabel, value: currentBusiness.value.identifier || 'Not Available' },
    { term: 'Email', value: currentBusinessContact.value.email || 'Not Available' },
    { term: 'Phone', value: currentBusinessContact.value.phone || 'Not Available' }
  ]
}
watch(currentBusiness, updateBusinessDetails)
watch(currentBusinessContact, updateBusinessDetails)

function loadComponentData (identifier: string) {
  business.loadBusiness(identifier)
  business.loadBusinessContact(identifier)
}
// watcher required because layouts start rendering before the route is initialized
watch(() => route.params.identifier as string, loadComponentData)
onBeforeMount(() => {
  // onBeforeMount required for refresh case (route will be set already so ^ watcher will not fire)
  if (route.params.identifier) {
    loadComponentData(route.params.identifier as string)
  }
})

</script>
