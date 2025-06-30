<script setup>
import { usePatientRegStore } from '@/stores/patientRegStore';
import Form from '@/views/register-flow/form.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
const { currentUser, currentRole, logout } = useAuth()

const patientRegStore = usePatientRegStore()
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    showNav: {
        type: Boolean,
        required: false
    },
})

const emit = defineEmits(['completed'])

const activeStep = ref(0)
const formKey = ref(0) // Force re-render of form when step changes
const visibility = ref('hidden')
const isMobile = ref(window.innerWidth <= 768)

let comboForms = props.data.config.forms.map(item => item.formId);

const exists = comboForms.every(id => patientRegStore.forms.includes(id));
if (exists) emit('completed')

const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
    window.addEventListener('resize', checkIfMobile)
    if (props.data.config.forms.length > 0) {
        setTimeout(() => {
            visibility.value = 'unset';
        }, 2000);
    }
    // Start watching submissions
    watchSubmissions()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkIfMobile)
})

watch(activeStep, () => {
    formKey.value++  // Force Form to re-render on step change
})

// Automatically move to the next step if current form is submitted
const watchSubmissions = () => {
    watch(() => props.data.config.forms.map(f => f.submitted), (submittedList) => {
        const currentForm = props.data.config.forms[activeStep.value]
        if (currentForm && currentForm.submitted) {
            goToNextStep()
        }
    })
}

// Go to next step automatically, or emit 'completed' if all steps are done
const goToNextStep = () => {
    if (activeStep.value < props.data.config.forms.length - 1) {
        activeStep.value++
    } else {
        emit('completed')
    }
}

// Dynamic width for responsiveness
const stepperWidth = computed(() => isMobile.value ? '100%' : '800px')

watch(
    () => currentUser.value?.company?.logo,
    (newLogo) => {
        if (newLogo) {
            themeConfig.app.logo = h('div', { innerHTML: `<img src="${newLogo}" alt="Logo" style="width:160px;">` });
        }
    },
    { immediate: true } // Trigger the watcher immediately on component mount
);
const logo = computed(() => {
    console.log(currentUser.value)
    return themeConfig.app.logo;
});
</script>

<template>
    <div class="text-center" v-if="props.showNav"
        style="padding: 15px 10px 10px 10px; border-bottom: 1px solid #c0c0c0b0; position: fixed; width: 100%; z-index: 1004; background: white;">
        <VNodeRenderer :nodes="logo" />
    </div>

    <VRow style="min-height: 100vh; margin: 0; position: relative;" :style="{
        visibility: visibility,
        top: isMobile ? '0px' : '0px',
        paddingTop: props.showNav ? '90px' : '0px'
    }" class="d-flex align-center justify-center">
        <VCol cols="12" md="12" class="px-0 py-0 d-flex justify-center align-center">
            <div :style="{ width: stepperWidth }">

                <VStepper v-model="activeStep" alt-labels>

                    <VStepperHeader style="box-shadow: none;">
                        <template v-for="(form, index) in props.data.config.forms" :key="index">
                            <VStepperItem :value="index" :complete="form.submitted" style="position: relative;">
                                <template v-slot:default>
                                    <span class="v-avatar__underlay" v-if="!form.submitted">{{ index + 1 }}</span>
                                </template>
                            </VStepperItem>
                            <VDivider v-if="index < props.data.config.forms.length - 1" />
                        </template>
                    </VStepperHeader>

                    <VStepperWindow style="margin: 0px;">
                        <VStepperWindowItem v-for="(form, index) in props.data.config.forms" :key="`step-${index}`"
                            :value="index">
                            <Form :key="`form-${index}-${formKey}`" :data="{ config: form }" :justRender="true" />
                        </VStepperWindowItem>
                    </VStepperWindow>

                </VStepper>

            </div>
        </VCol>
    </VRow>
</template>

<style scoped>
.bg-custom {
    background-color: #f9f9f9;
}

/* Hide the text node that contains "0" */
::v-deep(.v-stepper-item__avatar) {
    font-size: 0 !important;
}

::v-deep(.v-stepper-item__content) {
    position: absolute;
    color: white;
    padding-top: 1px;
}
</style>
