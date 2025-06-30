<script setup>
import { useCategoryStore } from '@/stores/categoryStore';
import { useFormsStore } from '@/stores/formsStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const categoryStore = useCategoryStore()
const formsStore = useFormsStore()
categoryStore.unloadCategory()
const refForm = ref()
const inTakeOptions = ref([]);
const questionnaireOptions = ref([]);

const props = defineProps({
  category: {
    type: Object,
    default: {},
    required: false,
  },
})

if (props.category?.id)
  await categoryStore.loadCategory(props.category)

onBeforeMount(async () => {

  await formsStore.getFormByType('charting-forms')
  inTakeOptions.value = formsStore.forms;

  // await formsStore.getQuestionnaireFormsList();
  await formsStore.getFormByType('simple-forms')
  questionnaireOptions.value = formsStore.forms;

});

const emit = defineEmits([
  'closeForm',
  'saveProductData',
  'dataSave',
  'saveData'
]);

const onSubmit = async () => {
  console.log('no');
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      categoryStore.saveCategory()
      categoryStore.isDrawerOpen = false
      emit('saveData', true)
    }
  });

}
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="end" class="scrollable-content category-drawer"
    @update:model-value="categoryStore.isDrawerOpen = false" :model-value="categoryStore.isDrawerOpen" style="z-index: 9999999 !important;">

    <AppDrawerHeaderSection :title="categoryStore.id ? $t('Edit Category') : $t('Add Category')"
      @cancel="categoryStore.isDrawerOpen = false" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <v-form ref="refForm">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field v-model="categoryStore.category.name" :rules="[requiredValidator]" :label="$t('Name')"
                  outlined required @input="generateSlug"></v-text-field>
              </v-col>
            </v-row>


            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="categoryStore.category.inTakeForm_id" :items="inTakeOptions"
                  :label="$t('Intake Form')" outlined required item-title="name" item-value="id"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="categoryStore.category.questiioneriesForm_id" :items="questionnaireOptions"
                  :label="$t('Questionnaire Form')" outlined required item-title="name" item-value="id"></v-select>
              </v-col>
              <!-- Submit Button in a Separate Row, Centered -->
              <v-col cols="12">
                <v-btn @click="onSubmit" color="primary">{{ $t('Submit') }}</v-btn>
              </v-col>
            </v-row>
          </v-form>

        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>

<style lang="scss">
.category-drawer {
  /* Ensure the drawer has an extremely high z-index */
  z-index: 9999999 !important;
  
  /* Make sure all dropdown menus appear above everything else with even higher z-index */
  .v-menu__content {
    z-index: 10000000 !important;
  }
  
  /* Ensure select dropdowns are visible */
  .v-select__menu, 
  .v-autocomplete__content {
    z-index: 10000000 !important;
  }
  
  /* Target the overlay that might be blocking */
  & + .v-overlay {
    z-index: 9999998 !important;
  }
}

/* Global override for Vuetify's menu content when our drawer is open */
body:has(.category-drawer) .v-overlay {
  z-index: 10000000 !important;
}
</style>
