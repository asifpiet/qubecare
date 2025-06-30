<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput';
import { useStore } from 'vuex';
const store = useStore()
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const today = ref(new Date());
const DiagnosisCodePanel = ref(true)
const orderDetailsPanel = ref(true)
const courtesy = ref({
    copy: null,
    fax_number: null,
    fax_attn: null,
    account_attn: null,

})
const payer = ref(null)
const includeSecIns = ref(null)
const isWorkersComp = ref(null)
const orderPSC = ref(null)
const DiagnosisCode = ref({
    diagnosisCode: null,
    diagnosticTests: null
})
const orderDetails = ref({
    priority: null,
    collectionDateTime: null,
    collectionDate: null,
    specimenSource: null,
    relevantClinicalInfo: null,
    notes: null,
    sourceSiteDetails: null,
    race: null,
    hispanicHeritage: null,
    specimenActionCode: null,
    height: null,
    weight: null,
    volume: null
})
const maternalScreening = ref({
    insulinDependent: null,
    numberOfFetuses: null,
    otherIndications: null,
    additionalInfo: '',
    donorEgg: null,
    ageOfDonor: '',
    typeOfEggDonor: null,
    gestationalAgeWeeks: '',
    gestationalAgeDays: '',
    gestationalAgeDecimal: '',
    gestationalAgeDate: '',
    crownRumpLength: '',
    sonographerLastName: '',
    sonographerFirstName: '',
    sonographerId: '',
    nuchalTranslucency: '',
    nuchalTranslucencyTwinB: '',
});
const bethesdaCytology = ref({
  cervix: null,
  endocervix: null,
  labiaVulva: null,
  vagina: null,
  endometrium: null,
  labiumMajus: null,
  labiumMinus: null,
  vulva: null,
  lmpMenoDate: '',
  none: null,
  coniza: null,
  colpBX: null,
  laserVap: null,
  cryo: null,
  radiation: null,
  datesResults: '',
  pregnant: null,
  lactating: null,
  oralContraceptives: null,
  menopausal: null,
  swabSpatula: null,
  brushSpatula: null,
  spatulaAlone: null,
  brushAlone: null,
  broomAlone: null,
  otherCollectionTechnique: null,
  estroRX: null,
  pmpBleeding: null,
  postPart: null,
  iud: null,
  allOtherPat: null,
  negative: null,
  atypical: null,
  caInSitu: null,
  invasive: null,
  otherPreviousInfo: null,
  hysterectomyTotal: null,
  hysterectomyPartial: null,
  dysplasiaLow: null,
  dysplasiaHigh: null,
});
const includeElectronicSignature = ref(false);
const printOrderDetails = ref(false);
const emailOrderDetails = ref(false);
const shareRequisitionOnPatientPortal = ref(false);





const isTextMessageDialogVisible = ref(true);
const closeNavigationDrawer = () => {
    isTextMessageDialogVisible.value = false;  
}

const emit = defineEmits([
  'update:isDrawerOpen',
])

