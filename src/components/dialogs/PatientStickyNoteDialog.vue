<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const patientNote = ref(null)
const route = useRoute('apps-user-view-id')
const emit = defineEmits(['update:isDialogVisible'])
const isNote = computed(async() => {
    let userData = await useApi(`/apps/users/${ route.params.id }`)    
    console.log("sadasd",userData.patientNote);
    // patientNote.value =  userData.patientNote 
});
const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}

const updateNote = () => {

}

</script>

<template>
    <div v-if="isNote"></div>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    
  </VDialog>
</template>
