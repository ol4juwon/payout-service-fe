let REST_ENDPOINT = 'http://localhost:5454/api/v1'

const Config = {
  isDev: process.env.NODE_ENV === 'development',
  REST_ENDPOINT
}

export default Config
