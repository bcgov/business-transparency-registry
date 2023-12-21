import { SignificantIndividualFilingI } from '~/interfaces/significant-individual-filing-i'
import { IdAsNumberI } from '~/interfaces/common-ids-i'
import { SignificantIndividualI } from '~/interfaces/significant-individual-i'

const constructBtrApiURL = () => {
  const runtimeConfig = useRuntimeConfig()
  const btrApiURL = runtimeConfig.public.btrApiURL
  return `${btrApiURL}`
}

const submitSignificantIndividualFiling = async (sif: SignificantIndividualFilingI) => {
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
  return { data: data.value, error: error.value }
}

export default {
  submitSignificantIndividualFiling,
  getCurrentOwners
}
