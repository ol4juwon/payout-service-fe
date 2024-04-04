// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { fundWallet } from 'src/Service/Api/services/WalletService'
import { fundUserWallet } from 'src/store/apps/wallet'



const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  // userId: yup.string().required('User id required'),
  amount: yup.number().positive().required('Please provide a valid amount')
})

const defaultValues = {
  userId: '',
  amount: ''
}

const FundUserWallet = props => {
  // ** Props
  const { open, toggle, userDetails } = props
  console.log({ fundWallet: userDetails })

  // const users = useSelector(state => state.user)

  // ** State

  // ** Hooks
  const dispatch = useDispatch()

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

  const onSubmit = data => {
    console.log('dddddddd', data)
    data.userId = userDetails?.User.id

    dispatch(fundUserWallet({ ...data }))

    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  // useEffect(() => {
  //   let done = false
  //   if (done == false) {

  //   }

  //   return () => {
  //     done = true
  //   }
  // }, [users.loading])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Fund wallet</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              value={`${userDetails?.User?.firstName} ${userDetails?.User?.lastName}`}
              disabled
              label='Name'
              placeholder='John Doe'
              error={Boolean(errors.fullName)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            {/* <Controller
              name='userId'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => ( */}
            <TextField
              name='userId'
              disabled
              value={userDetails?.User.id}
              label='User'
              placeholder='john doe'
              error={Boolean(errors.userId)}
            />
            {/* )}
            /> */}
            {errors.userId && <FormHelperText sx={{ color: 'error.main' }}>{errors.userId.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='amount'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='amount'
                  value={value}
                  label='Amount'
                  onChange={onChange}
                  placeholder='0.00'
                  error={Boolean(errors.amount)}
                />
              )}
            />
            {errors.amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.amount.message}</FormHelperText>}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              Fund wallet
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default FundUserWallet
