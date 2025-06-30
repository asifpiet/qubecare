<script setup>
import API from '@/utils/apiDatable';
import debounce from 'lodash.debounce';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
  cardTitle: {
    type: String,
    default: ''
  },
  btnTitle: {
    type: String,
    default: ''
  },
  headers: {
    type: Array,
    default: []
  },
  api: {
    type: String,
    default: ''
  },
  sortBy: {
    type: Array,
    default: []
  },
  meta: {
    type: Object
  }
})
const emit = defineEmits([
  'onBtnClick',
])
const meta = props.meta ?? { card: true, title: !!props.cardTitle, divider: true, addBtn: !!props.btnTitle }
const selectedRows = ref([])
const itemsPerPage = ref(10);
const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const search = ref('')
const sortByData = ref(props.sortBy)
const page = ref(1);
const displayedItemsStart = computed(() => {
  if (totalItems.value === 0) return 0;
  return (page.value - 1) * itemsPerPage.value + 1;
});

const displayedItemsEnd = computed(() => {
  if (totalItems.value === 0) return 0;
  return Math.min(page.value * itemsPerPage.value, totalItems.value);
});

// Modify the loadItems function to handle "All" option (-1)
const loadItems = debounce(async ({ page, itemsPerPage, sortBy }) => {
  const actualItemsPerPage = itemsPerPage === -1 ? totalItems.value || 1000 : itemsPerPage;
  
  const payload = {
    page,
    itemsPerPage: actualItemsPerPage,
    sortBy,
    filters: {
    },
    search: search.value,
  }
  console.log("sortByData.value==", sortByData.value, sortBy);
  sortByData.value = sortBy
  console.log("records", page, itemsPerPage, sortBy);
  loading.value = true;
  const data = await API.getDataTableRecord(props.api, payload, props.headers);
  console.log(data.total)
  serverItems.value = data.items;
  totalItems.value = data.total;

  loading.value = false;
}, 500);


const translatedHeaders = computed(() => {
  return props.headers.map(header => ({
    ...header,
    title: t(header.title)
  }));
});


const reload = () => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: sortByData.value });
}

defineExpose({
  reload
})
</script>
<template>

  <DynamicCard :meta="meta" :title="props.cardTitle">
    <template #titleRightPart>
      <div class="d-flex align-center gap-3 flex-wrap">
        <div style="inline-size: 15.625rem;">
          <AppTextField v-model="search" :placeholder="$t('Search')" density="default" prepend-inner-icon="tabler-search"/>
        </div>

        <VBtn v-if="props.btnTitle" prepend-icon="tabler-plus" @click="emit('onBtnClick')" size="large">
          {{ props.btnTitle }}
        </VBtn>

        <slot name="additionalButton"></slot>
      </div>



    </template>
    <!-- <div>
      <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
        <slot name="additionalButton"></slot>
      </div>
    </div> -->


    <VDataTableServer v-model:model-value="selectedRows" v-model:page="page" class="text-no-wrap"
      v-model:items-per-page="itemsPerPage" :headers="translatedHeaders" :items="serverItems" :items-length="totalItems"
      :loading="loading" :search="search" item-value="id" @update:options="loadItems" :sort-by="sortByData" :hover="true" :show-current-page="true">

      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData"></slot>
      </template>
      <template #bottom>
        <div class="d-flex flex-column flex-sm-row align-center justify-space-between flex-wrap gap-4 px-4 py-2">
          <!-- Showing X to Y of Z records - Hidden on extra small screens -->
          <div class="d-sm-flex align-center">
            <span class="text-body-2">{{ $t('Showing') }} <b>{{ displayedItemsStart }}</b> {{ $t('to') }} <b>{{ displayedItemsEnd }}</b> {{ $t('of') }} <b>{{ totalItems }}</b></span>
          </div>
          
          <!-- Pagination controls -->
          <div class="d-flex flex-column flex-md-row align-center gap-4 w-100 w-sm-auto">
            <!-- Items per page selector -->
            <div class="d-flex align-center">
              <VSelect
                v-model="itemsPerPage"
                :items="[10, 25, 50, 100, { title: $t('All'), value: -1 }]"
                density="compact"
                class="items-per-page-selector"
              />
              <span class="text-body-2 me-2 ms-2">{{ $t('Items per page') }}</span>
            </div>
            
            <!-- Pagination component -->
            <v-pagination
              v-model="page"
              :length="Math.ceil(totalItems / itemsPerPage)"
              :total-visible="$vuetify.display.xs ? 1 : $vuetify.display.sm ? 3 : 5"
              density="comfortable"
              class="mt-2 mt-md-0"
            />
          </div>
        </div>
      </template>
      
      
    </VDataTableServer>
    
    
  </DynamicCard>
</template>
<style scoped>
:deep(.v-data-table .v-table__wrapper table thead tr th) {
  background-color: #f8f7fa !important;
}

/* Add these additional selectors to increase specificity */
:deep(.v-data-table) :deep(.v-table__wrapper) :deep(table) :deep(thead) :deep(tr) :deep(th) {
  background-color: #f8f7fa !important;
}

/* Target the header specifically with a more direct selector */
:deep(.v-data-table__thead) th {
  background-color: #f8f7fa !important;
}

:deep(.items-per-page-selector) {
  max-width: 80px;
  display: inline-block;
}

:deep(.v-pagination) {
  justify-content: center;
}

@media (min-width: 600px) {
  :deep(.v-pagination) {
    justify-content: flex-end;
  }
}

:deep(.v-select__selection) {
  margin-bottom: 0;
}

.rows-text {
  position: relative;
  bottom: 10px;
}

@media (max-width: 600px) {
  .rows-text {
    font-size: 0.75rem;
  }
  
  :deep(.items-per-page-selector) {
    max-width: 70px;
  }
}
</style>
