<template>
  <footer
    id="bcros-main-footer"
    class="flex items-center h-[56px] border-t-2 border-bcGovColor-navDivider bg-bcGovColor-footer text-sm"
    data-cy="footer"
  >
    <div class="m-auto px-4 h-[30.5px] w-full max-w-[1360px]">
      <nav class="flex flex-grow">
        <ul class="p-0 -ml-2 list-none">
          <li v-for="link in links" :key="link.text" class="inline-block mr-2 pr-2 border-r last:mr-0 last:border-r-0">
            <a
              class="block py-1 px-2 text-white hover:underline"
              :href="link.href"
              :target="link.newTab ? '_blank' : '_self'"
            >
              {{ link.text }}
            </a>
          </li>
        </ul>
        <div class="flex flex-auto justify-end">
          <BcrosTooltip
            id="footer-tooltip"
            class="mt-1"
            :text="`BTR UI v${appVersion}`"
            :popper="{
              placement: 'left',
              arrow: true
            }"
          >
            <div class="icon-container" role="img" aria-label="information">
              <UIcon class="text-2xl text-white" name="i-mdi-information-outline" />
            </div>
          </BcrosTooltip>
        </div>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{appVersion: string}>()

const links = [
  { text: 'Home', href: '/', newTab: false },
  { text: 'Release Notes', href: 'https://www.release-notes.bcregistry.gov.bc.ca', newTab: true },
  { text: 'Disclaimer', href: 'https://www2.gov.bc.ca/gov/content/home/disclaimer', newTab: true },
  { text: 'Privacy', href: 'https://www2.gov.bc.ca/gov/content/home/privacy', newTab: true },
  { text: 'Accessibility', href: 'https://www2.gov.bc.ca/gov/content/home/accessibility', newTab: true },
  { text: 'Copyright', href: 'https://www2.gov.bc.ca/gov/content/home/copyright', newTab: true }
]
</script>

<style scoped>
</style>
