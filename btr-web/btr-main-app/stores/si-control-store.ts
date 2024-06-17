import { defineStore } from 'pinia'
import { ComputedRef, Ref } from 'vue'
import { SiSchemaType } from '~/utils/si-schema/definitions'
import { JointlyOrInConcertConnectionsI } from '~/interfaces/jointly-or-in-concert'
import { hasSharedControl } from '~/utils/significant-individual'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import fileSIApi from '~/services/file-significant-individual'

export const useSiControlStore = defineStore('jointlyOrInConcert', () => {
  const { currentSIFiling } = storeToRefs(useSignificantIndividuals())

  const allActiveSis: ComputedRef<Array<SiSchemaType>> = computed(
    () => currentSIFiling.value.significantIndividuals.filter(
      (si: SiSchemaType) => si.ui.action !== FilingActionE.REMOVE
    )
  )

  const allActiveAndHaveControlSis: ComputedRef<Array<SiSchemaType>> = computed(
    () => allActiveSis.value.filter(activeSi => hasSharedControl(activeSi))
  )
  // maps uuid of person and all of the associated person
  const actingJointlyAndInConcert: Ref<Map<string, JointlyOrInConcertConnectionsI>> = ref(new Map())

  const initActingJointlyOrInConcertFromBtrFiling = (btrFiling: BtrFilingI, force: boolean = false) => {
    if (!actingJointlyAndInConcert.value || actingJointlyAndInConcert.value.size === 0 || force) {
      actingJointlyAndInConcert.value = fileSIApi.getCurrentControlConnections(btrFiling)
    }
  }

  watchEffect(
    () => currentSIFiling,
    () => {
      const foundUuids: string[] = []
      allActiveAndHaveControlSis.value.forEach((si: SiSchemaType) => {
        foundUuids.push(si.uuid)
        if (!actingJointlyAndInConcert.value.has(si.uuid)) {
          const newConnections: JointlyOrInConcertConnectionsI = {
            sharesInConcert: [],
            sharesJointly: [],
            votesInConcert: [],
            votesJointly: [],
            directorsInConcert: [],
            directorsJointly: []
          }
          actingJointlyAndInConcert.value.set(si.uuid, newConnections)
        } // else do nothing
      })

      const notFoundUuids = Array.from(actingJointlyAndInConcert.value.keys()).filter(k => foundUuids.indexOf(k) === -1)

      notFoundUuids.forEach((uuid: string) => {
        actingJointlyAndInConcert.value.delete(uuid)
      })
    },
    {
      immediate: true,
      deep: true
    }
  )

  return {
    actingJointlyAndInConcert,
    allActiveAndHaveControlSis,
    allActiveSis,
    initActingJointlyOrInConcertFromBtrFiling
  }
})
