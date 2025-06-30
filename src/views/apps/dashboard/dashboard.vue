<script setup>
import store from '@/store';
import DashboardCardStatistics from '@/views/apps/dashboard/DashboardCardStatistics.vue';
import UpComingAppointments from '@/views/apps/dashboard/UpComingAppointments.vue';
import Graphical from '@/views/apps/dashboard/graphical.vue';
import Invoice from '@/views/apps/dashboard/invoice.vue';
import Sales from '@/views/apps/dashboard/sales.vue';
const date = ref();
const start_date = ref();
const end_date = ref();
const totalPaitent =ref();
const totalAppiontment =ref();
const report =ref();
const dashboardStats = ref([]);
const wizardSetup = ref();
const router = useRouter()
// const changeDateRange = async () => {
  // await store.dispatch('updateIsLoading',true)
   // console.log('shgdhasgdshla',store.getters.getCurrentFilterDate);
  //  console.log('changed date', date.value, 'type:', typeof date.value);
   
//    try {
//      const dateString = typeof date.value === 'string' ? date.value : '';
//      const [startDate, endDate] = dateString.split(" to ");
//         start_date.value = startDate;
//         end_date.value = endDate;
//       if (startDate && endDate) {
//         console.log('check date', startDate , endDate );
//         await store.dispatch('getAppointmentsReport',{
//           start_date: startDate,
//           end_date: endDate,
//           provider: provider.value,
//           status: appiontmentStatus.value,
//         })
//         report.value =  JSON.parse(store.getters.getAppiontmentReport);
//         console.log("ChangeActionReport",report.value);
//         totalPaitent.value = report.value.totalPatients;
//         totalAppiontment.value = report.value.totalAppointments;
//         console.log("changeTap",totalPaitent.value, totalAppiontment.value); 
//         await store.dispatch('updateIsLoading',false)
//      } else {
//        console.warn('Invalid date range');
//        await store.dispatch('updateIsLoading',false) 
//      }
//    } catch (error) {
//      console.error('Error processing date range:', error);
     
//    }
//  };

 onMounted(async () => {
  setDateRange();
  await store.dispatch('updateIsLoading',true)
      const now = new Date()
        let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const formatDate = (date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        const currentDate = formatDate(now)
        const monthStart = formatDate(startOfMonth)
        start_date.value = monthStart;
        end_date.value = currentDate;
        await store.dispatch('getDashbaordStats',{
          start_date: start_date.value,
          end_date: end_date.value,
        });
        dashboardStats.value = store.getters.getDashboardStats;
        // console.log("patientStats",providerStats.value);
        await store.dispatch('updateIsLoading',false)
});

const formatDate = (date)  => {
    const month = date.getMonth() + 1; // Months are zero-indexed
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedMonth = month.toString().padStart(2, '0');
      const formattedDay = day.toString().padStart(2, '0');
      return `${year}-${formattedMonth}-${formattedDay}`;
    }
    const setDateRange = () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      date.value = formatDate(startOfMonth)  + ' to ' +  formatDate(today);
    };
  const changeDateRange = async () => {
  // await store.dispatch('updateIsLoading',true)
   // console.log('shgdhasgdshla',store.getters.getCurrentFilterDate);
   console.log('changed date', date.value, 'type:', typeof date.value);
   try {
     const dateString = typeof date.value === 'string' ? date.value : '';
     const [startDate, endDate] = dateString.split(" to ");
        start_date.value = startDate;
        end_date.value = endDate;
      if (startDate && endDate) {
        console.log('check date', startDate , endDate );
        await store.dispatch('getDashbaordStats',{
          start_date: start_date.value,
          end_date: end_date.value,
        });
          dashboardStats.value = store.getters.getDashboardStats;
          // console.log("invoiceReport",invoiceReport.value);  
        await store.dispatch('updateIsLoading',false)
     } else {
       console.warn('Invalid date range');
       await store.dispatch('updateIsLoading',false) 
     }
   } catch (error) {
     console.error('Error processing date range:', error);
     
   }
 };


// onMounted(async () => {
  
    // await store.dispatch('getDashbaordStats');

    // dashboardStats.value = store.getters.getDashboardStats;
    // console.log("dashboardStats",dashboardStats.value);
    // await store.dispatch('wizardStup')
    // wizardSetup.value = await store.getters.getWizardSetup
    // if (wizardSetup.value.intake_question_count == 0
    //   || wizardSetup.value.intake_question_count == 0
    //   || wizardSetup.value.questiories_form_count == 0
    //   || wizardSetup.value.product_count == 0
    //   || wizardSetup.value.affliate_product_count == 0
    //   || !wizardSetup.value.sync_google_account
    //   || !wizardSetup.value.payment_method_setup
    // ) {
    //  // await router.push({name:'provider-register-setup'})
    // }
//  });
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12" md="4" class="mt-3 px-3">
                    <AppDateTimePicker
                        v-model="date"
                        label="Date Range"
                        :config="{ mode: 'range' }"
                        @change="changeDateRange()"
                        >
                    </AppDateTimePicker>
    </VCol>
    <VCol cols="12">
      <DashboardCardStatistics :statData ="dashboardStats" />
    </VCol>

    <VCol cols="12"
          
          md="4">
      <Sales :statData ="dashboardStats" />
    </VCol>
    <VCol cols="12" md="8"
          
          >
      <Graphical  :statData ="dashboardStats"/>
    </VCol>

    

    

    <VCol cols="12">
      <VCard title="Upcoming Appointments">  
      <UpComingAppointments  :statData ="dashboardStats" />
      </VCard>
    </VCol>

    <VCol cols="12">
        <VCard title="Invoices">
      <Invoice  :statData ="dashboardStats"/>
      </VCard>
    </VCol>



    
    
  </VRow>
</template>
