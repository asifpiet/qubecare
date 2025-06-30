<script setup>
import { defineProps, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';

const portalContainer = ref(null)
const { onPortalOpen, onPortalClose, isPortalOpen, offPortalClose, offPortalOpen, getPortalContainer } = usePortal()
const parantContainer = ref(null)
const elmToTeleport = ref(null)

const props = defineProps({
    
    to: {
        type: String,
        required: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})
const iframe = ref(null)
const localTo = ref(props.to)

const portalOpned = () => {
    const container = getPortalContainer(localTo.value)
    container.appendChild(elmToTeleport.value)
    onPortalClose(localTo.value, portalClosing)
    // doUpdate()
}

const portalClosing = () => {
    moveFromPortal()
}
const moveFromPortal = () => {
    offPortalClose(localTo.value, portalClosing)
    parantContainer.value.appendChild(elmToTeleport.value)
}

const moveToPortal = (to, prevTo) => {
    // offPortalOpen(localTo.value, portalOpned)
    if (isPortalOpen(localTo.value)) {
        portalOpned()
    } else {
        onPortalOpen(localTo.value, portalOpned)
    }
}

const doUpdate = () => {
    if (props.disabled && elmToTeleport.value.parentElement != parantContainer.value) {
        // localTo.value = null
        moveFromPortal()
    } else {
        if (!props.disabled && elmToTeleport.value.parentElement == parantContainer.value) {
            // moveFromPortal()
            moveToPortal(props.to, localTo.value)
            // localTo.value = props.to
        }
    }
}

onMounted(() => {
    console.log('onMounted')

    // parantContainer.value = document.body
    // elmToTeleport.value = document.createElement('div')
    // parantContainer.value.appendChild(elmToTeleport.value)
    // iframe.value = document.createElement('iframe')
    // elmToTeleport.value.appendChild(iframe.value)
    // iframe.value.src = props.iframeURL


    doUpdate()
})

watch(
    () => props.iframeURL,
    (newURL) => {
        if (iframe.value) {
            iframe.value.src = newURL;
        }
    }
);

onBeforeUnmount(() => {
    console.log('onBeforeUnmount')
    offPortalClose(localTo.value, portalClosing)
    offPortalOpen(localTo.value, portalOpned)
    moveFromPortal()
})
onUpdated(() => {
    console.log('onUpdated')
    doUpdate()
})
</script>
<template>
    <div key="teleport-parent" ref="parantContainer">
        <div ref="elmToTeleport">
            <slot></slot>
        </div>
    </div>
</template>
