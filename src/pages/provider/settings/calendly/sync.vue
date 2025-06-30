<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Calender View',
    },
})
import { hideLoader, showLoader } from '@/utils/showLoader';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore()
const router = useRouter()
const route = useRoute()
const gConnected = ref(false)
const code = route.query.code;
const loading = ref(false)
const gPullEmail = ref(null)
const gPulledCalendars = ref()
const settingId = ref(null)
const { t } = useI18n();
onMounted(async () => {

    if (code) {
        showLoader()
        try {
            let responseCalback = await $api(GET_CALENDLY_CALLBACK + '?code=' + code, {
                method: 'POST',
                onResponseError({ response }) {
                    console.error('Error in API:', response);
                }
            });
            console.log('responseCalback', responseCalback)
            hideLoader()
            if (responseCalback.message === 'Token Saved') {
                gConnected.value = true
                router.replace({ path: route.path });
            }
        } catch (error) {
            hideLoader()
            store.dispatch('updateIsTonalSnackbar', true)
            store.dispatch('updateErrorMessage', 'Something went wrong')
            console.error('Error in API:', error.response || error.message || error);
            router.replace({ path: route.path });
        }

    }

    await getCalendlySettings()

});

const gForm = ref()
const drawer = ref(false);
const gPushCalendar = ref(false);
const gPullCalendar = ref(false);
const gPullEvents = ref(false);
const gCalenderTypes = ref([])
const gTable = ref([])
const eventTypes = ref([])
const eventType = ref(null)

const gConnectItems = ref([
    {
        prependIcon: 'tabler-circle-check',
        title: 'New Subcalendar in Calendly Calendar',
        subtitle: 'Your appointments will appear in your Calendly Calendar as a sub-calendar.'
    },
    {
        prependIcon: 'tabler-circle-check',
        title: 'Pull in none, one, or more subcalendars from Calendly Calendar',
        subtitle: 'You can select which Calendly Calendar sub-calendars to pull into our website.'
    },
    {
        prependIcon: 'tabler-circle-check',
        title: 'Appointments which are “busy” will sync',
        subtitle: 'Only appointments marked “busy” in your Calendly Calendar will appear in your Calendar.'
    },
    {
        prependIcon: 'tabler-info-triangle',
        title: 'Manage appointments in the appropriate calendar',
        subtitle: 'You will need to manage appointments originating from our website within our website, and appointments originating from Calendly Calendar within Calendly Calendar.'
    }
])

const translatedgConnect = computed(() => {
    return gConnectItems.value.map(header => ({
        ...header,
        title: t(header.title),
        subtitle: t(header.subtitle)
    }));
});


const toggleConnectDrawer = () => {
    drawer.value = !drawer.value
    gConnected.value = true
};
const toggleConnectedDrawer = () => {
    drawer.value = !drawer.value
    gConnected.value = false
};
const connectCalendly = async () => {
    showLoader()
    try {
        let responseRedirect = await $api(GET_CALENDLY_CONNECT, {
            method: 'GET',
            onResponseError({ response }) {
                console.error('Error in API:', response);
            }
        });
        console.log('responseRedirect', responseRedirect)

        window.open(responseRedirect.url, '_blank');
        hideLoader()
    } catch (error) {
        hideLoader()
        store.dispatch('updateIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Something went wrong')
        console.error('Error in API:', error.response || error.message || error);
    }
}

const getCalendlySettings = async () => {
    gTable.value = []
    let responseSettings = await $api(GET_CALENDLY_SETTINGS, {
        method: 'GET',
        onResponseError({ response }) {
            console.error('Error in API:', response);
        }
    });
    console.log('responseSettings', responseSettings)
    if (responseSettings.data.access_token) {
        gConnected.value = true
        getCalendlyEventTypes()
    }
};

