import { useAuth } from '@/composables/useAuth'
import { computed, ref, watch } from 'vue'
import { useScriptInjection } from './useScriptInjection'

/**
 * Composable for managing company-specific script injection for authenticated patient pages
 * Uses the patient's userData.company information instead of fetching from provider store
 */
export function usePatientCompanyScripts() {
  const { injectHeaderScripts, injectFooterScripts, removeInjectedContent, isInjected } = useScriptInjection()

  const isLoading = ref(false)
  const error = ref(null)
  const companySetting = ref(null)

  // Get current user from global auth
  const { currentUser } = useAuth()

  // Computed properties for scripts from patient's userData
  const headerScripts = computed(() => {
    console.log('Computing header scripts, currentUser:', currentUser.value)
    if (currentUser.value?.company) {
      console.log('Company data found:', currentUser.value.company)
      return currentUser.value.company.header_scripts || ''
    }
    console.log('No company data found in currentUser')
    return ''
  })

  const footerScripts = computed(() => {
    console.log('Computing footer scripts, currentUser:', currentUser.value)
    if (currentUser.value?.company) {
      console.log('Company data found:', currentUser.value.company)
      return currentUser.value.company.footer_scripts || ''
    }
    console.log('No company data found in currentUser')
    return ''
  })

  /**
   * Get company settings from patient's userData
   */
  const fetchCompanySettings = async () => {
    try {
      isLoading.value = true
      error.value = null

      if (currentUser.value?.company) {
        companySetting.value = currentUser.value.company
        console.log('Company settings from patient userData:', companySetting.value)
      } else {
        console.log('No company data found in patient userData')
      }
    } catch (err) {
      error.value = err
      console.error('Error accessing patient company settings:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Inject company header scripts
   */
  const injectCompanyHeaderScripts = () => {
    if (headerScripts.value && headerScripts.value.trim()) {
      if (!isInjected('patient-company-header-scripts')) {
        injectHeaderScripts(headerScripts.value, 'patient-company-header-scripts')
        console.log('Patient company header scripts injected')
      }
    }
  }

  /**
   * Inject company footer scripts
   */
  const injectCompanyFooterScripts = () => {
    if (footerScripts.value && footerScripts.value.trim()) {
      if (!isInjected('patient-company-footer-scripts')) {
        injectFooterScripts(footerScripts.value, 'patient-company-footer-scripts')
        console.log('Patient company footer scripts injected')
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
    removeInjectedContent('patient-company-header-scripts')
    removeInjectedContent('patient-company-footer-scripts')
    console.log('Patient company scripts removed')
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
    console.log('Initializing patient company scripts...')
    await fetchCompanySettings()
    injectAllCompanyScripts()
    console.log('Patient company scripts initialization complete')
  }

  // Watch for changes in currentUser to reinject scripts when user data updates
  watch(() => currentUser.value?.company, (newCompany, oldCompany) => {
    if (newCompany && newCompany !== oldCompany) {
      console.log('Patient company data updated, refreshing scripts')
      refreshCompanyScripts()
    }
  }, { deep: true })

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
