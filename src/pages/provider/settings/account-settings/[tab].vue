<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Calender View',
    navActiveLink: 'provider-settings-account-settings-tab'
  }
})
import Availability from '@/pages/apps/availability.vue';
import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const route = useRoute('provider-settings-account-settings-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})



// tabs
const tabs = [
  {
    title: 'Account',
    icon: 'tabler-users',
    tab: 'account',
    action: 'read',
    subject: 'Profile Update',

  },
  {
    title: 'Availability',
    icon: 'tabler-calendar',
    tab: 'availability',
    action: 'read',
    subject: 'Availability View',

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



const translatedTab = computed(() => {
  return tabs.map(header => ({
    ...header,
    title: t(header.title)
    }));
});


</script>

<template>
  <div>
    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTab v-for="item in translatedTab" :key="item.icon" :value="item.tab"
        :to="{ name: 'provider-settings-account-settings-tab', params: { tab: item.tab } }">
        <VIcon start :icon="item.icon" v-if="$can(item.action, item.subject)" />

        <span v-if="$can(item.action, item.subject)">{{ item.title }}</span>

      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-6 disable-tab-transition" :touch="false">
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>


      <VWindowItem value="availability" v-if="$can('read', 'Availability View')">
        <Availability />
      </VWindowItem>

    </VWindow>
  </div>
</template>
