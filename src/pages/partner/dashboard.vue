<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Partner Dashboard View',
  },
})

import { usePartnerStore } from '@/stores/partnerStore';
import QRCode from 'qrcode';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { VCardText } from 'vuetify/components';
import { getLineChartSimpleConfig } from './components/apexChartConfig';
const { t } = useI18n();
const { currentUser, currentRole, logout } = useAuth()
const partnerStore = usePartnerStore()
const router = useRouter();
const isMobile = ref();
const grid = ref(4);
const logisticData = ref([
  {
    icon: 'tabler-currency-dollar',
    color: 'primary',
    title: 'Revenue',
    value: 0,
    change: 0,
    isHover: false,
    footerText: 'than last month'
  },
  {
    icon: 'tabler-alert-triangle',
    color: 'warning',
    title: 'Referrals',
    value: 0,
    change: 0,
    isHover: false,
    footerText: 'than last month'
  },
  {
    icon: 'tabler-git-fork',
    color: 'error',
    title: 'Weekly Referrals',
    value: 0,
    change: 0,
    isHover: false,
    footerText: 'than last week'
  },
  {
    icon: 'tabler-cash-banknote',
    color: 'info',
    title: 'Weekly Revenue',
    value: 0,
    change: 0,
    isHover: false,
    footerText: 'than last week'
  }
])

const translatedlogisticData = computed(() => {
  return logisticData.value.map(data => ({
    ...data,
    title: t(data.title)
  }));
});
const snackbar = ref(false);
const userData = currentUser
const account_type = ref(null)
const bank_name = ref(null)
const account_number = ref(null);
const routing_number = ref(null);
const ach = ref(null);
const link = ref(null)
const linkNetwork = ref(null)
const baseURL = `${window.location.protocol}//${window.location.host}${router.options.history.base}`;
const qrCodeSrc = ref(null);
link.value = baseURL + '/referral-redirect?ref=' + btoa(userData.value?.email)
linkNetwork.value = baseURL + '/network/register?ref=' + btoa(userData.value?.id)

const copyToClipboard = () => {
  navigator.clipboard.writeText(link.value).then(() => {
    snackbar.value = true; // Show success message
  });
};

const copyNetworkToClipboard = () => {
  navigator.clipboard.writeText(linkNetwork.value).then(() => {
    snackbar.value = true; // Show success message
  });
};

const dateRange = ref('')
const series = ref([{ data: [] }])

const vuetifyTheme = useTheme()
const balanceChartConfig = computed(() => getLineChartSimpleConfig(vuetifyTheme.current.value))

await partnerStore.getPartnerAccountData(userData.value?.id)
account_number.value = partnerStore.partnerAccount?.account_number ?? null;
routing_number.value = partnerStore.partnerAccount?.routing_number ?? null;
ach.value = partnerStore.partnerAccount?.ach ?? null;
bank_name.value = partnerStore.partnerAccount?.bank_name ?? null;
account_type.value = partnerStore.partnerAccount?.account_type ?? null;

onMounted(async () => {


  isMobile.value = window.innerWidth <= 768;
  grid.value = 4;
  if (isMobile.value == true) {
    grid.value = 12;
  }
  // Generate QR code for the link
  try {
    qrCodeSrc.value = await QRCode.toDataURL(link.value);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  dateRange.value = getCurrentMonthRange()
  const [startDate, endDate] = dateRange.value;
  await partnerStore.getDashboardStats(
    {
      start_date: startDate,
      end_date: endDate,
      partner_id: userData.value?.id
    }
  )
  // await store.dispatch('getPartnerDashboardData', {
  //   start_date: startDate,
  //   end_date: endDate,
  //   partner_id: userData.value?.id
  // });
  console.log('series', series.value)
  logisticData.value[0].value = formatCurrency(partnerStore.dashbardStats.total_revenue); // Update Revenue value
  logisticData.value[1].value = partnerStore.dashbardStats.total_affiliate_users; // Update Referrals value
  logisticData.value[2].value = partnerStore.dashbardStats.weekly_affiliate_users; // Update Weekly Referrals value
  logisticData.value[3].value = formatCurrency(partnerStore.dashbardStats.weekly_revenue); // Update Weekly Revenue value
  series.value[0].data = partnerStore.dashbardStats.line_chart.data


  console.log('series', series.value, startDate, endDate, userData.value?.id)
});
watch(dateRange, async (newRange) => {
  console.log('Date range changed:', newRange);

  if (newRange) {
    const [startDate, endDate] = getDatesFromStringRange(newRange);

    if (startDate && endDate) {
      try {
        console.log('Fetching data for range:', startDate, endDate);

        // Trigger the API call

        await partnerStore.getDashboardStats(
          {
            start_date: startDate,
            end_date: endDate,
            partner_id: userData.value?.id,
          }
        )
        // await store.dispatch('getPartnerDashboardData', {
        //   start_date: startDate,
        //   end_date: endDate,
        //   partner_id: userData.value?.id,
        // });

        logisticData.value[0].value = formatCurrency(partnerStore.dashbardStats.total_revenue); // Update Revenue value
        logisticData.value[1].value = partnerStore.dashbardStats.total_affiliate_users; // Update Referrals value
        logisticData.value[2].value = partnerStore.dashbardStats.weekly_affiliate_users; // Update Weekly Referrals value
        logisticData.value[3].value = formatCurrency(partnerStore.dashbardStats.weekly_revenue); // Update Weekly Revenue value
        // Update the chart data
        series.value[0].data = partnerStore.dashbardStats.line_chart.data;
        console.log('Updated chart series:', series.value);
      } catch (error) {
        console.error('Error during API call:', error);
      }
    } else {
      console.warn('Invalid date range after parsing:', newRange);
    }
  }
});


const getDatesFromStringRange = (rangeString) => {
  // Ensure the input is a string
  if (typeof rangeString !== 'string') {
    console.warn('Invalid rangeString:', rangeString);
    return [null, null];
  }

  // Split the string into start and end dates
  const [start, end] = rangeString.split(' to ');

  // Validate that both start and end are valid date strings
  if (!start || !end || isNaN(new Date(start)) || isNaN(new Date(end))) {
    console.warn('Invalid date range values:', { start, end });
    return [null, null];
  }

  // Return the formatted dates
  return [start.trim(), end.trim()];
};



const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the current month

  // Format the date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return [formatDate(start), formatDate(end)];
};

