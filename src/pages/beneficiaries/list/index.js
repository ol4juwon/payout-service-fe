// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import { fetchBeneficiaries } from 'src/store/apps/beneficiary'
import InitiatePayoutSideBar from 'src/views/apps/beneficiary/list/InitiatePayoutSideBar'
import AddBeneficiarySideBar from 'src/views/apps/beneficiary/list/AddBeneficiarySideBar'

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

const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const toggleDrawer = () => setOpen(!open)

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
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
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
      <InitiatePayoutSideBar open={open} toggle={toggleDrawer} />
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 280,
    field: 'accountName',
    headerName: 'Beneficiary',
    renderCell: ({ row }) => {
      const { accountName } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {accountName}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'accountNo',
    minWidth: 170,
    headerName: 'Account number',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.accountNo}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'MappedBankCode.bankName',
    headerName: 'Bank Name',
    renderCell: ({ row }) => {
      return <Typography>{row.MappedBankCode.bankName}</Typography>
    }
  },
  {
    flex: 0.15,
    field: 'userId',
    minWidth: 170,
    headerName: 'User Id',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap={true} sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.userId}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'created At',
    field: 'Created',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.primary', textTransform: 'capitalize' }}>
          {row.createdAt}
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
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
]

const UserList = ({ apiData }) => {
  // ** State
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [value, setValue] = useState('')
  const [all, setAll] = useState(true)
  const [orderBy, setOrderBy] = useState('createdAt')
  const [sort, setSort] = useState('DESC')
  const [pageSize, setPageSize] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()
  const beneficiaries = useSelector(state => state.beneficiaries)
  console.log(beneficiaries)

  useEffect(() => {
    dispatch(
      fetchBeneficiaries({
        page,
        limit,
        all,
        sort,
        orderBy
      })
    )
  }, [all, dispatch, limit, orderBy, page, sort])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
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
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={beneficiaries?.beneficiaries || []}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[0, 10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddBeneficiarySideBar open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

// export const getStaticProps = async () => {
//   const token = window.localStorage.getItem('accessToken')

//   const res = await axios.get('localhost:5454/api/v1/users/', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'x-access-token': process.env.NEXT_PUBLIC_X_ACCESS_TOKEN
//     }
//   })
//   const apiData = res.data

//   return {
//     props: {
//       apiData
//     }
//   }
// }

export default UserList
