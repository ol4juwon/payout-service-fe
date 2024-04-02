import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

import { ProviderService } from 'src/Service/Api/services'

// ** Fetch Users
export const fetchProviders = createAsyncThunk(
  'providers/eee',
  async ({ sort = 'DESC', orderBy = 'active', page = 1, limit = 10 }) => {
    try {
      const response = await ProviderService.getProviders({ page, limit, orderBy, sort })

      return response
    } catch (error) {
      toast.error(error.message)

      throw new Error('An Error occured ')
    }
  }
)

// ** Add Provider
export const addProvider = createAsyncThunk('beneficiaries/addProvider', async (data, { getState, dispatch }) => {
  // const response = await axios.post('http://localhost:5454/api/v1/providers/', {
  //   data
  // })
  // dispatch(fetchData(getState().user.params))
  // throw new error()
  // return response.data
})

// ** Delete User
export const disableProvider = createAsyncThunk('appUsers/deleteUser', async (id, { getState, dispatch }) => {
  const response = await axios.put('/apps/users/delete', {
    data: id
  })

  // dispatch(fetchData(getState().user.params))

  return response.data
})

export const providerSlice = createSlice({
  name: 'provider',
  initialState: {
    providers: [],
    total: 0,
    params: { sort: 'DESC', orderBy: 'active', page: 1, limit: 10 },
    allData: [],
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProviders.pending, state => {
        state.loading = true
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        // console.log('payload', action.payload)
        state.loading = false
        state.providers = action.payload.data
        state.total = action.payload.length
        state.params = action.payload.params
        state.allData = action.payload
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addProvider.pending, state => {
        state.loading = true
      })
      .addCase(addProvider.fulfilled, (state, action) => {
        state.loading = false
        state.providers = [...state.providers, action.payload]
        state.total = [...state.provider, action.payload]
      })
      .addCase(addProvider.rejected, (state, action) => {
        ;(state.loading = false), (state.error = action.payload)
      })
  }
})

export default providerSlice.reducer
