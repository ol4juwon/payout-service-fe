import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

import { UserService } from 'src/Service/Api/services'

// ** Fetch Users
export const fetchUsers = createAsyncThunk(
  'users/',
  async ({ page = 1, limit = 10, orderBy = 'createdAt', sort = 'DESC' }) => {
    try {
      const response = await UserService.getAllUsers({ page, limit, sort, orderBy })
      const params = { page, limit, sort, orderBy }
      response.params = params

      return response
    } catch (error) {
      // toast.error(error.message)

      throw new Error(error.message)
    }
  }
)

// ** Add User
export const addUser = createAsyncThunk('users/addUser', async (data, { getState, dispatch }) => {
  try {
    const response = await UserService.createUser(data)

    dispatch(fetchUsers(getState().user.params))

    // throw new error()

    return response
  } catch (err) {
    console.info('kkdkkdk', err)

    throw new Error(err.error)
  }
})

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    loading: false,
    data: [],
    params: { page: 1, limit: 10, sort: 'DESC', orderBy: 'createdAt' },
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log('payload', action.payload)
        state.loading = false
        state.data = action.payload.data.data
        state.params = action.payload.params
      })
      .addCase(fetchUsers.pending, state => {
        state.loading = true
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false

        state.error = action.error
        console.log({ action })

        toast.error(action.error.message)
      })
      .addCase(addUser.fulfilled, state => {
        toast.success('User added')
        state.loading = false
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
        toast.error(action.error.message)
      })
      .addCase(addUser.pending, state => {
        state.loading = true
      })
  }
})

export default usersSlice.reducer
