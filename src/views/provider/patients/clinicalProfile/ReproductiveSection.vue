<template>
  <v-container>
    <v-form>
      <div class="tw-om-box-content">
        <v-row class="mb-8">
          <v-col cols="12" sm="6">
            <div class="tw-om-input-label">{{ $t('Sexually Active') }}</div>
            <v-radio-group v-model="clinicalProfileStore.reproductive.sexuallyActive" inline>
              <v-radio :label="$t('Yes')" value="true"></v-radio>
              <v-radio :label="$t('No')" value="false"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="tw-om-input-label">{{ $t('Sexual Orientation') }}</div>
            <v-radio-group v-model="clinicalProfileStore.reproductive.sexualOrientation" inline>
              <v-radio :label="$t('Hetero')" value="Hetero"></v-radio>
              <v-radio :label="$t('Gay')" value="Gay"></v-radio>
              <v-radio :label="$t('Lesbian')" value="Lesbian"></v-radio>
              <v-radio :label="$t('Bi')" value="Bi"></v-radio>
              <v-radio :label="$t('Other')" value="Other"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>

        <v-row class="mb-8">
          <v-col cols="12" sm="6">
            <VTextField type="number" v-model="clinicalProfileStore.reproductive.periods_started_at_age"
              :label="$t('Periods started at age')" rows="1" />
          </v-col>

          <v-col cols="12" sm="6">
            <v-textarea v-model="clinicalProfileStore.reproductive.periodLength" :label="$t('Typical period length')"
              rows="1"></v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <VTextField type="date" v-model="clinicalProfileStore.reproductive.lastDateofMenses"
              :label="$t('Date of Last Menses')" />
          </v-col>

          <v-col cols="12" sm="6">
            <div class="tw-om-input-label">{{ $t('Perform Monthly breast self-exams?') }} </div>
            <v-radio-group v-model="clinicalProfileStore.reproductive.breastselfExams" inline>
              <v-radio :label="$t('Yes')" value="true"></v-radio>
              <v-radio :label="$t('No')" value="false"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <small>{{$t('Please indicate age, peri-menopausal & current symptoms & treatment')}}</small>
            <v-textarea v-model="clinicalProfileStore.reproductive.menopause" :label="$t('Menopause')"
              :hint="$t('Please indicate age, peri-menopausal & current symptoms & treatment')" rows="3"></v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <small> {{ $t('Please indicate the date and if it was normal, abnormal or any resulting action') }}</small>
            <v-textarea v-model="clinicalProfileStore.reproductive.lastPapSmear" :label="$t('Last Pap Smear')"
              :hint="$t('Please indicate the date and if it was normal, abnormal or any resulting action')"
              rows="3"></v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <small>{{ $t('Please indicate year; vaginal/c-section; gender; complications') }}</small>
            <v-textarea v-model="clinicalProfileStore.reproductive.childbirth" :label="$t('Child Births')"
             :hint="$t('Please indicate year; vaginal/c-section; gender; complications')" rows="3"></v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <small>{{ $t('Please indicate year; vaginal/c-section; gender; complications') }}</small>
            <v-textarea v-model="clinicalProfileStore.reproductive.misscarriages" :label="$t('Miscarriages/termination')"
              :hint="$t('Please indicate year; vaginal/c-section; gender; complications')" rows="3"></v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <small>{{ $t('Please indicate if current or past, reason for stopping, side effects, dosages') }}</small>
            <v-textarea v-model="clinicalProfileStore.reproductive.hormones" :label="$t('Hormones used')"
              :hint="$t('Please indicate if current or past, reason for stopping, side effects, dosages')"
              rows="3"></v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <small>{{ $t('Please indicate the dates, results')}}</small>
            <v-textarea v-model="clinicalProfileStore.reproductive.mammography" :label="$t('Mammography results')"
              :hint="$t('Please indicate the dates, results')" rows="3"></v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <small>{{ $t('Please indicate the dates, quantity/quality, treatment if applicable') }}</small>
            <v-textarea v-model="clinicalProfileStore.reproductive.abnormalVaginalBleeding"
               :label="$t('Abnormal vaginal bleeding')"
             :hint="$t('Please indicate the dates, quantity/quality, treatment if applicable')" rows="3"></v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <small>{{ $t('Reproductive Section Notes') }}</small>
            <v-textarea v-model="clinicalProfileStore.reproductive.notes"  :label="$t('Notes')"
              :hint="$t('Reproductive Section Notes')" rows="3"></v-textarea>
          </v-col>

          <VCol cols="12">
            <VBtn @click="onSubmitReproductive" class="me-3">
              {{ $t('Update Reproductive') }}
            </VBtn>

          </VCol>
        </v-row>
      </div>
    </v-form>
  </v-container>
</template>

<script setup>
import { useClinicalProfileStore } from '@/stores/clinicalProfileStore';
const clinicalProfileStore = useClinicalProfileStore()
const emit = defineEmits([
  'onSaveReproductive'
]);

const props = defineProps({
  reproductive: {
    type: Object,
    required: true,
  },
  patient: {
    type: Object,
    required: true,
  },

})



const onSubmitReproductive = () => {
  return clinicalProfileStore.saveReproductive(props.patient.id)
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
