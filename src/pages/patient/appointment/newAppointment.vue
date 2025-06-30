<script setup>
import DateCalendar from '@/pages/patient/appointment/scheduleCalendar.vue';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    isAppointment: {
        type: Object,
        required: true,
    },
});
const { currentUser, currentRole, logout } = useAuth()

const route = useRoute();
const router = useRouter();
const patientRegStore = usePatientRegStore()
const builderStore = useBuilderStore()
const practitionerStore = usePractitionerStore()

const isMobile = ref(window.innerWidth <= 768);

// Tab control for mobile view
const activeTab = ref('calendar'); // 'doctor' or 'calendar'

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
    if (!isMobile.value) {
        // Default to showing both on desktop
        activeTab.value = 'calendar';
    }
};
onMounted(async () => {
    console.log("currentUser", currentUser);
    window.addEventListener('resize', checkIfMobile);
    checkIfMobile();
})

onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});

</script>
<template>
    <div style="background-color: white; min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden;">
        <div :style="isMobile ? { marginTop: '0px', flex: '1 1 auto', paddingBottom: '70px' } : { marginTop: '0px' }">
            <VContainer :class="isMobile ? 'px-0 pt-0 container-mobile' : ''">
                <!-- <VRow>
                    <VCol cols="12" md="7"> -->
                <div class="">
                    <DateCalendar></DateCalendar>
                </div>

                <!-- </VRow> -->



            </VContainer>
        </div>


    </div>
</template>

<style scoped>
.doctor-image {
    border: 5px solid var(--primary-light);
    box-shadow: 0 6px 16px rgba(73, 163, 140, 0.15);
}

.doctor-card {
    padding: 32px;
    border-radius: 12px;
    text-align: center;
    background-color: white;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--gray-200);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
}

.doctor-card-mobile {
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    background-color: white;
    transition: transform 0.3s ease;
}

.scheduler {
    padding: 10px;
    border-radius: 12px;
    background-color: white;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--gray-200);
}

.scheduler-mobile {
    padding: 5px;
    background-color: white;
}

.calendar-container {
    padding: 0 5px;
}

.visit-type {
    display: inline-block;
    padding: 10px 18px;
    background: #e9f5f2;
    border-radius: 30px;
    color: #3d8a76;
    font-size: 15px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(73, 163, 140, 0.1);
}

/* Tab Navigation */
.tab-navigation {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    background-color: white;
    width: 100%;
}

.tab-nav-row {
    width: 100%;
    margin-right: 0;
    margin-left: 0;
}

.tab-button {
    flex: 1;
    text-align: center;
    padding: 15px 0;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
}

.tab-button.active {
    color: var(--primary, #3d8a76);
    border-bottom: 2px solid var(--primary, #3d8a76);
}

/* Mobile Bottom Navigation */
.mobile-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 0;
    color: #666;
    transition: all 0.3s;
}

.nav-item.active {
    color: var(--primary, #3d8a76);
}

.nav-icon {
    font-size: 20px;
    margin-bottom: 4px;
}

.nav-label {
    font-size: 12px;
    font-weight: 500;
}

.container-mobile {
    max-width: 100%;
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .custom-color {
        font-size: 24px;
    }
}
</style>
<style scoped>
.language-dropdown {
    position: fixed;
    top: 10px;
    /* Adjust the distance from the top */
    right: 10px;
    /* Adjust the distance from the right */
    z-index: 1000000;
    /* Ensure it's above other content */
}

.language-dropdown .language {
    cursor: pointer;
    padding: 5px 10px;
    background-color: transparent;
    /* border-radius: 5px; */
    /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.language-dropdown .language:hover {
    /* background-color: #f0f0f0; */
}
</style>
