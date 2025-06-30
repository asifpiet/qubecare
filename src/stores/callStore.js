import { defineStore } from 'pinia'

export const useCallStore = defineStore('call', {
    state: () => ({
        callOptions: {
            room: null,
            participant: null,
            patient: {},
            from: null
        },
        url: null,
        showUi: false,
        status: false,
        showMainUi: false,
        showMiniUi: false,
        teleportRef: false,
        teleport: false,
        enableCall: false,
        isJoin: false,
        teleportTo: '#livekitCall',
        portalReady: {

        }
    }),
    actions: {

    },
    getters: {},
})

