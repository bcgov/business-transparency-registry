<template>
  <div class="w-2/3 mr-2" :class="countries.length === 1 ? 'flex justify-center' : 'grid gap-x-1 grid-cols-2'">
    <BcrosCountryFlag
      v-for="elem in countries"
      :key="elem.alpha_2"
      :country-code-iso2letter="get2LetterCode(elem.alpha_2)"
      :tooltip-text="getNameSC(elem.alpha_2) || elem.alpha_2"
    />
  </div>
</template>

<script setup lang="ts">
import { getName } from 'country-list'

type CountryT = {
  alpha_2: string,
  name: string
}

const prop = defineProps<{ nationalities: Array<CountryT> }>()
const countries = prop.nationalities ?? []

const get2LetterCode = function (countryCodeAlpha2: string): string {
  // handle Perminent Resident special case
  if (countryCodeAlpha2 === 'CA_PR') {
    return 'CA'
  }

  return countryCodeAlpha2
}

const getNameSC = function (countryCodeAlpha2: string): string {
  // handle Perminent Resident special case
  if (countryCodeAlpha2 === 'CA_PR') {
    return 'Canada (Permanent Resident)'
  } else if (countryCodeAlpha2 === 'CA') {
    return 'Canada (Citizen)'
  }

  return getName(countryCodeAlpha2)
}

</script>
