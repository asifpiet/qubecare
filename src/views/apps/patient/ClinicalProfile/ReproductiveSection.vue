<template>
    <v-container>
      <div v-if="setReproductive"></div>
      <v-form>
        <div class="tw-om-box-content">
          <v-row class="mb-8">
            <v-col cols="12" sm="6">
              <div class="tw-om-input-label">Sexually Active</div>
              <v-radio-group v-model="sexuallyActive" inline>
                <v-radio label="Yes" value="true"></v-radio>
                <v-radio label="No" value="false"></v-radio>
              </v-radio-group>
            </v-col>
  
            <v-col cols="12" sm="6">
              <div class="tw-om-input-label">Sexual Orientation</div>
              <v-radio-group v-model="sexualOrientation" inline>
                <v-radio label="Hetero" value="Hetero"></v-radio>
                <v-radio label="Gay" value="Gay"></v-radio>
                <v-radio label="Lesbian" value="Lesbian"></v-radio>
                <v-radio label="Bi" value="Bi"></v-radio>
                <v-radio label="Other" value="Other"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
  
          <v-row class="mb-8">
            <v-col cols="12" sm="6">
              <VTextField
                type="number"
                v-model="periodsStartedAge"
                label="Periods started at age"
                rows="1"
              />
            </v-col>
  
            <v-col cols="12" sm="6">
              <v-textarea
                v-model="typicalPeriodLength"
                label="Typical period length"
                rows="1"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12" sm="6">
              <VTextField
                type="date"
                v-model="lastMensesDate"
                label="Date of Last Menses"
                
              />
            </v-col>
  
            <v-col cols="12" sm="6">
              <div class="tw-om-input-label">Perform Monthly breast self-exams?</div>
              <v-radio-group v-model="monthlyBreastSelfExams" inline>
                <v-radio label="Yes" value="true"></v-radio>
                <v-radio label="No" value="false"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
  
          <v-row>
            <v-col cols="12" sm="6">
                <small>Please indicate age, peri-menopausal & current symptoms & treatment</small>
              <v-textarea
                v-model="menopausalDetails"
                label="Menopause"
                hint="Please indicate age, peri-menopausal & current symptoms & treatment"
                rows="3"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12" sm="6">
                <small>Please indicate the date and if it was normal, abnormal or any resulting action</small>
              <v-textarea
                v-model="lastPapSmear"
                label="Last Pap Smear"
                hint="Please indicate the date and if it was normal, abnormal or any resulting action"
                rows="3"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12" sm="6">
                <small>Please indicate year; vaginal/c-section; gender; complications</small>
              <v-textarea
                v-model="childBirths"
                label="Child Births"
                hint="Please indicate year; vaginal/c-section; gender; complications"
                rows="3"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12" sm="6">
                <small>Please indicate year; vaginal/c-section; gender; complications</small>
              <v-textarea
                v-model="miscarriages"
                :label="$t('Miscarriages/terminations')"
                hint="Please indicate year; vaginal/c-section; gender; complications"
                rows="3"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12" sm="6">
                <small>Please indicate if current or past, reason for stopping, side effects, dosages</small>
              <v-textarea
                v-model="hormonesUsed"
                label="Hormones used"
                hint="Please indicate if current or past, reason for stopping, side effects, dosages"
                rows="3"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12" sm="6">
                <small>Please indicate the dates, results</small>
              <v-textarea
                v-model="mammographyResults"
                label="Mammography results"
                hint="Please indicate the dates, results"
                rows="3"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12" sm="6">
                <small>Please indicate the dates, quantity/quality, treatment if applicable</small>
              <v-textarea
                v-model="abnormalBleeding"
                label="Abnormal vaginal bleeding"
                hint="Please indicate the dates, quantity/quality, treatment if applicable"
                rows="3"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12" sm="6">
                <small>Reproductive Section Notes</small>
              <v-textarea
                v-model="reproductiveNotes"
                label="Notes"
                hint="Reproductive Section Notes"
                rows="3"
              ></v-textarea>
            </v-col>

            <VCol cols="12">
                <VBtn
                  @click="onSubmitReproductive"
                 class="me-3"
                >
                 Update Reproductive
                </VBtn>
                
              </VCol>
          </v-row>
        </div>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const sexuallyActive = ref('');
  const pastSexuallyActive = ref(false);
  const sexualOrientation = ref('');
  const periodsStartedAge = ref('');
  const typicalPeriodLength = ref('');
  const lastMensesDate = ref('');
  const monthlyBreastSelfExams = ref('');
  const menopausalDetails = ref('');
  const lastPapSmear = ref('');
  const childBirths = ref('');
  const miscarriages = ref('');
  const hormonesUsed = ref('');
  const mammographyResults = ref('');
  const abnormalBleeding = ref('');
  const reproductiveNotes = ref('');
  const emit = defineEmits([
    'onSaveReproductive'
]);

const props = defineProps({
  reproductive: {
    type: Object,
    required: true,
  },
  
})

const setReproductive = computed(() => {
    console.log("propsReproductive",props.reproductive);
    if(props.reproductive){
        // if(props.reproductive.sexuallyActive == '')
      sexuallyActive.value = props.reproductive.sexually_active;
      // pastSexuallyActive.value = props.reproductive.pastSexuallyActive; 
      sexualOrientation.value = props.reproductive.sexual_orientation;
      periodsStartedAge.value = props.reproductive.periods_started_at_age;
      typicalPeriodLength.value = props.reproductive.period_length;
      lastMensesDate.value = props.reproductive.last_dateof_menses;
      monthlyBreastSelfExams.value = props.reproductive.breastself_exams;
      menopausalDetails.value = props.reproductive.menopause; 
      lastPapSmear.value = props.reproductive.last_pap_smear; 
      childBirths.value = props.reproductive.childbirth; 
      miscarriages.value = props.reproductive.misscarriages; 
      hormonesUsed.value = props.reproductive.hormones;
      mammographyResults.value = props.reproductive.mammography; 
      abnormalBleeding.value = props.reproductive.abnormal_vaginal_bleeding; 
      reproductiveNotes.value = props.reproductive.notes; 
    }
   });

  const onSubmitReproductive = () => {
    emit('onSaveReproductive',{
      sexuallyActive:sexuallyActive.value,
      pastSexuallyActive:pastSexuallyActive.value,
      sexualOrientation:sexualOrientation.value,
      periods_started_at_age:periodsStartedAge.value,
      periodLength:typicalPeriodLength.value,
      lastDateofMenses:lastMensesDate.value,
      breastselfExams:monthlyBreastSelfExams.value,
      menopause:menopausalDetails.value,
      lastPapSmear:menopausalDetails.value,
      childbirth:childBirths.value,
      misscarriages:miscarriages.value,
      hormones:hormonesUsed.value,
      mammography:mammographyResults.value,
      abnormalVaginalBleeding:abnormalBleeding.value,
      notes:reproductiveNotes.value
    })
  }
  </script>
  
  <style scoped>
  .tw-om-input-label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .tw-om-title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  </style>
  