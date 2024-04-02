export default {
  baseUrl: 'localhost:5454/api/v1',
  meEndpoint: '/auth/me',
  loginEndpoint: '/auth/login',
  storageTokenKeyName: 'accessToken',
  xAccessToekn: process.env.NEXT_PUBLIC_X_ACCESS_TOKEN,
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
