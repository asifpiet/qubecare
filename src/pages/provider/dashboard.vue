<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Dashboard View',
  },
})
import { useProviderStore } from '@/stores/providerStore';
import DashboardCardStatistics from '@/views/provider/dashboard/DashboardCardStatisticsNew.vue';
import OnboardingProgress from '@/views/provider/dashboard/OnboardingProgress.vue';
import QuickActions from '@/views/provider/dashboard/QuickActions.vue';
import UpComingAppointmentsNew from '@/views/provider/dashboard/UpComingAppointmentsNew.vue';
import Graphical from '@/views/provider/dashboard/graphical.vue';

const { currentUser, currentRole, logout } = useAuth()
const dateRangeOptions = [
  { text: 'Today', value: 'today' },
  { text: 'This Week', value: 'this_week' },
  { text: 'This Month', value: 'this_month' },
  { text: 'This Year', value: 'this_year' },
  { text: 'Last Week', value: 'last_week' },
  { text: 'Last Month', value: 'last_month' },
  { text: 'Last Year', value: 'last_year' },
];

const selectedDateRange = ref('today');
const start_date = ref();
const end_date = ref();
const providerStore = useProviderStore();
const dashboardStats = ref([]);

onMounted(async () => {
    
  handleDateRangeChange(selectedDateRange.value);
  // hideLoader()
});

const calculateDateRange = (rangeType) => {
  const now = new Date();
  let startDate, endDate;
  
  switch (rangeType) {
    case 'today': {
      // Start and end are both today
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(); // current time today
      break;
    }
    case 'this_week': {
      const firstDay = new Date(now);
      const day = now.getDay(); // 0 = Sunday
      firstDay.setDate(now.getDate() - day);
      firstDay.setHours(0, 0, 0, 0);
      startDate = firstDay;
      endDate = now;
      break;
    }
    case 'this_month': {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
      break;
    }
    case 'this_year': {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
      break;
    }
    case 'last_week': {
      const firstDayLastWeek = new Date(now);
      const day = now.getDay();
      firstDayLastWeek.setDate(now.getDate() - day - 7);
      firstDayLastWeek.setHours(0, 0, 0, 0);
      startDate = firstDayLastWeek;

      const lastDayLastWeek = new Date(firstDayLastWeek);
      lastDayLastWeek.setDate(firstDayLastWeek.getDate() + 6);
      lastDayLastWeek.setHours(23, 59, 59, 999);
      endDate = lastDayLastWeek;
      break;
    }
    case 'last_month': {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    }
    case 'last_year': {
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31);
      break;
    }
    default: {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
    }
  }
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
};


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleDateRangeChange = (value) => {
  const { startDate, endDate } = calculateDateRange(value);
  
  start_date.value = startDate;
  end_date.value = endDate;
  
  // Update store and fetch new data
  providerStore.start_date = startDate;
  providerStore.end_date = endDate;
  providerStore.getDashbaordStats();
  dashboardStats.value = [];
};
</script>
<template>
    <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Main Content -->
        <main class="flex-1">
            <!-- Dashboard Section -->
            <section id="dashboard" class="section active">
                
                <!-- Onboarding Progress -->
                <OnboardingProgress v-if="providerStore?.dashboard?.onboarding_completed_percentage < 100"/>

                <!-- Quick Stats -->
                <DashboardCardStatistics />
                <div class="mb-8">
                    <VRow>
                        <VCol cols="12" md="9" class="mt-1 mb-3 px-3">
                            <h2 class="text-xl font-semibold mb-6" style="color: #0F172A;">{{ $t('Quick Actions') }}</h2>
                        </VCol>
                        <VCol cols="12" md="3" class="mt-1 mb-3 px-3">
                            <VSelect
                                v-model="selectedDateRange"
                                :items="dateRangeOptions"
                                item-title="text"
                                item-value="value"
                                label="Filter Data"
                                density="comfortable"
                                @update:model-value="handleDateRangeChange"
                            ></VSelect>
                        </VCol>
                    </VRow>
                    <!-- Quick Actions -->
                    <QuickActions />
                </div>
                
                

                <!-- Content Grid -->
                <UpComingAppointmentsNew />
            </section>
        </main>
    </div>
