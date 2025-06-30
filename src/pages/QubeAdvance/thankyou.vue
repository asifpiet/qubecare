<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
})

const continueFun = () => {

    // store.dispatch('updateIsLoading', true)
    // localStorage.setItem('access_token', access_token)
    // localStorage.setItem('isLogin', 'true')
    // router.replace(route.query.to && route.query.to != '/thankyou' ? String(route.query.to) : '/order-detail/' + localStorage.getItem('cart_id'))
}

</script>

<template>
    <VDialog v-model="store.getters.getIsLoading" width="110" height="150" color="primary">
        <VCardText class="" style="color: white !important;">
            <div class="demo-space-x">
                <VProgressCircular :size="40" color="primary" indeterminate />
            </div>
        </VCardText>
    </VDialog>
    <VRow style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
        :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }">
        <VCol cols="12" md="12" class="bg-custom col-order-2"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'">
            <VCard class="auth-card pa-2 rounded-5 regbx" style="" :class="isMobile ? '' : 'card-wid'">
                <VCardItem class="justify-center mb-8">
                    <VCardTitle class="text-2xl font-weight-bold text-primary">
                        <!-- <VImg :src="seetingPlanLogo" width="250" height="50" class="logo-img" /> -->
                    </VCardTitle>
                </VCardItem>
                <VRow>
                    <VRow class="bg-white">
                        <VCol cols="12 pt-3">
                            <div class="px-4 pl-4 pr-4">
                                <!-- <h4 class="mb-3">Your Lab Test Kit is on its Way.</h4>
                                <p>Congratulations! Your order has been placed successfully.
                                    You can expect to receive the kit at the shipping address you provided within
                                    the next 5-7 business
                                    days.</p>

                                <p>


                                    All future blood testing and associated costs will be included in your monthly
                                    subscription fee.
                                    Next Steps
                                    Once you receive the lab test kit, please follow the enclosed instructions
                                    carefully to
                                    collect and return your blood sample. The kit will include a 2-day return
                                    shipping label for your convenience. Your testing results will be securely sent
                                    to your doctor, and your doctor will review them. You will be notified about the
                                    next steps in your treatment plan.





                                </p>
                                <p>To continue your treatment journey and ensure uninterrupted access to
                                    our services, Please click the "View Order" button below to see your order details.
                                </p> -->
                                <p>
                                    Thankyou for booking your telehealth visit with us. Please keep an eye on your email
                                    for
                                    further instructions, In case you have any questions, please reach out to support at
                                    <a href="mailto:support@peptidewebmd.com">support@peptidewebmd.com</a> or refer to
                                    the FAQs.
                                </p>
                            </div>
                        </VCol>
                        <VCol cols="12" class="pt-3 mb-4 text-center">
                            <a href="https://peptidewebmd.com" rel="noopener noreferrer"
                                title="Click here to view order details">
                                <VBtn class="text-capitalize" @click="continueFun">
                                    <b>Go to Website</b>
                                </VBtn>
                            </a>
                        </VCol>
                        <VCol cols="12 pt-3 mb-4" class="text-center">
                            <!-- <RouterLink to="/review-appointment"> -->
                            <!-- <VBtn class="text-capitalize" @click="continueFun" title="Click here to view order details" >
                                <b>View Order</b>
                            </VBtn> -->
                            <!-- </RouterLink> -->

                        </VCol>
                    </VRow>
                </VRow>
            </VCard>
        </VCol>
    </VRow>
</template>
<style scoped>
@media only screen and (max-width: 768px) {
    .card-wid {
        max-width: 600px !important;
        min-width: auto !important;
    }

    .col-order-1 {
        order: 2;
    }

    .col-order-2 {
        order: 1;
    }
}

@media only screen and (min-width: 769px) {
    .col-order-1 {
        order: 1;
    }

    .col-order-2 {
        order: 2;
    }
}

.total-font {
    font-size: 20px;
    margin-bottom: 5px;
}

.bg-custom {
    background: #F3F3F3;
}

.bg-custom-color {
    background: #f0f8ff;
}

.bg-white bg-change-bk .current-plan {
    border: 2px solid rgb(var(--v-theme-primary));
}

.cut-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: line-through;
    text-decoration-color: red;
    text-decoration-thickness: 1px;
}

.plan-card {
    margin: 0rem;
    margin-bottom: 0;
}

.card-wid {
    max-width: 600px;
}

.layout-wrapper {
    justify-content: center;
}

.error-message {
    color: #ff2f2f;
    font-size: 15px;
}
</style>
<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.regbg {
    background-image: url('/assets/images/reg_bg.png');
    background-size: cover;
    background-repeat: no-repeat;
}

.regbx {
    background-color: rgb(var(--v-theme-yellow));
    box-shadow: 0px 0px 10px #ccc;
    border-radius: 10px;
}

.bg-custom {
    background: rgb(var(--v-theme-yellow));
}

.total-font {
    font-size: 20px;
    margin-bottom: 5px;
}

.cut-text {
    white-space: nowrap;
    /* Prevents text from wrapping */
    overflow: hidden;
    /* Hides any content that overflows the container */
    text-overflow: ellipsis;
    /* Displays an ellipsis (...) to represent the clipped text */
    // width: 100px;
    text-decoration: line-through;
    text-decoration-color: red;
    /* Set the color of the line */
    text-decoration-thickness: 1px;
    /* Adjust the width as needed */
}

.logo-img {
    display: block;
    position: relative;
    margin: 0 auto;
}
</style>
