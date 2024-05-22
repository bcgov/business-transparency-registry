import { describe, expect } from 'vitest'
import { BtrFilingI } from '~/interfaces/btr-bods/btr-filing-i'
import { btrSubmissionExampleMock, expectedSisOutput } from '~/tests/mocks/btrSubmissionExample'
import { SiSchemaType } from '~/utils/si-schema/definitions'
import { getSIsFromBtrBodsSubmission } from '~/utils/btr-bods/bods-to-si-schema-converters'

describe('getSIsFromBtrBodsSubmission', () => {
  it('should return the list of SignificantIndividual', () => {
    const submission: { payload: BtrFilingI } = btrSubmissionExampleMock
    const expectedResult: SiSchemaType[] = expectedSisOutput

    const result = getSIsFromBtrBodsSubmission(submission.payload)

    expect(result).deep.equal(expectedResult)
  })
})
