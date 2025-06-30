<script setup>
import { useBuilderStore } from '@/stores/builderStore';
import { useFormsStore } from '@/stores/formsStore';

const builderStore = useBuilderStore();
const formsStore = useFormsStore();

const props = defineProps({
    draggedWidget: {
        type: Object,
        required: false
    }
});

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
    },
])

const isAdd = !builderStore.selectedWidget
if (isAdd) {
    builderStore.selectedWidget = {
        title: props.draggedWidget?.title.charAt(0).toUpperCase() + props.draggedWidget?.title.slice(1),
        type: props.draggedWidget?.value,
        config: {
            formType: null,
            formId: null
        }
    };

}

watch(() => builderStore.selectedWidget?.config?.formId, () => {
    const form = formsStore.forms.find(form => form.id === builderStore.selectedWidget.config.formId)
    let formType = formTypes.value.find(form => form.type === builderStore.selectedWidget.config?.formType)
    if (form) {
        builderStore.selectedWidget.title = `${formType.title}: ${form.name}`
    }
})
watch(
    () => builderStore.selectedWidget?.config?.formType, // Watch the `formType`
    async (newValue, oldValue) => {
        console.log("newValue:", newValue, "oldValue:", oldValue);
        if (newValue) {
            await formsStore.getFormByType(newValue); // Call your function
            builderStore.selectedWidget.config.formId = formsStore.forms[0].id
        }
    },
    { immediate: true } // Optional: Run the watch immediately
);

const addItem = () => {

    builderStore.addItem(builderStore.selectedWidget);
    builderStore.isDialog = false;

};
</script>
<template>
    <VCard :title="$t('Forms')">
        <VCardText>
            <v-row>
                <v-col cols="12" md="6">
                    <AppSelect v-model="builderStore.selectedWidget.config.formType" :label="$t('Type')"
                        :items="formTypes" item-value="type" item-title="title" clearable />
                </v-col>
                <v-col cols="12" md="6">
                    <AppSelect v-model="builderStore.selectedWidget.config.formId" :label="$t('Form')"
                        :items="formsStore.forms" item-value="id" item-title="name" clearable />
                </v-col>
            </v-row>
            <v-row v-if="isAdd">
                <v-col cols="12" md="3">
                    <v-btn @click="addItem">{{ $t('Add') }}</v-btn>
                </v-col>
            </v-row>
        </VCardText>
    </VCard>
</template>
