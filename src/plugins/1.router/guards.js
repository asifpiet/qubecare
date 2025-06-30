import { useAuth } from '@/composables/useAuth'
import { canNavigate2 } from '@layouts/plugins/casl'
export const setupGuards = router => {
  // 👉 router.beforeEach
  // Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
  router.beforeEach(async (to, from, next) => {
    const { currentRole, isAuthenticated, validateAuth, currentUser } = useAuth(to.path)
    /*
         * If it's a public route, continue navigation. This kind of pages are allowed to visited by login & non-login users. Basically, without any restrictions.
         * Examples of public routes are, 404, under maintenance, etc.
         */
    if (to.meta.public)
      return next()

    /**
         * Check if user is logged in by checking if token & user data exists in local storage
         * Feel free to update this logic to suit your needs
         */
    // const isLoggedIn = !!(useCookie('userData').value && useCookie('accessToken').value)

    /*
          If user is logged in and is trying to access login like page, redirect to home
          else allow visiting the page
          (WARN: Don't allow executing further by return statement because next code will check for permissions)
         */
    if (to.meta.unauthenticatedOnly) {
      if (isAuthenticated.value)
        return next({ path: `/${currentRole.value}/dashboard` })
      else
        return next()
    }
    const canNavigate = canNavigate2()
    await validateAuth()
    if (currentRole.value == 'provider' && !to.path.includes('/register-setup') && !currentUser.value.company.complete_setup) {
      return next({ path: `/${currentRole.value}/register-setup` })
    }

    if (currentRole.value == 'patient' && !to.path.includes('/register-setup') && currentUser.value.pending_task == 1) {
      return next({ path: `/${currentRole.value}/register-setup` })
    }

    // const bypassRoutes = ['/pages/account-settings/account'];
    // if (bypassRoutes.includes(to.path)) {
    //   return;  // Allow access without checking permissions 
    // }
    if (to.meta.action && !canNavigate(to) && to.matched.length) {

      /* eslint-disable indent */
      return isAuthenticated.value
        ? next({ name: 'not-authorized' })
        : next({
          path: `/${currentRole.value}/login`,
          query: {
            ...to.query,
            to: to.fullPath !== '/' ? to.path : undefined,
          },
        })
      /* eslint-enable indent */
    }
    return next()
  })
}
