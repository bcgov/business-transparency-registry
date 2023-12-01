import { describe, expect, it } from 'vitest'
import { setActivePinia, createPinia, storeToRefs } from 'pinia'
import { testSI } from '../utils/mockedData'
import { useSignificantIndividuals } from '@/stores/significant-individuals'

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
    const identifier = 'BC1234567'
    await significantIndividuals.filingInit(identifier)
    expect(currentSIFiling.value.businessIdentifier).toBe(identifier)
    expect(currentSIFiling.value.effectiveDate).toBe(null)
    // FUTURE: call mocked and returning a list of existing SIs
    expect(currentSIFiling.value.significantIndividuals).toEqual([])
  })

  it('adds a new significant individual to the filing as expected', async () => {
    const identifier = 'BC1234567'
    await significantIndividuals.filingInit(identifier)
    significantIndividuals.filingAddSI(testSI)
    // FUTURE: call mocked and returning a list of existing SIs
    expect(currentSIFiling.value.significantIndividuals).toEqual([testSI])
  })
})
