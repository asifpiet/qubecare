<script setup>
definePage({
    meta: {
        layout: 'default',
        public: false,
    },
})

import { patientAuthService } from '@/services/auth/patientAuthService';
import { useAuthStore } from '@/stores/authStore';
import { useBuilderStore } from '@/stores/builderStore';
import { usePatientRegStore } from '@/stores/patientRegStore';
import ComboForms from '@/views/register-flow/comboforms.vue';
import Form from '@/views/register-flow/form.vue';
import MultipleForms from '@/views/register-flow/multipleforms.vue';
import { nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore()

const route = useRoute();
const router = useRouter();
const components = {
    forms: Form,
    comboforms: ComboForms,
    multipleforms: MultipleForms,
}

const showComponent = ref(true)
const { currentUser, currentRole, logout } = useAuth()

const builderStore = useBuilderStore()
const patientRegStore = usePatientRegStore()
const formsArr = ref([])
const completedTasks = ref(null)
let forms = currentUser.value.forms ?? []
if (currentUser.value.builder_id)
    await builderStore.getUnauthBuilderById(currentUser.value.builder_id)

formsArr.value = builderStore.layout.filter(item => item.type === 'forms' || item.type === 'comboforms' || item.type === 'multipleforms');
console.log('currentUser.value.completed_task', currentUser.value.completed_task)
if (currentUser.value.completed_task != null) {
    formsArr.value = formsArr.value.filter((_, index) => index !== currentUser.value.completed_task);
    console.log('Filtered formsArr.value', formsArr.value)
    // if (formsArr.value.length > patientRegStore.currentProfileState)
    //     patientRegStore.currentProfileState = currentUser.value.completed_task + 1


}
completedTasks.value = formsArr.value.length
console.log('formsArr', formsArr.value)

//Remove already sumbitted forms to prevent showing
formsArr.value = formsArr.value
    .map(item => {
        if (item.config.forms) {
            // Remove matching formId from nested forms array
            const filteredForms = item.config.forms.filter(f => !forms.includes(f.formId));
            return filteredForms.length ? { ...item, config: { ...item.config, forms: filteredForms } } : null;
        } else {
            // Remove entire object if formId matches
            return forms.includes(item.config.formId) ? null : item;
        }
    })
    .filter(item => item !== null);

console.log('newForm ', formsArr.value)


const updateOrderState = async (pendingTask, state) => {
    await patientRegStore.updateOrderState({
        pending_task: pendingTask,
        completed_task: state
    }, currentUser.value.order_id)
}

//If user already submitted forms redirect to dashboard
if (formsArr.value.length <= 0) {
    nextTick(async () => {
        try {
            await updateOrderState(0, completedTasks.value)
            console.log('Redirecting to /patient/dashboard')
            const { userData, permissions } = await patientAuthService.fetchProfile();
            authStore.setUser(userData, currentRole.value)
            await router.push('/patient/dashboard')
        } catch (error) {
            console.error('Error navigating to /patient/dashboard:', error)
        }

    })
}

const onCompleted = () => {
    let currentState = patientRegStore.currentProfileState
    patientRegStore.currentProfileState++
    showLoader()

    nextTick(async () => {
        hideLoader()

        console.log('Current State:', patientRegStore.currentProfileState)
        console.log('Forms Array Length:', formsArr.value.length)

        if (patientRegStore.currentProfileState === formsArr.value.length) {
            try {
                await updateOrderState(0, currentState)
                console.log('Redirecting to /patient/dashboard')
                const { userData, permissions } = await patientAuthService.fetchProfile();
                authStore.setUser(userData, currentRole.value)
                await router.push('/patient/dashboard')
            } catch (error) {
                console.error('Error navigating to /patient/dashboard:', error)
            }
        } else {
            updateOrderState(1, currentState)
        }
    })
}
</script>
<template>
    <div style="background-color: white;">




        <v-dialog v-model="showComponent" max-width="900px" persistent>
            <v-card>
                <div v-if="showComponent">
                    <component @completed="onCompleted"
                        :is="components[formsArr[patientRegStore.currentProfileState]?.type]"
                        :data="formsArr[patientRegStore.currentProfileState]"
                        v-if="!!formsArr[patientRegStore.currentProfileState]">
                    </component>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>
