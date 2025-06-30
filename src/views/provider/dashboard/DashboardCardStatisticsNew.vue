<script setup>
import { useProviderStore } from '@/stores/providerStore';
const providerStore = useProviderStore()
const props = defineProps({
  statData: {
    type: Object
  }
})

</script>
<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat-card p-6 rounded-xl">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-3xl font-bold" style="color: #0F172A;">{{ providerStore.dashboard.totalPaitient }}</h3>
                    <p class="text-sm mt-1" style="color: #475569;">{{ $t("Active Patients") }}</p>
                </div>
                <div class="bg-blue-600 p-4 rounded-xl shadow-lg">
                    <i class="fas fa-user-injured text-white text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-xs">
                <span
                    :class="[
                        providerStore.dashboard.patientPercentageChange < 0 ? 'text-red-600' : 'text-green-600',
                        'font-medium'
                    ]"
                    >
                    {{ providerStore.dashboard.patientPercentageChange }}%
                    </span>

                <span style="color: #475569;" class="ml-1">{{ $t('from last month') }}</span>
            </div>
        </div>

        <div class="stat-card p-6 rounded-xl">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-3xl font-bold" style="color: #0F172A;">{{ providerStore.dashboard.upcomingAppointmentCount }}</h3>
                    <p class="text-sm mt-1" style="color: #475569;">{{ $t('Upcoming Appointments') }}</p>
                </div>
                <div class="bg-purple-600 p-4 rounded-xl shadow-lg">
                    <i class="fas fa-calendar-check text-white text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-xs">
                <span class="text-blue-600 font-medium">{{ providerStore.dashboard.appointmentsThisWeek }} {{ $t('this week') }}</span>
                <span style="color: #475569;" class="ml-1">{{ providerStore.dashboard.appointmentsNextWeek }} {{ $t('next week') }}</span>
            </div>
        </div>

        <div class="stat-card p-6 rounded-xl">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-3xl font-bold" style="color: #0F172A;">{{
                                                                            providerStore.dashboard.totalPractitionerRevenue != null
                                                                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(providerStore.dashboard.totalPractitionerRevenue) || 0)
                                                                            : '$0.00'
                                                                        }}</h3>
                    <p class="text-sm mt-1" style="color: #475569;">{{ $t('Revenue') }}</p>
                </div>
                <div class="bg-green-600 p-4 rounded-xl shadow-lg">
                    <i class="fas fa-dollar-sign text-white text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-xs">
                <span class="text-green-600 font-medium">{{ providerStore.dashboard.revenuePercentageChange }}%</span>
                <span style="color: #475569;" class="ml-1">{{ $t('from last month') }}</span>
            </div>
        </div>

        <div class="stat-card p-6 rounded-xl">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-3xl font-bold" style="color: #0F172A;">{{ providerStore.dashboard.totalInvoice }}</h3>
                    <p class="text-sm mt-1" style="color: #475569;">{{ $t('Invoices') }}</p>
                </div>
                <div class="bg-red-600 p-4 rounded-xl shadow-lg">
                    <i class="fas fa-file-invoice text-white text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-xs">
                <span class="text-red-600 font-medium">{{ providerStore.dashboard.totalUnpaidInvoices }} {{ $t('overdue') }}</span>
                <span style="color: #475569;" class="ml-1">{{ $t('need attention') }}</span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.rounded-xl{
    border-radius: 15px !important;
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
</style>