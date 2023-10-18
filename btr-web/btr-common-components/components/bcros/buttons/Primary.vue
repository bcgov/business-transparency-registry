<template>
  <div class="flex">
    <slot>
      <!-- todo: add icon -->
      <button class="primary-button px-10 rounded-[4px]" @click="buttonAction">
        <span class="flex px-28 pt-5 pb-10 text-white">{{ buttonText }}</span>
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  buttonAction: {
    type: Function,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  buttonIcon: {
    type: String,
    required: false,
    default: ''
  },
  primary: {
    type: Boolean,
    required: false,
    default: false
  }
})

</script>

<!--&lt;!&ndash;// todo: add margins etc ...&ndash;&gt;-->
<!--<style scoped>-->
<!--.primary-button {-->
<!--  margin: 5px;-->
<!--  background-color: #1669BB;-->
<!--  font-family: "BC Sans Regular", serif;-->
<!--  font-size: 14px;-->
<!--  color: white;-->
<!--}-->
<!--</style>-->
