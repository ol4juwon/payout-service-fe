// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CrmLastTransaction from 'src/@core/components/dashboard/CrmLastTransaction'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CrmEarningReportsWithTabs from 'src/@core/components/dashboard/CrmEarningReportsWithTabs'
import TabConnections from 'src/@core/components/dashboard/TabConnections'
import ProviderTab from 'src/@core/components/dashboard/ProviderTab'
import RecentTransactions from 'src/@core/components/dashboard/RecentTransactions'
import transactions, { fetchTransations, fetchUserTransations } from 'src/store/apps/transactions'
import { useDispatch, useSelector } from 'react-redux'
import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { AuthContext } from 'src/context/AuthContext'

const Home = () => {
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transactions.transactions)
  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)
  useEffect(() => {
    dispatch(
      ability.can('manage', 'transactions')
        ? fetchTransations({
            all: false,
            page: 1,
            limit: 10,
            orderBy: 'createdAt',
            sort: 'DESC'
          })
        : fetchUserTransations(user._id, {})
    )
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {/* <Grid item xs={12} lg={6}>
          <CrmEarningReportsWithTabs />
        </Grid> */}
        {ability.can('read', 'providers') ? (
          <Grid item xs={12} sm={6}>
            <ProviderTab />
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12} sm={6}>
          <RecentTransactions transactions={transactions} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}
Home.acl = {
  action: 'read',
  subject: 'home-page'
}

export default Home
