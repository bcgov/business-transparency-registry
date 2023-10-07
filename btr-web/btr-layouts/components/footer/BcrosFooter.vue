<template>
  <footer id="bcros-main-footer" class="app-footer flex items-center min-h-[3.5rem]">
    <div class="container m-auto w-[1360px] max-w-full h-[30.5px]">
      <nav class="flex justify-between w-[1360px] max-w-full h-[30.5px] mx-auto">
        <ul class="p-0 list-none">
          <li class="inline-block mr-1">
            <a class="block py-1 px-2 text-white hover:underline" href="/">Home</a>
          </li>
          <li class="inline-block mr-1">
            <a class="block py-1 px-2 text-white hover:underline" href="https://www2.gov.bc.ca/gov/content/home/disclaimer" target="_blank">Disclaimer</a>
          </li>
          <li class="inline-block mr-1">
            <a class="block py-1 px-2 text-white hover:underline" href="https://www2.gov.bc.ca/gov/content/home/privacy" target="_blank">Privacy</a>
          </li>
          <li class="inline-block mr-1">
            <a class="block py-1 px-2 text-white hover:underline" href="https://www2.gov.bc.ca/gov/content/home/accessibility" target="_blank">Accessibility</a>
          </li>
          <li class="inline-block mr-1">
            <a class="block py-1 px-2 text-white hover:underline" href="https://www2.gov.bc.ca/gov/content/home/copyright" target="_blank">Copyright</a>
          </li>
        </ul>
        <UTooltip class="footer-tooltip mr-3 mt-1" :text="`Search UI v${appVersion}`">
          <div class="icon-container" role="img" tabindex="0">
            <UIcon class="text-2xl tooltip-icon" name="i-mdi-information-outline" />
          </div>
        </UTooltip>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
import pkg from '../../package.json'

export default {
  setup () {
    const appVersion = pkg.version
    return {
      appVersion
    }
  }
}
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
