<script setup>
import { useBuilderStore } from '@/stores/builderStore';

const builderStore = useBuilderStore();

const props = defineProps({
    draggedWidget: {
        type: Object,
        required: false
    }
});
const isAdd = !builderStore.selectedWidget
if (isAdd) {
    builderStore.selectedWidget = {
        title: props.draggedWidget?.title.charAt(0).toUpperCase() + props.draggedWidget?.title.slice(1),
        type: props.draggedWidget?.value,
        config: {
            description: null
        }
    };

}

const addItem = () => {
    builderStore.addItem(builderStore.selectedWidget);
    builderStore.isDialog = false;

};
</script>
<template>
    <VCard title="Blank Page">
        <VCardText>
            <v-row>

                <v-col cols="12" md="12">
                    <TiptapEditor v-model="builderStore.selectedWidget.config.description"
                        class="border rounded basic-editor" />
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
