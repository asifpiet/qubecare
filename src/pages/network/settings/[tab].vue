<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Network Settings View',
        navActiveLink: 'network-settings-tab'
    }
})
import CardConfig from '@/views/pages/network/CardConfig.vue';
import PaymentGatewayConfig from '@/views/pages/network/PaymentGatewayConfig.vue';

const route = useRoute('network-settings-tab')

const activeTab = computed({
    get: () => route.params.tab,
    set: () => route.params.tab,
})



// tabs
const tabs = [
    {
        title: 'Card Configurations',
        icon: 'tabler-card',
        tab: 'card',

    },
    {
        title: 'Payment Gateway',
        icon: 'tabler-brand-paypal',
        tab: 'gateway',

    },
    // {
    //   title: 'Billing & Plans',
    //   icon: 'tabler-file-text',
    //   tab: 'billing-plans',
    // },
    // {
    //   title: 'Notifications',
    //   icon: 'tabler-bell',
    //   tab: 'notification',
    // },
    // {
    //   title: 'Connections',
    //   icon: 'tabler-link',
    //   tab: 'connection',
    // },
]


</script>

<template>
    <div>
        <VTabs v-model="activeTab" class="v-tabs-pill">
            <VTab v-for="item in tabs" :key="item.icon" :value="item.tab"
                :to="{ name: 'provider-settings-tab', params: { tab: item.tab } }">
                <VIcon start :icon="item.icon" v-if="$can(item.action, item.subject)" />

                <span v-if="$can(item.action, item.subject)">{{ item.title }}</span>

            </VTab>
        </VTabs>

        <VWindow v-model="activeTab" class="mt-6 disable-tab-transition" :touch="false">
            <!-- Account -->
            <VWindowItem value="card">
                <CardConfig />
            </VWindowItem>


            <VWindowItem value="gateway">
                <PaymentGatewayConfig />
            </VWindowItem>

        </VWindow>
    </div>
</template>
