<script setup>
// import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
// import miscMaskDark from '@images/pages/misc-mask-dark.png';
// import miscMaskLight from '@images/pages/misc-mask-light.png';
import NavBarI18n from '@core/components/I18n.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
definePage({
    meta: {
        layout: 'blank',
        public: true,
    },
})
const companyEmail = import.meta.env.VITE_COMPANY_EMAIL ?? 'support@peptidewebmd.com';
const isMobile = ref(window.innerWidth <= 768);

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

const nextItems = ref([
    {
        title: 'Check Your Email',
        description: 'You will receive an email shortly with detailed instructions on how to join your telehealth appointment. Please make sure to check your inbox, including the spam/junk folder.'
    },
    {
        title: 'Prepare for Your Visit',
        description: 'Ensure you have a stable internet connection, a working webcam, and a quiet, private space for your consultation.'
    },
    {
        title: 'Medication Information',
        description: 'If your consultation results in a prescription, your medication will be processed and shipped to the address you provided. You will receive a confirmation email with tracking details once your order is shipped.'
    }
])

const translatedHeaders = computed(() => {
  return nextItems.value.map(item => ({
    ...item,
    title: t(item.title),
    description: t(item.description)
    }));
});


const assistItems = ref([
    {
        title: 'Email',
        description: companyEmail
    },
    {
        title: 'FAQs',
        description: 'Visit our FAQ page for quick answers to common questions'
    }
])

const translatedItem = computed(() => {
  return assistItems.value.map(item => ({
    ...item,
    title: t(item.title),
    description: t(item.description)
    }));
});
// const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
onMounted(async () => {
    sessionStorage.removeItem('patientRegStore')
});

const goToDashboard = () => {
    window.location.href = 'https://peptidewebmd.com';
};
</script>

<template>
    <div class="text-center"
        style="padding: 15px 10px 10px 10px; border-bottom: 1px solid #c0c0c0b0;position: fixed; width: 100%; z-index: 1004;background: white;">
        <VNodeRenderer :nodes="themeConfig.app.logo" />
    </div>
    <div class="language-dropdown">
      <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
                  :languages="themeConfig.app.i18n.langConfig" 
                  class="language" />
    </div>
    <VRow style="min-height: 100vh; margin: 0px; margin-top: 60px;"
        class="bg-custom d-flex align-center justify-center">
        <VCol cols="12" md="12" class="px-8 py-8 d-flex justify-center align-center">
            <VCard :style="{
                maxWidth: isMobile ? '' : '600px'
            }">
                <VCardText
                    style="min-height: calc(90vh - 50px); display: flex; justify-content: center; align-items: center; flex-direction: column;">
                    <div class="text-center mb-4">
                        <VIcon size="120" color="primary">tabler-rosette-discount-check</VIcon>
                        <h4 class="text-h4 font-weight-medium mb-2">
                            {{ $t('Booking Confirmed') }}
                        </h4>
                        <VDivider></VDivider>
                        <h4 class="mt-4 mb-4 font-weight-medium">
                           {{ $t('Thank you for booking your telehealth visit with us!')}} 
                           {{ $t(`We’re excited to assist you on your healthcare journey.`)}}  </h4>
                    </div>


                    <div>
                        <h3 class="mb-0">{{ $t('Next Steps') }}</h3>
                        <v-list>
                            <v-list-item class="pt-0 pb-1" v-for="(item, index) in translatedHeaders" :key="index">
                                <v-list-item-content>
                                    <v-list-item-title>{{ index + 1 }}. &nbsp;<b>{{ item.title }}:</b> {{
                                        item.description
                                        }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>

                        <h3 class="mb-0">{{ $t('Need assistance? Contact') }}</h3>
                        <p class="text-body-1 mb-0">
                            {{ $t('If you have any questions or need further assistance')}}, 
                           {{ $t(`please don’t hesitate to reach out to us`)}}: 
                            
                            
                        </p>
                        <v-list>
                            <v-list-item class="pt-0 pb-1" v-for="(item, index) in translatedItem" :key="index">
                                <v-list-item-content>
                                    <v-list-item-title>{{ index + 1 }}. &nbsp;<b>{{ item.title }}:</b> <span
                                            v-if="item.title !== 'Email'">{{
                                                item.description }}</span>
                                        <span v-else>
                                            <a :href="`mailto:${item.description}`" style="color: #49A38C;">{{
                                                item.description }}</a>
                                        </span></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>

                    </div>
                    <div class="text-center">
                        <VCol cols="12" class="pt-3 mb-4 text-center">
                            <RouterLink to="/patient/dashboard">

                                <VBtn class="text-capitalize" style="background-color: #49A38C !important;"
                                    rounded="lg">
                                    <b>{{ $t('Go to Dashboard') }}</b>
                                </VBtn>
                            </RouterLink>
                        </VCol>
                        <p class="text-body-1 mt-4">
                            {{ $t('You can access your patient dashboard to view your appointment details')}}, 
                            {{ $t(`update your information, or check the status of your order`)}}.
                            
                            .</p>
                    </div>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/misc.scss";

.v-list-item--density-compact.v-list-item--one-line {
    min-height: 26px;
}

.v-list-item-title {
    font-size: 13px !important;
    white-space: unset !important;
}

#body-wrapper {
    position: relative;
    top: 60px;
    // min-block-size: 90dvh;
}

.misc-email-input {
    max-inline-size: 22.75rem;
    min-inline-size: 14.75rem;
}

.misc-form {
    margin-block-end: 4rem;
}

@media screen and (max-width: 575.98px) {
    .misc-form {
        margin-block-end: 3rem;
    }
}
</style>
<style scoped>
.language-dropdown {
  position: fixed;
  top: 10px;  /* Adjust the distance from the top */
  right: 10px; /* Adjust the distance from the right */
  z-index: 1000000; /* Ensure it's above other content */
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
