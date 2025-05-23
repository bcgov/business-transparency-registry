<script setup lang="ts">
import { type SiSchemaType } from '~/utils/si-schema/definitions'

const props = defineProps<{ individual: SiSchemaType, index: number }>()

const { allEditableSIs }: {
  allEditableSIs: Ref<SiSchemaType>
} = storeToRefs(useSignificantIndividuals())

const cessationDate: Ref<string | undefined> = ref(undefined)
const submitDate = () => {
  if (!cessationDate.value) {
    return
  }
  // update individual
  allEditableSIs.value[props.index].ui.showCeaseDateInput = false
  useSignificantIndividuals().filingCeaseSI(props.index, cessationDate.value)
}
const cancel = () => {
  allEditableSIs.value[props.index].ui.showCeaseDateInput = false
}
</script>

<template>
  <BcrosSection
    :border="true"
    rounded-top
    rounded-bottom
    :section-title="$t('labels.cessationDate')"
  >
    <div class="flex-col w-full">
      <BcrosInputsDateSelect
        name="cessationDate"
        :max-date="new Date()"
        :placeholder="$t('labels.endDate')"
        @selection="cessationDate = dateToString($event, 'YYYY-MM-DD')"
      />

      <div class="flex justify-end mt-3 space-x-3">
        <UButton
          class="px-10 py-3"
          color="primary"
          :label="$t('buttons.cancel')"
          variant="outline"
          data-cy="cease-cancel"
          @click="cancel()"
        />
        <UButton
          class="px-10 py-3"
          color="primary"
          :label="$t('buttons.done')"
          variant="solid"
          type="submit"
          data-cy="cease-done"
          @click="submitDate()"
        />
      </div>
    </div>
  </BcrosSection>
</template>
