import FetchAPI from '../fetchAPI'
import { getAllTransactionUrl, getTransactionDetailsUrl, getValidateAccountUrl, getInitiatePayoutUrl } from '../endPoints'

export const getAllTransactions = async query => {
  return FetchAPI(getAllTransactionUrl(query), 'GET')
}

export const getTransactionDetails = async id => {
  return FetchAPI(getTransactionDetailsUrl(id), 'GET')
}

export const getBalance = () => {}

export const validateAccount = body => {
  return FetchAPI(getValidateAccountUrl(), 'POST', body)
}

export const initiatePayouts = async body => {
  return FetchAPI(getInitiatePayoutUrl(), 'POST', body)
}
