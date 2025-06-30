<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import { usePatientStore } from '@/stores/patientStore';
import actions from '@/views/provider/patients/actions.vue';
import PatientInfoEditDialog from '@/views/provider/patients/dialogs/patientInfoEditDialog.vue';
import PatientTagsDialog from '@/views/provider/patients/dialogs/patientTagsDialog.vue';
//import Intake from '@/views/apps/patient/Intake/Intake.vue';
const patientStore = usePatientStore()
const isUserInfoEditDialogVisible = ref(false)
const isTagsEditDialogVisible = ref(false)
const isActionDialogVisible = ref(false)
const selectedPatient = ref(null)
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
})
patientStore.patientTags(props.patient.id);


const actionBox = async (item) => {
  selectedPatient.value = item
}





const calculateAge = (dateOfBirth) => {
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





</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard v-if="patientStore.demographic">
        <VCardText class="text-center pt-12 pb-0">
          <!-- 👉 Avatar -->
          <VAvatar rounded :size="100" :color="!patientStore.demographic.avater ? 'primary' : undefined"
            :variant="!patientStore.demographic.avater ? 'tonal' : undefined">
            <VImg v-if="patientStore.demographic.avater" :src="patientStore.demographic.avater" />
            <span v-else class="text-5xl font-weight-medium">
              {{ avatarText(patientStore.demographic.firstName) }} {{ avatarText(patientStore.demographic.lastName) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h5 class="text-h5 mt-4">
            {{ patientStore.demographic.firstName }} {{ patientStore.demographic.lastName }}
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" @click="[isActionDialogVisible = true, actionBox(props.userData)]" />
            </VBtn>
          </h5>

          <p>{{ $t('Next Appointment: Not Available') }}</p>
        </VCardText>

        <VCardText>
          <VDivider />
          <v-row align="start" justify="space-between">

            <!-- List on the left -->
            <v-col cols="8">
              <VList class="card-list mt-2">
                <VListItem>
                  <VListItem>
                    <VListItemTitle>
                      <span class="text-h6">{{ $t('Email:') }} </span>
                      <span class="text-body-1"> {{ patientStore.demographic.email }} </span>
                    </VListItemTitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>
                      <span class="text-h6"> {{ $t('Contact:') }} </span>
                      <span class="text-body-1"> {{ patientStore.demographic.preferredPhone }}</span>
                    </VListItemTitle>
                  </VListItem>
                  <VListItemTitle>
                    <span class="text-h6">{{ $t('DOB:') }}   </span>
                    <span class="text-body-1"> {{ dateFormat(patientStore.demographic.dateOfBirth) }} </span>
                  </VListItemTitle>
                  <VListItemTitle>
                    <span class="text-h6">{{ $t('Age:') }} </span>
                    <span class="text-body-1"> {{ calculateAge(patientStore.demographic.dateOfBirth) }} </span>
                  </VListItemTitle>
                </VListItem>
              </VList>
            </v-col>


            <v-col cols="4" class="text-right" style="align-self: flex-start;">
              <IconBtn>
                <VIcon icon="tabler-edit" class="text-primary" @click="isUserInfoEditDialogVisible = true" />
              </IconBtn>
            </v-col>

          </v-row>



          <v-row>

            <v-col cols="12" class="text-left mt-2">
              <span class="text-h6"> {{ $t('Sticky Notes:') }} </span>
              <p>{{ patientStore.demographic.patientNote }}</p>
            </v-col>
            <v-row align="start" justify="space-between">
              <v-col cols="8" class="pb-0">
                <p class="text-h6 ml-3">{{ $t('Tags:') }}</p>
              </v-col>
              <v-col cols="4" class="text-right pb-0" style="align-self: flex-start;">
                <IconBtn>
                  <VIcon icon="tabler-edit" class="text-primary" @click="patientStore.isDrawerOpen = true" />
                </IconBtn>
              </v-col>
              <v-col cols="12" class="pt-0">
                <div class="d-flex flex-wrap ml-3" v-if="patientStore.tags && patientStore.tags.length > 0">
                  <div v-for="(tag, index) in patientStore.tags" :key="index">
                    <v-chip class="mt-1 mr-1">
                      {{ tag }}
                    </v-chip>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-row>
        </VCardText>
        <VCardText class="d-flex justify-center gap-x-4">
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <actions :patient="patientStore" v-model:showDialog="isActionDialogVisible" />
  <PatientInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" />
  <PatientTagsDialog v-if="patientStore.isDrawerOpen" :width="$vuetify.display.smAndDown ? 'auto' : 650" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}

.tag-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  background-color: #e9eaff;
  border-radius: 4px;
  margin: 2px;
  padding: 5px 10px;
}

.tag-label {
  margin-right: 5px;
  color: #454ce0;
}

.tag-remove {
  cursor: pointer;
  color: 'text-primary';
}

.tag-new {
  margin-top: 5px;
}
</style>
