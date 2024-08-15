<script setup lang="ts">
type ActionBtnT = {
  action: (val?: any) => any,
  actionArg?: any,
  disabled: boolean,
  icon?: string,
  label: string
}

defineProps<{ button: ActionBtnT, dropdownItems?: ActionBtnT[] }>()

</script>

<template>
  <div class="flex flex-nowrap justify-end overflow-hidden mt-2">
    <UButton
      :ui="{
        rounded: 'rounded-none focus-visible:rounded-md',
        padding: { default: 'py-0' }
      }"
      class="border-r-[1px] border-gray-400"
      :icon="button.icon"
      :label="button.label"
      variant="ghost"
      :disabled="button.disabled"
      data-cy="action-button"
      @click="button.action(button.actionArg)"
    />
    <UPopover v-if="dropdownItems" :popper="{ placement: 'bottom-end' }">
      <UButton
        :ui="{ padding: { default: 'py-0' } }"
        icon="i-mdi-menu-down"
        aria-label="show more options"
        variant="ghost"
        :disabled="button.disabled"
        data-cy="popover-button"
      />
      <template #panel>
        <UButton
          v-for="dropdownItem in dropdownItems"
          :key="dropdownItem.label"
          :ui="{ padding: { default: 'py-0' } }"
          class="m-2"
          :icon="dropdownItem.icon"
          :label="dropdownItem.label"
          color="primary"
          variant="ghost"
          data-cy="popover-action-button"
          @click="dropdownItem.action(button.actionArg)"
        />
      </template>
    </UPopover>
  </div>
</template>