const getCalendlyEventTypes = async () => {
    eventTypes.value = []
    let responseEvents = await $api(GET_CALENDLY_EVENT_TYPES, {
        method: 'GET',
        onResponseError({ response }) {
            console.error('Error in API:', response);
        }
    });
    console.log('responseEvents', responseEvents)
    if (responseEvents.data) {
        eventTypes.value = responseEvents.data

    }
};

const onGSubmit = async () => {
    gForm.value?.validate().then(async ({ valid }) => {
        if (valid) {
            let payload = {
                push_calendar: gPushCalendar.value,
                pull_calendar: gPullCalendar.value,
                pull_events: gPullEvents.value,
                calendar_types: gCalenderTypes.value
            }

            showLoader()
            try {
                const res = await $api(STORE_CALENDLY_SETTINGS, {
                    method: 'POST',
                    body: {
                        id: settingId.value,
                        push_calendar: gPushCalendar.value,
                        pull_calendar: gPullCalendar.value,
                        pull_events: gPullEvents.value,
                        calendar_types: gCalenderTypes.value
                    },

                }

                )
                store.dispatch('updateSuccessIsTonalSnackbar', true)
                store.dispatch('updateErrorMessage', 'Successfully Updated')
                console.log('settings update res', res);
                await getCalendlySettings()
                hideLoader()
            } catch (error) {
                hideLoader()
                store.dispatch('updateIsTonalSnackbar', true)
                store.dispatch('updateErrorMessage', 'Something went wrong')
                console.error('Error in API:', error.response || error.message || error);
            }

        }
    });

};

const gDisconnectSync = async () => {
    showLoader()
    try {
        let responseDisconnect = await $api(DISCONNECT_CALENDLY_SYNC, {
            method: 'GET',
            onResponseError({ response }) {
                console.error('Error in API:', response);
            }
        });
        console.log('responseDisconnect', responseDisconnect)
        await getCalendlySettings()
        gConnected.value = false
        hideLoader()
        store.dispatch('updateSuccessIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Successfully Disconnected')
    } catch (error) {
        hideLoader()
        store.dispatch('updateIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Something went wrong')
        console.error('Error in API:', error.response || error.message || error);
    }
};
</script>

