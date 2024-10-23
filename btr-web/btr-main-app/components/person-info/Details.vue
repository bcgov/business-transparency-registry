<template>
  <div class="information">
    <!-- NB: if the UIcons are not wrapped in dev they render at differring sizes -->
    <div v-if="item.email" class="flex">
      <div>
        <UIcon class="text-[20px]" name="i-mdi-at" />
      </div>
      <div class="ml-1 overflow-auto">
        {{ item.email }}
      </div>
    </div>
    <div v-if="showAddress" class="flex">
      <div>
        <UIcon class="text-[20px]" name="i-mdi-map-marker-outline" />
      </div>
      <BcrosAddressDisplay class="ml-1" :address="item.address" />
    </div>
    <div v-if="showMailingAddress" class="flex">
      <div>
        <UIcon class="text-[20px]" name="i-mdi-email-outline" />
      </div>
      <BcrosAddressDisplay class="ml-1" :address="item.mailingAddress.address" />
    </div>
    <div v-if="item.phoneNumber && item.phoneNumber.number" class="flex">
      <div>
        <UIcon class="text-[20px]" name="i-mdi-phone" />
      </div>
      <div class="ml-1">
        {{
          item.phoneNumber.countryCallingCode ?
            '+ ' + item.phoneNumber.countryCallingCode
            : ''
        }}
        {{ displayPhoneNumber(item.phoneNumber.number) }}
      </div>
    </div>
    <div v-if="item.tax || taxResidency" class="flex">
      <div>
        <UIcon class="text-[20px]" name="i-mdi-bank-outline" />
      </div>
      <div class="ml-1">
        <BcrosDetailsInfoBox
          v-if="taxResidency"
          class="mb-2"
          title="Tax Residency"
          :content="taxResidency"
        />
        <div v-if="item.tax?.taxNumber">
          {{ item.tax.taxNumber }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SiSchemaType } from '~/utils/si-schema/definitions'

const prop = defineProps<{ item: SiSchemaType }>()

const t = useNuxtApp().$i18n.t

const taxResidency: Ref<string | undefined> = ref(undefined)
if (prop.item.isTaxResident !== undefined) {
  taxResidency.value = prop.item.isTaxResident
    ? t('summaryTable.body.taxResidency.canada')
    : t('summaryTable.body.taxResidency.other')
}
const displayPhoneNumber = (num: string) => num.replace(/(\s{3})(\s{3})(\s{4})/, '($1) $2-$3')

const showAddress = computed(() => {
  if (!prop.item.address) {
    return false
  }
  let rv = prop.item.address.country && (prop.item.address.country.alpha_2 || prop.item.address.country.name)
  rv = rv || prop.item.address.city
  rv = rv || prop.item.address.line1
  rv = rv || prop.item.address.locationDescription
  rv = rv || prop.item.address.postalCode
  rv = rv || prop.item.address.region
  return rv
})

const showMailingAddress = computed(() => {
  if (!prop.item.mailingAddress.address) {
    return false
  }
  let rv = prop.item.mailingAddress.address.country &&
    (prop.item.mailingAddress.address.country.alpha_2 || prop.item.mailingAddress.address.country.name)
  rv = rv || prop.item.mailingAddress.address.city
  rv = rv || prop.item.mailingAddress.address.line1
  rv = rv || prop.item.mailingAddress.address.locationDescription
  rv = rv || prop.item.mailingAddress.address.postalCode
  rv = rv || prop.item.mailingAddress.address.region
  return rv
})

</script>

<style lang="scss" scoped>
.information > div:not(:first-child) {
  margin-top: 8px;
}

.information-icon {
  @apply mr-1 text-[20px]
}
</style>
