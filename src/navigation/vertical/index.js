const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
      action: 'read',
      subject: 'home-page'
    },
    {
      title: 'Users',
      path: '/user/list',
      icon: 'tabler:user'
    },
    {
      path: '/providers/list',

      action: 'read',
      subject: 'providers',
      title: 'Providers',
      icon: 'material-symbols:account-balance'
    },
    {
      path: '/transactions/list',
      action: 'read',
      subject: 'transactions',
      title: 'Transactions',
      icon: 'tabler:cards-filled'
    },
    {
      path: '/beneficiaries/list',

      title: 'Beneficiaries',
      icon: 'tabler:user-dollar'
    },
    {
      path: '/bankcodes/list',

      title: 'Bank Codes',
      icon: 'tabler:building-bank'
    }
  ]
}

export default navigation
