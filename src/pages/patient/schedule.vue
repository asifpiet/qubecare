<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})

import { usePatientCompanyScripts } from '@/composables/useCompanyScripts';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import DateCalendar from '@/views/register-flow/components/schedule.vue';
import Steps from '@/views/register-flow/components/steps.vue';
import NavBarI18n from '@core/components/I18n.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import debounce from 'lodash.debounce';
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const { currentUser, currentRole, logout } = useAuth()

const route = useRoute();
const router = useRouter();
const patientRegStore = usePatientRegStore()
const builderStore = useBuilderStore()
const practitionerStore = usePractitionerStore()
const { initializeCompanyScripts } = usePatientCompanyScripts()

const bid = atob(route.query.bid);
patientRegStore.patient.affiliate_email = route.query.af_ref ? atob(route.query.af_ref) : null
await builderStore.getUnauthBuilderById(bid)
console.log('builderStore.layout', builderStore.layout)
await patientRegStore.getProductByProviderId(builderStore.provider_id)

practitionerStore.getPractitionerInfoUnAuth(builderStore.provider_id)
console.log('>>', practitionerStore.practitioner)

// Initialize company scripts after practitioner data is loaded
watch(() => practitionerStore.practitioner, (practitioner) => {
    if (practitioner && practitioner.company) {
        console.log('Practitioner company data loaded, injecting scripts:', practitioner.company)
        initializeCompanyScripts()
    }
}, { immediate: true })

if (localStorage.getItem('patientRegStore')) {
    let data = JSON.parse(atob(localStorage.getItem('patientRegStore')))
    patientRegStore.setState(data)
}

const doctorName = ref(null);
const doctorAvatar = ref(null);
const doctorSpecialty = ref('M.D.');
const lastName = ref(null)
const initials = ref(null)
const slotDuration = ref('30 minutes'); // Default value

const appointmentObject = builderStore.layout.find(object => object.title === 'Appointment');
patientRegStore.appointment.practitioner_fee = appointmentObject.config.practitioner_fee
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

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

const encodeBase64Unicode = (obj) => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}
const goBack = () => {

    let url = '/patient/payment?bid=' + route.query.bid + '&cart=' + encodeBase64Unicode(patientRegStore.cart_products);

    if (patientRegStore.patient.affiliate_email) url += `&af_ref=${btoa(patientRegStore.patient.affiliate_email)}`;

    router.replace(url);
};

onMounted(async () => {
    let practitionerDataApi = await $api(GET_PRACTITIONER_DATA_BY_UUID + '/' + appointmentObject.config.practitioners[0], {
        method: 'GET',
        onResponseError({ response }) {
            console.error('Error in practitioner API:', response);
        }
    });
    console.log('>>', practitionerDataApi.data)
    doctorAvatar.value = practitionerDataApi.data.profile_image_url ?? '/images/doctor.jpg'
    doctorName.value = practitionerDataApi.data.firstName + ' ' + practitionerDataApi.data.lastName
    lastName.value = practitionerDataApi.data.lastName
    initials.value = getInitials(doctorName.value)
    window.addEventListener('resize', checkIfMobile);
    checkIfMobile();
})

onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile);
});

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0].toUpperCase())
        .join('');
}

const safeBtoa = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
}

const updateSlotDuration = (duration) => {
    slotDuration.value = duration;
}

patientRegStore.$subscribe(debounce((mutation, state) => {
    localStorage.setItem('patientRegStore', safeBtoa(JSON.stringify(state)))
}))

watch(
    () => practitionerStore.practitioner?.company?.logo,
    (newLogo) => {
        if (newLogo) {
            themeConfig.app.logo = h('div', { innerHTML: `<img src="${newLogo}" alt="Logo" style="width:160px;">` });
        }
    },
    { immediate: true }
);