const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`; // Adding '$' and fixing to 2 decimal places
}

</script>

<template>
  <v-snackbar v-model="snackbar" timeout="2000">
    {{ $t('Copied to clipboard!') }}
  </v-snackbar>
  <VRow class="match-height">
    <VCol :cols="grid">
      <AppDateTimePicker v-model="dateRange" :label="$t('Date Filter')" :placeholder="$t('Select date')"
        :config="{ mode: 'range' }" />
    </VCol>
    <VCol cols="12" class="mb-4 mt-4">
      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card" v-for="(data, index) in translatedlogisticData" :key="index">
          <div class="stat-icon">
            <VIcon :icon="data.icon" size="28" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ data.value }}</div>
            <div class="stat-label">{{ data.title }}</div>
            <div class="stat-change positive">
              <i class="fas fa-arrow-up"></i> {{ (data.change > 0) ? '+' : '' }} {{ data.change }}% {{ data.footerText
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bank Account Setup Card -->
      <div class="setup-card" v-if="!account_number || !routing_number || !ach || !account_type || !bank_name">
        <div class="setup-header">
          <div class="setup-title">
            <i class="fas fa-university"></i> {{ $t('Banking Information') }}
          </div>
          <div class="setup-badge">
            <i class="fas fa-exclamation-circle"></i> {{ $t('Action Required') }} 
          </div>
        </div>

        <div class="setup-message">
          <i class="fas fa-info-circle"></i>
          <span>
            {{ $t('Please set up your banking information to receive payments.') }} 
            {{ $t('You need to add your banking details to get paid for your referrals.') }}
          </span>
        </div>

        <!--  -->

        <router-link to="/partner/settings">
          <button class="btn-primary">
            <i class="fas fa-plus-circle"></i> {{ $t('Add Banking Information') }} 
          </button>
        </router-link>
      </div>
      <!-- <VRow>
        <VCol v-for="(data, index) in logisticData" :key="index" cols="12" md="3" sm="6">
          <div>
            <VCard class="logistics-card-statistics cursor-pointer"
              :style="data.isHover ? `border-block-end-color: rgb(var(--v-theme-${data.color}))` : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.38)`"
              @mouseenter="data.isHover = true" @mouseleave="data.isHover = false">
              <VCardText>
                <div class="d-flex align-center gap-x-4 mb-1">
                  <VAvatar variant="tonal" :color="data.color" rounded>
                    <VIcon :icon="data.icon" size="28" />
                  </VAvatar>
                  <h4 class="text-h4">
                    {{ data.value }}
                  </h4>
                </div>
                <div class="text-body-1 mb-1">
                  {{ data.title }}
                </div>
                <div class="d-flex gap-x-2 align-center">
                  <h6 class="text-h6">
                    {{ (data.change > 0) ? '+' : '' }} {{ data.change }}%
                  </h6>
                  <div class="text-sm text-disabled">
                    {{ data.footerText }}
                  </div>
                </div>
              </VCardText>
            </VCard>
          </div>
        </VCol>
      </VRow> -->
    </VCol>
    <VCol cols="12" md="6">
      <VCard :title="$t('Revenue')">
        <VCardText>
          <VueApexCharts type="line" height="400" :options="balanceChartConfig" :series="series" />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="6">
      <VCard>
        <VCardText class="px-4 py-4">
          <!-- <div class="mb-5">
              <h5 class="text-h5 mb-5">
                Invite people
              </h5>
              <div class="d-flex align-center flex-wrap gap-4 flex-wrap">
                <AppTextField
                  label="Ente<button class="btn-primary">
          <i class="fas fa-plus-circle"></i> Add Banking Information
        </button>r email address and invite"
                  placeholder="Email Address"
                />
                <VBtn class="align-self-end">
                  Submit
                </VBtn>
              </div>
            </div> -->

          <div>
            <h5 class="text-h5 mb-5">
              {{ $t('Share the referral link') }}
            </h5>
            <div class="d-flex gap-4 align-center flex-wrap">
              <AppTextField v-model="link" :label="$t('Affiliate Link')" readonly />
              <div class="d-flex align-self-end gap-x-2">
                <VBtn @click="copyToClipboard" icon class="rounded" color="secondary">
                  <VIcon color="white" icon="tabler-copy" />
                </VBtn>
              </div>
            </div>
            <div class="d-flex gap-4 align-center flex-wrap mt-4">
              <AppTextField v-model="linkNetwork" :label="$t('Network Link')" readonly />
              <div class="d-flex align-self-end gap-x-2">
                <VBtn @click="copyNetworkToClipboard" icon class="rounded" color="secondary">
                  <VIcon color="white" icon="tabler-copy" />
                </VBtn>
              </div>
            </div>
          </div>
          <div>
            <h5 class="text-h5 mb-5 mt-4">
              {{ $t('QR Code') }}
            </h5>
            <v-img v-if="qrCodeSrc" :src="qrCodeSrc" max-height="200"></v-img>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;

    @include mixins.elevation(8);

    transition: all 0.1s ease-out;
  }
}

