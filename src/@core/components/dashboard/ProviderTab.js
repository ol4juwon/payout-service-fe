// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const connectedAccountsArr = [
  {
    checked: true,
    title: 'Squadco',
    logo: '/images/logos/google.png',
    subtitle: 'Squadco by gt'
  },
  {
    checked: true,
    title: 'Sterling SPay',
    logo: '/images/logos/slack.png',
    subtitle: 'Spay by sterling bank'
  }
]

const ProviderTab = () => {
  return (
    <Card>
      <CardHeader
        title='Payout Providers'
        titleTypographyProps={{ sx: { mb: 1 } }}
        subheader={<Typography sx={{ color: 'text.secondary' }}>Provider Status</Typography>}
      />
      <CardContent>
        {connectedAccountsArr.map(account => {
          return (
            <Box
              key={account.title}
              sx={{
                gap: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '&:not(:last-of-type)': { mb: 4 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <Box sx={{ mr: 4, display: 'flex', justifyContent: 'center' }}>
                      <img src={account.logo} alt={account.title} height='30' width='30' />
                    </Box> */}
                <div>
                  <Typography sx={{ fontWeight: 500 }}>{account.title}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {account.subtitle}
                  </Typography>
                </div>
              </Box>
              <Switch disabled defaultChecked={account.checked} />
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default ProviderTab
