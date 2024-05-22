import { describe, expect } from 'vitest'
import { SI_EXAMPLE_DATE, testSI } from '../mockedData'

import { BodsInterestTypeE, BodsNameTypeE, BodsPersonTypeE } from '~/enums/btr-bods-e'
import siSchemaToBtrBodsConverters from '~/utils/btr-bods/si-schema-to-btr-bods-converters'

describe('Btr to Bods util converters Tests', () => {
  it('getBodsNamesFromSi', () => {
    const input = testSI
    const expectedOutput = [
      { fullName: 'Test Name', type: BodsNameTypeE.INDIVIDUAL },
      { fullName: 'Waffles Test', type: BodsNameTypeE.ALTERNATIVE }
    ]
    const result = siSchemaToBtrBodsConverters.getBodsNamesFromSi(input)
    expect(result).toEqual(expectedOutput)
  })

  it('getBodsIdentifiersFromSi', () => {
    const input = testSI
    const expectedOutput =
      [{ id: '000 000 000', scheme: 'CAN-TAXID', schemeName: 'ITN' }]
    const result = siSchemaToBtrBodsConverters.getBodsIdentifiersFromSi(input)
    expect(result).toEqual(expectedOutput)
  })

  it('getPersonType', () => {
    const input = testSI
    const expectedOutput = BodsPersonTypeE.KNOWN_PERSON
    const result = siSchemaToBtrBodsConverters.getPersonType(input)
    expect(result).toEqual(expectedOutput)
  })

  it('getInterests', () => {
    const input = testSI
    const expectedOutput =
      [
        {
          type: BodsInterestTypeE.SHAREHOLDING,
          share: { maximum: 75, minimum: 50, exclusiveMaximum: false, exclusiveMinimum: true },
          directOrIndirect: 'direct',
          details: 'controlType.shares.registeredOwner',
          startDate: SI_EXAMPLE_DATE,
          endDate: undefined
        },
        {
          type: BodsInterestTypeE.VOTING_RIGHTS,
          share: { maximum: 50, minimum: 25, exclusiveMaximum: false, exclusiveMinimum: false },
          directOrIndirect: 'direct',
          details: 'controlType.votes.registeredOwner',
          startDate: SI_EXAMPLE_DATE,
          endDate: undefined
        },
        {
          type: BodsInterestTypeE.APPOINTMENT_OF_BOARD,
          directOrIndirect: 'direct',
          details: 'controlType.directors.directControl',
          startDate: SI_EXAMPLE_DATE,
          endDate: undefined
        },
        {
          type: BodsInterestTypeE.APPOINTMENT_OF_BOARD,
          directOrIndirect: 'indirect',
          details: 'controlType.directors.indirectControl',
          startDate: SI_EXAMPLE_DATE,
          endDate: undefined
        }
      ]
    const result = siSchemaToBtrBodsConverters.getInterests(input)
    expect(result).toEqual(expectedOutput)
  })

  it('getBodsNationalitiesFromSi', () => {
    const input = testSI
    const expectedOutput = [{ name: 'Canada', code: 'CA' }]
    const result = siSchemaToBtrBodsConverters.getBodsNationalitiesFromSi(input)
    expect(result).toEqual(expectedOutput)

    const input2 = { ...input }
    input2.citizenships = [
      { name: 'Antigua and Barbuda', alpha_2: 'AG' },
      { name: 'Bonaire, Sint Eustatius and Saba', alpha_2: 'BQ' }
    ]

    const expectedOutput2 = [
      { name: 'Antigua and Barbuda', code: 'AG' },
      { name: 'Bonaire, Sint Eustatius and Saba', code: 'BQ' }
    ]
    const result2 = siSchemaToBtrBodsConverters.getBodsNationalitiesFromSi(input2)
    expect(result2).toEqual(expectedOutput2)
  })

  it('getTaxResidenciesFromSi', () => {
    const input = testSI
    const expectedOutput = [{ name: 'Canada', code: 'CA' }]
    const result = siSchemaToBtrBodsConverters.getTaxResidenciesFromSi(input)
    expect(result).toEqual(expectedOutput)
  })
})
