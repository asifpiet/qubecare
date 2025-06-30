<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Forms View',
  },
})
import { useI18n } from 'vue-i18n';
import Forms from './components/forms.vue';
const { t } = useI18n();
const route = useRoute('provider-settings-forms-tab')

const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
})

// tabs
const tabs = [
  {
    title: 'Document Forms',
    tab: 'document-forms',
    action: 'read',
    subject: 'Forms View',

  },
  {
    title: 'Charting Forms',
    tab: 'charting-forms',
    action: 'read',
    subject: 'Forms View',
  },
  {
    title: 'Simple Forms',
    tab: 'simple-forms',
    action: 'read',
    subject: 'Forms View',
  },
  {
    title: 'Consent Forms',
    tab: 'consent-forms',
    action: 'read',
    subject: 'Forms View',
  },
  {
    title: 'Communication Forms',
    tab: 'communication-forms',
    action: 'read',
    subject: 'Forms View',
  },
]



const tabHeaders = computed(() => {
  return tabs.map(tab => ({
    ...tab, // Spread the individual tab item
    title: t(tab.title) // Translate the title using `$t`
  }));
});
</script>

<template>
  <div>
    <VTabs v-model="activeTab" class="border-bottom-none"
    bg-color="deep-purple-accent-4">
      <VTab v-for="item in tabHeaders" :key="item.icon" :value="item.tab" 
        :to="{ name: 'provider-settings-forms-tab', params: { tab: item.tab } }">
        <VIcon start :icon="item.icon" v-if="$can(item.action, item.subject)" />

        <span v-if="$can(item.action, item.subject)">{{ item.title }}</span>

      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-6 disable-tab-transition" :touch="false">
      <VWindowItem v-for="item in tabs" :key="item.title" :value="item.tab">
        <Forms v-if="activeTab === item.tab" />
      </VWindowItem>
    </VWindow>
  </div>
</template>
<style>
.border-bottom-none {
  border-bottom: none !important;
}
</style>
