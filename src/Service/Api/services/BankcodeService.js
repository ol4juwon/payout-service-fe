import FetchAPI from '../fetchAPI'
import { getAllBankcodesUrl, getBankCodeDetailsUrl } from '../endPoints'

export const getAllBankcodes = query => {
  return FetchAPI(getAllBankcodesUrl(query), 'GET')
}

export const getBankCodeDetails = id => {
  return FetchAPI(getBankCodeDetailsUrl(id), 'GET')
}
