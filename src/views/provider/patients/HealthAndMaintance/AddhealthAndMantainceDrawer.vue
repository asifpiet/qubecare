<script setup>
import { useMedicalHealthStore } from '@/stores/medicalHealthStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const medicalHealthStore = useMedicalHealthStore()
medicalHealthStore.unloadHealthMaintenance()
const store = useStore()
const isFormValid = ref(false)
const isLoading = ref(false)
const refForm = ref()
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  selectedHealth: {
    type: String,
    required: true,
  }

})


if (props.selectedHealth) {
  console.log("selectedHealth", props.selectedHealth);
  medicalHealthStore.loadHealthMaintenance(props.selectedHealth)
}
onBeforeMount(() => { })
const emit = defineEmits([
  'closeForm',
  'patientData',
  'customEvent'
]);

const closeNavigationDrawer = () => {
  medicalHealthStore.isDrawerOpen = false;
  emit('customEvent', false)
  emit('update:isDrawerOpen', false)
  emit('reset-form')


}


const onSubmit = async () => {
  isLoading.value = true
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      const newEntryId = Date.now();
      let res = medicalHealthStore.saveHealthMaintenance(props.patient.id)
      console.log("res", res);
      closeNavigationDrawer();
      return res;
    }
  })
}
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
    @update:model-value="medicalHealthStore.isDrawerOpen = false" :model-value="medicalHealthStore.isDrawerOpen">

    <AppDrawerHeaderSection :title="props.selectedHealth ? $t('Edit Health Maintenance') : $t('Add Health Maintenance')"
      @cancel="medicalHealthStore.isDrawerOpen = false" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>

          <VForm ref="refForm" v-model="isFormValid">
            <VRow>
              <VCol cols="6">
                <AppTextField v-model="medicalHealthStore.healthMaintenance.name" :rules="[requiredValidator]"
                  :label="$t('Health Maintenance Name')" :placeholder="$t('Health Maintenance Name')" />
              </VCol>
              <VCol cols="6">
                <AppSelect v-model="medicalHealthStore.healthMaintenance.typeOfItem" :rules="[requiredValidator]"
                  :label="$t('Type Of Item')" :placeholder="$t('Type Of Item')" :items="['BP Screening', 'Breast  Screening', 'Cervical  Screening', 'Colorectal Screening', 'COPD Screening',
                    'Diabetes Eye Exam',
                    'Hyptertension Screening',
                    'Ovarian Screening',
                    'Prostate Screening',
                    'Skin Screening',
                    'Thyroid Screening',
                    'Custom'
                  ]" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="medicalHealthStore.healthMaintenance.lastDate" :rules="[requiredValidator]"
                  type="date" :label="$t('Last Date')" :placeholder="$t('Last Date')" />
              </VCol>

              <VCol cols="6">
                <AppTextField v-model="medicalHealthStore.healthMaintenance.nextDate" :rules="[requiredValidator]"
                  type="date" :label="$t('Next Date')" :placeholder="$t('Next Date')" />
              </VCol>

              <VCol cols="12">
                <v-textarea v-model="medicalHealthStore.healthMaintenance.screeningDetails" :rules="[requiredValidator]"
                  :label="$t('Screening Detail')" :placeholder="$t('Screening Detail')" />
              </VCol>
              <VCol cols="12">
                <p>{{ $t('Flag') }}</p>
                <VRadioGroup v-model="medicalHealthStore.healthMaintenance.flag" inline>
                  <VRadio :label="$t('Normal')" value="Normal" />
                  <VRadio :label="$t('Monitored')" value="Monitored" />
                  <VRadio :label="$t('Alert')" value="Alert" />
                </VRadioGroup>
              </VCol>
              <VCol cols="12">
                <VBtn @click="onSubmit" class="me-3">
                  {{ $t('Save') }}
                </VBtn>
                <VBtn type="reset" variant="tonal" color="error" class="ml-3" @click="closeNavigationDrawer">
                  {{ $t('Close') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>

        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
