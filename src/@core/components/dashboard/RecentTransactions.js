// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import { formatDate } from 'src/@core/utils/format'

const statusObj = {
  FAILED: { text: 'failed', color: 'error' },
  PENDING: { text: 'Pending', color: 'secondary' },
  PROCESSING: { text: 'processing', color: 'warning' },
  SUCCESSFUL: { text: 'successful', color: 'success' }
}

const RecentTransactions = ({ transactions }) => {
  return (
    <Card>
      <CardHeader
        title='Recent Payout'
        action={
          <OptionsMenu
            options={['Show all entries', 'Refresh']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{ '& .MuiTableCell-root': { py: 2, borderTop: theme => `1px solid ${theme.palette.divider}` } }}
            >
              {/* <TableCell>Card</TableCell> */}
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Provider</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions?.map((row, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child .MuiTableCell-root': { pb: theme => `${theme.spacing(6)} !important` },
                    '& .MuiTableCell-root': { border: 0, py: theme => `${theme.spacing(2.25)} !important` },
                    '&:first-of-type .MuiTableCell-root': { pt: theme => `${theme.spacing(4.5)} !important` }
                  }}
                >
                  {/* <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& img': { mr: 4 } }}>
                      <img width={50} alt={row.imgName} src={`/images/cards/${row.imgName}.png`} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                          {row.cardNumber}
                        </Typography>
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                          {row.cardType}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell> */}
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      {/* <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Sent
                      </Typography> */}
                      <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                        {formatDate(row.createdAt)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      label={statusObj[row.status].text}
                      color={statusObj[row.status].color}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {row.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {row.provider || 'Not avaialble'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default RecentTransactions