</template>
<style scoped>

.sidebar {
    background: linear-gradient(180deg, #0C1426 0%, #1A202C 100%);
    backdrop-filter: blur(10px);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
}

.rounded-xl{
    border-radius: 15px !important;
}

.glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
}

.active-nav {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%);
    border-left: 3px solid #3B82F6;
    box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.08);
}

.section {
    display: none;
    animation: fadeIn 0.3s ease-in-out;
}

.section.active {
    display: block;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

.sidebar.mobile-open {
    animation: slideIn 0.3s ease-out;
}

.dropdown {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    min-width: 200px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(148, 163, 184, 0.15);
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 10px 25px -5px rgba(15, 23, 42, 0.08);
    z-index: 50;
    animation: dropdownFade 0.2s ease-out;
}

.dropdown.show {
    display: block;
}

@keyframes dropdownFade {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chat-header {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
}

.user-message {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    color: white;
    border-radius: 18px 18px 4px 18px;
    margin-left: auto;
    max-width: 80%;
    box-shadow: 0 2px 10px rgba(14, 165, 233, 0.3);
}

.ai-message {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 18px 18px 18px 4px;
    max-width: 80%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-bar {
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.mic-button {
    background: #3B82F6;
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.mic-button:hover {
    background: #1D4ED8;
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
}

.mic-button.recording {
    background: #EF4444;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    50% {
        transform: scale(1.1);
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.5);
    }
}

.patient-tag {
    background: linear-gradient(45deg, #3B82F6, #10B981);
    color: white;
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    margin-left: 0.5rem;
    font-weight: 500;
}

.step-indicator {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.step-pending {
    background: #e5e7eb;
    color: #6b7280;
}

.step-progress {
    background: linear-gradient(45deg, #F59E0B, #f97316);
    color: white;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.step-complete {
    background: linear-gradient(45deg, #10B981, #059669);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.task-row {
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 4px 0;
}

.task-row:hover {
    background: #f8fafc;
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.task-row.completed {
    background: linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%);
}

.task-row.in-progress {
    background: linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%);
}

.stat-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(148, 163, 184, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent);
}

.stat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 32px 64px -12px rgba(15, 23, 42, 0.08), 0 20px 40px -8px rgba(15, 23, 42, 0.08);
    border-color: rgba(59, 130, 246, 0.2);
}

.quick-action-btn {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(148, 163, 184, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.quick-action-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.2), transparent);
}

.quick-action-btn:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
    border-color: rgba(59, 130, 246, 0.25);
}

.mobile-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 40;
}

.mobile-overlay.show {
    display: block;
    animation: fadeIn 0.3s ease-out;
}

.notification-badge {
    background: linear-gradient(45deg, #EF4444, #dc2626);
    animation: bounce 2s infinite;
}

@keyframes bounce {

    0%,
    20%,
    53%,
    80%,
    100% {
        transform: translateY(0);
    }

    40%,
    43% {
        transform: translateY(-8px);
    }

    70% {
        transform: translateY(-4px);
    }

    90% {
        transform: translateY(-2px);
    }
}

.search-input {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(148, 163, 184, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #0F172A;
}

.search-input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08), 0 8px 25px -5px rgba(15, 23, 42, 0.08);
    border-color: #3B82F6;
    background: rgba(255, 255, 255, 0.95);
}

.search-input::placeholder {
    color: #475569;
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: -100%;
        top: 0;
        height: 100vh;
        z-index: 50;
        transition: left 0.3s ease;
    }

    .sidebar.mobile-open {
        left: 0;
    }
}

.typing-indicator {
    display: inline-flex;
    align-items: center;
}

.typing-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #9ca3af;
    margin: 0 1px;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes typing {

    0%,
    80%,
    100% {
        transform: scale(0.8);
        opacity: 0.5;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
