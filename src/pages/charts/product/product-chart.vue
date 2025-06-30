<script setup>
import ApexChartDataScience from '@/views/charts/apex-chart/ApexChartDataScience.vue';
const downloadfile =ref();
const date =ref();
const logisticData = ref([]);
const bissnessDay =ref();
const today = new Date();
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const changeDateRange = async () => {
   
   
   console.log('changed date', date.value, 'type:', typeof date.value);
   
  //  try {
  //    const dateString = typeof date.value === 'string' ? date.value : '';
  //    const [startDate, endDate] = dateString.split(" to ");
     
  //    if (startDate && endDate) {
  //      await store.dispatch('getAdminAnalyticsOverview', {
  //        start_date: startDate,
  //        end_date: endDate,
  //      });
  //      analyticsData.value = store.getters.getAnalyticsOverview;
  //    } else {
  //      console.warn('Invalid date range');
       
  //    }
  //  } catch (error) {
  //    console.error('Error processing date range:', error);
     
  //  }
 };
</script>

<template>
  <VRow id="apex-chart-wrapper">
    <VCol cols="12" md="4" sm="6" class="mt-3 px-3 pb-0" >
                    <AppDateTimePicker
                        v-model="date"
                        label="Date Range"
                        :config="{ mode: 'range' }"
                        @change="changeDateRange()"
                        >
                    </AppDateTimePicker>
    </VCol>
    <!-- 👉  Area chart -->
   
 <!-- 👉 Data Science -->
    <VCol cols="12">
      <VCard>
        <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
          <VCardTitle>Product</VCardTitle>

          <template #append>
            <div class="d-flex align-center">
                  <VBtnToggle
                    density="compact"
                    color="primary"
                    variant="outlined"
                    divided
                    class="mr-2"
                  >
                    <VBtn>Daily</VBtn>
                    <VBtn>Monthly</VBtn>
                    <VBtn>Yearly</VBtn>
                  </VBtnToggle>
                  
                  <VSelect
                    width="150"  
                    v-model="downloadfile"
                    label="Download" 
                    :items="['PDF', 'Excel']"
                    
                  />
                </div> 
          </template>
        </VCardItem>

        <VCardText>
          <ApexChartDataScience />
        </VCardText>
      </VCard>
    </VCol>

  
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.date-picker-wrapper {
  inline-size: 10.5rem;
}

#apex-chart-wrapper {
  .v-card-item__append {
    padding-inline-start: 0;
  }
}
</style>
