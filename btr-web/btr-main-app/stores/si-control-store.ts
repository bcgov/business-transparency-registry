import { type SiSchemaType } from '~/utils/si-schema/definitions'
import { type JointlyOrInConcertConnectionsI } from '~/interfaces/jointly-or-in-concert'
import { hasSharedControl } from '~/utils/significant-individual'
import { type BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import fileSIApi from '~/services/file-significant-individual'

export const useSiControlStore = defineStore('jointlyOrInConcert', () => {
  const { allActiveSIs } = storeToRefs(useSignificantIndividuals())

  const allActiveAndHaveControlSis = computed(
    (): SiSchemaType[] => allActiveSIs.value.filter(activeSi => hasSharedControl(activeSi))
  )
  // maps uuid of person and all of the associated person
  const actingJointlyAndInConcert: Ref<Map<string, JointlyOrInConcertConnectionsI>> = ref(new Map())

  const initActingJointlyOrInConcertFromBtrFiling = (btrFiling?: BtrFilingI, force: boolean = false) => {
    if (!btrFiling) {
      return
    }

    if (!actingJointlyAndInConcert.value || actingJointlyAndInConcert.value.size === 0 || force) {
      actingJointlyAndInConcert.value = fileSIApi.getCurrentControlConnections(btrFiling)
    }
  }

  watch(
    allActiveAndHaveControlSis,
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

      const notFoundUuids = Array.from(actingJointlyAndInConcert.value.keys()).filter(k => !foundUuids.includes(k))

      notFoundUuids.forEach((uuid: string) => {
        actingJointlyAndInConcert.value.delete(uuid)
      })

      // cleanup all the selected items after removed ones
      allActiveAndHaveControlSis.value.forEach((si: SiSchemaType) => {
        const siControl = actingJointlyAndInConcert.value.get(si.uuid)
        if (siControl) {
          siControl.sharesInConcert =
            siControl.sharesInConcert.filter(sic => !!allActiveSIs.value.find(asi => asi.uuid === sic.uuid))
          siControl.sharesJointly =
            siControl.sharesJointly.filter(sic => !!allActiveSIs.value.find(asi => asi.uuid === sic.uuid))
          siControl.votesInConcert =
            siControl.votesInConcert.filter(sic => !!allActiveSIs.value.find(asi => asi.uuid === sic.uuid))
          siControl.votesJointly =
            siControl.votesJointly.filter(sic => !!allActiveSIs.value.find(asi => asi.uuid === sic.uuid))
          siControl.directorsInConcert =
            siControl.directorsInConcert.filter(sic => !!allActiveSIs.value.find(asi => asi.uuid === sic.uuid))
          siControl.directorsJointly =
            siControl.directorsJointly.filter(sic => !!allActiveSIs.value.find(asi => asi.uuid === sic.uuid))
        }
      })
    }
  )

  return {
    actingJointlyAndInConcert,
    allActiveAndHaveControlSis,
    allActiveSIs,
    initActingJointlyOrInConcertFromBtrFiling
  }
})
