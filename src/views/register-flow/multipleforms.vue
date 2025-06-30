<script setup>
import { patientService } from '@/services/patientService';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import Form from '@/views/register-flow/form.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const { currentUser, currentRole, logout } = useAuth();
const builderStore = useBuilderStore();
const patientRegStore = usePatientRegStore();

definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
});

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    showNav: {
        type: Boolean,
        required: false
    },
});

const emit = defineEmits(['completed']);
const formRef = ref();
const formKey = ref(0); // Force re-render of form when step changes
const visibility = ref('hidden');
const isMobile = ref(window.innerWidth <= 768);
const products = ref([]);
const cartJson = ref([]);
const formsToExclude = (currentUser.value?.forms?.length > 0)
    ? currentUser.value.forms
    : (patientRegStore.submittedForm?.length > 0)
        ? patientRegStore.submittedForm
        : [];

// Function to fetch and prepare product data
const setupProductData = async () => {
    try {
        if (currentUser.value?.order_id || patientRegStore.order_id) {
            const orderResp = await patientService.getOrderDetails(currentUser.value?.order_id ?? patientRegStore.order_id);
            cartJson.value = orderResp.items ?? [];
        }

        if (currentUser.value?.builder_id) {
            await builderStore.getUnauthBuilderById(currentUser.value.builder_id);
        }

        await patientRegStore.getProductByProviderId(builderStore.provider_id);
        products.value = patientRegStore.products.filter(item => item.provider_id !== null);

        // Map cart items to products
        const finalArray = cartJson.value
            .map(cartItem => {
                const matchedProduct = patientRegStore.products.find(plan => plan.id === cartItem.product_id);
                return matchedProduct ? { ...matchedProduct } : null;
            })
            .filter(Boolean);

        patientRegStore.cart_products = finalArray;
    } catch (error) {
        console.error('Error setting up product data:', error);
    }
};

// Function to collect form IDs from products
const collectFormIds = () => {
    const ptProducts = patientRegStore.cart_products;
    let combinedFormIds = [];

    if (props.data.config?.productForm) {
        const proIntakeFormIds = ptProducts
            .filter(product => product.in_take_form_id != null && product.name !== 'Doctor Visit' && product.in_take_form_id !== 0)
            .map(product => product.in_take_form_id);

        const proQuestionnaireFormIds = ptProducts
            .filter(product => product.questiioneries_form_id != null && product.name !== 'Doctor Visit' && product.questiioneries_form_id !== 0)
            .map(product => product.questiioneries_form_id);

        const productFormIds = [...new Set([...proIntakeFormIds, ...proQuestionnaireFormIds])].filter(Boolean);
        combinedFormIds.push(productFormIds);
    }

    if (props.data.config?.categoryForm) {
        const catIntakeFormIds = ptProducts
            .filter(product => product.category_intake_form_id != null && product.name !== 'Doctor Visit' && product.category_intake_form_id !== 0)
            .map(product => product.category_intake_form_id);

        const catQuestionnaireFormIds = ptProducts
            .filter(product => product.category_questiioneries_form_id != null && product.name !== 'Doctor Visit' && product.category_questiioneries_form_id !== 0)
            .map(product => product.category_questiioneries_form_id);

        const categoryFormIds = [...new Set([...catIntakeFormIds, ...catQuestionnaireFormIds])].filter(Boolean);
        combinedFormIds.push(categoryFormIds);
    }

    return [...new Set(combinedFormIds.flat())];
};

// Function to update forms configuration
const updateFormsConfig = async () => {
    if (props.data.config?.productForm || props.data.config?.categoryForm) {
        await setupProductData();

        const combinedUniqueArray = collectFormIds()
            .filter(formId => !formsToExclude.includes(formId));

        console.log('formsToExclude', formsToExclude)

        if (combinedUniqueArray.length > 0) {
            const newForms = combinedUniqueArray.map(formId => ({
                title: "Weight Loss",
                formType: "simple-forms",
                formId,
                checked: false,
                submitted: false,
                opened: false
            }));
            console.log('newForms', newForms)
            props.data.config.forms.push(...newForms);
        }
    }

    // Deduplicate forms based on formId
    props.data.config.forms = [...new Map(props.data.config.forms.map(item => [item.formId, item])).values()];

    // Filter out already submitted forms
    const existingFormIds = props.data.config.forms.map(item => item.formId);
    const formsToShow = existingFormIds.filter(id => !formsToExclude.includes(id));

    if (formsToShow.length > 0) {
        props.data.config.forms = formsToShow.map(id => ({
            title: "Weight Loss",
            formType: "simple-forms",
            formId: id,
            checked: false,
            submitted: false,
            opened: false
        }));

        // Deduplicate again after filtering
        props.data.config.forms = [...new Map(props.data.config.forms.map(item => [item.formId, item])).values()];
    }

    // Check if all forms are already submitted
    if (existingFormIds.every(id => formsToExclude.includes(id))) {
        emit('completed');
    }
};

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

const logo = computed(() => themeConfig.app.logo);

onMounted(async () => {
    window.addEventListener('resize', checkIfMobile);

    await updateFormsConfig();

    if (props.data.config.forms.length > 0) {
        // Delayed visibility to ensure proper rendering
        setTimeout(() => {
            visibility.value = 'unset';
        }, 1000); // Reduced from 2000ms to 1000ms for better UX
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkIfMobile);
});

// Update logo when company logo changes
watch(
    () => currentUser.value?.company?.logo,
    (newLogo) => {
        if (newLogo) {
            themeConfig.app.logo = h('div', { innerHTML: `<img src="${newLogo}" alt="Logo" style="width:160px;">` });
        }
    },
    { immediate: true }
);

// Submit handler for all forms
const callSave = async () => {
    let isInvalid = false
    for (let form of formRef.value) {
        console.log('isValid', form.isValid())
        if (!form.isValid()) {
            isInvalid = true
        }
    }
    if (!isInvalid) {
        for (let form of formRef.value) {
            await form.save()
        }

        emit('completed')
    }


}

</script>

<template>
    <!-- Header -->
    <div v-if="props.showNav" class="text-center fixed-header">
        <VNodeRenderer :nodes="logo" />
    </div>

    <!-- Full screen centered container -->
    <VRow class="fill-height d-flex justify-center align-center"
        :style="{ visibility: visibility, paddingTop: props.showNav ? '90px' : '0px' }">
        <VCol cols="12" class="d-flex justify-center align-center">
            <!-- Card container -->
            <VCard class="pa-5 form-card">
                <VRow class="pa-0 d-flex justify-center align-center">
                    <VCol v-for="(form, index) in props.data.config.forms" :key="`step-${index}`" cols="12"
                        v-show="!form.submitted">
                        <Form ref="formRef" :key="`form-${index}-${formKey}`" :data="{ config: form }"
                            :justRender="true" :inline="true" />
                    </VCol>
                    <VCol cols="12">
                        <VBtn type="submit" @click="callSave" block class="submit-button">
                            Next
                        </VBtn>
                    </VCol>
                </VRow>
            </VCard>
        </VCol>
    </VRow>
</template>

<style scoped>
.fixed-header {
    padding: 15px 10px 10px 10px;
    border-bottom: 1px solid rgba(192, 192, 192, 0.7);
    position: fixed;
    width: 100%;
    z-index: 1004;
    background: white;
}

.form-card {
    width: 100%;
    max-width: 600px;
}

::v-deep(.v-stepper-item__avatar) {
    font-size: 0 !important;
}

::v-deep(.v-stepper-item__content) {
    position: absolute;
    color: white;
    padding-top: 1px;
}
</style>