.skin--bordered {
  .logistics-card-statistics {
    border-block-end-width: 2px;

    &:hover {
      border-block-end-width: 3px;
      margin-block-end: -2px;
      transition: all 0.1s ease-out;
    }
  }
}
</style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f8fafc;
  color: #333333;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(21, 110, 77, 0.05) 0%, transparent 400px),
    radial-gradient(circle at 80% 70%, rgba(21, 110, 77, 0.05) 0%, transparent 400px),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
}

.dashboard {
  display: flex;
  min-height: 100vh;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 70%);
  z-index: 2;
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s;
  transform: translateX(-100%);
}

.stat-card:hover {
  transform: translateY(-10px) rotateX(5deg);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
}

.stat-card:hover::before {
  opacity: 1;
  transform: translateX(100%);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  position: relative;
  z-index: 2;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #156e4d 0%, #0e5238 100%);
  color: white;
  overflow: hidden;
}

.stat-icon::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%);
  border-radius: 18px;
  z-index: 0;
}

.stat-icon i {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
}

.stat-info {
  flex: 1;
  position: relative;
  z-index: 2;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
  background: linear-gradient(to right, #0e5238, #156e4d);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.07));
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.stat-change {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-top: 5px;
}

.stat-change.positive {
  color: #4caf50;
}

.stat-change.negative {
  color: #ff7b7b;
}

.stat-change i {
  margin-right: 4px;
  font-size: 11px;
}

/* Bank Account Setup */
.setup-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.setup-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 7px;
  background: linear-gradient(135deg, #0e5238 0%, #156e4d 100%);
}

.setup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.setup-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  display: flex;
  align-items: center;
}

.setup-title i {
  margin-right: 15px;
  color: #156e4d;
  font-size: 24px;
}

.setup-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  background-color: rgba(255, 183, 77, 0.15);
  color: #ffb74d;
  box-shadow: 0 5px 15px rgba(255, 183, 77, 0.15);
  position: relative;
  overflow: hidden;
}

.setup-badge::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.5s, transform 0.5s;
}

.setup-badge:hover::before {
  opacity: 1;
  transform: translateX(100%);
}

.setup-message {
  background-color: rgba(255, 183, 77, 0.08);
  border-left: 4px solid #ffb74d;
  padding: 20px 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  font-size: 15px;
  color: #6b7280;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 30px rgba(255, 183, 77, 0.1);
}

.setup-message i {
  font-size: 24px;
  margin-right: 15px;
  color: #ffb74d;
  filter: drop-shadow(0 2px 4px rgba(255, 183, 77, 0.3));
}

.btn-primary {
  display: block;
  padding: 18px 28px;
  background: linear-gradient(135deg, #0e5238 0%, #156e4d 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-align: center;
  box-shadow: 0 15px 30px rgba(21, 110, 77, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s;
  transform: translateX(-100%);
}

.btn-primary:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(21, 110, 77, 0.4);
}

.btn-primary:hover::before {
  opacity: 1;
  transform: translateX(100%);
}

.btn-primary:active {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(21, 110, 77, 0.3);
}

.btn-primary i {
  margin-right: 12px;
  position: relative;
  z-index: 2;
  font-size: 18px;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
}

/* Responsive Media Queries */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .sidebar {
    width: 80px;
  }

  .logo-text,
  .nav-text,
  .nav-category {
    display: none;
  }

  .main-content {
    margin-left: 80px;
    width: calc(100% - 80px);
  }

  .header {
    left: 80px;
  }

  .nav-link {
    justify-content: center;
    padding: 14px 5px;
  }

  .nav-icon {
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 20px;
    padding-top: calc(60px + 20px);
  }

  .setup-card {
    padding: 25px;
  }

  .setup-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

@media (max-width: 576px) {
  .header {
    padding: 0 20px;
  }

  .page-title {
    font-size: 18px;
  }
}
</style>
