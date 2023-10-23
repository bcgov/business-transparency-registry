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
            {{ t('header.title') }}
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
              {{ t('header.buttons.createAccount') }}
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">

const { t } = useI18n()

const isAuthenticated = ref(true)
const username = ref('Developer Test')
const accountName = ref('Ministry of Citizen Services')

const goToLogin = () => { isAuthenticated.value = true }
const goToLogout = () => { isAuthenticated.value = false }
const goToHome = () => {}
const goToCreateAccount = () => {}

const loginOptions = [
  { label: t('header.menus.labels.bcsc'), icon: 'i-mdi-account-card-details-outline', action: goToLogin },
  { label: 'BCeID', icon: 'i-mdi-two-factor-authentication', action: goToLogin },
  { label: 'IDIR', icon: 'i-mdi-account-group-outline', action: goToLogin }
]

const loggedOutMenuOptions = [
  { header: t('header.menus.headers.selectLogin') },
  { items: loginOptions }
]

const basicAccountOptions = [
  { label: t('header.menus.labels.editProfile'), icon: 'i-mdi-account-outline' },
  { label: t('header.menus.labels.logOut'), icon: 'i-mdi-logout-variant', action: goToLogout }
]

const accountSettingsOptions = [
  { label: t('header.menus.labels.accountInfo'), icon: 'i-mdi-information-outline' },
  { label: t('header.menus.labels.teamMembers'), icon: 'i-mdi-account-group-outline' },
  { label: t('header.menus.labels.transactions'), icon: 'i-mdi-file-document-outline' }
]

const switchAccountOptions = [
  { label: 'Ministry of Citizen Services', icon: 'i-mdi-check', setActive: true },
  { label: 'Ministry of Testing' },
  { label: 'Web Developers' }
]

const createOptions = [
  { label: t('header.menus.labels.createAccount'), icon: 'i-mdi-plus' }
]

const loggedInMenuOptions = [
  { items: basicAccountOptions },
  { header: t('header.menus.headers.accountSettings'), items: accountSettingsOptions },
  { header: t('header.menus.headers.switchAccount'), items: switchAccountOptions },
  { items: createOptions }
]
</script>

<style scoped>
</style>
