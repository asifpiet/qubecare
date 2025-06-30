<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Category View',
  },
})
import AddNewCategory from '@/pages/provider/category/AddNewCategory.vue';
import { categoryService } from '@/services/categoryService';
import { useCategoryStore } from '@/stores/categoryStore';

const categoryStore = useCategoryStore()
const sortByData = ref([{ 'key': 'id', 'order': 'desc' }])
const selectedCategory = ref(null)
const dataTable = ref(null);
const emit = defineEmits([
  'saveProductData',
  'handleDialog'

]);
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Category',
    key: 'name',
  },
]

onMounted(async () => {
  dataTable.value.reload()
})

const EditDetail = async (item) => {
  let temp = categoryService.mapCategoryData(item)
  selectedCategory.value = temp
  console.log("temp", temp);
  categoryStore.isDrawerOpen = true
}

const reload = () => dataTable.value.reload()

watch(() => categoryStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})

const handleDialogVisible = async (data) => {
  emit('handleDialog', true)
}

</script>

<template>
  <section>
    <DataTable ref="dataTable" :cardTitle="$t('Categories')" :btnTitle="$t('Add New Category')" :headers="headers"
      :api="GET_CATEGORY_API" :sortBy="sortByData"
      @onBtnClick="[categoryStore.isDrawerOpen = true, selectedCategory = null]">
      <template #item.name="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span @click="EditDetail(item)" class="cursor-pointer text-primary" style="text-decoration: underline;">{{
            item.name }} </span>
        </div>
      </template>
    </DataTable>

    <teleport to="body">
      <AddNewCategory :category="selectedCategory" v-if="categoryStore.isDrawerOpen"  @saveData="handleDialogVisible"/>
    </teleport>
  </section>
</template>
<style scoped>
::v-deep .v-data-table .v-data-table__wrapper::-webkit-scrollbar {
  width: 10px;
}
</style>
