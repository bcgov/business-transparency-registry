<template>
  <footer id="bcros-main-footer" class="flex items-center h-[56px] border-t-2 border-yellow-400 bg-blue-900 text-sm">
    <div class="container m-auto w-[1360px] max-w-full h-[30.5px]">
      <nav class="flex justify-between">
        <ul class="p-0 list-none">
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
        <UTooltip id="footer-tooltip" class="mr-3 mt-1" :text="`BTR UI v${appVersion}`">
          <div class="icon-container" role="img" tabindex="0">
            <UIcon class="text-2xl text-white" name="i-mdi-information-outline" />
          </div>
        </UTooltip>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{appVersion: string}>()

const links = [
  { text: 'Home', href: '/', newTab: false },
  { text: 'Disclaimer', href: 'https://www2.gov.bc.ca/gov/content/home/disclaimer', newTab: true },
  { text: 'Privacy', href: 'https://www2.gov.bc.ca/gov/content/home/privacy', newTab: true },
  { text: 'Accessibility', href: 'https://www2.gov.bc.ca/gov/content/home/accessibility', newTab: true },
  { text: 'Copyright', href: 'https://www2.gov.bc.ca/gov/content/home/copyright', newTab: true }
]
</script>

<style scoped>
</style>
