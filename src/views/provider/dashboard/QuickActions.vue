<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '@/stores/providerStore';

const providerStore = useProviderStore()
const route = useRoute();
const router = useRouter();
const snackbar = ref(false);
const baseURL = `${window.location.protocol}//${window.location.host}${router.options.history.base}`;
const copyPatientLink = () => {
    if(!providerStore.dashboard?.builder_id){
        addAlert('No builder found, Please add a builder!', 'error');
        return;
    } 
    const patientSignup = ref(baseURL + '/patient/signup?bid=' + btoa(providerStore.dashboard?.builder_id))
    navigator.clipboard.writeText(patientSignup.value).then(() => {
    snackbar.value = true; // Show success message
  });
};
</script>
<template>
    <v-snackbar v-model="snackbar" timeout="2000">
        {{ $t('Copied to clipboard!') }}
    </v-snackbar>
    <!-- <div class="mb-8">
        <h2 class="text-xl font-semibold mb-6" style="color: #0F172A;">{{ $t('Quick Actions') }}</h2> -->
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button class="quick-action-btn p-6 rounded-xl text-center transition-all duration-300" @click="$router.push('/provider/patients')">
                <div
                    class="bg-blue-600 text-white text-2xl mb-3 w-12 h-12 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <i class="fas fa-user-plus"></i>
                </div>
                <p class="text-sm font-medium" style="color: #0F172A;">{{ $t('Add Patient') }}</p>
            </button>
            <button class="quick-action-btn p-6 rounded-xl text-center transition-all duration-300" @click="$router.push('/provider/calendar')">
                <div
                    class="bg-purple-600 text-white text-2xl mb-3 w-12 h-12 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <i class="fas fa-calendar-plus"></i>
                </div>
                <p class="text-sm font-medium" style="color: #0F172A;">{{ $t('Schedule Appointment') }}</p>
            </button>
            <button class="quick-action-btn p-6 rounded-xl text-center transition-all duration-300" @click="$router.push('/provider/prescriptions')">
                <div
                    class="bg-green-600 text-white text-2xl mb-3 w-12 h-12 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <i class="fas fa-prescription"></i>
                </div>
                <p class="text-sm font-medium" style="color: #0F172A;">{{ $t('Write Prescription') }}</p>
            </button>
            <button class="quick-action-btn p-6 rounded-xl text-center transition-all duration-300" @click="copyPatientLink">
                <div
                    class="bg-red-600 text-white text-2xl mb-3 w-12 h-12 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <i class="fas fa-link"></i>
                </div>
                <p class="text-sm font-medium" style="color: #0F172A;">{{ $t('Patient Invite Link') }}</p>
            </button>
        </div>
    <!-- </div> -->
</template>
<style scoped>
.rounded-xl{
    border-radius: 15px !important;
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
</style>