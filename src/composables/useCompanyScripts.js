import { usePractitionerStore } from '@/stores/practitionerStore'
import { useRegisterSetupStore } from '@/stores/registerSetupStore'
import { computed, ref } from 'vue'
import { useAuth } from './useAuth'
import { useScriptInjection } from './useScriptInjection'

/**
 * Composable for managing company-specific script injection
 * Fetches company settings and injects header/footer scripts
 * Priority order: 1) currentUser.userData.company, 2) practitionerStore, 3) providerStore.getCompanySetting()
 * Works for both provider pages (using registerSetupStore) and patient pages (using practitionerStore)
 */
export function useCompanyScripts(options = {}) {
  const { useProviderStore = true, usePractitionerStore: usePractitionerStoreOption = false } = options

  const providerStore = useRegisterSetupStore()
  const practitionerStore = usePractitionerStore()
  const { currentUser } = useAuth()
  const { injectHeaderScripts, injectFooterScripts, removeInjectedContent, isInjected } = useScriptInjection()

  const isLoading = ref(false)
  const error = ref(null)
  const companySetting = ref(null)

  // Computed properties for scripts
  const headerScripts = computed(() => {
    // First try to get company from currentUser.userData
    if (currentUser.value?.company) {
      return currentUser.value.company.header_scripts || ''
    }
    // Fallback to practitioner store if using practitioner store option
    if (usePractitionerStoreOption && practitionerStore.practitioner?.company) {
      return practitionerStore.practitioner.company.header_scripts || ''
    }
    // Final fallback to companySetting
    return companySetting.value?.header_scripts || ''
  })

  const footerScripts = computed(() => {
    // First try to get company from currentUser.userData
    if (currentUser.value?.company) {
      return currentUser.value.company.footer_scripts || ''
    }
    // Fallback to practitioner store if using practitioner store option
    if (usePractitionerStoreOption && practitionerStore.practitioner?.company) {
      return practitionerStore.practitioner.company.footer_scripts || ''
    }
    // Final fallback to companySetting
    return companySetting.value?.footer_scripts || ''
  })

  /**
   * Fetch company settings from the appropriate store
   */
  const fetchCompanySettings = async () => {
    try {
      isLoading.value = true
      error.value = null

      // First try to get company from currentUser.userData
      if (currentUser.value?.company) {
        companySetting.value = currentUser.value.company
        console.log('Company settings from currentUser.userData:', companySetting.value)
        return
      }

      if (usePractitionerStoreOption) {
        // For patient pages, company settings come from practitioner data
        // No need to fetch separately as it's already loaded with practitioner info
        if (practitionerStore.practitioner?.company) {
          companySetting.value = practitionerStore.practitioner.company
          console.log('Company settings from practitioner:', companySetting.value)
        }
      } else {
        // For provider pages, fallback to fetch from registerSetupStore
        await providerStore.getCompanySetting()
        companySetting.value = providerStore.companySetting
        console.log('Company settings from provider store:', companySetting.value)
      }
    } catch (err) {
      error.value = err
      console.error('Error fetching company settings:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Inject company header scripts
   */
  const injectCompanyHeaderScripts = () => {
    if (headerScripts.value && headerScripts.value.trim()) {
      if (!isInjected('company-header-scripts')) {
        injectHeaderScripts(headerScripts.value, 'company-header-scripts')
        console.log('Company header scripts injected')
      }
    }
  }

  /**
   * Inject company footer scripts
   */
  const injectCompanyFooterScripts = () => {
    if (footerScripts.value && footerScripts.value.trim()) {
      if (!isInjected('company-footer-scripts')) {
        injectFooterScripts(footerScripts.value, 'company-footer-scripts')
        console.log('Company footer scripts injected')
      }
    }
  }

  /**
   * Inject all company scripts (header and footer)
   */
  const injectAllCompanyScripts = () => {
    injectCompanyHeaderScripts()
    injectCompanyFooterScripts()
  }

  /**
   * Remove company scripts
   */
  const removeCompanyScripts = () => {
    removeInjectedContent('company-header-scripts')
    removeInjectedContent('company-footer-scripts')
    console.log('Company scripts removed')
  }

  /**
   * Refresh company scripts (remove old and inject new)
   */
  const refreshCompanyScripts = async () => {
    removeCompanyScripts()
    await fetchCompanySettings()
    injectAllCompanyScripts()
  }

  /**
   * Initialize company scripts
   */
  const initializeCompanyScripts = async () => {
    await fetchCompanySettings()
    injectAllCompanyScripts()
  }

  return {
    // State
    isLoading,
    error,
    companySetting,
    headerScripts,
    footerScripts,

    // Methods
    fetchCompanySettings,
    injectCompanyHeaderScripts,
    injectCompanyFooterScripts,
    injectAllCompanyScripts,
    removeCompanyScripts,
    refreshCompanyScripts,
    initializeCompanyScripts
  }
}

/**
 * Convenience function for patient pages that use practitioner store
 * Automatically configures the composable to use practitioner data
 */
export function usePatientCompanyScripts() {
  return useCompanyScripts({
    useProviderStore: false,
    usePractitionerStore: true
  })
}
