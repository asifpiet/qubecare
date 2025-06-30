<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Calender View',
    },
})
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
        loading.value = true
        try {
            let responseCalback = await $api(GET_GOOGLE_CALLBACK + '?code=' + code, {
                method: 'GET',
                onResponseError({ response }) {
                    console.error('Error in API:', response);
                }
            });
            console.log('responseCalback', responseCalback)
            if (responseCalback.message === 'authenticated') {
                gConnected.value = true
                loading.value = false
                router.replace({ path: route.path });
            }
        } catch (error) {
            loading.value = false
            store.dispatch('updateIsTonalSnackbar', true)
            store.dispatch('updateErrorMessage', 'Something went wrong')
            console.error('Error in API:', error.response || error.message || error);
            router.replace({ path: route.path });
        }

    }

    await getGoogleSettings()

});

const gForm = ref()
const drawer = ref(false);
const gPushCalendar = ref(false);
const gPullCalendar = ref(false);
const gPullEvents = ref(false);
const gCalenderTypes = ref([])
const gTable = ref([])

const gConnectItems = ref([
    {
        prependIcon: 'tabler-circle-check',
        title: 'New Subcalendar in Google Calendar',
        subtitle: 'Your appointments will appear in your Google Calendar as a sub-calendar.'
    },
    {
        prependIcon: 'tabler-circle-check',
        title: 'Pull in none, one, or more subcalendars from Google Calendar',
        subtitle: 'You can select which Google Calendar sub-calendars to pull into our website.'
    },
    {
        prependIcon: 'tabler-circle-check',
        title: 'Appointments which are “busy” will sync',
        subtitle: 'Only appointments marked “busy” in your Google Calendar will appear in your Calendar.'
    },
    {
        prependIcon: 'tabler-info-triangle',
        title: 'Manage appointments in the appropriate calendar',
        subtitle: 'You will need to manage appointments originating from our website within our website, and appointments originating from Google Calendar within Google Calendar.'
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
const connectGoogle = async () => {
    loading.value = true
    try {
        let responseRedirect = await $api(GET_GOOGLE_CONNECT, {
            method: 'GET',
            onResponseError({ response }) {
                console.error('Error in API:', response);
            }
        });
        console.log('responseRedirect', responseRedirect)

        window.open(responseRedirect.data, '_blank');
        loading.value = false
    } catch (error) {
        loading.value = false
        store.dispatch('updateIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Something went wrong')
        console.error('Error in API:', error.response || error.message || error);
    }
}

const getGoogleSettings = async () => {
    gTable.value = []
    let responseSettings = await $api(GET_GOOGLE_SETTINGS, {
        method: 'GET',
        onResponseError({ response }) {
            console.error('Error in API:', response);
        }
    });
    console.log('responseSettings', responseSettings)
    if (responseSettings.data) {
        gConnected.value = true
        settingId.value = responseSettings.data.id
        gCalenderTypes.value = responseSettings.data.pull_event_types
        gPullEvents.value = responseSettings.data.pull_events === 1 ? true : false;
        gPullCalendar.value = responseSettings.data.pull_from_calender === 1 ? true : false
        gPushCalendar.value = responseSettings.data.push_to_calendar === 1 ? true : false
        gPullEmail.value = responseSettings.data.pull_from_email

        gPulledCalendars.value = gCalenderTypes.value.filter(item => item.value) // Keep only items where value is true
            .map(item => item.label) // Extract the label
            .join(', '); // Join the labels with a comma

        gTable.value.push(
            {
                label: gPullEmail.value,
                value: 'CONNECTED'
            },
            {
                label: 'Push to Calendar',
                value: responseSettings.data.push_to_calendar === 1 ? 'ON' : 'OFF'
            },
            {
                label: 'Pull from Calendar',
                value: responseSettings.data.pull_from_calender === 1 ? 'ON' : 'OFF'
            },
            {
                label: 'Pulled Calendars',
                value: gPulledCalendars.value
            },
            {
                label: 'Pull In Event Details',
                value: responseSettings.data.pull_events === 1 ? 'ON' : 'OFF'
            },
        );
        console.log('gTable.value', gTable.value)
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

            loading.value = true
            try {
                const res = await $api(STORE_GOOGLE_SETTINGS, {
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
                await getGoogleSettings()
                loading.value = false
            } catch (error) {
                loading.value = false
                store.dispatch('updateIsTonalSnackbar', true)
                store.dispatch('updateErrorMessage', 'Something went wrong')
                console.error('Error in API:', error.response || error.message || error);
            }

        }
    });

};

const gDisconnectSync = async () => {
    loading.value = true
    try {
        let responseDisconnect = await $api(DISCONNECT_GOOGLE_SYNC, {
            method: 'GET',
            onResponseError({ response }) {
                console.error('Error in API:', response);
            }
        });
        console.log('responseDisconnect', responseDisconnect)
        await getGoogleSettings()
        gConnected.value = false
        loading.value = false
        store.dispatch('updateSuccessIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Successfully Disconnected')
    } catch (error) {
        loading.value = false
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
            <AppDrawerHeaderSection title="Google Calendar" @cancel="drawer = false" />
            <v-divider />

            <VAlert density="default" color="success" variant="tonal" style="margin: 10px;">
                {{ gPullEmail }} <strong class="float-right">{{ $t('CONNECTED') }}</strong>
            </VAlert>
            <!-- Drawer Content -->
            <v-form ref="gForm">
                <v-list dense>
                    <v-list-item>
                        <v-row class="align-center" justify="space-between">
                            <!-- Icon and Heading on the Left -->
                            <v-col class="d-flex align-center" cols="8">
                                <p class="m-0">{{ $t('Push to Calendar') }} <br> {{ $t(`Your Calendar entries will
                                    appear in
                                    your Google Calendar.`) }}</p>
                            </v-col>

                            <!-- Edit Button on the Right -->
                            <v-col class="text-end" cols="4">
                                <v-switch v-model="gPushCalendar" :label="gPushCalendar ? 'ON' : 'OFF'" hide-details
                                    inset class="float-right"></v-switch>
                            </v-col>
                        </v-row>
                    </v-list-item>
                    <v-list-item>
                        <v-row class="align-center" justify="space-between">
                            <!-- Icon and Heading on the Left -->
                            <v-col class="d-flex align-center" cols="8">
                                <p class="m-0">{{ $t('Pull from Calendar') }} <br>
                                    {{ $t(`Choose Google Calendars which will appear in our calendar:`) }}</p>
                            </v-col>

                            <!-- Edit Button on the Right -->
                            <v-col class="text-end" cols="4">
                                <v-switch v-model="gPullCalendar" :label="gPullCalendar ? 'ON' : 'OFF'" hide-details
                                    inset class="float-right"></v-switch>
                            </v-col>
                        </v-row>
                    </v-list-item>
                    <v-list-item v-if="gPullCalendar">
                        <v-row class="align-center" justify="space-between">
                            <v-col class="d-flex align-center" cols="12">
                                <VAlert icon="tabler-info-circle" variant="outlined" color="primary">
                                    {{ $t(`Only appointments marked as "busy" will be pulled into our system.`) }}
                                </VAlert>
                            </v-col>
                        </v-row>
                        <v-row class="align-center" justify="space-between">
                            <v-col class="d-flex align-center" cols="12">
                                <v-container fluid>
                                    <!-- Dynamic Checkboxes -->
                                    <v-checkbox v-for="(type, index) in gCalenderTypes" :key="index"
                                        v-model="type.value" :label="type.label"></v-checkbox>
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-list-item>
                    <v-list-item>
                        <v-row class="align-center" justify="space-between">
                            <!-- Icon and Heading on the Left -->
                            <v-col class="d-flex align-center" cols="8">
                                <p class="m-0">{{ $t(`Pull in Event Details`) }} <br> {{ $t(`When turned on, event
                                    details from Google
                                    Calendar will be visible in your calendar in our website. When off, they will only
                                    show as “Busy”. Clients cannot see any information about events on your calendar.`)
                                }}
                                </p>
                            </v-col>

                            <!-- Edit Button on the Right -->
                            <v-col class="text-end" cols="4">
                                <v-switch v-model="gPullEvents" :label="gPullEvents ? 'ON' : 'OFF'" hide-details inset
                                    class="float-right"></v-switch>
                            </v-col>
                        </v-row>
                    </v-list-item>

                </v-list>
            </v-form>
            <VDivider></VDivider>
            <p style="padding: 20px;font-size: 12px;"><b>{{ $t(`Note: If you’re on a Google Suite account, you can sign
                    a BAA
                    to see client names in your Google Calendar.`) }} <a
                        href="https://support.google.com/a/answer/3407074?hl=en" target="_blank">{{ $t('Learn more')
                        }}</a></b></p>
            <VDivider></VDivider>
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
            <AppDrawerHeaderSection :title="$t('Connect your Google Calendar')" @cancel="drawer = false" />
            <v-divider />
            <p class="mt-2" style="padding: 20px;">
                {{ $t('You will soon be prompted to connect your Google account with')}}
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
                    <VBtn variant="flat" class="mr-2" @click="connectGoogle">
                        {{ $t(`Connect my Google Calendar`) }}
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
                            <h4 class="m-0">{{ $t(`Google Calendar`) }}</h4>
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
            <v-row class="justify-center mt-4" v-if="!gConnected">
                <v-col cols="12" md="8">
                    <VBtn variant="outlined" class="text-center" @click="toggleConnectedDrawer">
                        {{ $t(`Connect your Google Calendar`) }}
                    </VBtn>

                </v-col>
            </v-row>
            <v-row class="mt-4" v-if="gConnected">
                <v-col cols="8" md="8">
                    <VTable class="text-no-wrap">
                        <tbody>
                            <tr v-for="item in gTable" :key="item.label">
                                <td>
                                    {{ item.label }}
                                </td>
                                <td class="text-right break-word">
                                    {{ item.value }}
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
