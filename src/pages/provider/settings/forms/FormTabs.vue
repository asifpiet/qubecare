<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Forms View',
  },
})
import { useI18n } from 'vue-i18n';
import Forms from './components/forms.vue';

const props = defineProps({
  initialTab: {
    type: String,
    default: 'document-forms'
  }
});
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const activeTab = ref('document-forms')
// Use query parameter instead of route params
// const activeTab = computed({
//   get: () => route.query.tab || 'document-forms', // default to document-forms if no tab query
//   set: (newTab) => {
//     router.push({
//       query: { ...route.query, tab: newTab }  // preserve other query params if any
//     })
//   }
// })
// tabs
const emit = defineEmits([
  'handleDialog'

]);
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
const handleDialogVisible = async (data) => {
  emit('handleDialog', true)
}
</script>

<template>
  <div>
    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTab v-for="item in tabHeaders" :key="item.icon" :value="item.tab">
        <VIcon start :icon="item.icon" v-if="$can(item.action, item.subject)" />

        <span v-if="$can(item.action, item.subject)">{{ item.title }}</span>

      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-6 disable-tab-transition" :touch="false">
      <VWindowItem v-for="item in tabs" :key="item.title" :value="item.tab">

        <Forms v-if="activeTab === item.tab" :tab="item.tab" @saveData="handleDialogVisible"/>
      </VWindowItem>
    </VWindow>
  </div>
</template>
