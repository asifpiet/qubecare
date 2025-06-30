// import { adminAuthService } from '@/services/auth/adminAuthService'
import { affiliateAuthService } from '@/services/auth/affiliateService'
import { networkAuthService } from '@/services/auth/networkService'
import { partnerAuthService } from '@/services/auth/partnerService'
import { patientAuthService } from '@/services/auth/patientAuthService'
import { providerAuthService } from '@/services/auth/providerAuthService'
import { superAdminAuthService } from '@/services/auth/superAdminAuthService'
import { useAuthStore } from '@/stores/authStore'
import { useAbility } from '@casl/vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useAuth(toPath = null) {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const ability = useAbility()

  const currentRole = computed(() => {
    const path = toPath ?? route.path
    return getRoleByUri(path)
  })

  const currentUser = computed(() => {
    return authStore.getUserByRole(currentRole.value)
  })

  const isAuthenticated = computed(() => {
    return authStore.isAuthenticated(currentRole.value)
  })

  const authService = computed(() => {
    switch (currentRole.value) {
      case 'provider':
        return providerAuthService

      case 'patient':
        return patientAuthService
      case 'partner':
        return partnerAuthService
      case 'affiliate':
        return affiliateAuthService
      case 'network':
        return networkAuthService
      case 'admin':
        return superAdminAuthService
      default:
        return null
    }
  })

  const updateAbilities = (permissions) => {
    const abilityRules = authService.value.transformPermissions(permissions)
    ability.update(abilityRules)
  }
  const validateAuth = async () => {
    const path = toPath ?? route.path
    if (!isAuthenticated.value || !currentUser.value) {
      try {
        const { userData, permissions } = await authService.value.fetchProfile()
        authStore.setUser(userData, currentRole.value)
        updateAbilities(permissions)
      } catch (error) {
        console.error('Authentication failed:', error)
        authStore.clearUser(currentRole.value)
        ability.update([]) // Clear abilities
        await router.push(`/${currentRole.value}/login?to=${path}`)
      }
    } else {
      // If the user is already authenticated, fetch and update abilities
      //   try {
      //     const { permissions } = await authService.value.fetchPermissions()
      //     updateAbilities(permissions)
      //   } catch (error) {
      //     console.error('Failed to fetch permissions:', error)
      //   }
    }
  }

  const logout = async () => {
    try {
      await authService.value.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      authStore.clearUser(currentRole.value)
      ability.update([]) // Clear abilities
      await router.push(`/${currentRole.value}/login`)
    }
  }

  return {
    currentRole,
    currentUser,
    isAuthenticated,
    validateAuth,
    logout,
    updateAbilities,
    authService,
  }
}
