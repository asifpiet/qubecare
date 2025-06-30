<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import AiAssistance from '@/views/apps/patient/AiAssistance/AiAssistance.vue';
import Appointments from '@/views/apps/patient/Appointments/Appointments.vue';
import ConsentForm from '@/views/apps/patient/ConsentForm/ConsentForm.vue';
//import Intake from '@/views/apps/patient/Intake/Intake.vue';
import Intake from '@/views/apps/patient/Intake/IntakeList.vue';
import LabDiagnostics from '@/views/apps/patient/LabDiabnostics/LabDiabnostics.vue';
import AddPayment from '@/views/apps/patient/Payments/AddPayment.vue';
import Questioner from '@/views/apps/patient/Questioner/Questioner.vue';
import SubmitIntakes from '@/views/apps/patient/SubmitIntakes/SubmitIntakes.vue';
import Document from '@/views/apps/patient/document/document.vue';
import EmailLog from '@/views/apps/patient/list/EmailLog.vue';
import MessageList from '@/views/apps/patient/list/MessageListPatient.vue';
import PhoneLog from '@/views/apps/patient/list/PhoneLog.vue';
import TextMessage from '@/views/apps/patient/list/TextMessage.vue';
import Tasks from '@/views/apps/patient/list/tasks.vue';
import Vitals from '@/views/apps/patient/list/vitals.vue';
import actions from '@/views/apps/user/actions.vue';
import { useStore } from 'vuex';
const store = useStore()
const patientNote = ref()
const patientTags = ref([]);
const inputValue = ref('');
const tags = ref([]);
const isUserInfoEditDialogVisible = ref(false)
const isStickyNoteDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)
const isTagsEditDialogVisible =ref(false)
const isActionDialogVisible = ref(false)
const isEditNewUserDrawerVisible = ref(false)
const isTextMessageUserDrawerVisible = ref(false)
const isTaskUserDrawerVisible = ref(false)
const isVitalDrawerVisible = ref(false)
const isLabDiagnosticsDrawerVisible = ref(false)
const isQuestionerDrawerVisible = ref(false)
const isConsentFormDrawerVisible = ref(false)
const isIntakeDrawerVisible = ref(false)
const isSubmitIntakesDrawerVisible = ref(false)
const isAiAssistanceDrawerVisible = ref(false)
const isAppointmentsDrawerVisible = ref(false)
const isAddPaymentDrawerVisible = ref(false)
const isAddNewUserDrawerVisible = ref(false)
const isphoneLogDrawerVisible = ref(false)
const isMessageListDrawerVisible = ref(false)
const isDocumentDrawerVisible = ref(false)
const isTonalSnackbarVisible = ref(false)
const isDialogTwoShow =ref(false)
const isQuestionerDialogTwoShow =ref(false)
const isEmailDrawerVisible = ref(false)
const intakeForms = ref([])
const intakeFormRef = ref()
const questionerForms = ref([])
const questionerFormRef = ref()
const consentFormRef = ref()
const questionerFormId = ref(null)
const intakeFormId = ref(null)
const selectedPatient = ref(null)
const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

const selectedItem = ref([
  'Vuetify',
  'Programming',
])

const items1 = [
  'Programming',
  'Design',
  'Vue',
  'Vuetify',
]

const emit = defineEmits([
  'patientData',
  'submit',
  'patientTags',
  'update:isDrawerOpen',
 'openTextMessage',
  'openTaskDrawn',
  'openVitalDrawn',
  "openPhoneLog",
  "drawanOpenMessageList",
  'openLabDiagnosticsDrawn',
  'openSubmitIntakesDrawn',
  'openAppointmentsDrawn',
  'openAddPaymentDrawn',
  'openEmailDrawn',
  'openDocumentDrawn',
  'openIntakeDrawn',
  'openQuestionerDrawn',
  'openConsentFormDrawn',
  'openAiAssistance'
]);

onBeforeMount(() => {
  props.userData.avater = localStorage.getItem('patientAvater');
  getPatientTags();
})

const actionBox = async(item) => {
  selectedPatient.value = item
  await store.dispatch('getPatientData', {
    item:item
  })

}

const  getPatientTags =async() => {
  await store.dispatch('getPatientTags',{
    id: props.userData.patient_id
  });
  let ptags = store.getters.getPatientTags;
  console.log('ptags',ptags)
  patientTags.value = [];
  tags.value = [];
  if(ptags){
    
    if(ptags[0].tags.length > 0){
      patientTags.value = ptags[0].tags;
      tags.value = ptags[0].tags;
    }
    
  }
  patientNote.value = props.userData.patientNote;
}

