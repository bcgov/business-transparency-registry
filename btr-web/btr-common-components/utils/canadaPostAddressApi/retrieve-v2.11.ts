const CANADA_POST_RETRIEVE_API_URL =
  'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/Retrieve/v2.11/json3.ws'

// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-retrieve/#parameters
// API : Retrieve (v2.11)
export interface CanadaPostApiRetrieveParamsI {
  Key: string
  Id: string
}

// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-retrieve/#responses
// API : Retrieve (v2.11)
export interface CanadaPostRetrieveItemI {
  Id: string
  DomesticId: string
  Language: string
  LanguageAlternatives: string
  Department: string
  Company: string
  SubBuilding: string
  BuildingNumber: string
  BuildingName: string
  SecondaryStreet: string
  Street: string
  Block: string
  Neighbourhood: string
  District: string
  City: string
  Line1: string
  Line2: string
  Line3: string
  Line4: string
  Line5: string
  AdminAreaName: string
  AdminAreaCode: string
  Province: string
  ProvinceName: string
  ProvinceCode: string
  PostalCode: string
  CountryName: string
  CountryIso2: string
  CountryIso3: string
  CountryIsoNumber: Number
  SortingNumber1: string
  SortingNumber2: string
  Barcode: string
  POBoxNumber: string
  Label: string
  Type: string
  DataLevel: 'Unknown' | 'Premise' | 'RangedPremise' | 'Street' | 'City'
  // not in docs but found in response
  AcMua: string
  AcRbdi: string
}

export const retrieveAddress = async (id: string, canadaPostApiKey: string): Promise<CanadaPostRetrieveItemI[]> => {
  const retrieveParams: CanadaPostApiRetrieveParamsI = {
    Key: canadaPostApiKey,
    Id: id
  }

  // @ts-ignore
  const retrieveUrl = CANADA_POST_RETRIEVE_API_URL + '?' + new URLSearchParams(retrieveParams)
  const retrieveResp =
    await $fetch(retrieveUrl).catch((error) => {
      console.error(error)
      return { Items: [] }
    })

  // @ts-ignore
  return retrieveResp.Items
}
