<script setup>
import { usePatientStore } from '@/stores/patientStore';
import { useStore } from 'vuex';

const { currentUser, currentRole, logout } = useAuth()
const patientStore = usePatientStore()
const store = useStore()

const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
})
const isLoading = ref(false)
const currentStep = ref(0);
const message = ref();
const subject = ref();
const selectedService = ref(null);
const errorMessage = ref('');
const refVForm = ref(null)
const emit = defineEmits(['submit'])

const sendMessage = async () => {
  const { valid } = await refVForm.value.validate()
  if (valid) {
    let userData = currentUser.value
    patientStore.AddMessage(
      {
        subject: subject.value,
        message: message.value,
        with_name: userData.fullName
      },
      props.patient.id
    )

    emit('submit', 'success')
  }
};

const cancelForm = () => {
  emit('submit', 'cancel')
  subject.value = null;
  selectedService.value = null;
  message.value = null;
  currentStep.value = 0;
};
</script>
<template>
  <VForm class="mt-2" ref="refVForm">
    <VRow v-if="errorMessage" class="error-message">
      <VCol cols="12">
        <p style="color: red;">{{ errorMessage }}</p>
      </VCol>
    </VRow>


    <VRow>
      <VCol cols="12">
        <AppTextField v-model="subject" :label="$t('Subject')" :placeholder="$t('Subject')"
          :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12">
        <VTextarea v-model="message" :label="$t('Notes')" :placeholder="$t('Notes')" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12">
        <VBtn color="primary" @click="sendMessage" class="mr-2">{{ $t('Save') }}</VBtn>
        <VBtn color="secondary" @click="cancelForm">{{ $t('Cancel') }}</VBtn>
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
