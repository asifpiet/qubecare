import { inject } from 'vue'


let portalProvided = false

export function usePortal() {
  // if (!portalProvided) {
  // provide(portalSymbol, { portals: {}, removeCallbacks: {}, addCallbacks: {} })
  //   portalProvided = true
  // }
  const portals = inject('teleportPortal')

  const openPortal = (name, container) => {
    portals.value.portals[name] = container
    portals.value.addCallbacks[name]?.forEach((callback) => {
      callback(name, container)
    })
    delete portals.value.addCallbacks[name]
  }

  const closePortal = (name) => {
    delete portals.value.portals[name]
    portals.value.removeCallbacks[name]?.forEach((callback) => {
      callback(name)
    })
    delete portals.value.removeCallbacks[name]
  }

  const onPortalOpen = (name, callback) => {
    if (!portals.value.addCallbacks[name]) {
      portals.value.addCallbacks[name] = []
    }
    portals.value.addCallbacks[name].push(callback)
  }

  const onPortalClose = (name, callback) => {
    if (!portals.value.removeCallbacks[name]) {
      portals.value.removeCallbacks[name] = []
    }
    portals.value.removeCallbacks[name].push(callback)
  }

  const isPortalOpen = (name) => {
    return !!portals.value.portals[name]
  }

  const getPortalContainer = (name) => {
    return portals.value.portals[name]
  }

  const offPortalOpen = (name, callback) => {
    if (!portals.value.addCallbacks[name]) return
    const index = portals.value.addCallbacks[name].indexOf(callback)
    if (index !== -1) {
      portals.value.addCallbacks[name].splice(index, 1)
    }
  }

  const offPortalClose = (name, callback) => {
    if (!portals.value.removeCallbacks[name]) return
    const index = portals.value.removeCallbacks[name].indexOf(callback)
    if (index !== -1) {
      portals.value.removeCallbacks[name].splice(index, 1)
    }
  }

  return {
    portals,
    openPortal,
    closePortal,
    onPortalClose,
    onPortalOpen,
    isPortalOpen,
    getPortalContainer,
    offPortalOpen,
    offPortalClose,
  }
}
