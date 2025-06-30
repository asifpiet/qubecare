<script setup>

import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const props = defineProps({
  patient: {
    type: Object,
    default: {}
  },
  grid: {
    type: Number,
    default: 4
  },
  secondGrid: {
    type: Number,
    default: 6
  },
})
const emit = defineEmits([
  'update:showDialog',
  'onDialogBtnClick'
])
const store = useStore()
const currentTab = ref('window1')
const router = useRouter();
const route = useRoute()
const patientId = ref()
const currentPath = route.path;
const showDrawer = ref('')
const isDrawerOpen = ref(false)
const onDialogBtnClick = (actionName) => {
  emit('onDialogBtnClick', actionName)
};
</script>
<template>


  <VCard>
    <VCardText class="px-0">
      <div v-if="patientData"></div>
      <!-- <VTabs v-model="currentTab" class="v-tabs-pill">
        <VTab>Admin</VTab>
        <VTab>Clinical</VTab>
        <VTab>Point of Sales</VTab>
      </VTabs> -->
      <!-- <VDivider class="mt-3" /> -->

      <VCardText>
        <!-- <VWindow v-model="currentTab">
          <VWindowItem key="0"> -->
        <VRow>
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <RouterLink :to="{ path: '/provider/patients/dashboard/' + props.patient.id }"
              class="font-weight-medium text-link">
              <VBtn variant="outlined" class="w-100" v-if="$can('read', 'Patient Dashboard View')">{{ $t('Dashboard') }}
              </VBtn>
            </RouterLink>
          </VCol>
          <!-- <VCol cols="12" :lg=props.grid md="4" sm="6">
                <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('EmailLog')"
                  v-if="$can('read', 'Email View')">Email</VBtn>
              </VCol> -->
          <!-- <VCol cols="12" :lg=props.grid md="4" sm="6">
                <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('PhoneLog')"
                  v-if="$can('read', 'Phone Log View')">Phone Log</VBtn>
              </VCol> -->

          <!-- <VCol cols="12" :lg=props.grid md="4" sm="6">
                <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('Tasks')"
                  v-if="$can('read', 'Tasks View')">Task</VBtn>
              </VCol> -->
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('Document')"
              v-if="$can('read', 'Documents View')"> {{ $t('Documents') }}</VBtn>
          </VCol>
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('IntakeList')"
              v-if="$can('read', 'Intake Questions View')">{{ $t('Intake') }}</VBtn>
          </VCol>
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('ConsentForm')"
              v-if="$can('read', 'Consent View')"> {{ $t('Consent') }}</VBtn>
          </VCol>

          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('Vitals')"
              v-if="$can('read', 'Vitals View')"> {{ $t('Vitals') }}</VBtn>
          </VCol>
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('MessageList')"
              v-if="$can('read', 'Messages View')"> {{ $t('Notes') }}</VBtn>
          </VCol>
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('LabOrders')"
              v-if="$can('read', 'All Meds/Supplements View')"> {{ $t('Lab Orders') }}</VBtn>
          </VCol>
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('MedSupplement')"
              v-if="$can('read', 'All Meds/Supplements View')"> {{ $t('Prescriptions') }}</VBtn>
          </VCol>
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('Appointments')"
              v-if="$can('read', 'Appointments View')"> {{ $t('Appointments') }}</VBtn>
          </VCol>
          <VCol cols="12" :lg=props.grid md="4" sm="6" style="display: none;">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('TextMessage')">
              {{ $t('Text Message') }}</VBtn>
          </VCol>
          <VCol cols="12" :lg=props.grid md="4" sm="6">
            <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('AiAssistance')"
              v-if="currentPath === '/apps/call'"> {{ $t('AI Help') }}</VBtn>
          </VCol>

        </VRow>
        <!-- </VWindowItem> -->
        <!-- 
          <VWindowItem key="1">
            <VRow>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <RouterLink :to="{ path: '/provider/patients/new-initial-consult/' + props.patient.id }"
                  class="font-weight-medium text-link">
                  <VBtn variant="outlined" class="w-100" v-if="$can('read', 'New Initial Consult View')">New Initial
                    Consult</VBtn>
                </RouterLink>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <RouterLink :to="{ path: '/provider/patients/new-follow-up/' + props.patient.id }"
                  class="font-weight-medium text-link">
                  <VBtn variant="outlined" class="w-100" v-if="$can('read', 'New Follow Up')">New
                    Follow Up</VBtn>
                </RouterLink>
              </VCol>

              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <RouterLink :to="{ path: '/provider/patients/new-basic-notes/' + props.patient.id }"
                  class="font-weight-medium text-link">
                  <VBtn variant="outlined" class="w-100" v-if="$can('read', 'Basic Note View')">
                    New Basic Note</VBtn>
                </RouterLink>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>Charting History</VBtn>
              </VCol>

              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('LabDiagnostics')" disabled>
                  Lab/Diagnostics</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>Custom Formulations</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('SubmitIntakes')"
                  v-if="$can('read', 'Intake Questions View')">Submitted Intakes</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>Sent Records</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('Questioner')"
                  v-if="$can('read', 'Questionnaire View')">Forms</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>eRx</VBtn>
              </VCol>

            </VRow>
          </VWindowItem>

          <VWindowItem key="2">
            <VRow>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>Supperbill</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('AddPayment')"
                  v-if="$can('read', 'Card Payment View')">Take Card Payment</VBtn>
              </VCol>

              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>Form1500</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>Full Script</VBtn>
              </VCol>

              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>Recommendations</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" disabled>Check Balance</VBtn>
              </VCol>
              <VCol cols="12" :lg=props.secondGrid md="6" sm="6">
                <VBtn variant="outlined" class="w-100" @click="onDialogBtnClick('Appointments')"
                  v-if="$can('read', 'Appointments View')">Appointments</VBtn>
              </VCol>
            </VRow>
          </VWindowItem>
        </VWindow> -->
      </VCardText>

    </VCardText>
  </VCard>

</template>
