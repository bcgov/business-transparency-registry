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
    <div v-if="item.address" class="flex">
      <div>
        <UIcon class="text-[20px]" name="i-mdi-email-outline" />
      </div>
      <BcrosAddressDisplay class="ml-1" :address="item.address" />
    </div>
    <div v-if="item.phoneNumber" class="flex">
      <div>
        <UIcon class="text-[20px]" name="i-mdi-phone" />
      </div>
      <div class="ml-1">
        {{ item.phoneNumber.countryCallingCode ?
          '+ ' + item.phoneNumber.countryCallingCode
          : ''
        }}
        {{ displayPhoneNumber(item.phoneNumber.number) }}
      </div>
    </div>
    <div v-if="item.tax" class="flex">
      <div>
        <UIcon class="text-[20px]" name="i-mdi-bank-outline" />
      </div>
      <div class="ml-1">
        <BcrosDetailsInfoBox
          class="mb-2"
          title="Tax Residency"
          :content="taxResidency"
        />
        <div v-if="item.tax.taxNumber">
          {{ item.tax.taxNumber }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type PhoneNumberT = {
  countryCallingCode?: string,
  number?: string
}

type TaxT = {
  taxNumber?: string
}

type SearchResultI = {
  email?: string,
  address?: object,
  phoneNumber?: PhoneNumberT,
  tax?: TaxT,
  isTaxResident?: boolean
}

const prop = defineProps<{ item: SearchResultI }>()
const taxResidency = !prop.item.isTaxResident ? 'Other' : 'Canada'
const displayPhoneNumber = (num: string) => num.replace(/(\s{3})(\s{3})(\s{4})/, '($1) $2-$3')
</script>

<style lang="scss" scoped>
.information > div:not(:first-child) {
  margin-top: 8px;
}
.information-icon {
  @apply mr-1 text-[20px]
}
</style>
