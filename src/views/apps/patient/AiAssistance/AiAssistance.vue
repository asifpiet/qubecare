<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
import "../../../../../node_modules/formeo/dist/formeo.min.css";

const route = useRoute();

const store = useStore()

const fullName = ref();
const additional_information = ref(null)
const patient_comment = ref(null)
const recommended_products = ref(null)
const recommended_test = ref(null)
const safety_measure = ref(null)
const props = defineProps({
    patient: {
        type: Object,
        required: true,
    },
    isDrawerOpen: {
        type: Boolean,
        required: true,
    },
    isDataEnable: {
        type: Boolean,
    }
})
const fullname = computed(() => {
    fullName.value = props.patient.firstName + ' ' + props.patient.lastName;

    console.log("fullname", fullName.value);
})


onMounted(async () => {
    getAiData()

})

const getAiData = async () => {
    store.dispatch('updateIsLoading', true)
    try {
        const res = await $api(PATIENT_AT_RESPONSE, {
            method: 'POST',
            body: {
                uuid: props.patient.uuid,
            },

        }

        )
        store.dispatch('updateIsLoading', false)
        console.log('ai res', res);
        additional_information.value = res.recommendation.additional_information
        patient_comment.value = res.recommendation.patient_comment
        recommended_products.value = res.recommendation.recommended_products
        recommended_test.value = res.recommendation.recommended_test
        safety_measure.value = res.recommendation.safety_measure
    } catch (error) {
        store.dispatch('updateIsLoading', false)
        store.dispatch('updateIsTonalSnackbar', true)
        store.dispatch('updateErrorMessage', 'Something went wrong')
        console.error('Error in API:', error.response || error.message || error);
    }
}

const formatHeading = (heading) => heading.replace(/_/g, ' ').toUpperCase();

const onTick = (heading, item) => {
    console.log(`Ticked: ${item} under ${heading}`);
};

const onCross = (heading, item) => {
    console.log(`Crossed: ${item} under ${heading}`);
};



const emit = defineEmits([
    'closeForm',
    'patientData'
]);

const closeNavigationDrawer = () => {
    emit('update:isDrawerOpen', false)
}

const handleDrawerModelValueUpdate = val => {
    emit('update:isDrawerOpen', val)
}


</script>

<template>
    <div v-if="fullname"></div>


    <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content"
        :model-value="props.isDrawerOpen" @update:model-value="handleDrawerModelValueUpdate">

        <AppDrawerHeaderSection :title='"AI Assistance (" + fullName + ")"' @cancel="closeNavigationDrawer" />

        <VDivider />

        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCard flat>
                <VCardText>
                    <div class="mb-6">
                        <v-row>
                            <v-col>
                                <h3>Current Medical Situation</h3>
                                <v-list dense v-if="patient_comment">
                                    <v-list-item class="align-center item-bg">
                                        <v-list-item-content>
                                            <span>{{ patient_comment }} </span>
                                        </v-list-item-content>
                                        <v-list-item-action class="ai-btn">
                                            <VBtn icon="tabler-check" variant="text" color="success"
                                                @click="onTick(1, patient_comment)" />
                                            <VBtn icon="tabler-x" variant="text" color="error"
                                                @click="onCross(1, patient_comment)" />
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <h3>AI-recommended Patient Data Collection</h3>
                                <v-list dense>
                                    <v-list-item v-for="(item, index) in additional_information" :key="index"
                                        class="align-center item-bg">
                                        <v-list-item-content>
                                            <span>{{ item }} </span>
                                        </v-list-item-content>
                                        <v-list-item-action class="ai-btn">
                                            <VBtn icon="tabler-check" variant="text" color="success"
                                                @click="onTick(index, item)" />
                                            <VBtn icon="tabler-x" variant="text" color="error"
                                                @click="onCross(index, item)" />
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <h3>Recommended Diagnostic Tests</h3>
                                <v-list dense>
                                    <v-list-item v-for="(item, index) in recommended_test" :key="index"
                                        class="align-center item-bg">
                                        <v-list-item-content>
                                            <span>{{ item }} </span>
                                        </v-list-item-content>
                                        <v-list-item-action class="ai-btn">
                                            <VBtn icon="tabler-check" variant="text" color="success"
                                                @click="onTick(index, item)" />
                                            <VBtn icon="tabler-x" variant="text" color="error"
                                                @click="onCross(index, item)" />
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <h3>Suggested Medications</h3>
                                <v-list dense>
                                    <v-list-item v-for="(item, index) in recommended_products" :key="index"
                                        class="align-center item-bg">
                                        <v-list-item-content>
                                            <span>{{ item }} </span>
                                        </v-list-item-content>
                                        <v-list-item-action class="ai-btn">
                                            <VBtn icon="tabler-check" variant="text" color="success"
                                                @click="onTick(index, item)" />
                                            <VBtn icon="tabler-x" variant="text" color="error"
                                                @click="onCross(index, item)" />
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <h3>Safety Precautions</h3>
                                <v-list dense>
                                    <v-list-item v-for="(item, index) in safety_measure" :key="index"
                                        class="align-center item-bg">
                                        <v-list-item-content>
                                            <span>{{ item }} </span>
                                        </v-list-item-content>
                                        <v-list-item-action class="ai-btn">
                                            <VBtn icon="tabler-check" variant="text" color="success"
                                                @click="onTick(index, item)" />
                                            <VBtn icon="tabler-x" variant="text" color="error"
                                                @click="onCross(index, item)" />
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>

                    </div>
                </VCardText>
            </VCard>


        </PerfectScrollbar>
    </VNavigationDrawer>
</template>
<style>
.ai-btn {
    position: absolute;
    right: 5px;
    bottom: 0px;
}

.item-bg {
    border-radius: 5px !important;
    background-color: silver;
    margin-bottom: 5px;
    padding-right: 60px !important;
}
</style>
