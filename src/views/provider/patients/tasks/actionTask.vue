<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import Tasks from '@/views/provider/patients/tasks/list.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable: {
    type: Boolean,
  }
})
const fullName = ref();
const fullname = computed(() => {
  console.log("sds", props.patient);
  fullName.value = props.patient.demographic.firstName + ' ' + props.patient.demographic.lastName;

  console.log("fullname", fullName.value);
})
const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Check if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

</script>

<template>
  <div v-if="fullname"></div>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">

    <AppDrawerHeaderSection :title='"Tasks (" + fullName + ")"' @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText class="pt-6">
          <VRow class="">
            <VCol cols="6" md="3">
              <div class="d-flex align-center gap-4">
                <VAvatar color="info" variant="tonal" size="42">
                  <VIcon icon="tabler-user" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium"> {{ props.patient.demographic.firstName }} {{
                    props.patient.demographic.lastName }}</span>
                  <span class="text-sm"> {{ $t('Patient Name') }} </span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex align-center gap-4">
                <VAvatar color="primary" variant="tonal" size="42">
                  <VIcon icon="tabler-calendar" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ dateFormat(props.patient.demographic.dateOfBirth)
                    }}</span>
                  <span class="text-sm"> {{ $t('Date of Birth') }} </span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex align-center gap-4">
                <VAvatar color="error" variant="tonal" size="42">
                  <VIcon icon="tabler-user" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.demographic.sexatBirth }}</span>
                  <span class="text-sm"> {{  $t('Gender') }} </span>
                </div>

              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex align-center gap-4">
                <VAvatar color="error" variant="tonal" size="42">
                  <VIcon icon="tabler-user" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ calculateAge(props.patient.demographic.dateOfBirth)
                    }}</span>
                  <span class="text-sm"> {{  $t('Age') }} </span>
                </div>

              </div>
            </VCol>

            <VCol cols="6" md="3" style="display: none;">
              <div class="d-flex align-center gap-4">
                <VAvatar color="info" variant="tonal" size="42">
                  <VIcon icon="tabler-currency-dollar" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.demographic.insuranceDeductible }}</span>
                  <span class="text-sm"> {{ $t('Deductible $') }} </span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3" style="display: none;">
              <div class="d-flex align-center gap-4">
                <VAvatar color="primary" variant="tonal" size="42">
                  <VIcon icon="tabler-chart-pie-2" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.demographic.coInsurance }}</span>
                  <span class="text-sm"> {{ $t('Co-Ins %') }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3" style="display: none;">
              <div class="d-flex align-center gap-4">
                <VAvatar color="error" variant="tonal" size="42">
                  <VIcon icon="tabler-currency-dollar" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ props.patient.demographic.insurance }}</span>
                  <span class="text-sm"> {{ $t('Insurance')}} </span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <Tasks :patient="props.patient" />
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
