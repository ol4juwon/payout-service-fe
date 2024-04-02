import Config from 'src/configs/app'

const aboutcontroller = new AbortController()

export default (url, method, data) => {
  // let token = ''
  const token = localStorage.getItem('accessToken')
  console.log({ url :Config.REST_ENDPOINT + url })
  let options

  const args = {
    method: method || 'POST',
    body: JSON.stringify(data)
  }
  if (method) {
    options = { ...args }
  }

  return fetch(Config.REST_ENDPOINT + url, {
    signal: aboutcontroller.signal,
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'x-access-token': process.env.NEXT_PUBLIC_X_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json().then(json => {
      if (response.status === 401) {
        localStorage.clear()

        return (window.location.href = '/login')
      }
      if (!response.ok && response.status !== 401) {
        const error = Object.assign({}, json, {
          status: response.status,
          statusText: response.statusText
        })

        return Promise.reject(error)
      }

      return json
    })
  })
}
