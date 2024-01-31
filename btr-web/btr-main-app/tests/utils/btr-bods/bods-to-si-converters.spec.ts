import { describe, expect } from 'vitest'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import { SignificantIndividualI } from '~/interfaces/significant-individual-i'
import { getSIsFromBtrBodsSubmission } from '~/utils/btr-bods/bods-to-si-converters'
import { btrSubmissionExampleMock, expectedSisOutput } from '~/tests/mocks/btrSubmissionExample'

describe('getSIsFromBtrBodsSubmission', () => {
  it('should return the list of SignificantIndividual', () => {
    const submission: { payload: BtrFilingI } = btrSubmissionExampleMock
    const expectedResult: SignificantIndividualI[] = expectedSisOutput

    const result = getSIsFromBtrBodsSubmission(submission.payload)

    expect(result).deep.equal(expectedResult)
  })
})
