<script setup>
import { useStore } from 'vuex';
const store = useStore()
const isLoading = ref(false)
const ispatientCoverageTonalSnackbarVisible = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const inNetworkCalPlanStart = ref('');
const inNetworkOOPMax = ref('');
const inNetworkMet = ref('');
const inNetworkDeductible  = ref('');
const inNetworkUsed = ref('');
const outOfNetworkCalPlanStart = ref('');
const outOfNetworkOOPMax = ref('');
const outOfNetworkMet = ref('');
const outOfNetworkDeductible = ref('');
const outOfNetworkUsed = ref('');
const LabsINCopayCoIns = ref(''); 
const LabsOONCopayCoIns = ref('');
const preAuthRequiredRorACUCHIROPT = ref('');
const coveredUnderCHIROPT  = ref('');
const coverageDetails  = ref('');
const patientInsuranceDeductible  = ref('');
const patientInsuranceMet  = ref('');
const patientInsuracnePercentage  = ref('');
const copayCoinsurance	 = ref('');
const limitsYear = ref('')
const howManyUsed = ref('')
const dollarAmountVisit	 = ref('')
const outOfNetworkCopayCoIns = ref('')
const outOfNetworkDeductibleSecond  = ref('')
const outOfNetworkMetSecond = ref('')
const outOfNetworkOOPMaxSecond = ref('')
const outOfNetworkOOPMaxMetSecond = ref('')
const diagnosisExclusions = ref('')
const eMCodesCovered	 = ref('')
const modalitiesCovered	 = ref('')
const patientInsuraceCoverageNotes	 = ref('')

const showEditData = computed(() =>{
  console.log("getPatientProfile",store.getters.getPatientPorfile);
  let patient = store.getters.getPatientPorfile;
  if(patient){
    inNetworkCalPlanStart.value = store.getters.getPatientPorfile.inNetworkCalPlanStart
    inNetworkOOPMax.value = store.getters.getPatientPorfile.inNetworkOOPMax
    inNetworkMet.value =  store.getters.getPatientPorfile.inNetworkMet
    inNetworkDeductible.value = store.getters.getPatientPorfile.inNetworkDeductible
    inNetworkUsed.value = store.getters.getPatientPorfile.inNetworkUsed
    outOfNetworkCalPlanStart.value = patient.outOfNetworkCalPlanStart
    outOfNetworkOOPMax.value = patient.outOfNetworkOOPMax
    outOfNetworkMet.value = patient.outOfNetworkMet
    outOfNetworkDeductible.value = patient.outOfNetworkDeductible
    outOfNetworkUsed.value = patient.outOfNetworkUsed;
    LabsINCopayCoIns.value = store.getters.getPatientPorfile.LabsINCopayCoIns
    LabsOONCopayCoIns.value = store.getters.getPatientPorfile.LabsOONCopayCoIns
    preAuthRequiredRorACUCHIROPT.value =  store.getters.getPatientPorfile.preAuthRequiredRorACUCHIROPT
    coveredUnderCHIROPT.value = store.getters.getPatientPorfile.coveredUnderCHIROPT
    coverageDetails.value = patient.coverageDetails
    patientInsuranceDeductible.value = patient.patientInsuranceDeductible
    patientInsuranceMet.value = patient.patientInsuranceMet
    patientInsuracnePercentage.value = patient.patientInsuracnePercentage
    copayCoinsurance.value = patient.copayCoinsurance
    limitsYear.value = patient.limitsYear;
    howManyUsed.value = store.getters.getPatientPorfile.howManyUsed
    dollarAmountVisit.value = store.getters.getPatientPorfile.dollarAmountVisit
    outOfNetworkCopayCoIns.value =  store.getters.getPatientPorfile.outOfNetworkCopayCoIns
    outOfNetworkDeductibleSecond.value = store.getters.getPatientPorfile.outOfNetworkDeductibleSecond
    outOfNetworkMetSecond.value = patient.outOfNetworkMetSecond
    outOfNetworkOOPMaxSecond.value = patient.outOfNetworkOOPMaxSecond
    outOfNetworkOOPMaxMetSecond.value = patient.outOfNetworkOOPMaxMetSecond
    diagnosisExclusions.value = patient.diagnosisExclusions
    eMCodesCovered.value = patient.eMCodesCovered
    modalitiesCovered.value = patient.modalitiesCovered
    patientInsuraceCoverageNotes.value = patient.patientInsuraceCoverageNotes

    
  }
})

const emit = defineEmits([
  'customEvent'
])

