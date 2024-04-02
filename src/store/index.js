// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
// import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import provider from 'src/store/apps/providers'
import banks from 'src/store/apps/banks'
import transactions from 'src/store/apps/transactions'
import beneficiaries from 'src/store/apps/beneficiary'

export const store = configureStore({
  reducer: {
    user,
    provider,
    banks,
    transactions,
    beneficiaries
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
