<template>
  <footer id="bcros-main-footer" class="app-footer flex items-center h-[56px]">
    <div class="container m-auto w-[1360px] max-w-full h-[30.5px]">
      <nav class="flex justify-between">
        <ul class="p-0 list-none">
          <li v-for="link in links" :key="link.text" class="inline-block mr-1">
            <a class="block py-1 px-2 text-white hover:underline" :href="link.href" :target="link.newTab ? '_blank' : '_self'">
              {{ link.text }}
            </a>
          </li>
        </ul>
        <UTooltip id="footer-tooltip" class="footer-tooltip mr-3 mt-1" :text="`Search UI v${appVersion}`">
          <div class="icon-container" role="img" tabindex="0">
            <UIcon class="text-2xl tooltip-icon" name="i-mdi-information-outline" />
          </div>
        </UTooltip>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { appVersion } = defineProps({
  appVersion: {
    type: String,
    required: true,
    default: ''
  }
})

const links = [
  { text: 'Home', href: '/', newTab: false },
  { text: 'Disclaimer', href: 'https://www2.gov.bc.ca/gov/content/home/disclaimer', newTab: true },
  { text: 'Privacy', href: 'https://www2.gov.bc.ca/gov/content/home/privacy', newTab: true },
  { text: 'Accessibility', href: 'https://www2.gov.bc.ca/gov/content/home/accessibility', newTab: true },
  { text: 'Copyright', href: 'https://www2.gov.bc.ca/gov/content/home/copyright', newTab: true }
]
</script>

<style scoped>
.app-footer {
  border-top: 2px solid #fcba19;
  background-color: #003366;
  font-size: 0.9735rem;
}

.tooltip-icon {
  color: #8099b3;
}

@media (min-width: 960px) {
  nav {
    li {
      margin-right: 0.5rem;
      padding-right: 0.5rem;
      border-right: 1px solid #4d7094;
      a {
        padding: 0.25rem 0.5rem;
      }
    }

    li:last-child {
      margin-right: 0;
      border-right: none;
    }
  }
}
</style>
