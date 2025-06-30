<script setup>
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';

const practitionerStore = usePractitionerStore()
const patientStore = usePatientStore()
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  emailData: {
    type: String,
    required: true,
  }
})
const practitionerOptions = ref([]);
const currentStep = ref(0);
const selectedPractitioner = ref(null);
const messageText = ref(null);
const subject = ref(null);
const to_email = ref(null);
const from_email = ref(null);
const emailTempalte = ref(null);

const errorMessage = ref('');
await practitionerStore.practitionersList()





const refVForm = ref(null)
const emit = defineEmits(['submit'])

const emailTemplate = [
  { value: 'None', text: 'None' },

];

const nextStep = () => {
  errorMessage.value = ''; // Reset error message  

  if (currentStep.value === 0) {
    if (!selectedPractitioner.value) {
      errorMessage.value = 'Please select a practitioner.';
      return;
    }
  } else if (currentStep.value === 1) {

    if (!messageText.value) {
      errorMessage.value = 'Please enter Message.';
      return;
    }
  }
  console.log(selectedPractitioner.value)
  const practitioner = practitionerOptions.value.find(practitioner => practitioner.id === selectedPractitioner.value);
  from_email.value = practitioner.fullName
  if (currentStep.value < 2) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const sendMessage = async () => {

  const { valid } = await refVForm.value.validate()
  if (valid) {
    let patientId = props.patient.id
    patientStore.AddEmail(
      {
        practitioner: selectedPractitioner.value,
        messageText: messageText.value,
        to_email: to_email.value,
        from_email: from_email.value,
        emailTempalte: emailTempalte.value,
        subject: subject.value,
        id: patientId,
      },
      patientId
    )

    emit('submit', 'success')
  }
};

const cancelForm = () => {
  // Optionally reset the form  
  emit('submit', 'cancel')
  selectedPractitioner.value = null;
  messageText.value = null;
  to_email.value = null;
  from_email.value = null;
  emailTempalte.value = null;
  subject.value = null;
  currentStep.value = 0; // Reset to the first step  
};
const resetForm = () => {
  // Handle form cancellation logic here  
  console.log('Form canceled');
  // Optionally reset the form  

  messageText.value = null;
  to_email.value = null;
  from_email.value = null;
  emailTempalte.value = null;
  subject.value = null;
  currentStep.value = 0; // Reset to the first step  
};

onMounted(async () => {
  const usersFromStore = practitionerStore.practitioners;
  console.log(props.emailData, props.patient.demographic.email)
  practitionerOptions.value = usersFromStore.map(user => ({
    ...user,
    fullName: `${user.fname || ''} ${user.lname || ''}`.trim(),
  }));
  to_email.value = props.patient.demographic.email
  console.log(practitionerOptions.value)
})



</script>
<template>

  <div></div>
  <VForm class="mt-2" ref="refVForm">
    <VRow v-if="errorMessage" class="error-message">
      <VCol cols="12">
        <p style="color: red;">{{ errorMessage }}</p>
      </VCol>
    </VRow>
    <VRow v-if="currentStep === 0">
      <AppSelect v-model="selectedPractitioner" label="Select Practitioner" :items="practitionerOptions"
        item-title="fullName" item-value="id" placeholder="Select Practitioner" />
      <VCol cols="12">
        <VBtn color="primary" @click="nextStep" class="mr-2">Send Email</VBtn>
        <VBtn color="secondary" @click="cancelForm" class="mr-2">Cancel</VBtn>
        <VBtn color="secondary" @click="resetForm" class="mr-2">Reset</VBtn>

      </VCol>
    </VRow>

    <VRow v-if="currentStep === 1">
      <VCol cols="6">
        <AppSelect v-model="emailTempalte" label="Email Template" :items="emailTemplate" item-title="text"
          item-value="value" :rules="[requiredValidator]" placeholder="Select Email Template" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="to_email" label="To" placeholder="zee@test.com" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="subject" label="Subject" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="6">
        <AppTextField v-model="from_email" label="From" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12">
        <TiptapEditor v-model="messageText" class="border rounded" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12">
        <VBtn color="primary" @click="sendMessage" class="mr-2">Send Message</VBtn>
        <VBtn color="secondary" @click="cancelForm" class="mr-2">Cancel</VBtn>
        <VBtn color="secondary" @click="resetForm" class="mr-2">Reset</VBtn>
        <VBtn color="secondary" @click="prevStep" class="mr-2">Back</VBtn>
      </VCol>
    </VRow>



  </VForm>

</template>
<style scoped>
.notes {
  margin-top: 20px;
  font-size: 0.9em;
  color: #555;
  background: #eee;
  padding: 10px;
}
</style>
