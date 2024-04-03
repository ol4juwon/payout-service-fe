// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import Payment from 'payment'
import Cards from 'react-credit-cards'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { fetchBankcodes } from 'src/store/apps/banks'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHelperText } from '@mui/material'
import { TransactionService } from 'src/Service/Api/services'
import { addBeneficiary } from 'src/store/apps/beneficiary'
import { useRouter } from 'next/router'

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const data = []

const UserViewBilling = ({ id, user }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  // ** States
  const [accountNumber, setAccountNumber] = useState('')
  const [bankcode, setBankcode] = useState('')
  const [name, setName] = useState('')
  const [focus, setFocus] = useState()
  const [cardId, setCardId] = useState(0)
  const [expiry, setExpiry] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [openEditCard, setOpenEditCard] = useState(false)
  const [openAddressCard, setOpenAddressCard] = useState(false)
  const [openUpgradePlans, setOpenUpgradePlans] = useState(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)
  const [bankCodes, setBankCodes] = useState(null)
  const banks = useSelector(state => state.banks.banks)

  const schema = yup.object().shape({
    accountNumber: yup.string().min(10, 'Please provide a valid account number').required(),
    accountName: yup.string().required(),
    bankcode: yup.string().min(3, 'bank is required').required()
  })

  const defaultValues = {
    accountNumber: '',
    accountName: '',
    bankcode: ''
  }

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Handle Edit Card dialog and get card ID
  const handleEditCardClickOpen = id => {
    setDialogTitle('Edit')
    setCardId(id)
    setCardNumber(data[id].cardNumber)
    setName(data[id].name)
    setCvc(data[id].cardCvc)
    setExpiry(data[id].expiryDate)
    setOpenEditCard(true)
  }

  const handleAddCardClickOpen = () => {
    setDialogTitle('Add')
    setCardNumber('')
    setName('')

    // setCvc('')
    setExpiry('')
    setOpenEditCard(true)
  }

  const handleEditCardClose = () => {
    // setDialogTitle('Add')
    // setCardNumber('')
    // setName('')
    // setCvc('')
    // setExpiry('')
    // setOpenEditCard(false)
  }

  // Handle Upgrade Plan dialog
  const handleUpgradePlansClickOpen = () => setOpenUpgradePlans(true)
  const handleUpgradePlansClose = () => setOpenUpgradePlans(false)
  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      // target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    }
  }

  useEffect(() => {
    dispatch(fetchBankcodes())
  }, [])

  useEffect(() => {
    // console.log('banks changing', banks)
    if (banks?.length > 0 && bankCodes == null) {
      console.log('useEffect', { banks })
      if (banks?.length > 0 && bankCodes == null) {
        console.log('bansss')

        setBankCodes(banks)
      }
    }
  }, [banks, bankCodes])
  useEffect(() => {}, [name])

  const onSubmit = data => {
    setOpenEditCard(false)
    console.log({ data })
    dispatch(
      addBeneficiary({
        userId: id,
        bank_code_id: data.bankcode,
        account_no: data.accountNumber,
        account_name: data.accountName
      })
    )

    router.reload()

    // toggle()
    reset()
  }

  const fetchAccount = async body => {
    const response = await TransactionService.validateAccount(body).catch(err => err)
    console.log('name enquiry', { response })
    if (response.data) {
      setValue('accountName', response.data.account_name)
    }

    // return response
  }
  useEffect(() => {
    if (accountNumber.length == 10 && bankcode != '') {
      //call inquiry endpoint
      fetchAccount({
        accountNo: accountNumber,
        bankcode: bankcode
      })

      // console.log('Name enquirty response ', response)
    }
  }, [accountNumber, bankcode])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Beneficiary Account'
            action={
              <Button variant='contained' onClick={handleAddCardClickOpen} sx={{ '& svg': { mr: 1 } }}>
                <Icon icon='tabler:plus' fontSize='1rem' />
                Add Account
              </Button>
            }
          />
          <CardContent>
            <Box
              sx={{
                p: 4,
                display: 'flex',
                borderRadius: 1,
                flexDirection: ['column', 'row'],
                justifyContent: ['space-between'],
                alignItems: ['flex-start', 'center'],
                mb: undefined,
                border: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              {user.beneficiary ? (
                <>
                  <div>
                    <Typography sx={{ mr: 2, color: 'text.secondary' }}>
                      {user?.beneficiary?.MappedBankCode?.bankName}
                    </Typography>
                    <Box sx={{ mt: 3.5, mb: 2.5, display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 2, color: 'text.secondary' }}>{user?.beneficiary?.accountName}</Typography>
                    </Box>
                    <Typography sx={{ color: 'text.secondary' }}>{user?.beneficiary?.accountNo}</Typography>
                  </div>

                  <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                    <Button variant='contained' sx={{ mr: 2.5 }} onClick={() => handleEditCardClickOpen()}>
                      Edit
                    </Button>
                  </Box>
                </>
              ) : (
                <></>
              )}
            </Box>
          </CardContent>

          <Dialog
            open={openEditCard}
            onClose={handleEditCardClose}
            aria-labelledby='user-view-billing-edit-card'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            aria-describedby='user-view-billing-edit-card-description'
          >
            <DialogTitle
              id='user-view-billing-edit-card'
              sx={{
                textAlign: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              {dialogTitle} Deposit Account
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(5)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    {/* <CardWrapper sx={{ '& .rccs': { m: '0 auto' } }}>
                      <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
                    </CardWrapper> */}
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        {/* <TextField
                          fullWidth
                          name='number'
                          length={10}
                          value={cardNumber}
                          autoComplete='off'
                          label='Account Number'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          placeholder='0123456789'
                          onFocus={e => setFocus(e.target.name)}
                        /> */}
                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name='accountNumber'
                            control={control}
                            rules={{ required: true, length: 10 }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                label='Account Number'
                                onChange={e => {
                                  setAccountNumber(e.target.value)
                                  onChange(e)
                                }}
                                placeholder='0123456789'
                                error={Boolean(errors.accountNumber)}
                              />
                            )}
                          />
                        </FormControl>
                        {errors.accountNumber && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.accountNumber.message}</FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name='accountName'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                label='Account Name'
                                onChange={onChange}
                                placeholder='Ola juwon'
                                disabled
                                error={Boolean(errors.accountName)}
                              />
                            )}
                          />
                        </FormControl>

                        {errors.accountName && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.accountName.message}</FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={8}>
                        <FormControl fullWidth>
                          <InputLabel id='user-view-billing-edit-card-status-label'>Select Bank</InputLabel>
                          <Controller
                            name='bankcode'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Select
                                name='bankcode'
                                value={value}
                                label='Select Bank'
                                onChange={e => {
                                  console.log('select', e.target)
                                  setBankcode(e.target.value)
                                  onChange(e)
                                }}
                                id='user-view-billing-edit-card-status'
                                labelId='user-view-billing-edit-card-status-label'
                                defaultValue={''}
                              >
                                <MenuItem value={''}>Select bank</MenuItem>
                                {bankCodes?.map((bankcode, index) => (
                                  <MenuItem key={index} value={bankcode.id}>
                                    {bankcode.bankName}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                  Submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleEditCardClose}>
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewBilling
