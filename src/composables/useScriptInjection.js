import { onUnmounted, readonly, ref } from 'vue'

/**
 * Composable for managing dynamic script injection
 * Handles both header scripts (injected into <head>) and footer scripts (injected before </body>)
 */
export function useScriptInjection() {
  const injectedScripts = ref(new Set())
  const injectedElements = ref([])

  /**
   * Safely inject HTML content into the document
   * @param {string} htmlContent - The HTML content to inject (scripts, meta tags, etc.)
   * @param {string} location - Where to inject: 'head' or 'body'
   * @param {string} identifier - Unique identifier for this injection to prevent duplicates
   */
  const injectHTML = (htmlContent, location = 'head', identifier = null) => {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return
    }

    // Create unique identifier if not provided
    const id = identifier || `injected-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Prevent duplicate injections
    if (injectedScripts.value.has(id)) {
      console.warn(`Script with identifier "${id}" already injected`)
      return
    }

    try {
      // Create a temporary container to parse the HTML
      const tempContainer = document.createElement('div')
      tempContainer.innerHTML = htmlContent.trim()

      // Get the target location
      const targetElement = location === 'head' ? document.head : document.body

      // Process each element in the HTML content
      Array.from(tempContainer.children).forEach((element, index) => {
        const clonedElement = element.cloneNode(true)

        // Add data attribute for tracking
        clonedElement.setAttribute('data-injected-id', `${id}-${index}`)

        // Handle script elements specially to ensure they execute
        if (element.tagName.toLowerCase() === 'script') {
          const newScript = document.createElement('script')

          // Copy all attributes
          Array.from(element.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value)
          })

          // Copy script content
          if (element.src) {
            newScript.src = element.src
          } else {
            newScript.textContent = element.textContent
          }

          // Add tracking attribute
          newScript.setAttribute('data-injected-id', `${id}-${index}`)

          // Inject the script
          if (location === 'head') {
            document.head.appendChild(newScript)
          } else {
            document.body.appendChild(newScript)
          }

          injectedElements.value.push(newScript)
        } else {
          // For non-script elements, inject directly
          targetElement.appendChild(clonedElement)
          injectedElements.value.push(clonedElement)
        }
      })

      // Mark as injected
      injectedScripts.value.add(id)

      console.log(`Successfully injected content with ID: ${id} into ${location}`)
    } catch (error) {
      console.error('Error injecting HTML content:', error)
    }
  }

  /**
   * Inject header scripts into the <head> section
   * @param {string} scripts - The script content to inject
   * @param {string} identifier - Optional unique identifier
   */
  const injectHeaderScripts = (scripts, identifier = 'header-scripts') => {
    injectHTML(scripts, 'head', identifier)
  }

  /**
   * Inject footer scripts before the closing </body> tag
   * @param {string} scripts - The script content to inject
   * @param {string} identifier - Optional unique identifier
   */
  const injectFooterScripts = (scripts, identifier = 'footer-scripts') => {
    injectHTML(scripts, 'body', identifier)
  }

  /**
   * Remove injected content by identifier
   * @param {string} identifier - The identifier of the content to remove
   */
  const removeInjectedContent = (identifier) => {
    const elementsToRemove = injectedElements.value.filter(el =>
      el.getAttribute('data-injected-id')?.startsWith(identifier)
    )

    elementsToRemove.forEach(element => {
      element.remove()
    })

    // Remove from tracking arrays
    injectedElements.value = injectedElements.value.filter(el =>
      !el.getAttribute('data-injected-id')?.startsWith(identifier)
    )
    injectedScripts.value.delete(identifier)

    console.log(`Removed injected content with identifier: ${identifier}`)
  }

  /**
   * Clean up all injected content
   */
  const cleanupInjectedContent = () => {
    injectedElements.value.forEach(element => {
      try {
        element.remove()
      } catch (error) {
        console.warn('Error removing injected element:', error)
      }
    })

    injectedElements.value = []
    injectedScripts.value.clear()
  }

  /**
   * Check if content with given identifier is already injected
   * @param {string} identifier - The identifier to check
   * @returns {boolean}
   */
  const isInjected = (identifier) => {
    return injectedScripts.value.has(identifier)
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanupInjectedContent()
  })

  return {
    injectHTML,
    injectHeaderScripts,
    injectFooterScripts,
    removeInjectedContent,
    cleanupInjectedContent,
    isInjected,
    injectedScripts: readonly(injectedScripts),
    injectedElements: readonly(injectedElements)
  }
}
