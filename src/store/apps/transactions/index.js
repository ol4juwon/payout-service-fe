import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

import { ProviderService, TransactionService } from 'src/Service/Api/services'

// ** Fetch Users
export const fetchTransations = createAsyncThunk(
  'transactions/fetch',
  async ({ all, sort = 'DESC', orderBy = 'createdAt', page = 1, limit = 10 }) => {
    try {
      const response = await TransactionService.getAllTransactions({ all, page, limit, orderBy, sort })

      return response
    } catch (error) {
      toast.error(error.message)

      throw new Error('An Error occured ')
    }
  }
)

export const fetchUserTransations = createAsyncThunk(
  'transactions/user/fetch',
  async (userId, { all, sort = 'DESC', orderBy = 'createdAt', page = 1, limit = 10 }) => {
    try {
      const response = await TransactionService.getUserTransactions({ id: userId, all, page, limit, orderBy, sort })

      return response
    } catch (error) {
      toast.error(error.message)

      throw new Error('An Error occured ')
    }
  }
)

// ** Initiate Payout
export const initiatePayout = createAsyncThunk(
  'Transactions/initiatePayout',
  async ({ amount, recipientId, narration }, { getState, dispatch }) => {
    try {
      const response = await TransactionService.initiatePayouts({ amount, recipientId, narration })
      if (response.data) toast.success('Payout initiated')

      if (response.error) toast.error('Payout failed')
    } catch (error) {
      toast.error(error.error)

      return error
    }
  }
)

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    total: 0,
    params: { all: true, sort: 'DESC', orderBy: 'active', page: 1, limit: 10 },
    error: null,
    loading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTransations.pending, state => {
        state.loading = true
      })
      .addCase(fetchTransations.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.data
        state.total = action.payload.length
        state.params = action.payload.params
      })
      .addCase(fetchTransations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserTransations.pending, state => {
        state.loading = true
      })
      .addCase(fetchUserTransations.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.data
        state.total = action.payload.length
        state.params = action.payload.params
      })
      .addCase(fetchUserTransations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(initiatePayout.pending, state => {
        state.loading = true
      })
      .addCase(initiatePayout.fulfilled, (state, action) => {
        state.loading = false

        // state.transactions = [...state.transactions, action.payload]
        // state.total = [...state.transactions, action.payload].length
      })
      .addCase(initiatePayout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default transactionsSlice.reducer