<template>
    <VDialog :model-value="loading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
            <div class="demo-space-x">
                <VProgressCircular :size="40" color="primary" indeterminate />
            </div>
        </VCardText>
    </VDialog>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary :width="$vuetify.display.smAndDown ? 'auto' : 500" location="end">
        <div v-if="gConnected">
            <AppDrawerHeaderSection title="Calendly Sync" @cancel="drawer = false" />
            <v-divider />

            <VAlert density="compact" color="success" variant="tonal" style="margin: 10px;">
                {{ gPullEmail }} <strong class="text center">{{ $t('CONNECTED') }}</strong>
            </VAlert>
            <!-- Drawer Content -->
            <v-form ref="gForm">
                <v-list dense>
                    <v-list-item v-if="eventTypes.length > 0">
                        <v-row class="align-center" justify="space-between">
                            <v-col class="d-flex align-center" cols="12">
                                <v-container fluid>
                                    <!-- Dynamic Checkboxes -->
                                    <VRadioGroup v-model="eventType">
                                        <VRadio v-for="(type, index) in eventTypes" :key="type.uuid" :label="type.name"
                                            :value="type.uuid" />
                                    </VRadioGroup>
                                    <!-- <v-checkbox v-for="(type, index) in eventTypes" :key="type.uuid" v-model="type.uuid"
                                        :label="type.name"></v-checkbox> -->
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-list-item>

                </v-list>
            </v-form>
            <!-- <VDivider></VDivider> -->
            <p style="padding: 20px;font-size: 12px;"><b>{{ $t(`Note: If you’re on a Calendly account, and you need any
                    support or assistance `) }} <a href="https://help.calendly.com/hc/en-us" target="_blank">{{
                        $t('click here.')
                    }}</a></b></p>
            <!-- <VDivider></VDivider> -->
            <v-row class="justify-center mt-1" style="padding: 20px;">
                <v-col cols="12" md="12">
                    <VBtn variant="flat" class="mr-2" @click="onGSubmit">
                        {{ $t(`Update Details`) }}
                    </VBtn>
                    <VBtn variant="flat" color="secondary" @click.stop="drawer = !drawer">
                        {{ $t(`Cancel`) }}
                    </VBtn>
                </v-col>
            </v-row>
            <VDivider></VDivider>
            <v-row class="justify-center" style="padding: 20px;">
                <v-col cols="12" md="12" class="text-center">
                    <VBtn variant="text" color="error" @click="gDisconnectSync">
                        {{ $t(`Disconnect Sync`) }} </VBtn>
                </v-col>
            </v-row>
        </div>
        <div v-if="!gConnected">
            <AppDrawerHeaderSection :title="$t('Connect your Calendly Calendar')" @cancel="drawer = false" />
            <v-divider />
            <p class="mt-2" style="padding: 20px;">
                {{ $t('You will soon be prompted to connect your Calendly account with') }}
                {{ $t('this website to enable a sync. Here are some details on how this integration works') }}</p>

            <VList lines="three" :items="translatedgConnect" item-props>
                <template #subtitle="{ subtitle }">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-html="subtitle" />
                </template>
            </VList>
            <v-divider />
            <v-row class="justify-center mt-3" style="padding: 20px;">
                <v-col cols="12" md="12">
                    <VBtn variant="flat" class="mr-2" @click="connectCalendly">
                        {{ $t(`Connect my Calendly Calendar`) }}
                    </VBtn>
                    <VBtn variant="flat" color="secondary" @click.stop="drawer = !drawer">
                        {{ $t(`Cancel`) }}
                    </VBtn>
                </v-col>
            </v-row>
        </div>
    </v-navigation-drawer>
    <VCard :title="$t('External Calendar Sync')"
        :subtitle="$t('Pick any of the provided calendar options and it will sync with your Calendar.')">


        <!-- Card Content -->
        <v-card-title>
            <v-row>
                <v-col cols="8" md="8">
                    <v-row class="align-center" justify="space-between">
                        <!-- Icon and Heading on the Left -->
                        <v-col class="d-flex align-center" cols="8">
                            <VIcon icon="tabler-calendar" class="me-2" />
                            <h4 class="m-0">{{ $t(`Calendly Calendar`) }}</h4>
                        </v-col>

                        <!-- Edit Button on the Right -->
                        <v-col class="text-end" cols="4" v-if="gConnected">
                            <VBtn variant="text" color="primary" class="d-flex align-center float-right"
                                @click="toggleConnectDrawer">
                                <VIcon icon="tabler-pencil" class="me-1" />
                                {{ $t(`Edit`) }}
                            </VBtn>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                </v-col>
            </v-row>

            <!-- Centered Button -->
            <v-row class="justify-center mt-4" v-if="eventTypes.length === 0">
                <v-col cols="12" md="8">
                    <VBtn variant="outlined" class="text-center" @click="toggleConnectedDrawer">
                        {{ $t(`Connect your Calendly Calendar`) }}
                    </VBtn>

                </v-col>
            </v-row>
            <v-row class="mt-4" v-if="eventTypes.length > 0">
                <v-col cols="8" md="8">
                    <VTable class="text-no-wrap">
                        <tbody>
                            <tr v-for="item in eventTypes" :key="item.uuid">
                                <td>
                                    {{ item.name }}
                                </td>
                                <td class="text-right break-word">
                                    {{ item.duration }}
                                </td>
                            </tr>
                        </tbody>
                    </VTable>
                </v-col>
            </v-row>

        </v-card-title>

        <!-- Divider -->
        <v-divider />
    </VCard>
</template>
<style scoped>
.break-word {
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    /* Allow wrapping */
}

.v-navigation-drawer>>>.v-navigation-drawer__content {
    overflow-y: scroll !important;
}

.v-navigation-drawer>>>.v-navigation-drawer__content .v-list .v-list-item-title {
    white-space: unset !important;
}
</style>
