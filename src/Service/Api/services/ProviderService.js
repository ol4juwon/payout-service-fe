import FetchAPI from '../fetchAPI'
import {
  getAlProvidersUrl,
  getProviderDetailsUrl,
  createProviderUrl,
  toggleActiveProviderUrl,
  setDefaultProviderUrl
} from '../endPoints'

export const getProviders = query => {
  return FetchAPI(getAlProvidersUrl(query), 'GET')
}

export const getProviderDetails = id => {
  return FetchAPI(getProviderDetailsUrl(id), 'GET')
}

export const addProvider = body => {
  return FetchAPI(createProviderUrl(), 'POST', body)
}

export const setProviderDefault = body => {
  return FetchAPI(setDefaultProviderUrl(body.id), 'PUT', body.payload)
}

export const toggleActiveProvider = body => {
  return FetchAPI(toggleActiveProviderUrl(body.id), 'PUT', body.payload)
}
