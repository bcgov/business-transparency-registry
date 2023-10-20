<template>
  <div
    id="bcros-main-header"
    class="bg-bcGovColor-header border-b-2 border-bcGovColor-navDivider"
  >
    <div
      id="bcros-main-header__container"
      class="flex flex-wrap content-center m-auto px-4 h-[68px] w-full max-w-[1360px]"
    >
      <nav id="bcros-main-header__container__actions" class="flex flex-wrap content-center h-[50px] w-full">
        <a id="bcros-main-header__container__actions__home-redirect" class="flex" @click="goToHome()">
          <picture>
            <source media="(max-width:600px)" srcset="@/assets/images/gov_bc_logo_vert.png">
            <img src="@/assets/images/gov_bc_logo_horiz.png" alt="Government of British Columbia Logo">
          </picture>
          <span
            class="flex flex-wrap content-center font-bold ml-5 text-white text-lg"
            style="letter-spacing: -.03rem;"
          >
            BC Registries and Online Services
          </span>
        </a>
        <div
          id="bcros-main-header__container__actions__menus"
          class="flex flex-auto justify-end h-full text-white"
        >
          <div v-if="isAuthenticated" class="flex flex-wrap self-center text-sm">
            <BcrosHeaderMenu :menu-lists="loggedInMenuOptions">
              <template #menu-button-text>
                <BcrosHeaderAccountLabel :account-name="accountName" :username="username" />
              </template>
              <template #menu-list-header-0>
                <div class="flex px-4 mb-3">
                  <BcrosHeaderAccountLabel
                    :avatar-classes="'text-white'"
                    :account-name="accountName"
                    :username="username"
                  />
                </div>
              </template>
            </BcrosHeaderMenu>
          </div>
          <div v-else class="flex flex-wrap self-center text-sm h-[36px]">
            <BcrosHeaderMenu :menu-button-text="'Log in'" :menu-lists="loggedOutMenuOptions" />
            <button class="text-white ml-2 p-2 hover:bg-bcGovColor-activeBlue/[0.2]" @click="goToCreateAccount()">
              Create account
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">

const isAuthenticated = ref(true)
const username = ref('Developer Test')
const accountName = ref('Ministry of Citizen Services')

const goToLogin = () => { isAuthenticated.value = true }
const goToLogout = () => { isAuthenticated.value = false }
const goToHome = () => {}
const goToCreateAccount = () => {}

const loginOptions = [
  { label: 'BC Services Card', icon: 'i-mdi-account-card-details-outline', action: goToLogin },
  { label: 'BCeID', icon: 'i-mdi-two-factor-authentication', action: goToLogin },
  { label: 'IDIR', icon: 'i-mdi-account-group-outline', action: goToLogin }
]

const loggedOutMenuOptions = [
  { header: 'Select login method' },
  { items: loginOptions }
]

const basicAccountOptions = [
  { label: 'Edit Profile', icon: 'i-mdi-account-outline' },
  { label: 'Log out', icon: 'i-mdi-logout-variant', action: goToLogout }
]

const accountSettingsOptions = [
  { label: 'Account Info', icon: 'i-mdi-information-outline' },
  { label: 'Team Members', icon: 'i-mdi-account-group-outline' },
  { label: 'Transactions', icon: 'i-mdi-file-document-outline' }
]

const switchAccountOptions = [
  { label: 'Ministry of Citizen Services', icon: 'i-mdi-check', setActive: true },
  { label: 'Ministry of Testing' },
  { label: 'Web Developers' }
]

const createOptions = [
  { label: 'Create Account', icon: 'i-mdi-plus' }
]

const loggedInMenuOptions = [
  { items: basicAccountOptions },
  { header: 'Account Settings', items: accountSettingsOptions },
  { header: 'Switch Account', items: switchAccountOptions },
  { items: createOptions }
]
</script>

<style scoped>
</style>
