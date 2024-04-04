// ** React Imports
import { useState, useEffect, useCallback, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import

// ** Actions Imports

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import { fetchTransations, fetchUserTransations } from 'src/store/apps/transactions'
import TransactionDetails from 'src/views/apps/transactions/view/TransactionDetails'
import InitiatePayoutSideBar from 'src/views/apps/transactions/view/InitiatePayoutSideBar'
import { formatDate, formatMoney } from 'src/@core/utils/format'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { AuthContext } from 'src/context/AuthContext'

// ** renders client column
const userRoleObj = {
  ADMIN: { icon: 'tabler:user-shield', color: 'warning' },
  SUPER_ADMIN: { icon: 'tabler:password-user', color: 'error' },
  USER: { icon: 'tabler:user-circle', color: 'info' }
}

const userStatusObj = {
  SUCCESSFUL: 'success',
  PROCESSING: 'warning',
  FAILED: 'error',
  PENDING: 'secondary'
}

const RowOptions = ({ id, detailss }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const rowOptionsOpen = Boolean(anchorEl)
  const toggleDrawer = () => setOpen(!open)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={toggleDrawer}>
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
      </Menu>

      <TransactionDetails open={open} toggle={toggleDrawer} />
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 150,
    field: 'createdAt',
    headerName: 'Transaction Date',
    renderCell: ({ row }) => {
      const { createdAt } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href='/apps/transactions/view/account'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {formatDate(createdAt)}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'amount',
    minWidth: 170,
    headerName: 'Amount',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {formatMoney(row.amount)}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'accountNo',
    minWidth: 170,
    headerName: 'account No.',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.Beneficiary.accountNo}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'Beneficiary.MappedBankCode.bankName',
    headerName: 'Bank',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.Beneficiary.MappedBankCode.bankName}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.status}
          color={userStatusObj[row.status]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
]

const TransactionList = ({ apiData }) => {
  // ** State
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(100)
  const [orderBy, setOrderBy] = useState('createdAt')
  const ability = useContext(AbilityContext)
  const [value, setValue] = useState('')
  const { user } = useContext(AuthContext)

  // const [status, setStatus] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const [addUserOpen, setAddUserOpen] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transactions)

  useEffect(() => {
    dispatch(
      ability.can('manage', 'transactions')
        ? fetchTransations({
            all: true,
            page,
            limit,
            orderBy,
            sort: 'DESC'
          })
        : fetchUserTransations(user._id, { all: true, page, limit, orderBy, sort: 'DESC' })
    )
  }, [dispatch])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontalWithDetails.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          {ability.can('manage', 'transactions') ? (
            <TableHeader
              value={value}
              title={'Initiate Payout'}
              handleFilter={handleFilter}
              toggle={toggleAddUserDrawer}
            />
          ) : (
            <></>
          )}
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={transactions.transactions}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <InitiatePayoutSideBar open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export default TransactionList
