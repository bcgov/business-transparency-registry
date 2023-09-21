import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { IndividualPersonInterface } from '~/models/persons'

export const useIndividualPerson = defineStore('individualPerson', () => {
  const individualPersons = ref<Array<IndividualPersonInterface>>([
    {
      address: '231-5600 Andres Rd Richmond BC V7E 6N1 Canada',
      controlsText: 'Registered owner of 25% or more of the shares. Direct control of the right to elect, appoint or remove a majority directors.',
      details: {
        dateOfBirth: '1970-12-12',
        taxResidency: ['Canada', 'USA']
      },
      fullName: 'Jim Halperst',
      significanceDates: ['2011-10-23'],
      uuid: '068f2803-436f-4b29-bc43-ce3f23c78e6c'
    },
    {
      address: '1231-5600 Andres Rd Richmond BC V7E 6N1 Canada',
      controlsText: 'Registered owner of 25% or more of the shares. Direct control of the right to elect, appoint or remove a majority directors.',
      details: {
        dateOfBirth: '1980-02-16',
        taxResidency: ['Canada']
      },
      fullName: 'Ed Truck',
      significanceDates: ['2010-03-02'],
      uuid: '57f4f5fb-db3e-4cd0-887e-d20bfd1da91c'
    },
    {
      address: '7231-5600 Andres Rd Richmond BC V7E 6N1 Canada',
      controlsText: 'Registered owner of 25% or more of the shares.',
      details: {
        dateOfBirth: '1980-02-16',
        taxResidency: ['Canada']
      },
      fullName: 'Dunder Mifflin Paper Company INC.',
      significanceDates: ['2010-03-02'],
      uuid: '28ec39c3-408c-4a2e-b16e-41509a8cb0bf'
    }
  ])

  const getIndividualPersons = computed(() => individualPersons.value)

  return { getIndividualPersons }
})
