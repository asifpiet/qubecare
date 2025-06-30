<script setup>
import { dateFormat } from '@/plugins/globalFunctions';
import { useProviderStore } from '@/stores/providerStore';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const providerStore = useProviderStore()
const props = defineProps({
  statData: {
    type: Object
  }
})


const headers = [
  {
    title: 'ID',
    key: 'invoice_id',
  },
  {
    title: 'Patient Name',
    key: 'name',
  },

  {
    title: 'Issue Date',
    key: 'issue_date',
  },
  {
    title: 'Grand Total',
    key: 'grand_total',
  },

]


const translatedHeaders = computed(() => {
  return headers.map(header => ({
    ...header,
    title: t(header.title)
  }));
});

</script>

<template>

  <VDataTable :headers="translatedHeaders" :items="providerStore.invocieReport.invoice" :items-per-page="5">
    <template #item.issue_date="{ item }">
      <div class="text-body-1 text-high-emphasis text-capitalize">
        {{ dateFormat(item.issue_date) }}
      </div>
    </template>

    <template #item.grand_total="{ item }">
      <div class="text-body-1 text-high-emphasis text-capitalize">
        ${{ item.grand_total }}.00
      </div>
    </template>
  </VDataTable>
</template>
