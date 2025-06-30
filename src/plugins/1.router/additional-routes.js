

// 👉 Redirects
export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie('userData')
      const userRole = userData.value?.role
      if (userRole === 'admin')
        return {
          name: 'dashboards-logistics',
        }
      if (userRole === 'client')
        return {
          name: 'access-control',
        }

      if (userRole === 'partner')
        return {
          name: 'partner-dashboard',
        }
      if (userRole === 'affiliate')
        return {
          name: 'affiliate-dashboard',
        }
      if (userRole === 'patient')
        return {
          name: 'patient-dashboard',
        }

      return { name: 'provider-login', query: to.query }
    },
  },


]
export const routes = [

]
