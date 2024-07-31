<template>
  <div class="w-2/3 mr-2" :class="countries.length === 1 ? 'flex justify-center' : 'grid gap-x-1 grid-cols-2'">
    <UTooltip
      v-for="elem in countries"
      :key="elem.alpha_2"
      :text="getName(elem.alpha_2) || elem.alpha_2"
      :popper="{ arrow: true, placement: 'top' }"
    >
      <CountryFlag
        :country="elem.alpha_2"
        size="normal"
        style="margin-top: -5px"
      />
    </UTooltip>
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
</script>
