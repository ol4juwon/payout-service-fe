import FetchAPI from '../fetchAPI'
import { getAllWalletsUrl, getWalletDetailsUrl, getCreateWalletUrl, getFundWalletUrl } from '../endPoints'

export const getAllWallets = query => {
  return FetchAPI(getAllWalletsUrl(query), 'GET')
}

export const getWalletDetails = id => {
  return FetchAPI(getWalletDetailsUrl(id), 'GET')
}

export const createWallet = body => {
  return FetchAPI(getCreateWalletUrl(), 'POST', body)
}

export const fundWallet = body => {
  return FetchAPI(getFundWalletUrl(body.userId), 'POST', { amount: body.amount })
}