const onSubmit = () => {
  isLoading.value = true;
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('patientInsuranceCoverage', {
        id: store.getters.getPatientPorfile.patientId,
        inNetworkCalPlanStart: inNetworkCalPlanStart.value,
        inNetworkOOPMax: inNetworkOOPMax.value,
        inNetworkMet: inNetworkMet.value,
        inNetworkDeductible: inNetworkDeductible.value,
        inNetworkUsed: inNetworkUsed.value,
        outOfNetworkCalPlanStart: outOfNetworkCalPlanStart.value,
        outOfNetworkOOPMax: outOfNetworkOOPMax.value,
        outOfNetworkMet: outOfNetworkMet.value,
        outOfNetworkUsed: outOfNetworkUsed.value,
        LabsINCopayCoIns: LabsINCopayCoIns.value,
        LabsOONCopayCoIns: LabsOONCopayCoIns.value,
        preAuthRequiredRorACUCHIROPT: preAuthRequiredRorACUCHIROPT.value,
        coveredUnderCHIROPT: coveredUnderCHIROPT.value,
        coverageDetails: coverageDetails.value,
        patientInsuranceDeductible: patientInsuranceDeductible.value,
        patientInsuranceMet: patientInsuranceMet.value,
        patientInsuracnePercentage: patientInsuracnePercentage.value,
        copayCoinsurance: copayCoinsurance.value,
        limitsYear: limitsYear.value,
        howManyUsed: howManyUsed.value,
        dollarAmountVisit: dollarAmountVisit.value,
        outOfNetworkCopayCoIns: outOfNetworkCopayCoIns.value,
        outOfNetworkDeductibleSecond: outOfNetworkDeductibleSecond.value,
        outOfNetworkMetSecond: outOfNetworkMetSecond.value,
        outOfNetworkOOPMaxSecond: outOfNetworkOOPMaxSecond.value,
        outOfNetworkOOPMaxMetSecond: outOfNetworkOOPMaxMetSecond.value,
        diagnosisExclusions: diagnosisExclusions.value,
        eMCodesCovered: eMCodesCovered.value,
        modalitiesCovered: modalitiesCovered.value,
        patientInsuraceCoverageNotes: patientInsuraceCoverageNotes.value,
      })
      ispatientCoverageTonalSnackbarVisible.value = true;
      patientInsuranceCoverageModle();
    }
    isLoading.value = false;
  })
}

