import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { BeneficiaryService, TransactionService } from 'src/Service/Api/services'

export const fetchBeneficiaries = createAsyncThunk(
  'beneficiary/fetchall',
  async ({ page = 1, all = true, limit = 10, orderBy = 'createdAt', sort = 'DESC' }) => {
    try {
      const response = await BeneficiaryService.getAllBeneficiaries({ page, all, limit, sort, orderBy })

      return response.data
    } catch (err) {
      toast.error('Failed to fetch beneficiaries:\n' + err)
    }
  }
)

export const addBeneficiary = createAsyncThunk('beneficiary/add', async body => {
  try {

    const response = await BeneficiaryService.AddBeneficiary(body).catch(err => err)
    if (response.error) {
      toast.error('Failed to add beneficiary:\n' + response.error)

      return
    }

    // toast.info('Beneficiary added')

    return response.data
  } catch (err) {
    toast.error('Failed to add beneficiary:\n' + err)
  }
})

export const beneficiariesSlice = createSlice({
  name: 'beneficiaries',
  initialState: {
    beneficiaries: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addBeneficiary.fulfilled, (state, action) => {
        toast.success('Beneficiary Added')
      })
      .addCase(fetchBeneficiaries.pending, state => {
        state.loading = false
        state.beneficiaries = null
        state.error = null
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false
        state.beneficiaries = action.payload
        state.error = null
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default beneficiariesSlice.reducer
