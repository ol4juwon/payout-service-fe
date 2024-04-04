let REST_ENDPOINT

// REST_ENDPOINT = 'http://localhost:5454/api/v1'

REST_ENDPOINT = 'https://vend-payout.onrender.com/api/v1'

const Config = {
  isDev: process.env.NODE_ENV === 'development',
  REST_ENDPOINT
}

export default Config
