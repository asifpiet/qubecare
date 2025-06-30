<script setup>
const props = defineProps({
  userData: {
    type: Object,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})
const firstName = ref()
const lastName = ref()
const preferredPhone = ref()
const email = ref()
const fullName = ref()
const dateOfBirth = ref()
const sexatBirth =ref()
const middleName  =ref()
const address = ref()
const city = ref()
const state = ref()
const zip = ref()
const race =ref()
const patientNote =ref()
const alternativePhone =ref()
const status = ref()
const emit = defineEmits([
  'submit',
  'update:isDialogVisible',
])

// const userData = ref(structuredClone(toRaw(props.userData)))
// const isUseAsBillingAddress = ref(false)

// watch(() => props, () => {
//   userData.value = structuredClone(toRaw(props.userData))
//   console.log("sadsdxxxxx", userData.value);
  
// })

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
    preferredPhone.value = formattedValue;
  }
};
const userDispalyData = computed(() => {
  console.log("userDispalyData",props.userData)
  firstName.value = props.userData.firstName;
  lastName.value = props.userData.lastName;
  fullName.value = props.userData.firstName +' '+props.userData.lastName; 
  preferredPhone.value = props.userData.preferredPhone;
  alternativePhone.value = props.userData.alternativePhone;
  email.value = props.userData.email;
  dateOfBirth.value = props.userData.dateOfBirth;
  sexatBirth.value = props.userData.sexatBirth;
  middleName.value = props.userData.middleName;
  address.value = props.userData.address;
  city.value = props.userData.city;
  state.value = props.userData.state;
  zip.value = props.userData.zipcode;
  race.value = props.userData.race;
  patientNote.value = props.userData.patientNote;
  status.value = true;
  
});

const onFormSubmit = () => {
  console.log(">>>>>",props.userData)
  emit('update:isDialogVisible', false)
  emit('submit',{
    firstName: firstName.value,
    lastName: lastName.value,
    preferredPhone:preferredPhone.value,
    alternativePhone:alternativePhone.value,
    email:email.value,
    fullName:firstName.value+' '+ lastName.value,
    dateOfBirth: dateOfBirth.value,
    sexatBirth:sexatBirth.value,
    middleName:middleName.value,
    address:address.value,
    city:city.value,
    state:state.value,
    zipcode:zip.value,
    race:race.value,
    patientNote:patientNote.value,
    status:status.value
  })
}

const onFormReset = () => {
  // userData.value = structuredClone(toRaw(props.userData))
  emit('update:isDialogVisible', false)
}

const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <div v-if="userDispalyData"></div>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          Edit User Information
        </h4>
        <p class="text-body-1 text-center mb-6">
          Updating user details will receive a privacy audit.
        </p>

        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 First Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="firstName"
                label="First Name"
                placeholder="John"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="lastName"
                label="Last Name"
                placeholder="Doe"
              />
            </VCol>

            <!-- 👉 Username -->
            <!-- <VCol cols="12">
              <AppTextField
                v-model="userData.username"
                label="Username"
                placeholder="john.doe.007"
              />
            </VCol> -->

            <!-- 👉 Billing Email -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="dateOfBirth"
                type="date"
                label="Date of Birth"
              />
            </VCol>

            <!-- 👉 Status -->
            <!-- <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                v-model="userData.status"
                label="Status"
                placeholder="Active"
                :items="['Active', 'Inactive', 'Pending']"
              />
            </VCol> -->

            <!-- 👉 Tax Id -->
            <!-- <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.taxId"
                label="Tax ID"
                placeholder="123456789"
              />
            </VCol> -->

            <!-- 👉 Contact -->
            <VCol cols="12"
            md="6">
                <AppTextField
                  v-model="preferredPhone"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[requiredValidator, validUSAPhone]"
                  label="Phone Number"
                  max="14"
                  @input="(e) => updatePhone('preferredPhone', e)"
                  placeholder="i.e. (000) 000-0000"
                />
              </VCol>
            <!-- <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="preferredPhone"
                label="Phone Number"
                placeholder="+1 9876543210"
              />
            </VCol> -->

            

            <!-- 👉 Language -->
            <VCol
              cols="12"
              md="12"
            >
            <v-textarea
            v-model="patientNote"
            label="Note"
            placeholder="Note"
          />
            </VCol>

            <!-- 👉 Country -->
            <!-- <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                v-model="userData.country"
                label="Country"
                placeholder="United States"
                :items="['United States', 'United Kingdom', 'France']"
              />
            </VCol> -->

            <!-- 👉 Switch -->
            <!-- <VCol cols="12">
              <VSwitch
                v-model="isUseAsBillingAddress"
                density="compact"
                label="Use as a billing address?"
              />
            </VCol> -->

            <!-- 👉 Submit and Cancel -->
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn type="submit" size="small">
                Update
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                @click="onFormReset"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
