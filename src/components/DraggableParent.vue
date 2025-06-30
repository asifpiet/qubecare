<script setup>
const draggableParentRef = ref(null)
const position = ref({ x: 50, y: 50 }); // Initial position
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });

onMounted(()=>{
    draggableParentRef.value.parentElement.addEventListener('mousedown',startDrag)
})
const startDrag = (e) => {
    isDragging.value = true;
    offset.value.x = e.clientX - position.value.x;
    offset.value.y = e.clientY - position.value.y;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
};

const drag = (e) => {
    if (isDragging.value) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const newX = e.clientX - offset.value.x;
    const newY = e.clientY - offset.value.y;

    // Constrain to screen bounds
    const maxX = windowWidth - 150; // Assuming 150px width of the box
    const maxY = windowHeight - 150; // Assuming 150px height of the box

    position.value.x = Math.max(0, Math.min(newX, maxX));
    position.value.y = Math.max(0, Math.min(newY, maxY));

    draggableParentRef.value.parentElement.style.top = `${position.value.y}px`
    draggableParentRef.value.parentElement.style.left = `${position.value.x}px`
    }
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
};

onUnmounted(() => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
});
</script>
<template>
    <div
    ref="draggableParentRef"
    class="draggableCall"
    >
    </div>
</template>