const openTextMessageDrawn = ()=> {
  isActionDialogVisible.value = false;
  isTextMessageUserDrawerVisible.value = true;
}
const openPhoneLogDrawn = ()=> {
  isActionDialogVisible.value = false;
  isphoneLogDrawerVisible.value = true;
}
const openMessageListDrawn = ()=> {
  isActionDialogVisible.value = false;
  isMessageListDrawerVisible.value = true;
}

const openTaskDrawan = ()=> {
  isActionDialogVisible.value = false;
  isTaskUserDrawerVisible.value = true;
}
const openVitalUserDrawan = ()=> {
  isActionDialogVisible.value = false;
  isVitalDrawerVisible.value = true;
}
const openLabDiagnosticsUserDrawan = ()=> {
  isActionDialogVisible.value = false;
  isLabDiagnosticsDrawerVisible.value = true;
}
const openSubmitIntakesUserDrawan = ()=> {
  isActionDialogVisible.value = false;
  isSubmitIntakesDrawerVisible.value = true;
}
const openAiAssistanceDrawan = ()=> {
  console.log('openAiAssistanceUserDrawan')
  isActionDialogVisible.value = false;
  isAiAssistanceDrawerVisible.value = true;
}
const openAppointmentsUserDrawan = ()=> {
  isActionDialogVisible.value = false;
  isAppointmentsDrawerVisible.value = true;
}
const openAddPaymentUserDrawan = ()=> {
  isActionDialogVisible.value = false;
  isAddPaymentDrawerVisible.value = true;
};
const openEmailLogDrawan = ()=> {
  isActionDialogVisible.value = false;
  isEmailDrawerVisible.value = true;
}

const openPatientDocumentDrawan = () => {
  isActionDialogVisible.value = false;
  isDocumentDrawerVisible.value = true;
}

const openIntakeDrawan = async()=> {
    //isDialogTwoShow.value =true;
     isActionDialogVisible.value = false;
    isIntakeDrawerVisible.value = true;
    await store.dispatch('getIntakeFormsList');
    intakeForms.value = await store.getters.getIntakeForms;
}

const openQuestionerDrawan = async()=> {
    isQuestionerDialogTwoShow.value =true;
    // isActionDialogVisible.value = false;
    // isQuestionerDrawerVisible.value = true;
    await store.dispatch('getQuestionerFormsList');
    questionerForms.value = await store.getters.getQuestionerForms;
}

const openConsentFormDrawan = async()=> {
    // isConsentFormDialogTwoShow.value =true;
    isActionDialogVisible.value = false;
    isConsentFormDrawerVisible.value = true;
}

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

const selectedStates = ref([]);
const items = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'];

const updateTag = () => {
 
  console.log('updateTag', tags.value);
  emit('patientTags', {
    tags:tags.value,
    })
    isTagsEditDialogVisible.value = false;
    isStickyNoteDialogVisible.value = true;
    patientTags.value = tags.value;
}
const updateBio = (userData) => {
  emit('patientData', userData)
}



// Function to add a new tag
const addTag = () => {
  const newTag = inputValue.value.trim();
  if (newTag && !tags.value.includes(newTag)) {
    tags.value.push(newTag);
    inputValue.value = '';
     // Clear the input
  }
};

// Function to remove a tag
const removeTag = (index) => {
  tags.value.splice(index, 1);
};
watch(intakeFormId, async (newValue, oldValue) => {
  await store.dispatch('updateIntakeFormId', newValue);
  // console.log(`Input changed from "${oldValue}" to "${newValue}"`);
});
watch(questionerFormId, async (newValue, oldValue) => {
  await store.dispatch('updateQuestionerFormId', newValue);
  // console.log(`Input changed from "${oldValue}" to "${newValue}"`);
});
const selectIntakeForm = async() => {
  const { valid } = await intakeFormRef.value.validate()
    console.log(valid)
    if (valid) {
      isActionDialogVisible.value = false, 
      isIntakeDrawerVisible.value = true, 
      isDialogTwoShow.value = false
    }
};
const selectQuestionerForm = async() => {
  const { valid } = await questionerFormRef.value.validate()
    console.log(valid)
    if (valid) {
      isActionDialogVisible.value = false, 
      isQuestionerDrawerVisible.value = true, 
      isQuestionerDialogTwoShow.value = false
    }
};
</script>

