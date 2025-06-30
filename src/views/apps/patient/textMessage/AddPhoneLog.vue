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
})

const isLoading = ref(false)
const provider = ref()
const practitionerOptions = ref([  // Dropdown options
  { id: 1, name: 'Zeeshan Anjum' },
  { id: 2, name: 'Nasir Ali' },
  { id: 3, name: 'John Doe' },
]);
const currentStep = ref(0);
const selectedPractitioner = ref(null);
const selectedService = ref(null);
const selectedDate = ref(null);
const additionalNotes = ref(null);
const errorMessage = ref('');

await practitionerStore.practitionersList()

const getPractionerUser = computed(async () => {
  const usersFromStore = practitionerStore.practitioners;
  console.log(usersFromStore)

  practitionerOptions.value = usersFromStore.map(user => ({
    ...user,
    fullName: `${user.fname || ''} ${user.lname || ''}`.trim(),
  }));
  return practitionerOptions.value

})




const refVForm = ref(null)
const emit = defineEmits(['submit'])

const nextStep = () => {
  errorMessage.value = ''; // Reset error message  

  if (currentStep.value === 0) {
    if (!selectedPractitioner.value) {
      errorMessage.value = 'Please select a practitioner.';
      return;
    }
  } else if (currentStep.value === 1) {
    console.log('ffff')

    if (!additionalNotes.value) {
      errorMessage.value = 'Please enter Message.';
      return;
    }
  }
  console.log(practitionerOptions.value)
  const practitioner = practitionerOptions.value.find(practitioner => practitioner.id === selectedPractitioner.value);
  provider.value = practitioner.fullName
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
  // Handle form submission logic here  
  if (!additionalNotes.value) {
    errorMessage.value = 'Please enter Message.';
    return;
  }
  let patientId = props.patient.id
  await patientStore.AddPhoneLog(
    {
      user_id: selectedPractitioner.value,
      provider: provider.value,
      message: additionalNotes.value
    },
    patientId
  )

  emit('submit', 'success')
  console.log('Form submitted with:', {
    practitioner: selectedPractitioner.value,
    message: additionalNotes.value,
  });
};

const cancelForm = () => {
  // Handle form cancellation logic here  
  console.log('Form canceled');
  // Optionally reset the form  
  emit('submit', 'cancel')
  selectedPractitioner.value = null;
  selectedService.value = null;
  selectedDate.value = null;
  currentStep.value = 0; // Reset to the first step  
};

</script>
<template>
  <VForm class="mt-2" ref="refVForm" v-if="getPractionerUser">
    <VRow v-if="errorMessage" class="error-message">
      <VCol cols="12">
        <p style="color: red;">{{ errorMessage }}</p>
      </VCol>
    </VRow>
    <VRow v-if="currentStep === 0">
      <AppSelect v-model="selectedPractitioner" label="Select Practitioner" :items="practitionerOptions"
        item-title="fullName" item-value="id" />
      <VCol cols="12">
        <VBtn color="primary" @click="nextStep" class="mr-2">Create Phone Log</VBtn>
        <VBtn color="secondary" @click="cancelForm">Cancel</VBtn>
      </VCol>
    </VRow>

    <VRow v-if="currentStep === 1">

      <VTextarea v-model="additionalNotes" label="Message" placeholder="Placeholder Text" />
      <VCol cols="12">
        <VBtn color="primary" @click="sendMessage" class="mr-2">Send Message</VBtn>
        <VBtn color="secondary" @click="prevStep">Back</VBtn>
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
