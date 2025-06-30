<script setup>
import { useProviderStore } from '@/stores/providerStore';
const { currentUser, currentRole, logout } = useAuth()
const providerStore = useProviderStore();
</script>
<template>
    <div class="glass-card border-l-4 mb-6 rounded-xl" style="border-left-color: #3B82F6;">
        <div class="p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div class="text-lg font-semibold mb-1" style="color: #0F172A;">{{ $t('Practice Onboarding') }}:
                        <span id="progress-percentage"
                            style="color: #3B82F6;">{{providerStore.dashboard?.onboarding_completed_percentage}}%</span> {{ $t('Complete') }}</div>
                    <div class="text-sm" style="color: #475569;"><span
                            id="remaining-tasks">{{ providerStore.dashboard?.onboarding_total_tasks > 0 ? providerStore?.dashboard?.onboarding_total_tasks -  providerStore?.dashboard?.onboarding_completed_tasks : 0}}</span> {{ $t('tasks remaining to finish setting up your practice') }}</div>
                </div>
                <button
                    class="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 nav-link"
                    data-section="onboarding" @click="$router.push('/provider/onboarding')" v-if="$can('read', 'Provider On Boarding View')">
                    {{ $t('Continue Setup') }}
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
            <div class="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-3 rounded-full progress-bar" id="main-progress-bar" :style="`width: ${providerStore.dashboard?.onboarding_completed_percentage}%`"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.rounded-xl{
    border-radius: 15px !important;
}
.progress-bar {
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>