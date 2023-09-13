<template>
  <!--  todo: fixme -->
  <div id="bcros-main-header" class="flex bcros-background px-10 h-[70px] items-center">
    <a class="float-left flex items-center justify-center" href="/">
      <picture>
        <source media="(max-width:600px)" srcset="@/assets/images/gov_bc_logo_vert.png">
        <img src="@/assets/images/gov_bc_logo_horiz.png" alt="Government of British Columbia Logo">
      </picture>
      <h1 class="text-white text-xl my-2 ml-5 font-bold">BC Registries and Online Services</h1>
    </a>
    <div id="header-actions" class="float-right flex h-full">
      <BcrosButtonPrimary button-text="Btn1" :button-action="()=>{}" />
      <BcrosButtonPrimary button-text="Btn2" :button-action="()=>{}" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.bcros-background {
  background-color: #003366;
  border-bottom: 2px solid #fcba19;
}

</style>
