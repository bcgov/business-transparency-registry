<template>
  <div id="bcros-person-details" class="bg-white h-[150px]">
    <div class="flex flex-wrap m-auto px-4 w-full max-w-[1360px]">
      <div class="flex mt-5" data-cy="person-details-name">
        <UIcon class="mt-[2px] text-2xl" name="i-mdi-account" />
        <span class="font-bold ml-2 text-xl">
          {{ keycloak.kcUser.fullName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const keycloak = useBcrosKeycloak()

</script>
