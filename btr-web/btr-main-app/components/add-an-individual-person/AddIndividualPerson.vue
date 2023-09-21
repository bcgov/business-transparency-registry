<template>
  <div class="flex-col w-full">
    <div>
      <p class="text-justify">To add a person to the transparency register of this business, enter their name and email address. A request will be
        sent to the person at
        their email address and they will have the ability to accept or decline the addition of their information to the transparency register of the
        business. If they accept, their information will automatically be added to the transparency register. If you don’t want to send an invitation,
        you can add the person’s transparency information manually.</p>
    </div>
    <div class="flex-col py-5">
      <label for="individual-full-name" class="font-bold py-5">Person’s Full Legal Name</label> (or English phonetic pronunciation for character based
      languages)
      <UInput id="individual-full-name" v-model="fullName" type="text" variant="none" class="bg-gray-100 border-b-2" />
    </div>
    <div class="">
      <span class="font-bold py-5">Email Address</span>
      <UInput v-model="email" type="text" variant="none" class="bg-gray-100 border-b-2" />
    </div>
    <div v-if="!showAddInfoManually" class="text-blue-700 py-5 align-middle">
      <a href=""  @click.prevent="showAddInfoManually=true" class="p-1 underline">Add transparency register information manually</a>
    </div>
    <template v-if="showAddInfoManually">
      <div class="text-blue-700 py-5 align-middle">
        <a href="" @click.prevent="showAddInfoManually=false" class="p-1 underline"><UIcon name="i-mdi-close" /> Cancel transparent register information</a>
      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-3">Beneficial Ownership Assessment</p>
        <p class="text-justify">
          Beneficial Ownership is determined by the control of of shares and/or votes at general meetings, and control of the right to elect, appoint,
          or remove directors of the business.

          Complete following assessment to determine this person’s beneficial ownership status.
        </p>

      </div>
      <div class="flex-col py-5">
        <p class="font-bold py-5">Control of Shares and Votes</p>
        <p class="text-justify">
          Enter the percentage of shares and/or shares entitled to votes at general meetings this person owns or ultimately controls (or can exercise
          ultimate effective control over).
        </p>

      </div>
      <div class="flex-col py-5">
        <UInput v-model="percentOfShares" placeholder="Percent of Shares" type="text" variant="none" class="w-1/5 bg-gray-100 border-b-2 my-5 p-2">
          <template #trailing><span class="text-gray-500 dark:text-gray-400 text-xs">%</span></template>
        </UInput>
        <UInput v-model="percentOfVotes" placeholder="Percent of Votes" type="text" variant="none" class="w-1/5 bg-gray-100 border-b-2 my-5 p-2">
          <template #trailing><span class="text-gray-500 dark:text-gray-400 text-xs">%</span></template>
        </UInput>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fullName = ref('')
const email = ref('')
const showAddInfoManually = ref(false)
const percentOfShares = ref<Number>(undefined)
const percentOfVotes = ref<Number>(undefined)
</script>

<style scoped>

</style>
