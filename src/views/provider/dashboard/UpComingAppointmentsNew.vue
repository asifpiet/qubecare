<script setup>
import { useProviderStore } from '@/stores/providerStore';
import { dateTimeFormat } from '@/utils/showLoader';
import avatar8 from '@images/avatars/profile-5.webp';
import { useRouter } from 'vue-router';

const router = useRouter();
const providerStore = useProviderStore();

const goToCallPage = (patientId, appointmentId) => {
  router.replace(`/provider/call/${patientId}/${appointmentId}`);
};

const getAppointmentStatusColor = (status) => {
  if (status === 'Pending') {
    return 'warning';
  } else if (['CANCELLED', 'CANCELLATION_BY_PROVIDER', 'CANCELLATION_LATE', 'NO_SHOW'].includes(status)) {
    return 'error';
  } else if (status === 'CONFIRMED') {
    return 'primary';
  } else {
    return 'success';
  }
};
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        <!-- Today's Schedule -->
        <div class="lg:col-span-3 glass-card rounded-xl">
            <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 class="font-semibold text-gray-800 flex items-center text-lg">
                    <div class="bg-gradient-to-br bg-blue-600 to-cyan-500 p-2 rounded-lg mr-3 shadow-md">
                        <i class="fas fa-calendar-day text-white"></i>
                    </div>
                    {{ $t("Upcoming Appointments") }}
                </h2>
                <!-- <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">May 23, 2025</div> -->
            </div>
            <div class="divide-y divide-gray-100">
                <div v-for="appointment in providerStore.dashboard.upcomingAppointments" :key="appointment.id" 
                     class="p-5 flex items-center hover:bg-gray-50 transition-colors duration-200">
                    <div class="w-20 text-center">
                        <div class="text-sm font-semibold text-gray-800">{{ dateFormat(`${appointment.date}`, "MM-DD-YYYY") }}</div>
                        <div class="text-xs text-gray-500">{{ timeFormat(`${appointment.date} ${appointment.time}`, "hh:mm A") }}</div>
                    </div>
                    <!-- <img class="h-10 w-10 rounded-xl mx-4 border-2 border-gray-200 shadow-sm"
                        :src="appointment.patient_image ?? avatar8"
                        alt="Patient"> -->
                    <div class="d-flex align-center gap-x-4 ml-2 mr-2">
                        <VAvatar size="34" :variant="!appointment.patient_image ? 'tonal' : undefined"
                            :color="!appointment.patient_image ? 'primary' : undefined">
                            <VImg v-if="appointment.patient_image" :src="appointment.patient_image" />
                            <span v-else>{{ avatarText(appointment.patient_name) }}</span>
                        </VAvatar>
                    </div>
                    <div class="flex-1">
                        <div class="text-sm font-semibold flex items-center text-gray-800">
                            {{ appointment.patient_name }}
                            <span class="patient-tag">Weight Loss</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">{{ appointment.type.replace('_', ' ') }} • {{ appointment.duration }} minutes</div>
                    </div>
                    <VBtn
                    size="small"
                    rounded="pill"
                    variant="tonal"
                    :color="getAppointmentStatusColor(appointment.appointment_status)"
                    >
                    {{ appointment.appointment_status }}
                    </VBtn>
                    <VBtn 
                      size="small" 
                      icon="tabler-video"
                      @click="goToCallPage(appointment.patient_id, appointment.id)"
                    ></VBtn>
                </div>
                
                <!-- Fallback when no appointments -->
                <div v-if="!providerStore.dashboard.upcomingAppointments || providerStore.dashboard.upcomingAppointments.length === 0" 
                     class="p-5 text-center text-gray-500">
                  {{ $t("No upcoming appointments") }}
                </div>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 text-right">
                <button
                    class="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-end w-full font-medium nav-link transition-colors duration-200"
                    data-section="calendar"
                    @click="$router.push('/provider/calendar')">
                    {{ $t("View full calendar") }}
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.rounded-xl{
    border-radius: 15px !important;
}
.glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(148, 163, 184, 0.15);
    /* box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04); */
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
</style>
