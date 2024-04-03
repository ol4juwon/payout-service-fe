// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Third Party Imports
import axios from 'axios'
import { formatDate, formatMoney } from 'src/@core/utils/format'

const columns = [
  {
    flex: 0.2,

    minWidth: 120,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatMoney(row.amount)}
        </Typography>
      </Box>
    )
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'createdAt',
    headerName: 'Transaction Date',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{formatDate(row.createdAt)}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 180,
    headerName: 'status',
    field: 'status',
    renderCell: ({ row }) => (
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ mb: 1.5, color: 'text.primary' }}>{`${row.status}`}</Typography>
        {/* <LinearProgress sx={{ height: 8 }} variant='determinate' value={row.progressValue} color={row.progressColor} /> */}
      </Box>
    )
  },
  {
    flex: 0.2,
    minWidth: 110,
    field: 'provider',
    headerName: 'Provider',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.primary' }}>{`${row?.provider || 'not available'}`}</Typography>
    )
  }
]

const TransactionListTable = ({ transactions }) => {
  // ** State
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(7)
  const [data, setData] = useState([])

  // useEffect(() => {
  //   axios
  //     .get('/apps/users/project-list', {
  //       params: {
  //         q: value
  //       }
  //     })
  //     .then(res => setData(res.data))
  // }, [value])

  return (
    <Card>
      <CardHeader title="User's Payout List" />
      <CardContent></CardContent>
      <DataGrid
        autoHeight
        rows={transactions}
        rowHeight={60}
        columns={columns}
        pageSize={pageSize}
        disableSelectionOnClick
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Card>
  )
}

export default TransactionListTable
