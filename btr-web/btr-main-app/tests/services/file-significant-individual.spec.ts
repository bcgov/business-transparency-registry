import { describe, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { testSI } from '../utils/mockedData'
import { OwnershipOrControlStatements as expectedOutput } from './expected-ouptuts'
import { useSiControlStore } from '~/stores/si-control-store'

import FilingService from '~/services/file-significant-individual'

describe('File significant individuals service Tests', () => {
  it('getPersonAndOwnershipAndControlStatements', () => {
    setActivePinia(createPinia())
    const store = useSiControlStore()
    // fake inControl table setting the values for connected individuals
    store.actingJointlyAndInConcert.set('001', {
      sharesInConcert: [{ uuid: '002', legalName: 'Another test name' }],
      directorsInConcert: [],
      directorsJointly: [],
      sharesJointly: [],
      votesInConcert: [],
      votesJointly: []
    })

    const mockDate = new Date(2024, 0, 26)
    vi.setSystemTime(mockDate)
    const testExpectedOutput = expectedOutput
    testExpectedOutput.personStatements[0].statementDate = todayIsoDateString()
    testExpectedOutput.ownershipOrControlStatements[0].statementDate = todayIsoDateString()
    const result = FilingService.getPersonAndOwnershipAndControlStatements(
      {
        noSignificantIndividualsExist: false,
        businessIdentifier: 'BC123123',
        certified: false,
        effectiveDate: '2020-02-20',
        folioNumber: 'This, is, Folio!!!',
        significantIndividuals: [testSI]
      })

    expect(result).toBeTruthy()
    testExpectedOutput.ownershipOrControlStatements[0].interestedParty.describedByPersonStatement =
      result.ownershipOrControlStatements[0].interestedParty.describedByPersonStatement as string
    testExpectedOutput.ownershipOrControlStatements[0].statementID =
      result.ownershipOrControlStatements[0].statementID
    testExpectedOutput.personStatements[0].statementID = result.personStatements[0].statementID

    expect(result).toEqual(testExpectedOutput)
    vi.setSystemTime(new Date())
  })
})
