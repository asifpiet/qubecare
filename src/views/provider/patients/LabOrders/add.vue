<script setup>
import {
    requiredValidator
} from '@core/utils/validators';
import { useLaborderStore } from '@/stores/laborderStore';
import { useLabtestStore } from '@/stores/labtestStore';
import { useLabStore } from '@/stores/labStore';
import { ref, watch } from 'vue';

const props = defineProps({
    patient: {
        type: Object,
        required: true,
    },
    data: {
        type: String,
        required: true,
    }
})

const laborderStore = useLaborderStore()
const labtestStore = useLabtestStore()
const labStore = useLabStore()
laborderStore.unloadLaborder()
labStore.getLabs()

const refForm = ref()
const isFormValid = ref(false)
const priorityOptions = ['low', 'medium', 'high'];
const labTestsMap = ref({}) // Map to store lab tests by lab ID

const emit = defineEmits([
    'update:isDrawerOpen',
    'customEvent'
])

const closeNavigationDrawer = () => {
    emit('customEvent', false)
};

const onSubmit = async (t) => {
    refForm.value?.validate().then(async ({ valid }) => {
        if (valid) {
            // Set patient ID
            laborderStore.patient_id = props.patient.id
            
            // Filter out empty items before saving
            const originalItems = [...laborderStore.labOrderItems.items];
            laborderStore.labOrderItems.items = originalItems.filter(item => !isRowEmpty(item));
            
            let res = await laborderStore.saveLaborder(props.patient.id);
            console.log("res", res);
            
            closeNavigationDrawer();
            return res;
        }
    });
}

// Fetch lab tests when a lab is selected
const onSelectValue = async (selectedLabId, index) => {
    if (selectedLabId) {
        // Only fetch if we haven't fetched this lab's tests before
        if (!labTestsMap.value[selectedLabId]) {
            await getLabTests(selectedLabId);
        }
        
        // Clear the test selection when lab changes
        laborderStore.labOrderItems.items[index].test_id = '';
    }
};

const isRowEmpty = (row) => {
    // Check if all fields are empty (or falsy)
    return !row.lab_id ||
        !row.test_id ||
        !row.priority;
    // Notes and status can be empty, they're optional
};

// New function to add a row with the button
function addNewRow() {
    // Add a new empty medicine object to the list
    laborderStore.labOrderItems.items.push({
        lab_id: '',
        test_id: '',
        priority: '',
        notes: '',
        status: '',
    });
}

function removeMedicine(index) {
    laborderStore.labOrderItems.items.splice(index, 1);
}

const getLabTests = async (labId) => {
    if (!labId) return [];
    
    try {
        await labtestStore.getLabtests(labId);
        // Store tests in our map for future reference
        labTestsMap.value[labId] = labtestStore.labtests;
        return labtestStore.labtests;
    } catch (error) {
        console.error('Error fetching lab tests:', error);
        return [];
    }
};

// Helper function to get tests for a specific lab
const getTestsForLab = (labId) => {
    if (!labId) return [];
    return labTestsMap.value[labId] || [];
};

// Initialize the first empty row
if (laborderStore.labOrderItems.items.length === 0) {
    addNewRow();
}
</script>

<template>
    <v-form ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit('image/jpeg')">
        <VCardText>
            <v-row>
                <div class="scrollable-table-container">
                    <v-table density="compact" border>
                        <thead>
                            <tr class="backgroundColor">
                                <th>{{ $t('Lab') }}</th>
                                <th>{{ $t('Lab Test') }}</th>
                                <th>{{ $t('Priority') }}</th>
                                <th>{{ $t('Notes') }}</th>
                                <th>{{ $t('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in laborderStore.labOrderItems.items" :key="index"
                                class="mb-3 py-3">
                                <td :style="{ 'min-width': '210px' }">
                                    <v-autocomplete v-model="item.lab_id"
                                        :items="labStore.labs" item-title="name" item-value="id"
                                        :placeholder="$t('Search Lab')" :menu-props="{ maxHeight: '150px' }"
                                        @update:model-value="onSelectValue($event, index)" :rules="[requiredValidator]"></v-autocomplete>
                                </td>

                                <td :style="{ 'min-width': '200px' }">
                                    <v-autocomplete v-model="item.test_id"
                                        :items="getTestsForLab(item.lab_id)"
                                        item-title="test_name" item-value="id" :placeholder="$t('Lab Test')"
                                        :menu-props="{ maxHeight: '150px' }" :rules="[requiredValidator]">
                                    </v-autocomplete>
                                </td>

                                <!-- Priority -->
                                <td :style="{ 'min-width': '150px' }">
                                    <v-select v-model="item.priority" :items="priorityOptions"
                                        :placeholder="$t('Priority')" :rules="[requiredValidator]">
                                    </v-select>
                                </td>

                                <!-- Notes -->
                                <td :style="{ 'min-width': '150px', 'padding': '10px 10px' }">
                                    <v-textarea v-model="item.notes" :placeholder="$t('Notes here..')" rows="2">
                                    </v-textarea>
                                </td>

                                <!-- Action Button -->
                                <td>
                                    <IconBtn v-if="index > 0" @click="removeMedicine(index)">
                                        <VIcon icon="tabler-trash" />
                                    </IconBtn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-row>

            <!-- Add More Button -->
            <v-row class="mt-2">
                <v-col>
                    <VBtn prepend-icon="tabler-plus" variant="outlined" color="primary" @click="addNewRow">
                        {{ $t('Add More') }}
                    </VBtn>
                </v-col>
            </v-row>

            <v-row class="mt-4">
                <v-col>
                    <VBtn class="me-3" type="submit">
                        {{ $t('Save') }}
                    </VBtn>
                    <VBtn variant="tonal" color="error" class="ml-1" @click="closeNavigationDrawer">
                        {{ $t('Close') }}
                    </VBtn>
                </v-col>
            </v-row>
        </VCardText>
    </v-form>
</template>

<style scoped>
.scrollable-table-container {
    max-height: 500px;
    width: 100%;
    /* Ensure it takes full width of its parent */
    overflow-x: auto;
    /* Enable horizontal scrolling */
    overflow-y: auto;
    /* Enable vertical scrolling */
    display: block;
}

.prescription-details {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
}

.prescription-details p {
    margin: 2px 0;
}

.scrollable-table {
    width: 100%;
    /* Ensure it stretches to take full available width */
    min-width: 1400px;
    /* Adjust this value to ensure table is wider than its container */
    table-layout: auto;
}


.v-table th,
.v-table td {
    white-space: nowrap;
    /* Prevent content from breaking to a new line */
}

.v-table td {
    padding: 8px;
    /* Adjust padding as needed */
}

.backgroundColor {
    background-color: #e0f2ef;
}
</style>