// ** React Imports
import { useState, useEffect, useCallback } from 'react'

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
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import FundUserWallet from 'src/views/apps/wallet/FundUserWallet'
import { fetchAllWallets } from 'src/store/apps/wallet'
import { formatMoney } from 'src/@core/utils/format'

// ** renders client column
const userRoleObj = {
  ADMIN: { icon: 'tabler:user-shield', color: 'warning' },
  SUPER_ADMIN: { icon: 'tabler:password-user', color: 'error' },
  USER: { icon: 'tabler:user-circle', color: 'info' }
}

const userStatusObj = {
  true: 'success',
  false: 'warning'

  // inactive: 'secondary'
}

const RowOptions = ({ id, userDetails }) => {
  // ** Hooks
  const dispatch = useDispatch()
  console.log({ userDetails })

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const toggleOpen = () => setOpen(!open)

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
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={toggleOpen}>
          <Icon icon='tabler:cash' fontSize={20} />
          Fund Wallet
          <Icon icon='tabler:plus' fontSize={20} />
        </MenuItem>
      </Menu>
      <FundUserWallet open={open} toggle={toggleOpen} userDetails={userDetails} />
    </>
  )
}

const columns = [
  {
    flex: 0.1,
    minWidth: 110,
    field: 'userId',
    headerName: 'User ',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ color: 'text.primary' }}>
          {`${row.User.firstName} ${row.User.lastName}`}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'balance',
    headerName: 'Balance ',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ color: 'text.primary' }}>
          {formatMoney(row.balance)}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userDetails={row} />
  }
]

const WalletList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [open, setOpen] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()
  const wallets = useSelector(state => state.wallets)
  console.log(wallets)

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleFundUserDrawer = () => setAddUserOpen(!addUserOpen)
  useEffect(() => {
    dispatch(fetchAllWallets({ all: false, limit: 100, page: 1, orderBy: 'balance', sort: 'DESC' }))
  }, [dispatch])

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
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleFundUserDrawer} /> */}
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={wallets?.wallets}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
      <FundUserWallet open={open} />
      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  )
}

export default WalletList
