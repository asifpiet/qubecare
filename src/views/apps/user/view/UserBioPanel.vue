<script setup>
import { useStore } from 'vuex';
const store = useStore()
const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'patientData',
  'submit'
]);

const standardPlan = {
  plan: 'Standard',
  price: 99,
  benefits: [
    '10 Users',
    'Up to 10GB storage',
    'Basic Support',
  ],
}
const patientNote = ref(props.userData.patientNote)
const isUserInfoEditDialogVisible = ref(false)
const isStickyNoteDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)
const  calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Check if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const updateNote = () => {
  emit('patientData', {
    patientNote: patientNote.value
    })
    isStickyNoteDialogVisible.value = false
}
const updateBio = (userData) => {
  emit('patientData', userData)
}


</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.userData">
        <VCardText class="text-center pt-12 pb-0">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!props.userData.avatar ? 'primary' : undefined"
            :variant="!props.userData.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.userData.avatar"
              :src="props.userData.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.userData.fullName) }}
            </span>
          </VAvatar>

          
          <h5 class="text-h5 mt-4">
            {{ props.userData.fullName }}
          </h5>

          <p>Next Appointment: Not Available</p>
          
        </VCardText>

        <VCardText>
          <VDivider/>
  <v-row align="start" justify="space-between">
    <!-- List on the left -->
    <v-col cols="12">
      <VList class="card-list mt-2">
        <VListItem>
        <VListItem>
          <VListItemTitle>
            <span class="text-h6">Email:  </span>
            <span class="text-body-1"> {{ props.userData.email }} </span>
          </VListItemTitle>
        </VListItem>
        <VListItem>
          <VListItemTitle>
            <span  class="text-h6">Contact: </span>
            <span class="text-body-1"> {{ props.userData.preferredPhone }}</span>
          </VListItemTitle>
        </VListItem>
        <VListItemTitle>
            <span class="text-h6">DOB: </span>
            <span class="text-body-1"> {{ props.userData.dateOfBirth }} </span>
          </VListItemTitle>
          <VListItemTitle>
            <span class="text-h6">Age: </span>
            <span class="text-body-1">   {{ calculateAge(props.userData.dateOfBirth) }} </span>
          </VListItemTitle>
        </VListItem>
      </VList>
    </v-col>

    <!-- Edit button on the top right -->
    <!-- <v-col cols="4" class="text-right" style="align-self: flex-start;">
      <IconBtn @click="isUserInfoEditDialogVisible = true">
            <VIcon icon="tabler-edit" class="text-primary" />
          </IconBtn>
    </v-col> -->
  </v-row>

  <VDivider class="my-1" />
  <v-row>
    <v-col cols="12" class="text-right pb-0" style="align-self: flex-end;">
      <IconBtn @click="isStickyNoteDialogVisible = true">
            <VIcon icon="tabler-edit" class="text-primary pb-0" />
          </IconBtn>
         
    </v-col>
    <v-col cols="12" class="text-left pt-0">
      <p>{{  props.userData.patientNote }}</p>
    </v-col>
  </v-row>
</VCardText>

        <VCardText class="d-flex justify-center gap-x-4">
         
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  
  <UserInfoEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    :user-data="props.userData"
    @submit="updateBio"
  />

    <VDialog
    v-model="isStickyNoteDialogVisible"
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    >
    
    <DialogCloseBtn @click="isStickyNoteDialogVisible = false" />
    <VCard class="pa-2 pa-sm-10">
      <VCardText>
        <h4 class="text-h4 text-center mb-2">
          Patient Note
        </h4>
        

        <div class="d-flex justify-space-between flex-column flex-sm-row gap-4 pb-2">
          <v-textarea
            v-model="patientNote"
            label="Note"
            placeholder="Note"
          />
        </div>
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="d-flex align-center gap-1 me-3 mb-2">
          </div>
          <VBtn
            color="primary"
            variant="tonal"
            @click="updateNote"
          >
            Update
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Confirm Dialog -->
    </VCard>
    </VDialog>
  <!-- <PatientStickyNoteDialog v-model:isDialogVisible="isStickyNoteDialogVisible"
     :user-data="props.userData"
  /> -->
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
