import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { WalletService } from 'src/Service/Api/services'

// ** Fetch Wallets
export const fetchAllWallets = createAsyncThunk(
  'wallet/fetch',
  async ({ all, sort = 'DESC', orderBy = 'createdAt', page = 1, limit = 10 }) => {
    try {
      const response = await WalletService.getAllWallets({ all, page, limit, orderBy, sort })

      return response
    } catch (error) {
      toast.error(error.message)

      throw new Error('An Error occured ')
    }
  }
)

export const fetchUserTransations = createAsyncThunk('wallet/user/fetch', async userId => {
  try {
    const response = await WalletService.getWalletDetails(userId)

    return response
  } catch (error) {
    toast.error(error.message)

    throw new Error('An Error occured ')
  }
})

// ** Initiate Payout
export const initiatePayout = createAsyncThunk(
  'wallet/initiatepayout',
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

// ** Initiate Payout
export const fundUserWallet = createAsyncThunk('wallet/fund', async ({ amount, userId }) => {
  try {
    const response = await WalletService.fundWallet({ amount, userId })
    if (response.data) toast.success('Wallet funded')

    if (response.error) toast.error('Funding failed')
  } catch (error) {
    toast.error(error.error)

    return error
  }
})

export const walletSlice = createSlice({
  name: 'wallets',
  initialState: {
    wallets: [],
    total: 0,
    params: { all: true, sort: 'DESC', orderBy: 'active', page: 1, limit: 10 },
    error: null,
    loading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllWallets.pending, state => {
        state.loading = true
      })
      .addCase(fetchAllWallets.fulfilled, (state, action) => {
        state.loading = false
        state.wallets = action.payload.data
        state.total = action.payload.length
        state.params = action.payload.params
      })
      .addCase(fetchAllWallets.rejected, (state, action) => {
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

export default walletSlice.reducer