const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
    //   console.log('lastnae',lastName.value);
      
      emit('addVital', {
        id: store.getters.getPatientPorfile.patientId,
        vitals:[
          ...store.getters.getPatientPorfile.vitals,
          {
            provider:'Zeeshan Anjum',
            created_date:today.value,
        }
          
      ]
        
      })
        isLoading.value = false;
        nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        closeNavigationDrawer();  
        })
    }else{
        
      isLoading.value = false;
    }
  })
  
}
</script>
<template>
    <VForm
        ref="refForm"
        v-model="isFormValid"
    >
        <VRow>
            <VCol cols="12"><h4>Lab Order Form</h4></VCol>
            <VCol cols="4"><span><b>Name:</b></span> <span></span></VCol>
            <VCol cols="4"><span><b>DOB:</b></span> <span></span></VCol>
            <VCol cols="4"><span><b>Phone:</b></span> <span></span></VCol>
            <VCol cols="4"><span><b>Insurance:</b></span> <span></span></VCol>
            <VCol cols="4"><span><b>ID:</b></span> <span></span></VCol>
            <VCol cols="4"><span><b>Group:</b></span> <span></span></VCol>
            <VCol cols="4">
                <AppSelect
                    v-model="practitioner"
                    label="Practitioner Account"
                    placeholder=""
                    :items="['Fasting', 'Non-Fasting']"
                />
            </VCol>
            <VCol cols="4">
                <AppSelect
                    v-model="location"
                    label="Location"
                    placeholder=""
                    :items="['TKO Wellness', 'Test Location','Vagas']"
                />
            </VCol>
            <VCol cols="4">
                <AppSelect
                    v-model="lab"
                    label="Lab"
                    placeholder=""
                    :items="['LabCorp', 'Genova', 'Solaris']"
                />
            </VCol>
        </VRow>
        <VRow>
            <VCol cols="12" md="12">
                <VCard title="Payer">
                    <VRow>
                        <VCol cols="5">
                            <v-radio-group
                                v-model="payer"
                                inline
                                >
                                <v-radio
                                    label="Insurance"
                                    value="Insurance"
                                ></v-radio>
                                <v-radio
                                    label="Practice (Client)"
                                    value="Practice (Client)"
                                ></v-radio>
                                <v-radio
                                    label="Patient (Out of Pocket)"
                                    value="Patient (Out of Pocket)"
                                ></v-radio>
                            </v-radio-group>
                            
                        </VCol>
                        <VCol cols="5">
                            <v-row>
                                <v-col cols="6">
                                    <v-checkbox v-model="includeSecIns" label="Include Secondary Insurance"></v-checkbox>
                                </v-col>
                                <v-col cols="6">
                                    <v-checkbox v-model="isWorkersComp" label="Workers Compensation"></v-checkbox>
                                </v-col>
                            </v-row>
                        </VCol>
                        <VCol cols="2">
                            <AppSelect
                                v-model="orderPSC"
                                label=""
                                placeholder="Type "
                                :items="['PSC Hold']"
                            />
                        </VCol>
                    </VRow>
                </VCard>
            </VCol>
        </VRow>
        <VRow>
            <VCol cols="12">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                            Courtesy Copies
                        </v-expansion-panel-title>
                        
                        <v-expansion-panel-text>
                        <v-row>
                            <v-col cols="12">
                            <v-checkbox v-model="courtesy.copy" label="Courtesy Copy for Patient"></v-checkbox>
                            </v-col>
                            <v-col cols="12">
                            <AppTextField
                                v-model="courtesy.fax_number"
                                :rules="[requiredValidator]"
                                label="Fax Number"
                                placeholder=""
                            />
                            </v-col>
                            <v-col cols="12">
                            <AppTextField
                                v-model="courtesy.fax_attn"
                                :rules="[requiredValidator]"
                                label="Fax (Attn)"
                                placeholder=""
                            />
                            </v-col>
                            <v-col cols="12">
                            <AppTextField
                                v-model="courtesy.account_number"
                                :rules="[requiredValidator]"
                                label="Account Number"
                                placeholder=""
                            />
                            </v-col>
                            <v-col cols="12">
                            <AppTextField
                                v-model="courtesy.account_attn"
                                :rules="[requiredValidator]"
                                label="Account (Attn)"
                                placeholder=""
                            />
                            </v-col>
                        </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>

            </VCol>
            <VCol cols="12">
                <v-expansion-panels>
                    <v-expansion-panel v-model="DiagnosisCodePanel">
                        <v-expansion-panel-title>
                        Diagnosis Code(s) And Lab Order(s)
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                        <v-row class="mt-2">
                            <!-- Diagnosis (ICD10) Autocomplete -->
                            <v-col cols="6">
                            <v-autocomplete
                                v-model="DiagnosisCode.diagnosisCode"
                                :items="icd10Codes"
                                label="Diagnosis (ICD10)"
                                placeholder="Select Diagnosis"
                                :rules="[requiredValidator]"
                                return-object
                                clearable
                            />
                            </v-col>

                            <!-- Diagnostic Tests Autocomplete -->
                            <v-col cols="6">
                            <v-autocomplete
                                v-model="DiagnosisCode.diagnosticTests"
                                :items="tests"
                                label="Diagnostic Tests"
                                placeholder="Select Tests"
                                :rules="[requiredValidator]"
                                return-object
                                clearable
                            />
                            </v-col>
                        </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </VCol>
            <VCol cols="12">
                <v-expansion-panels>
                    <v-expansion-panel  v-model="orderDetailsPanel">
                        <v-expansion-panel-title>
                        Order Details
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                        <v-row>
                            <!-- Priority (Radio) -->
                            <v-col cols="4">
                            <v-radio-group v-model="orderDetails.priority" label="Priority">
                                <v-radio label="Stat (do immediately)" value="stat"></v-radio>
                                <v-radio label="As soon as possible" value="asap"></v-radio>
                                <v-radio label="Routine" value="routine"></v-radio>
                                <v-radio label="Timing critical" value="timing_critical"></v-radio>
                            </v-radio-group>
                            </v-col>

                            <!-- Specimen Collection Date/Time -->
                            <v-col cols="4">
                                <v-date-input v-model="orderDetails.collectionDateTime" label="Obs./Specimen Collection Date/Time" variant="outlined"></v-date-input>
                            
                            </v-col>

                            <!-- Specimen Source -->
                            <v-col cols="4">
                            <v-text-field
                                v-model="orderDetails.specimenSource"
                                label="Specimen Source"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Relevant Clinical Information -->
                            <v-col cols="4">
                            <v-text-field
                                v-model="orderDetails.relevantClinicalInfo"
                                label="Relevant Clinical Information"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Notes -->
                            <v-col cols="4">
                            <v-text-field
                                v-model="orderDetails.notes"
                                label="Notes (your private notes)"
                            />
                            </v-col>

                            <!-- Specimen Source-site Details -->
                            <v-col cols="4">
                            <v-text-field
                                v-model="orderDetails.sourceSiteDetails"
                                label="Specimen Source-site Details"
                            />
                            </v-col>

                            <!-- Race (Radio) -->
                            <v-col cols="4">
                            <v-radio-group v-model="orderDetails.race" label="Race">
                                <v-radio label="Asian" value="asian"></v-radio>
                                <v-radio label="Black/African American" value="black"></v-radio>
                                <v-radio label="White/Caucasian" value="white"></v-radio>
                                <v-radio label="American Indian/Alaskan Native" value="native"></v-radio>
                                <v-radio label="Hispanic" value="hispanic"></v-radio>
                                <v-radio label="Other Race" value="other_race"></v-radio>
                                <v-radio label="Ashkenazi Jewish" value="ashkenazi_jewish"></v-radio>
                                <v-radio label="Sephardic Jewish" value="sephardic_jewish"></v-radio>
                                <v-radio label="Unknown" value="unknown"></v-radio>
                            </v-radio-group>
                            </v-col>

                            <!-- Hispanic Heritage (Radio) -->
                            <v-col cols="4">
                            <v-radio-group v-model="orderDetails.hispanicHeritage" label="Hispanic Heritage">
                                <v-radio label="Yes" value="yes"></v-radio>
                                <v-radio label="No" value="no"></v-radio>
                                <v-radio label="Unknown" value="unknown"></v-radio>
                            </v-radio-group>
                            </v-col>

                            <!-- Specimen Action Code (Radio) -->
                            <v-col cols="4">
                            <v-radio-group v-model="orderDetails.specimenActionCode" label="Specimen Action Code">
                                <v-radio label="Pending specimen" value="pending_specimen"></v-radio>
                                <v-radio label="Add ordered tests to the existing specimen" value="add_tests"></v-radio>
                                <v-radio label="Generated order; reflex order" value="reflex_order"></v-radio>
                                <v-radio label="Lab to obtain specimen from patient" value="lab_to_obtain"></v-radio>
                                <v-radio label="Schedule the tests specified below" value="schedule_tests"></v-radio>
                                <v-radio label="Specimen obtained by service other than Lab" value="other_service"></v-radio>
                            </v-radio-group>
                            </v-col>

                            <!-- Height (inches) -->
                            <v-col cols="4">
                            <v-text-field
                                v-model="orderDetails.height"
                                label="Height (###.## Inches)"
                                type="number"
                            />
                            </v-col>

                            <!-- Weight (LBS) -->
                            <v-col cols="4">
                            <v-text-field
                                v-model="orderDetails.weight"
                                label="Weight (LBS ###.#)"
                                type="number"
                            />
                            </v-col>

                            <!-- Volume (ml) -->
                            <v-col cols="4">
                            <v-text-field
                                v-model="orderDetails.volume"
                                label="Volume (### ml)"
                                type="number"
                            />
                            </v-col>
                        </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </VCol>
            <VCol cols="12">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                        Maternal Serum Screening and Amniotic Fluid Alpha-Fetoprotein
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                        <v-row>
                            <!-- Insulin Dependent -->
                            <v-col cols="12">
                            <v-select
                                v-model="maternalScreening.insulinDependent"
                                :items="['Yes', 'No']"
                                label="Insulin Dependent"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Number of Fetuses -->
                            <v-col cols="12">
                            <v-select
                                v-model="maternalScreening.numberOfFetuses"
                                :items="['1', '2', '3']"
                                label="Number of Fetuses"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Other Indications -->
                            <v-col cols="12">
                            <v-select
                                v-model="maternalScreening.otherIndications"
                                :items="['Yes', 'No']"
                                label="Other Indications"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Additional Info -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.additionalInfo"
                                label="Additional Info"
                            />
                            </v-col>

                            <!-- Donor Egg -->
                            <v-col cols="12">
                            <v-select
                                v-model="maternalScreening.donorEgg"
                                :items="['Yes', 'No']"
                                label="Donor Egg"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Age of Donor -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.ageOfDonor"
                                label="Age of Donor"
                                type="number"
                            />
                            </v-col>

                            <!-- Type of Egg Donor -->
                            <v-col cols="12">
                            <v-select
                                v-model="maternalScreening.typeOfEggDonor"
                                :items="['Self', 'Nonself']"
                                label="Type of Egg Donor"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Gestational Age Weeks -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.gestationalAgeWeeks"
                                label="Gestational Age Weeks"
                                type="number"
                            />
                            </v-col>

                            <!-- Gestational Age Days -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.gestationalAgeDays"
                                label="Gestational Age Days"
                                type="number"
                            />
                            </v-col>

                            <!-- Gestational Age Decimal -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.gestationalAgeDecimal"
                                label="Gestational Age Decimal"
                                type="number"
                                step="0.1"
                            />
                            </v-col>

                            <!-- Gestational Age Date -->
                            <v-col cols="12">
                            <v-menu
                                v-model="menuGestationalAgeDate"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="maternalScreening.gestationalAgeDate"
                                    label="Gestational Age Date (mm/dd/yyyy)"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                />
                                </template>
                                <v-date-picker
                                v-model="maternalScreening.gestationalAgeDate"
                                @input="menuGestationalAgeDate = false"
                                ></v-date-picker>
                            </v-menu>
                            </v-col>

                            <!-- Other fields here like 'Previously Elevated AFP', 'LMP Date', 'Ultrasound Date', etc. -->
                            <!-- Repeat the above structure for date pickers and dropdowns -->

                            <!-- Ultrasound Measurement Crown Rump Length (mm) -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.crownRumpLength"
                                label="Ultrasound Measurement Crown Rump Length (mm)"
                                type="number"
                            />
                            </v-col>

                            <!-- Sonographer Last Name -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.sonographerLastName"
                                label="Sonographer Last Name"
                            />
                            </v-col>

                            <!-- Sonographer First Name -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.sonographerFirstName"
                                label="Sonographer First Name"
                            />
                            </v-col>

                            <!-- Sonographer ID Number -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.sonographerId"
                                label="Sonographer ID Number"
                                type="number"
                            />
                            </v-col>

                            <!-- Nuchal Translucency (mm) -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.nuchalTranslucency"
                                label="Nuchal Translucency (mm)"
                                type="number"
                            />
                            </v-col>

                            <!-- Nuchal Translucency for Twin B (mm) -->
                            <v-col cols="12">
                            <v-text-field
                                v-model="maternalScreening.nuchalTranslucencyTwinB"
                                label="Nuchal Translucency for Twin B (mm)"
                                type="number"
                            />
                            </v-col>
                        </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </VCol>
            <VCol cols="12">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                        Bethesda Cytology
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                        <v-row>
                            <!-- Cervix -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.cervix"
                                :items="['Yes', 'No']"
                                label="Cervix"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Endocervix -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.endocervix"
                                :items="['Yes', 'No']"
                                label="Endocervix"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Labia-Vulva -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.labiaVulva"
                                :items="['Yes', 'No']"
                                label="Labia-Vulva"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Vagina -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.vagina"
                                :items="['Yes', 'No']"
                                label="Vagina"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Endometrium -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.endometrium"
                                :items="['Yes', 'No']"
                                label="Endometrium"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Labium Majus -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.labiumMajus"
                                :items="['Yes', 'No']"
                                label="Labium Majus"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Labium Minus -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.labiumMinus"
                                :items="['Yes', 'No']"
                                label="Labium Minus"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Vulva -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.vulva"
                                :items="['Yes', 'No']"
                                label="Vulva"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- LMP-Meno Date -->
                            <v-col cols="12">
                            <v-menu
                                v-model="menuLMPMenoDate"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="bethesdaCytology.lmpMenoDate"
                                    label="LMP-Meno Date (mm/dd/yyyy)"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                />
                                </template>
                                <v-date-picker
                                v-model="bethesdaCytology.lmpMenoDate"
                                @input="menuLMPMenoDate = false"
                                ></v-date-picker>
                            </v-menu>
                            </v-col>

                            <!-- None -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.none"
                                :items="['Yes', 'No']"
                                label="None"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Coniza -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.coniza"
                                :items="['Yes', 'No']"
                                label="Coniza"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Colp-BX -->
                            <v-col cols="12">
                            <v-select
                                v-model="bethesdaCytology.colpBX"
                                :items="['Yes', 'No']"
                                label="Colp-BX"
                                :rules="[requiredValidator]"
                            />
                            </v-col>

                            <!-- Other fields for collection techniques, contraceptives, etc. -->
                            <!-- Continue the same pattern for remaining fields like Laser-Vap, Cryo, Radiation, Pregnant, Lactating, and others -->

                            <!-- Dates-Results -->
                            <v-col cols="12">
                            <v-menu
                                v-model="menuDatesResults"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="bethesdaCytology.datesResults"
                                    label="Dates-Results"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                />
                                </template>
                                <v-date-picker
                                v-model="bethesdaCytology.datesResults"
                                @input="menuDatesResults = false"
                                ></v-date-picker>
                            </v-menu>
                            </v-col>

                            <!-- Repeat similar dropdowns for other fields like 'Negative', 'Atypical', etc. -->
                        </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </VCol>
        </VRow>
        <VRow>
            <VCol cols="12">
            <v-checkbox v-model="includeElectronicSignature" label="Include Electronic Signature"></v-checkbox>
            </VCol>
            <VCol cols="12">
            <v-checkbox v-model="printOrderDetails" label="Print Order Details"></v-checkbox>
            </VCol>
            <VCol cols="12">
            <v-checkbox v-model="emailOrderDetails" label="Email Order Details"></v-checkbox>
            </VCol>
            <VCol cols="12">
            <v-checkbox v-model="shareRequisitionOnPatientPortal" label="Share Requisition On Patient Portal"></v-checkbox>
            </VCol>

        </VRow>
        <v-row>
            <v-col cols="3">
                <v-btn color="primary" @click="saveOrder" block>Save Order</v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn color="primary" @click="saveAndSendOrder" block>Save & Send Order</v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn color="primary" @click="checkInstructions" block>Check Instructions</v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn color="primary" @click="abnNotice" block>ABN Notice (Medicare)</v-btn>
            </v-col>
        </v-row>

    </VForm>             
</template>
