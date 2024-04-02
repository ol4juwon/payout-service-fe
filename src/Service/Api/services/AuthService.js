import FetchAPI from '../fetchAPI'
import { loginUserUrl } from '../endPoints'

export const LoginUser = data => {
  return FetchAPI(loginUserUrl(), 'POST', data)
}

// export const changePassword = data => {
//   return FetchAPI(verifyEmail(), 'POST', data)
// }

// export const verifyCode = data => {
//   return FetchAPI(confirmCodeUrl(), 'POST', data)
// }

// export const ResetPassword = data => {
//   return FetchAPI(resetPassword(), 'PUT', data)
// }
