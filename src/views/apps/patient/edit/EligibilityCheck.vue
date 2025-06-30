<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const isLoading = ref(false)
const isTonalSnackbarVisible = ref(false)
const refForm = ref()
const payerType = ref('')
const practitioner = ref('')
const typeOfCoverage = ref('')
const officeAllyPayer = ref('')
const payerPortalLogin = ref('')
const portalPass = ref('')

const states = ref([
  { name: 'Howland Island', abbreviation: 'UM-84' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Baker Island', abbreviation: 'UM-81' },
  { name: 'Kingman Reef', abbreviation: 'UM-89' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'Wake Island', abbreviation: 'UM-79' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Jarvis Island', abbreviation: 'UM-86' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Guam', abbreviation: 'GU' },
  { name: 'United States Virgin Islands', abbreviation: 'VI' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'American Samoa', abbreviation: 'AS' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Johnston Atoll', abbreviation: 'UM-67' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Northern Mariana Islands', abbreviation: 'MP' },
  { name: 'United States Minor Outlying Islands', abbreviation: 'UM' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'District of Columbia', abbreviation: 'DC' },
  { name: 'Midway Atoll', abbreviation: 'UM-71' },
  { name: 'Navassa Island', abbreviation: 'UM-76' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'Palmyra Atoll', abbreviation: 'UM-95' },
  { name: 'Puerto Rico', abbreviation: 'PR' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'Ohio', abbreviation: 'OH' },
  // ... (add the rest of the states)
]);

const showEditData = computed(() =>{
  console.log("getPatientProfile",store.getters.getPatientPorfile);
  let patient = store.getters.getPatientPorfile;
  if(patient){
    payerType.value = store.getters.getPatientPorfile.payerType
    practitioner.value = store.getters.getPatientPorfile.practitioner
    payerPortalLogin.value =  store.getters.getPatientPorfile.payerPortalLogin
    typeOfCoverage.value = store.getters.getPatientPorfile.typeOfCoverage
    portalPass.value = store.getters.getPatientPorfile.portalPass
  }
})
const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
  'customEvent'
])


const saveAndClose = ()=> {
  onSubmit('saveClose')
  emit('update:isDrawerOpen', false)
}

const saveOnly = ()=> {
  onSubmit('save')
  emit('update:isDrawerOpen', true)
}

const onSubmit = (trigger) => {
  isLoading.value = true;
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('patientData', {
        id: store.getters.getPatientPorfile.uuid,
        checkIsFormOpen: trigger,
        payerType: payerType.value,
        practitioner: practitioner.value,
        typeOfCoverage: typeOfCoverage.value,
        officeAllyPayer: officeAllyPayer.value,
        payerPortalLogin: payerPortalLogin.value,
        portalPass: portalPass.value,
      })
      isTonalSnackbarVisible.value = true;
      isLoading.value = false;
    }
    isLoading.value = false;
  })
}

const items = []

</script>
<template>
  <div v-if="showEditData"></div>
  <VDialog v-model="isLoading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
          <div class="demo-space-x">
            <VProgressCircular :size="40" color="primary" indeterminate />
          </div>
        </VCardText>
      </VDialog>
      <VSnackbar
      v-model="isTonalSnackbarVisible"
      location="top end"
      variant="flat"
      color="success"
    >
      Eligibility Chedck updated.
    </VSnackbar>
    <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <p>Payer Type</p>
                <VRadioGroup
                    v-model="payerType"
                    inline
                >
                    <VRadio
                    label="Primary"
                    value="primary"
                    />
                    <VRadio
                    label="Secondary"
                    value="secondary"
                    />
                </VRadioGroup>
              </VCol>
              <VCol cols="6">
                <AppSelect
                v-model="practitioner"
                label="Practitioner"
                placeholder="Practitioner"
                :items="['Testing']"
                />
              </VCol>
              <VCol cols="6">
                <AppAutocomplete
                v-model="typeOfCoverage"
                label="Type Of Coverage"
                placeholder="Type Of Coverage"
                :items="['Health Benefit Plan Coverage [30]',
                         'Acupuncture [64]',
                         'Ambulatory Service Center Facility [13]',
                         'Chiropractic [33]',
                         'Chiropractic Office Visits [34]',
                         'Consultation [3]',
                         'Diagnostic Lab [5]',
                         'Diagnostic X-Ray [4]',
                         'Eye [BR]',
                         'General Benefits [60]',
                         'Massage Therapy [BE]',
                         'Medical Care [1]',
                         'Mental Health [MH]',
                         'Mental Health Provider - Outpatient [CF]',
                         'MRI/CAT Scan [62]',
                         'Occupational Therapy [AD]',
                         'Orthopedic [BK]',
                         'Physical Medicine [AE]',
                         'Physical Therapy [PT]',
                         'Psychiatric [A4]',
                         'Psychotherapy [A6]',
                         'Routine Physical [81]',
                         'Screening laboratory [CL]',
                         'Screening X-ray [CK]',
                         'Speech Therapy [AF]'
                ]"
                />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="6">
                <AppAutocomplete
                        label="Office Ally Payer"
                        :items="items"
                        placeholder="Office Ally Payer"
                    />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="6">
                <AppTextField
                  v-model="payerPortalLogin"
                  label="Payer Portal Login"
                  placeholder="Payer Portal Login"
                
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="portalPass"
                  label="Portal Pass"
                  placeholder="Portal Pass"
                />
              </VCol>

              <VCol cols="12">
                <VBtn
                 @click="saveAndClose"
                  class="me-3"
                >
                  Save and Close
                </VBtn>
                <VBtn
                  @click="saveOnly"
                 class="me-3"
                
                >
                Save
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="error"
                  class="ml-3"
                  @click="closeNavigationDrawer"
                >
                Close
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
</template>
