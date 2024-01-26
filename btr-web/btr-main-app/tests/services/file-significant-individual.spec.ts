import { describe, expect } from 'vitest'
import { testSI } from '../utils/mockedData'

import { OwnershipOrControlStatements as expectedOutput } from './expected-ouptuts'

import FilingService from '~/services/file-significant-individual'

describe('File significant individuals service Tests', () => {
  it('getPersonAndOwnershipAndControlStatements', () => {
    const testExpectedOutput = expectedOutput
    const result = FilingService.getPersonAndOwnershipAndControlStatements(
      {
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
  })
})
