<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import QuestionnaireForm from './components/QuestionnaireForm.vue';
const store = useStore()
const router = useRouter()
const route = useRoute()
let builderData = JSON.parse(localStorage.getItem('builderData'));
const products = JSON.parse(localStorage.getItem('cart_products'));
const patientData = JSON.parse(localStorage.getItem('patient_data'));
let nextPage = localStorage.getItem('next_page');
const items = ref()
const step = ref(1);
const formsRef = {}
const showStepper = ref(false)
onBeforeMount(async () => {
    const questionereFormIds = products.filter(product => product.questiioneries_form_id != null && product.questiioneries_form_id !== 0).map(product => product.questiioneries_form_id);
    const catQuestionereFormIds = products.filter(product => product.category_questiioneries_form_id != null && product.category_questiioneries_form_id !== 0).map(product => product.category_questiioneries_form_id);
    const combinedUniqueArray = [...new Set([...questionereFormIds, ...catQuestionereFormIds, ...builderData.questionnaire])].filter(item => item != null);
    console.log('combinedUniqueArray', combinedUniqueArray)
    items.value = combinedUniqueArray.map(item => ({ id: item, title: '' })).filter(item => item.id != null);
    console.log('items.value', items.value)
    if (combinedUniqueArray.length === 0) {
        // router.replace(route.query.to ? String(route.query.to) : '/'+builderData.theme_name+'/thankyou')
        if (builderData.patientFlow.length > 0) {
            localStorage.setItem('builderData', JSON.stringify(updatePatientFlow(builderData, nextPage)))
            let builder = JSON.parse(localStorage.getItem('builderData'))
            localStorage.setItem('next_page', builder.patientFlow[0] ? builder.patientFlow[0] : [])
            console.log('/' + builder.theme_name + '/' + builder.patientFlow[0])
            if (builder.patientFlow[0])
                router.replace(route.query.to ? String(route.query.to) : '/' + builder.theme_name + '/' + builder.patientFlow[0])
            else
                router.replace(route.query.to ? String(route.query.to) : '/' + builderData.theme_name + '/thankyou')
        } else {
            console.log('/' + builderData.theme_name + '/thankyou')
            router.replace(route.query.to ? String(route.query.to) : '/' + builderData.theme_name + '/thankyou')
        }
    } else {
        showStepper.value = true
    }
})
onMounted(async () => {
    if (builderData.patientFlow.length == 1) {
        console.log('builderData.patientFlow', builderData.patientFlow)
        localStorage.setItem('builderData', JSON.stringify(updatePatientFlow(builderData, nextPage)))
        builderData = JSON.parse(localStorage.getItem('builderData'))
        localStorage.setItem('next_page', 'thankyou')
        nextPage = localStorage.getItem('next_page');
    }
    const b1 = document.querySelector('.bg-custom-color');
    if (b1) {
        b1.style.background = builderData.bg_color;
    }
    const bt = document.querySelector('.v-btn.bg-primary');
    if (bt) {
        console.log(bt);
        bt.style.setProperty('background-color', builderData.btn_color, 'important');
    }
    const questionereFormIds = products.map(product => product.questiioneries_form_id);
    const catQuestionereFormIds = products.map(product => product.questiioneries_form_id);
    const combinedUniqueArray = [...new Set([...questionereFormIds, ...catQuestionereFormIds, ...builderData.questionnaire])];
    items.value = combinedUniqueArray.map(item => ({ id: item, title: '' }));
    for (let item of items.value) {
        formsRef[item.id] = ref()

        console.log('formsRef.value[item.id]', formsRef[item.id])
    }
    console.log('combinedUniqueArray', items.value)
});

const onNext = async (props) => {
    let item = items.value[step.value - 1]
    let currentForm = formsRef[item.id]
    console.log(step.value, item, formsRef)
    let formData = new FormData((currentForm.value))
    console.log('formData', Object.fromEntries(formData.entries()))
    await store.dispatch('storePatientQuestionnairFormData', {
        form_id: item.id,
        pid: patientData.id,
        data: Object.fromEntries(formData.entries())
    });
    props.onClick()
};

const onFinish = async (props) => {
    let item = items.value[step.value - 1]
    let currentForm = formsRef[item.id]
    console.log(step.value, item, formsRef)
    let formData = new FormData((currentForm.value))
    console.log('formData', Object.fromEntries(formData.entries()))
    await store.dispatch('storePatientQuestionnairFormData', {
        form_id: item.id,
        pid: patientData.id,
        data: Object.fromEntries(formData.entries())
    });
    if (builderData.patientFlow.length > 0) {
        localStorage.setItem('builderData', JSON.stringify(updatePatientFlow(builderData, nextPage)))
        let builder = JSON.parse(localStorage.getItem('builderData'))
        localStorage.setItem('next_page', builder.patientFlow[0] ? builder.patientFlow[0] : [])
        console.log('/' + builder.theme_name + '/' + builder.patientFlow[0])
        router.replace(route.query.to ? String(route.query.to) : '/' + builder.theme_name + '/' + builder.patientFlow[0])
    } else {
        console.log('/' + builderData.theme_name + '/thankyou')
        router.replace(route.query.to ? String(route.query.to) : '/' + builderData.theme_name + '/thankyou')
    }
};

const updatePatientFlow = (obj, itemToExclude) => {
    return {
        ...obj,  // Spread the original object
        patientFlow: obj.patientFlow.filter(item => item !== itemToExclude)  // Update patientFlow
    };
}
</script>
<template>
    <VRow style="min-height: 101.7dvh; max-height: 101.7dvh; margin: 0px;"
        :style="isMobile ? { marginTop: '90px' } : { marginTop: '0px' }">
        <VCol cols="12" md="12" class="bg-custom col-order-1"
            :class="isMobile ? '' : 'auth-wrapper d-flex align-center justify-center pa-4'" v-if="showStepper">
            <VCard>
                <VCardText>
                    <v-stepper v-model="step" prev-text="Previous" next-text="Next" :items="items" item-title="title">
                        <template #item="item">
                            <QuestionnaireForm :formId="item.raw.id" :formRef="formsRef[item.raw.id]">
                            </QuestionnaireForm>
                        </template>
                        <!-- <v-stepper-actions #actions="{next,prev}"> -->
                        <template #next="{ props }">
                            <VBtn @click="onNext(props)" v-if="step != items.length"></VBtn>
                            <VBtn @click="onFinish(props)" v-if="step == items.length" :disabled="false">{{ $t('Finish') }}</VBtn>
                        </template>
                        <!-- </v-stepper-actions> -->

                    </v-stepper>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>
