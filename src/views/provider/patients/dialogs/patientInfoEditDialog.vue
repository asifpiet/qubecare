<script setup>
import { usePatientStore } from '@/stores/patientStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const patientStore = usePatientStore()
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const refInputEl = ref()

const emit = defineEmits([
  'submit',
  'update:isDialogVisible',
])



const formatPhoneNumber = (inputValue) => {
  const numericValue = inputValue.replace(/\D/g, '');
  if (numericValue.length <= 10) {
    return numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    const truncatedValue = numericValue.slice(0, 10);
    return truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};

const updatePhone = (field, event) => {
  const formattedValue = formatPhoneNumber(event.target.value);
  if (field === 'preferredPhone') {
    patientStore.demographic.preferredPhone = formattedValue;
  }
};
const onSubmit = async () => {
  isLoading.value = true;
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      let formData = null;
       await patientStore.saveDemographic(
        formData,
      )
      
      

    } else {
      isLoading.value = false;
    }
    dialogModelValueUpdate(false);
  })

}



const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>

  <VNavigationDrawer v-model="props.isDialogVisible" temporary :width="600" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection title='Update Information'
          @cancel="dialogModelValueUpdate(false)" />
        <PerfectScrollbar :options="{ wheelPropagation: false }">
          
      
  

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          {{ $t('Edit User Information') }}
        </h4>
        <p class="text-body-1 text-center mb-6">
          {{ $t('Updating user details will receive a privacy audit.') }}
        </p>

        <!-- 👉 Form -->
        <VForm  ref="refForm" v-model="isFormValid"
          class="mt-6"
          @submit.prevent="onSubmit"
        >
          <VRow>
            <!-- 👉 First Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="patientStore.demographic.firstName"
                :label="$t('First Name')"
                :placeholder="$t('First Name')"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="patientStore.demographic.lastName"
                :label="$t('Last Name')"
                placeholder="$t('Last Name')"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="patientStore.demographic.dateOfBirth"
                type="date"
                :label="$t('Date of Birth')"
              />
            </VCol>

            <VCol cols="12"
            md="6">
                <AppTextField
                  v-model="patientStore.demographic.preferredPhone"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[requiredValidator, validUSAPhone]"
                  :label="$t('Phone Number')"
                  max="14"
                  @input="(e) => updatePhone('preferredPhone', e)"
                  placeholder="i.e. (000) 000-0000"
                />
              </VCol>
           
            <VCol
              cols="12"
              md="12"
            >
            <v-textarea
            v-model="patientStore.demographic.patientNote"
            :label="$t('Note')"
            :placeholder="$t('Note')"
          />
            </VCol>

           
           
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn type="submit" size="small">
                {{ $t('Update') }}
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                size="small"
                @click="dialogModelValueUpdate(false)"
              >
                {{ $t('Cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </PerfectScrollbar>
</VNavigationDrawer>
</template>
