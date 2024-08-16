<script setup lang="ts">
import { SiSchemaType } from '~/utils/si-schema/definitions'

const props = defineProps<{ individual: SiSchemaType, index: number }>()

const { allEditableSIs } = storeToRefs(useSignificantIndividuals())

const currentDateGrp: Ref<{ startDate?: string, endDate?: string }> = ref({})
const currentDateGrps = ref(props.individual.effectiveDates.filter(dateGrp => !dateGrp.endDate))
onMounted(() => {
  if (currentDateGrps.value.length > 0) {
    if (currentDateGrps.value.length > 1) {
      // should never get here
      console.error('More than one current date group for individual')
    }
    currentDateGrp.value = currentDateGrps.value[0]
  }
})

props.individual.effectiveDates.filter(dateGrp => !dateGrp.endDate)
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
      <!-- NOTE: adding min date time so that it shows correctly for pacific time
       (otherwise since startDate has no time / tz info so it defaults to 12am GMT in the date picker) -->
      <BcrosInputsDateSelect
        name="cessationDate"
        :min-date="currentDateGrp.startDate ? currentDateGrp.startDate + 'T08:00:00' : undefined"
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
