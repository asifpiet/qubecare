<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { patientAuthService } from '@/services/auth/patientAuthService';
import { usePatientRegStore } from '@/stores/patientRegStore';
import { onMounted } from 'vue';
// import ProductForm from './components/productForms.vue';
import Form from './form.vue';
const emit = defineEmits(['completed']);
const patientRegStore = usePatientRegStore()
patientRegStore.currentPage = 'Category Form'
const visibility = ref('hidden')
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

const products = patientRegStore.cart_products;
const items = ref()
const step = ref(0);
const formsRef = {}

const intakeFormIds = products.filter(product => product.category_intake_form_id != null && product.name !== 'Doctor Visit' && product.category_intake_form_id !== 0).map(product => product.category_intake_form_id);
const questionereFormIds = products.filter(product => product.category_questiioneries_form_id != null && product.name !== 'Doctor Visit' && product.category_questiioneries_form_id !== 0).map(product => product.category_questiioneries_form_id);
let combinedUniqueArray = [...new Set([...intakeFormIds, ...questionereFormIds])].filter(item => item != null);

// console.log('combinedUniqueArray', combinedUniqueArray)
combinedUniqueArray = combinedUniqueArray.length > 0 ? combinedUniqueArray.filter(item => !patientRegStore.submittedForm.includes(item)) : [];
console.log('combinedUniqueArray', combinedUniqueArray)
if (combinedUniqueArray.length <= 0) emit('completed')
items.value = combinedUniqueArray.map(item => ({ id: item, title: '' })).filter(item => item.id != null);
onMounted(async () => {
    visibility.value = 'unset'
})

const onCompleted = (() => {
    if (step.value >= items.value.length - 1) {
        emit('completed')
    } else {
        step.value += 1
    }
})
const data = computed(() => {
return {
    config: {
        formId: items.value[step.value]?.id
    }
}
})
</script>
<template>
    <Form :data="data" @completed="onCompleted"></Form>
</template>
