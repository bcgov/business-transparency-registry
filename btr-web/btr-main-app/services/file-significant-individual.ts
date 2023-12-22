import { SignificantIndividualFilingI } from '~/interfaces/significant-individual-filing-i'
import { IdAsNumberI } from '~/interfaces/common-ids-i'
import { SignificantIndividualI } from '~/interfaces/significant-individual-i'

const constructBtrApiURL = () => {
  const runtimeConfig = useRuntimeConfig()
  const btrApiURL = runtimeConfig.public.btrApiURL
  return `${btrApiURL}`
}

const convertPercentsToNumber = (sif: SignificantIndividualFilingI) => {
  for (const si of sif.significantIndividuals) {
    si.percentOfShares = parseFloat(si.percentOfShares.toString()) || 0
    si.percentOfVotes = parseFloat(si.percentOfVotes.toString()) || 0
  }
  return sif
}

const submitSignificantIndividualFiling = async (sif: SignificantIndividualFilingI) => {
  sif = convertPercentsToNumber(sif)
  const url = constructBtrApiURL() + '/plots'
  const { data, error } = await useFetchBcros<IdAsNumberI>(url,
    {
      method: 'POST',
      body: sif,
      headers: { 'Content-Type': 'application/json' }
    })

  return { data: data.value, error: error.value }
}

const getCurrentOwners = async (businessIdentifier: string) => {
  const url = `${constructBtrApiURL()}/owners/${businessIdentifier}`
  const { data, error } =
          await useFetchBcros<SignificantIndividualI[]>(url)

  if (data.value) {
    for (const si of data.value) {
      si.percentOfShares = si.percentOfShares ? si.percentOfShares.toString() : '0'
      si.percentOfVotes = si.percentOfVotes ? si.percentOfVotes.toString() : '0'
    }
  }
  return { data: data.value, error: error.value }
}

export default {
  submitSignificantIndividualFiling,
  getCurrentOwners
}
