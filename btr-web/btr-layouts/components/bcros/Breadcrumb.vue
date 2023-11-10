<template>
  <div id="bcros-breadcrumb" class="bg-bcGovBlue-350">
    <div class="flex flex-wrap divide-x divide-white mx-auto py-[7px] px-4 h-[45px] w-full max-w-[1360px] text-white">
      <UButton
        class="mr-3 mt-[1px] px-1 h-[28px] w-[28px] rounded-full"
        color="white"
        icon="i-mdi-arrow-left"
        data-cy="crumb-back"
        @click="back()"
      />
      <div class="flex pl-2">
        <div v-for="crumb, i in breadcrumbs" :key="crumb.text" class="ml-1">
          <UButton
            :class="i === breadcrumbs.length - 1 ? 'pointer-events-none': 'underline'"
            color="white"
            :icon="i === breadcrumbs.length - 1 ? '': 'i-mdi-chevron-right'"
            :padded="false"
            size="xs"
            :trailing="true"
            variant="link"
            data-cy="crumb-link"
            @click="navigate(crumb)"
          >
            {{ crumb.text }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ crumbConstructors:(() => BreadcrumbI)[] }>()
const breadcrumbs = computed(() => props.crumbConstructors.map(getCrumb => getCrumb()))
const { redirect } = useBcrosNavigate()
const { push } = useRouter()

const back = () => {
  const crumbsLength = breadcrumbs.value.length
  const backCrumb = breadcrumbs.value[crumbsLength - 2]
  navigate(backCrumb)
}

const navigate = (breadcrumb: BreadcrumbI): void => {
  if (breadcrumb.to) {
    push(breadcrumb.to)
  } else if (breadcrumb.href) {
    redirect(breadcrumb.href)
  }
}

</script>

<style lang="scss" scoped>
//@import '@/assets/styles/theme.scss';
#breadcrumb {
  height: 45px;
  //background-color: $app-dk-blue;
  color: white;
  display: flex;
  align-items: center;
  li {
    margin-bottom: 0 !important;
  }
}
.back-btn {
  background-color: white;
  //color: $app-dk-blue;
}
.v-breadcrumbs li {
    align-items: center;
    display: inline-flex;
    font-size: 14px;
}
.breadcrumb-text {
  font-size: 0.8125rem !important;
  color: white;
}
.breadcrumb-col {
  display: flex;
  align-items: center;
}
.active-crumb {
  text-decoration: underline !important;
  cursor: pointer !important;
}
.inactive-crumb {
  cursor: default !important; // To override default or local link styling
}
.text-primary{
  color: #1669bb!important;
}

@media(min-width:960px) {
.container {
  max-width: 900px
}
}

@media(min-width:1264px) {
.container {
  max-width: 1185px
}
}

@media(min-width:1904px) {
.container {
  max-width: 1785px
}
}

.container {
    max-width: 1360px;
}

:deep(.v-breadcrumbs .v-breadcrumbs__divider) {
  color: white !important;
  margin-bottom: 0;
}
:deep(.theme--bcgov.v-btn.v-btn--disabled) {
  opacity: .4;
  .v-icon {
    //color: $app-blue !important;
  }
}
:deep(.v-btn--icon.v-btn--density-default) {
  height: 28px;
  width: 28px;
}
</style>