<template>
  <!-- <div v-if="checkData"></div>  -->
  <v-col cols="12" class="text-right pb-0" style="align-self: flex-end;">
          <VSnackbar
      v-model="isStickyNoteDialogVisible"
      location="top end"
      variant="flat"
      color="success"
    >
    Patient tag Updated
    <template #actions>
              <VBtn
                  icon
                  color="white"
                  @click="isStickyNoteDialogVisible = false"
                >
                  x
              </VBtn>
    </template>
     </VSnackbar>
    </v-col>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.userData">
        <VCardText class="text-center pt-12 pb-0">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!props.userData.avater ? 'primary' : undefined"
            :variant="!props.userData.avater ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.userData.avater"
              :src="props.userData.avater"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.userData.firstName) }}  {{ avatarText(props.userData.lastName) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h5 class="text-h5 mt-4">
            {{ props.userData.firstName }}  {{ props.userData.lastName }}  
             <VBtn
              icon
              variant="text"
              color="medium-emphasis"
            >
              <VIcon icon="tabler-dots-vertical" @click="[isActionDialogVisible=true, actionBox(props.userData)]" />
            </VBtn>
          </h5>

          <p>Next Appointment: Not Available</p>
          <!-- <VChip
            label
            :color="resolveUserRoleVariant(props.userData.role).color"
            size="small"
            class="text-capitalize mt-4"
          >
            {{ props.userData.role }}
          </VChip> -->
        </VCardText>

        <VCardText>
          <VDivider/>
  <v-row align="start" justify="space-between">
   
    <!-- List on the left -->
    <v-col cols="8">
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
            <span class="text-body-1"> {{ dateFormat(props.userData.dateOfBirth) }} </span>
          </VListItemTitle>
          <VListItemTitle>
            <span class="text-h6">Age: </span>
            <span class="text-body-1">   {{ calculateAge(props.userData.dateOfBirth) }} </span>
          </VListItemTitle>
        </VListItem>
      </VList>
    </v-col>

    
     <v-col cols="4" class="text-right" style="align-self: flex-start;">
      <IconBtn >
            <VIcon icon="tabler-edit" class="text-primary" @click="isUserInfoEditDialogVisible = true" />
          </IconBtn>
    </v-col>
    
  </v-row>
   
            
            
  <v-row>
     
    <v-col cols="12" class="text-left mt-2">
      <span class="text-h6">Sticky Notes:  </span>
      <p>{{  props.userData.patientNote  }}</p>
    </v-col>
    <v-row align="start" justify="space-between">
      <v-col cols="8" class="pb-0">
        <p class="text-h6 ml-3">Tags:</p>
      </v-col>
      <v-col cols="4" class="text-right pb-0" style="align-self: flex-start;">
      <IconBtn >
            <VIcon icon="tabler-edit" class="text-primary" @click="isTagsEditDialogVisible = true" />
          </IconBtn>
    </v-col>
    <v-col cols="12" class="pt-0">
      <div class="d-flex flex-wrap ml-3" v-if="patientTags && patientTags.length > 0">
          <div v-for="(tag, index) in patientTags" :key="index">
            <v-chip class="mt-1 mr-1">
              {{ tag.trim() }}
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
  <VDialog
          v-model="isActionDialogVisible"
          width="800"
        >
        <DialogCloseBtn @click="isActionDialogVisible = false" />
        <VCard>
        <VCardText>
          <actions 
              :selectedPatient="selectedPatient"
              @openTextMessage="openTextMessageDrawn"
              @openPhoneLog="openPhoneLogDrawn"
              @openTaskDrawn="openTaskDrawan"
              @openVitalDrawn ="openVitalUserDrawan"
              @drawanOpenMessageList ="openMessageListDrawn"
              @openLabDiagnosticsDrawn ="openLabDiagnosticsUserDrawan"
              @openSubmitIntakesDrawn ="openSubmitIntakesUserDrawan"
              @openAppointmentsDrawn ="openAppointmentsUserDrawan"
              @openAddPaymentDrawn ="openAddPaymentUserDrawan"
              @openEmailDrawn ="openEmailLogDrawan"
              
              @openDocumentDrawn ="openPatientDocumentDrawan"
              @openIntakeDrawn ="openIntakeDrawan"
              @openQuestionerDrawn ="openQuestionerDrawan"
              @openConsentFormDrawn ="openConsentFormDrawan"
              @openAiAssistance ="openAiAssistanceDrawan"
          /> 
          </VCardText>
        </VCard> 
        </VDialog>
  <UserInfoEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    :user-data="props.userData"
     @submit="updateBio"
    
  />
  <VDialog
          v-model="isDialogTwoShow"
          class="v-dialog-sm"
        >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogTwoShow = false" />

      <VCard title="Intake Form">
        <VCardText>
          <VForm ref="intakeFormRef">
            <VRow>
              <VCol cols="9">
                  <AppSelect
                      v-model="intakeFormId"
                      label="Select Intake Form"
                      placeholder=""
                      :items="intakeForms"
                      item-value="id"
                      item-title="name"
                      :rules="[requiredValidator]"  
                  />
              </VCol>
              <VCol cols="3">
                  <VBtn class="mt-6" @click="selectIntakeForm">Select</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog
          v-model="isQuestionerDialogTwoShow"
          class="v-dialog-sm"
        >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isQuestionerDialogTwoShow = false" />

      <VCard title="Questioner Form">
        <VCardText>
          <VForm ref="questionerFormRef">
            <VRow>
              <VCol cols="9">
                  <AppSelect
                      v-model="questionerFormId"
                      label="Select Questioner Form"
                      placeholder=""
                      :items="questionerForms"
                      item-value="id"
                      item-title="name"
                      :rules="[requiredValidator]"  
                  />
              </VCol>
              <VCol cols="3">
                  <VBtn class="mt-6" @click="selectQuestionerForm">Select</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog
    v-model="isTagsEditDialogVisible"
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isTagsEditDialogVisible = false" />
    <VCard class="pa-2 pa-sm-10">
      <VCardText>
        <!-- 👉 Title -->
        <VCardTitle class="pb-0">Patient Tags</VCardTitle>
      <VCol cols="12">
      <AppCombobox
        v-model="tags"
        placeholder="Add Tags"
        label=""
        multiple
        chips
      />
      </VCol>
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="d-flex align-center gap-1 me-3 mb-2">
          </div>
          <VBtn
            color="primary" size="small"
            
            @click="updateTag"
          >
            Update
          </VBtn>
        </div>
      </VCardText>

    </VCard>
    </VDialog>

    
    <TextMessage  
     v-model:isDrawerOpen="isTextMessageUserDrawerVisible"
      v-if="isTextMessageUserDrawerVisible"
    />
    <PhoneLog  
     v-model:isDrawerOpen="isphoneLogDrawerVisible"
      v-if="isphoneLogDrawerVisible"
    />
    <MessageList  
     v-model:isDrawerOpen="isMessageListDrawerVisible"
     v-if="isMessageListDrawerVisible"
    />
    <EmailLog  
     v-model:isDrawerOpen="isEmailDrawerVisible"
     v-if="isEmailDrawerVisible"
    />
    
    <LabDiagnostics 
      v-model:isDrawerOpen="isLabDiagnosticsDrawerVisible" 
      v-if="isLabDiagnosticsDrawerVisible"
      />
      <SubmitIntakes 
      v-model:isDrawerOpen="isSubmitIntakesDrawerVisible" 
      v-if="isSubmitIntakesDrawerVisible"
      />
      <AiAssistance 
      v-model:isDrawerOpen="isAiAssistanceDrawerVisible" 
      v-if="isAiAssistanceDrawerVisible"
      />
    <Tasks   v-model:isDrawerOpen="isTaskUserDrawerVisible" 
     v-if="isTaskUserDrawerVisible"
      />
      <Vitals 
      v-model:isDrawerOpen="isVitalDrawerVisible"  v-if="isVitalDrawerVisible"/>
      <Document 
        v-model:isDrawerOpen="isDocumentDrawerVisible" v-if="isDocumentDrawerVisible"
      /> 
      <Appointments 
      v-model:isDrawerOpen="isAppointmentsDrawerVisible"  v-if="isAppointmentsDrawerVisible"
      />
      
      <AddPayment 
      v-model:isDrawerOpen="isAddPaymentDrawerVisible"  v-if="isAddPaymentDrawerVisible"
      /> 
      <Intake 
      v-model:isDrawerOpen="isIntakeDrawerVisible" 
      v-if="isIntakeDrawerVisible"
      :getIntakeForms="intakeForms"
      />
      <Questioner 
      v-model:isDrawerOpen="isQuestionerDrawerVisible" 
      v-if="isQuestionerDrawerVisible"
      />
      <ConsentForm 
      v-model:isDrawerOpen="isConsentFormDrawerVisible" 
      v-if="isConsentFormDrawerVisible"
      />

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
