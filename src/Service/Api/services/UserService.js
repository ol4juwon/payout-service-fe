import FetchAPI from '../fetchAPI'
import { getAllUsersUrl, getUserDetailsUrl, createUserUrl, toggleUserUrl, blacklistUserUrl } from '../endPoints'

export const getAllUsers = query => {
  return FetchAPI(getAllUsersUrl(query), 'GET')
}

export const getUserDetails = id => {
  return FetchAPI(getUserDetailsUrl(id), 'GET')
}

export const createUser = body => {
  return FetchAPI(createUserUrl(), 'POST', body)
}

export const toggleUser = body => {
  return FetchAPI(toggleUserUrl(body), 'PUT')
}

export const blacklistUser = id => {
  return FetchAPI(blacklistUserUrl(id), 'PUT')
}

export const updateUser = (id, payload) => {}
