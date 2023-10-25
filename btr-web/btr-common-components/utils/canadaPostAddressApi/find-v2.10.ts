const CANADA_POST_FIND_API_URL =
  'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/Find/v2.10/json3.ws'

// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-find/#parameters
// API : Find (v2.10)
export type CanadaPostApiFindParams = {
  // mandatory, error if not provided
  Key: string
  SearchTerm: string

  // with defaults if not provided
  LastId?: string // default ''
  Country?: string // default 'CAN'
  LanguagePreference?: string // default 'en'
  MaxSuggestions?: Number // default 7

  // in examples, but could not find description of it
  SearchFor?: string
  MaxResults?: Number
  Origin?: string
  Bias?: string
  Filters?: string
  GeoFence?: string
}

// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-find/#responses
// API : Find (v2.10)
export type CanadaPostApiFindResponseItem = {
  Id: string // use as LastId in find method or as id to select the item with retrieve
  Text: string // suggestion text
  Highlight: string
  Cursor: Number
  Description: string
  Next: 'Find' | 'Retrieve'
}

export const findAddress = async (searchTerm: string,
  lastId: string,
  props: { countryIso3166Alpha2: string, maxSuggestions: Number, langCode: string },
  canadaPostApiKey: string) => {
  if (!searchTerm) {
    return
  }
  const searchParams: CanadaPostApiFindParams = {
    Key: canadaPostApiKey,
    SearchTerm: searchTerm,
    LastId: lastId || '',
    MaxSuggestions: props.maxSuggestions,
    LanguagePreference: props.langCode,
    Country: props.countryIso3166Alpha2
  }

  // @ts-ignore
  const urlFind = CANADA_POST_FIND_API_URL + '?' + new URLSearchParams(searchParams)
  const resp =
    await $fetch(urlFind).catch((error) => {
      console.error(error)
      return { Items: [] }
    })

  // @ts-ignore
  return resp.Items
}
