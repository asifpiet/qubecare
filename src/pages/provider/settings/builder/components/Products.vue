<script setup>
import { useBuilderStore } from '@/stores/builderStore';
import { useProductStore } from '@/stores/productStore';
import { computed, watch } from 'vue';

const productStore = useProductStore();
productStore.productsList();

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
            products: null
        }
    };

}

const productsWithAllOption = computed(() => {
    return [
        { id: 'all', name: 'All Products' },
        ...productStore.products
    ];
});


watch(() => builderStore.selectedWidget?.config?.products, (newValue, oldValue) => {
    if (newValue.includes('all') && !oldValue?.includes('all')) {
        builderStore.selectedWidget.config.products = productsWithAllOption.value.map(product => product.id).filter(id => id !== 'all');
    }
});

const addItem = () => {
    builderStore.addItem(builderStore.selectedWidget);
    builderStore.isDialog = false;
};
</script>

<template>
    <VCard :title="$t('Products')">
        <VCardText>
            <v-row>
                <v-col cols="12" md="12">
                    <AppSelect v-model="builderStore.selectedWidget.config.products" :label="$t('Products')"
                        :items="productsWithAllOption" item-value="id" item-title="name" multiple clearable />
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
