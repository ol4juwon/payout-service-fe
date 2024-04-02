import FetchAPI from '../fetchAPI'
import { getAddBeneficiaryURl, getAllBeneficiariesUrl } from '../endPoints'

export const AddBeneficiary = async data => {
  return FetchAPI(getAddBeneficiaryURl(), 'POST', data)
}

export const getAllBeneficiaries = async data => {
  return FetchAPI(getAllBeneficiariesUrl(data), 'GET')
}