const patientInsuranceCoverageModle = () => {
  emit('customEvent', false)
}


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
      v-model="ispatientCoverageTonalSnackbarVisible"
      location="top end"
      variant="flat"
      color="success"
    >
    Patient Insurace Coverage updated.
    </VSnackbar>
      <VCard title="Patient Insurance Coverage" flat>
        <VCardText>General</VCardText>
          <VCardText>
            
            In-Network
          <VForm
              ref="refForm"
              v-model="isFormValid"
              @submit.prevent="onSubmit"
            >
              <VRow>
                <!-- 👉 Full name -->
                <VCol cols="6">
                  <AppTextField
                    v-model="inNetworkCalPlanStart"
                   
                    label="Cal/Plan Start"
                    placeholder="Cal/Plan Start"
                  />
                </VCol>
                <VCol cols="6">
                  <AppTextField
                    v-model="inNetworkOOPMax"
                   
                    label="OOP Max "
                    placeholder="OOP Max"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="inNetworkMet"
                   
                    label="Met?"
                    placeholder="Met"
                  />
                </VCol>

                <!-- 👉 Username -->
                <VCol cols="4">
                  <AppTextField
                    v-model="inNetworkDeductible"
                   
                    label="Deductible"
                    placeholder="Deductible"
                  />
                </VCol>

                <!-- 👉 Email -->
                <VCol cols="4">
                  <AppTextField
                    v-model="inNetworkUsed"
                   
                    label="Used?"
                    placeholder="Used?"
                  />
                </VCol>

                <!-- 👉 company -->
                 <VCol cols="12">
                  <p>Out-Of-Network</p>
                 </VCol>
                

                <!-- 👉 Country -->
                <VCol cols="6">
                  <AppTextField
                    v-model="outOfNetworkCalPlanStart"
                    label="Cal/Plan Start"
                    placeholder="Cal/Plan Start"
                   
                  />
                </VCol>

                <!-- 👉 Contact -->
                <VCol cols="6">
                  <AppTextField
                    v-model="outOfNetworkOOPMax"
                   
                    label="OOP Max"
                    placeholder="OOP Max"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="outOfNetworkMet"
                   
                    label="Met?"
                    placeholder="Met"
                  />
                </VCol>

                <!-- 👉 Role -->
                <VCol cols="4">
                  <AppTextField
                    v-model="outOfNetworkDeductible"
                    label="Deductible"
                    placeholder="Deductible"
                   
                    
                  />
                </VCol>

                <VCol cols="4">
                  <AppTextField
                    v-model="outOfNetworkUsed"
                    label="Used?"
                    placeholder="Used"
                   
                    
                  />
                </VCol>
                <VCol cols="12">
                  <p>Labs</p>
                </VCol>

                <VCol cols="6">
                  <AppTextField
                    v-model="LabsINCopayCoIns"
                    label="IN Copay/Co-Ins"
                    placeholder="	IN Copay/Co-Ins"
                   
                    
                  />
                </VCol>

                <VCol cols="6">
                  <AppTextField
                    v-model="LabsOONCopayCoIns"
                    label="OON Copay/Co-Ins"
                    placeholder="OON Copay/Co-Ins "
                   
                  />
                </VCol>

                <VCol cols="6">
                  <AppSelect
                    v-model="preAuthRequiredRorACUCHIROPT"
                    label="Pre-auth required for ACU/CHIRO/PT"
                    placeholder="Pre-auth required for ACU/CHIRO/PT"
                   
                    :items="['Yes', 'No']"
                  />
                </VCol>

                <VCol cols="6">
                  <AppSelect
                    v-model="coveredUnderCHIROPT"
                    label="Covered under CHIRO/PT"
                    placeholder="Covered under CHIRO/PT"
                   
                    :items="['Yes', 'No']"
                  />
                </VCol>

                <VCol cols="6">
                  <AppSelect
                    v-model="coverageDetails"
                    label="Coverage Detail"
                    placeholder="Coverage Detail"
                    :items="['Acupuncture',
                     'Chiropractic',
                      'Counseling',
                      'Consultation',
                      'Massage',
                      'Naturopathy',
                      'Physical',
                      'Other (See Notes)'
                      ]"
                  />
                </VCol>
                <VCol cols="6"></VCol>
                

                <VCol cols="4">
                  <AppTextField
                    v-model="patientInsuranceDeductible"
                   
                    label="Deductible"
                    placeholder="Deductible"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="patientInsuranceMet"
                   
                    label="Met?"
                    placeholder="Met"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="patientInsuracnePercentage"
                    label="Percentage"
                    placeholder="Percentage"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="copayCoinsurance"
                   
                    label="Copay/Coinsurance"
                    placeholder="Copay/Coinsurance"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="limitsYear"
                   
                    label="Limits/Year"
                    placeholder="Limits/Year"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="howManyUsed"
                   
                    label="How many used"
                    placeholder="How many used"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="dollarAmountVisit"
                   
                    label="Dollar Amount/Visit"
                    placeholder="Dollar Amount/Visit	"
                  />
                </VCol>
                <VCol cols="12">
                  <p>Out-Of-Network</p>
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="outOfNetworkCopayCoIns"
                   
                    label="Copay/CoIns"
                    placeholder="Copay/CoIns"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="outOfNetworkDeductibleSecond"
                   
                    label="Deductible"
                    placeholder="Deductible "
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="outOfNetworkMetSecond"
                   
                    label="Met?"
                    placeholder="Met"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="outOfNetworkOOPMaxSecond"
                   
                    label="OOP Max"
                    placeholder="OOP Max"
                  />
                </VCol>
                <VCol cols="4">
                  <AppTextField
                    v-model="outOfNetworkOOPMaxMetSecond"
                   
                    label="Met?"
                    placeholder="Met"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="diagnosisExclusions"
                   
                    label="Diagnosis Exclusions"
                    placeholder="Diagnosis Exclusions"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="eMCodesCovered"
                   
                    label="E/M Codes covered"
                    placeholder="E/M Codes covered"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="modalitiesCovered"
                   
                    label="Modalities covered"
                    placeholder="Modalities covered"
                  />
                </VCol>
                <VCol cols="12">
                  <v-textarea
                    v-model="patientInsuraceCoverageNotes"
                   
                    label="Notes"
                    placeholder="Notes"
                    row="5"
                  />
                </VCol>
                
                <VCol cols="12">
                  <VBtn
                    type="submit"
                    class="me-3"
                  >
                    Save
                  </VBtn>
                  <VBtn
                    type="reset"
                    variant="tonal"
                    color="error"
                    @click="patientInsuranceCoverageModle"
                  >
                    Cancel
                  </VBtn>
                </VCol>
              </VRow>
          </VForm>
          </VCardText>
          </VCard>
    </template>
