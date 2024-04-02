// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { UserService } from 'src/Service/Api/services'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'

const UserView = ({ tab, id }) => {
  const [userDetails, setUserDetails] = useState(null)
  console.log('id', id)

  const fetchUserDetails = async id => {
    const response = await UserService.getUserDetails(id)

    if (response.data) {
      setUserDetails(response.data)
    }
  }

  useEffect(() => {
    let done = false
    if (done == false) {
      if (id) fetchUserDetails(id)
    }

    return () => {
      done = true
    }
  }, [id])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userDetails={userDetails} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} id={id} userDetails={userDetails} />
      </Grid>
    </Grid>
  )
}

export default UserView
