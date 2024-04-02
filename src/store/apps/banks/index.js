import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

import { BankcodeService } from 'src/Service/Api/services'

export const fetchBankcodes = createAsyncThunk('banks/get', async () => {
  try {
    const response = await BankcodeService.getAllBankcodes({ page: 1, limit: 100, orderBy: 'bankName', sort: 'DESC' })
    console.log('fetchiing banks', response)

    return response.data
  } catch (error) {
    console.log('fetch error', error)
    throw new Error(error)
  }
})

export const bankSlice = createSlice({
  name: 'banks',
  initialState: {
    banks: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBankcodes.pending, state => {
        state.loading = true
      })
      .addCase(fetchBankcodes.fulfilled, (state, action) => {
        state.loading = false
        console.log({ action: action.payload })
        state.banks = action.payload
      })
      .addCase(fetchBankcodes.rejected, (state, action) => {
        console.log('rejected', action.error)
        state.loading = false
        state.error = action.error
        toast.error(action.error.error)
      })
  }
})

export default bankSlice.reducer
