// ** Third Party Imports
import axios from 'axios'
import { useRouter } from 'next/router'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = () => {
  const router = useRouter()
  const { id, tab } = router.query

  return <UserViewPage tab={tab} id={id} />
}

// export const getStaticPaths = () => {
//   return {
//     paths: [
//       { params: { id, tab: 'account' } },
//       { params: { id, tab: 'security' } },
//       { params: { id, tab: 'billing-plan' } },
//       { params: { id, tab: 'notification' } },
//       { params: { id, tab: 'connection' } }
//     ],
//     fallback: false
//   }
// }

// export const getStaticProps = async ({ params }) => {
//   // const res = await axios.get('/apps/invoice/invoices')
//   // const invoiceData = res.data.allData

//   return {
//     props: {
//       tab: params?.tab,
//       id: params?.id
//     }
//   }
// }

export default UserView