const logo = computed(() => {
    console.log(practitionerStore.practitioner)
    return themeConfig.app.logo;
});
</script>
<template>
    <div style="background-color: white; min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden;">
        <!-- Fixed Header -->
        <div class="text-center"
            style="padding: 15px 10px 10px 10px; border-bottom: 1px solid #c0c0c0b0; position: fixed; width: 100%; z-index: 1004; background: white;">
            <VNodeRenderer :nodes="logo" />
        </div>
        <div class="language-dropdown">
            <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
                :languages="themeConfig.app.i18n.langConfig" class="language" />
        </div>

        <!-- Progress Steps -->
        <div style="position: relative; top: 70px; margin-bottom: 20px;">
            <Steps currentStep="Schedule"></Steps>
        </div>

        <!-- Main Content with adjusted padding for mobile -->
        <div :style="isMobile ? { marginTop: '0px', flex: '1 1 auto', paddingBottom: '70px' } : { marginTop: '0px' }">
            <VContainer :class="isMobile ? 'px-0 container-mobile' : ''">
                <!-- Page Title -->
                <VRow class="mt-4" :class="isMobile ? 'mx-0' : ''">
                    <VCol cols="12" class="text-center pb-0">
                        <h1 class="custom-color mb-2"> {{ $t('Schedule Your Consultation') }}</h1>
                        <p class="mb-3">{{ $t('Book your virtual appointment with') }}
                            {{ $t('Dr. {doctorName}', {
                                'doctorName': doctorName
                            }) }},
                            <span> {{ $t('specializing in') }} {{ $t(' {doctorSpecialty}', {
                                'doctorSpecialty':
                                    doctorSpecialty
                            }) }}</span>
                        </p>
                    </VCol>
                </VRow>

                <!-- Desktop Layout -->
                <div v-if="!isMobile">
                    <VRow>
                        <VCol cols="12" md="5">
                            <div class="doctor-card px-5" style="min-height: 430px;">
                                <div class="text-center mb-4">
                                    <VAvatar class="doctor-image" :rounded="50" size="150" :image="doctorAvatar" />
                                </div>
                                <div>
                                    <h2 class="custom-color font-weight-bold mb-2">
                                        {{ $t('Dr. {doctorName}', {
                                            'doctorName': doctorName
                                        }) }},
                                        <span> {{ $t(' {doctorSpecialty}', {
                                            'doctorSpecialty':
                                                doctorSpecialty
                                        }) }}</span>
                                    </h2>
                                    <!-- <p class="text-body-1 text-grey-darken-1 mb-0">
                                        {{ $t('Dr. {doctorName}', {
                                            'doctorName': doctorName
                                        }) }}
                                        {{ $t(`is a dedicated medical professional with extensive experience in`) }}

                                        {{ $t('specializing in') }} {{ $t(' {doctorSpecialty}', {
                                            'doctorSpecialty':
                                                doctorSpecialty
                                        }) }}.
                                        {{ $t(`Known for his patient-centered approach, he strives to provide
                                        personalized care and ensure the best outcomes for his patients.`) }}
                                        {{ $t('Dr. {lastName}', {
                                            'lastName': lastName
                                        }) }},
                                        {{ $t(`stays at the forefront of medical advancements to offer the highest
                                        quality treatment.`) }}
                                    </p> -->
                                    <p class="text-body-1 text-grey-darken-1 mb-0">
                                        {{ $t('Dr. {doctorName}', {
                                            'doctorName': doctorName
                                        }) }}
                                        {{ $t('is a dedicated medical professional with extensive experience in medicine.Known for his patient - centered approach, he strives to provide personalized care and ensure the best outcomes for his patients.') }}
                                        {{ $t('Dr. {lastName}', {
                                            'lastName': lastName
                                        }) }}
                                        {{ $t('stays at the forefront of medical advancements to offer the highest quality treatment.') }}
                                    </p>
                                    <div class="text-center mt-6">
                                        <span class="visit-type">
                                            
                                            {{ $t('Virtual Telehealth Visit • ') }}{{ slotDuration }}</span>
                                    </div>
                                </div>
                            </div>
                        </VCol>
                        <VCol cols="12" md="7">
                            <div class="scheduler">
                                <DateCalendar :data="appointmentObject" :doctorName="doctorName"
                                    @update:slotDuration="updateSlotDuration"></DateCalendar>
                            </div>
                        </VCol>
                    </VRow>
                </div>

                <!-- Mobile Layout with Tabs -->
                <div v-else>
                    <!-- Tab Navigation -->
                    <VRow class="mx-0 tab-nav-row">
                        <VCol cols="12" class="px-0">
                            <div class="tab-navigation">
                                <div :class="['tab-button', activeTab === 'doctor' ? 'active' : '']"
                                    @click="setActiveTab('doctor')">
                                    {{ $t('Doctor') }}
                                </div>
                                <div :class="['tab-button', activeTab === 'calendar' ? 'active' : '']"
                                    @click="setActiveTab('calendar')">
                                    {{ $t('Calendar') }}
                                </div>
                            </div>
                        </VCol>
                    </VRow>

                    <!-- Doctor Tab Content -->
                    <div v-if="activeTab === 'doctor'" class="px-4 py-2">
                        <div class="doctor-card-mobile">
                            <div class="text-center mb-4">
                                <VAvatar class="doctor-image" :rounded="50" size="120" :image="doctorAvatar" />
                            </div>
                            <div>
                                <h2 class="custom-color font-weight-bold mb-2">
                                    {{ $t('Dr. {doctorName}', {
                                        'doctorName': doctorName
                                    }) }},
                                    <span> {{ $t('specializing in') }} {{ $t(' {doctorSpecialty}', {
                                        'doctorSpecialty':
                                            doctorSpecialty
                                    }) }}</span>
                                </h2>
                                <p class="text-body-1 text-grey-darken-1 mb-0">
                                    {{ $t('Dr. {doctorName}', {
                                        'doctorName': doctorName
                                    }) }}
                                    {{ $t(`is a dedicated medical professional with extensive experience in`) }}
                                    {{ $t('specializing in') }} {{ $t(' {doctorSpecialty}', {
                                        'doctorSpecialty':
                                            doctorSpecialty
                                    }) }}.
                                    {{ $t(`Known for his patient-centered approach, he strives to provide personalized
                                    care and ensure the best outcomes for his patients.`) }}
                                    {{ $t('Dr. {lastName}', {
                                        'lastName': lastName
                                    }) }}, {{ $t(`stays at the forefront of medical advancements to offer the highest
                                    quality treatment.`) }}
                                </p>
                                <div class="text-center mt-4">
                                    <span class="visit-type">{{ $t('Virtual Telehealth Visit • {duration}', {
                                        duration:
                                        slotDuration }) }} </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Calendar Tab Content -->
                    <div v-if="activeTab === 'calendar'" class="calendar-container">
                        <div class="scheduler-mobile">
                            <DateCalendar :data="appointmentObject" :doctorName="doctorName"
                                @update:slotDuration="updateSlotDuration"></DateCalendar>
                        </div>
                    </div>
                </div>
            </VContainer>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div v-if="isMobile" class="mobile-bottom-nav">
            <div class="nav-item" @click="goBack">
                <div class="nav-icon">←</div>
                <div class="nav-label">{{ $t('Back') }}</div>
            </div>
            <div :class="['nav-item', activeTab === 'calendar' ? 'active' : '']" @click="setActiveTab('calendar')">
                <div class="nav-icon">
                    <v-icon icon="tabler-calendar" size="24"></v-icon>
                </div>
                <div class="nav-label">{{ $t('Schedule') }} </div>
            </div>
            <div :class="['nav-item', activeTab === 'doctor' ? 'active' : '']" @click="setActiveTab('doctor')">
                <div class="nav-icon">
                    <v-icon icon="tabler-user-star" size="24"></v-icon>
                </div>
                <div class="nav-label">{{ $t('Doctor') }} </div>
            </div>
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
