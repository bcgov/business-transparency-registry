<template>
  <div id="bcros-person-details" class="bg-white h-[150px]">
    <div class="flex flex-wrap m-auto px-4 pt-5 w-full max-w-[1360px] text-bcGovGray-900">
      <div class="flex" data-cy="person-details-name">
        <UIcon class="mt-[2px] text-2xl" name="i-mdi-account" />
        <h2 class="font-bold ml-2 text-xl">
          {{ keycloak.kcUser.fullName }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const keycloak = useBcrosKeycloak()

</script>
