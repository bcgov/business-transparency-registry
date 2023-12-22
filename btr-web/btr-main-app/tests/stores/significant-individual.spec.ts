import { describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia, storeToRefs } from 'pinia'
import { testSI } from '../utils/mockedData'
import { useSignificantIndividuals } from '@/stores/significant-individuals'
import fileSIApi from '@/services/file-significant-individual'

describe('Business Store Tests', () => {
  setActivePinia(createPinia())
  const significantIndividuals = useSignificantIndividuals()
  const { currentSIFiling, currentSavedSIs } = storeToRefs(significantIndividuals)

  beforeEach(() => { currentSIFiling.value = {} })

  it('renders default state/getters as expected', () => {
    expect(currentSIFiling.value).toEqual({})
    expect(currentSavedSIs.value).toEqual([])
  })

  it('initializes a new significant individuals filing as expected', async () => {
    fileSIApi.getCurrentOwners = vi.fn(() => {
      return { data: [testSI], errors: [] }
    })

    const identifier = 'BC1234567'
    await significantIndividuals.filingInit(identifier)
    expect(currentSIFiling.value.businessIdentifier).toBe(identifier)
    expect(currentSIFiling.value.effectiveDate).toBe(null)
    // FUTURE: call mocked and returning a list of existing SIs
    expect(currentSIFiling.value.significantIndividuals).toEqual([testSI])
  })

  it('adds a new significant individual to the filing as expected', async () => {
    const identifier = 'BC1234567'
    const startingSI = { ...testSI }
    startingSI.profile.name = 'starting si name'
    delete startingSI.action
    // FUTURE: call mocked and returning a list of existing SIs
    currentSavedSIs.value = [startingSI]
    await significantIndividuals.filingInit(identifier)
    significantIndividuals.filingAddSI(testSI)
    // ensure it is ahead of the 'current' one
    expect(currentSIFiling.value.significantIndividuals).toEqual([testSI, startingSI])
    // add another one and ensure it is behind the 1st added one, but still ahead of the 'current' one
    const newTestSI = { ...testSI }
    newTestSI.profile.fullName = 'Test Name 2'
    significantIndividuals.filingAddSI(newTestSI)
    expect(currentSIFiling.value.significantIndividuals).toEqual([testSI, newTestSI, startingSI])
  })
})
