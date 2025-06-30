<script setup>
import {
    requiredValidator,
} from '@core/utils/validators';
import { useBuilderStore } from '@/stores/builderStore';
import { useFormsStore } from '@/stores/formsStore';
import { ref, watch, onMounted } from 'vue';

const builderStore = useBuilderStore();
const formsStore = useFormsStore();

const props = defineProps({
    draggedWidget: {
        type: Object,
        required: false
    }
});
const refVForm = ref()
const productForm = ref(false)
const categoryForm = ref(false)
const formTypes = ref([
    {
        title: 'Document Forms',
        type: 'document-forms',
    },
    {
        title: 'Charting Forms',
        type: 'charting-forms',
    },
    {
        title: 'Simple Forms',
        type: 'simple-forms',
    },
    {
        title: 'Consent Forms',
        type: 'consent-forms',
    },
    {
        title: 'Communication Forms',
        type: 'communication-forms',
    }
])
console.log('props', props.draggedWidget)
// Store to keep track of forms for each form type
const formTypeCache = ref({});

// Store for managing multiple form rows
const formRows = ref([]);

// Track forms by row index
const getFormsByRowIndex = (rowIndex, formType) => {
    // If form type is selected, return cached forms for that type
    if (formType && formTypeCache.value[formType]) {
        return formTypeCache.value[formType];
    }
    return [];
}

// Function to fetch and cache forms for a specific type
const fetchAndCacheForms = async (formType) => {
    if (!formTypeCache.value[formType]) {
        await formsStore.getFormByType(formType);
        formTypeCache.value[formType] = formsStore.forms || [];
    }
    return formTypeCache.value[formType];
}

// Watch for form type changes for any row
const watchFormType = (rowIndex) => {
    watch(
        () => formRows.value[rowIndex]?.formType,
        async (newValue, oldValue) => {
            console.log(`Row ${rowIndex} formType changed:`, newValue, "oldValue:", oldValue);
            if (newValue) {
                const cachedForms = await fetchAndCacheForms(newValue);

                // Set the first form as default if forms exist
                if (cachedForms && cachedForms.length > 0) {
                    // If no formId is set, select the first form
                    if (!formRows.value[rowIndex].formId) {
                        formRows.value[rowIndex].formId = cachedForms[0].id;
                    }
                }
            }
        },
        { immediate: true }
    );
}

// Initialize component
const initializeComponent = async () => {
    const isAdd = !builderStore.selectedWidget
    console.log('isAdd', isAdd)

    if (isAdd) {
        builderStore.selectedWidget = {
            title: props.draggedWidget?.title.charAt(0).toUpperCase() + props.draggedWidget?.title.slice(1),
            type: props.draggedWidget?.value,
            config: {
                forms: [], // Will store multiple form configurations
                productForm: productForm.value,
                categoryForm: categoryForm.value
            }
        };

        // Add initial form row
        formRows.value.push({
            title: '',
            formType: null,
            formId: null,
            checked: false,
            submitted: false,
            opened: false
        });
    } else {
        // When editing, load existing forms if available
        if (builderStore.selectedWidget.config.forms && builderStore.selectedWidget.config.forms.length > 0) {
            formRows.value = [...builderStore.selectedWidget.config.forms];
            productForm.value = builderStore.selectedWidget.config.productForm
            categoryForm.value = builderStore.selectedWidget.config.categoryForm
        } else {
            // Backward compatibility: convert single config to array
            formRows.value.push({
                title: builderStore.selectedWidget.config.title || '',
                formType: builderStore.selectedWidget.config.formType || null,
                formId: builderStore.selectedWidget.config.formId || null,
                checked: false,
                submitted: false,
                opened: false
            });
        }
    }

    // Set up watches and pre-fetch forms for pre-selected form types
    for (let i = 0; i < formRows.value.length; i++) {
        if (formRows.value[i].formType) {
            // Fetch forms for pre-selected form types
            await fetchAndCacheForms(formRows.value[i].formType);

            // Set up watch for this row
            watchFormType(i);
        }
    }

    // If no watches set up (like for a new row), set up watch for first row
    if (formRows.value.length > 0 && !formRows.value[0].formType) {
        watchFormType(0);
    }
}

// Call initialization when component is mounted
onMounted(initializeComponent);

watch([productForm, categoryForm], ([newProductForm, newCategoryForm]) => {
    if (builderStore.selectedWidget?.config) {
        builderStore.selectedWidget.config.productForm = newProductForm;
        builderStore.selectedWidget.config.categoryForm = newCategoryForm;
    }
});

// Add a new form row
const addFormRow = () => {
    const newRowIndex = formRows.value.length;
    formRows.value.push({
        title: '',
        formType: null,
        formId: null,
        checked: false,
        submitted: false,
        opened: false
    });

    // Set up watch for the new row
    watchFormType(newRowIndex);
}

// Remove a form row
const removeFormRow = (index) => {
    if (formRows.value.length > 1) {
        formRows.value.splice(index, 1);
    }
}

// Submit all form rows
const addItem = () => {
    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            // Save all form rows to the widget config
            builderStore.selectedWidget.config.forms = [...formRows.value];

            builderStore.addItem(builderStore.selectedWidget);
            builderStore.isDialog = false;
        }
    })
};
</script>

<template>
    <VCard title="Multiple Forms">
        <VCardText>
            <VForm ref="refVForm" @submit.prevent="">
                <!-- Form rows container -->
                <div v-for="(row, index) in formRows" :key="index" class="form-row mb-2">
                    <v-row>
                        <v-col cols="12" md="3">
                            <label style="font-size: 14px;color: #323232;">Title</label>
                            <VTextField v-model="row.title" label="" :rules="[requiredValidator]"
                                density="comfortable" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <AppSelect v-model="row.formType" label="Type" :items="formTypes" item-value="type"
                                item-title="title" clearable :rules="[requiredValidator]" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <AppSelect v-model="row.formId" label="Form"
                                :items="getFormsByRowIndex(index, row.formType)" item-value="id" item-title="name"
                                clearable :rules="[requiredValidator]" />
                        </v-col>
                        <v-col cols="12" md="1">
                            <v-btn v-if="formRows.length > 1" class="mt-8" icon density="comfortable" variant="text"
                                color="error" size="x-small" @click="removeFormRow(index)">
                                <v-icon>tabler-trash</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider v-if="index < formRows.length - 1" class="mt-2"></v-divider>
                </div>

                <div>
                    <VRow>
                        <VCol cols="12" md="4">
                            <VCheckbox v-model="productForm" label="Product Form" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <VCheckbox v-model="categoryForm" label="Category Form" />
                        </VCol>
                    </VRow>
                </div>

                <!-- Add More Forms button -->
                <v-row>
                    <v-col cols="12" class="mb-2">
                        <v-btn prepend-icon="mdi-plus" variant="outlined" color="primary" size="x-small"
                            @click="addFormRow" class="mr-4">
                            Add More
                        </v-btn>
                    </v-col>
                </v-row>
                <VDivider></VDivider>
                <v-row class="mt-2">
                    <v-col cols="12" md="3">
                        <v-btn @click="addItem">Add</v-btn>
                    </v-col>
                </v-row>
            </VForm>
        </VCardText>
    </VCard>
</template>
