<script setup>
import { computed } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const store = useStore()
const isDisable = ref(true);
const currentTab = ref('0')
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const name = ref('');
const slug = ref('');
const description = ref('');
const price = ref(null);
const isPrescription = ref(false);
const inTakeForm = ref(null);
const questiioneriesForm = ref(null);
const selectCategoryId =ref();
const id =ref()
const priceOptions = ref([ 'One Time', 'Monthly', 'Yearly', 'Quartly']);
const inTakeOptions = ref([]);
const categories = ref(['Category A', 'Category B', 'Category C']);
const questionnaireOptions = ref([]);

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isDataEnable:{
    type: Boolean,
  },
  editCategory:{
    type:Object
  }
})
onBeforeMount(async () => {
    await store.dispatch('getIntakeQuestionsFormList');
    inTakeOptions.value = store.getters.getIntakeQuestions;
    console.log("inTakeOptions",inTakeOptions.value);

    await store.dispatch('getQuestionerQuestionsFormList');
    questionnaireOptions.value = store.getters.getQuestionerQuestions;
    // console.log("inTakeOptions",inTakeOptions.value);
  });

const emit = defineEmits([
  'closeForm',
  'saveProductData',
  'dataSave'
]);

const editCategory = computed(() => {
    console.log("editCategory",props.editCategory);
    name.value = props.editCategory.name;
    inTakeForm.value = props.editCategory.intake_form_id;
    questiioneriesForm.value = props.editCategory.questionire_form_id;
    id.value = props.editCategory.id;
})
const closeNavigationDrawer = () => {
  currentTab.value = 0;
  emit('update:isDrawerOpen', false)  
  emit('reset-form')
  //TabsUpdate();
  
}

const addNewUser = async userData => {
  console.log('UserDataDrawn', userData);
  emit('userData',userData);
  isDisable.value = false;
  emit('update:isDrawerOpen', true)
  if(userData.checkIsFormOpen == 'saveClose'){
    currentTab.value = 0;
    emit('update:isDrawerOpen', false)
  }
  await nextTick();
}

const updateNewUser = async userData => {
  console.log('UserDataDrawn', userData);
  emit('updateUserData',userData);
  emit('update:isDrawerOpen', true)
  
  if(userData.checkIsFormOpen == 'saveClose'){
    emit('update:isDrawerOpen', false)
  }
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const generateSlug = () => {
      if (name.value) {
        slug.value = name.value
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '')
      } else {
        slug.value = ''
      }
}

const onSubmit = async() => {
  console.log('no');
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
        console.log('yes');
      emit('updateCategoryData', {
        id: id.value,
        name: name.value,
        inTakeForm: inTakeForm.value,
        questiioneriesForm: questiioneriesForm.value,
      })
      // let mgs =  store.getters.getSuccessMsg;
      // console.log("mgs",mgs);
      // if(mgs == false){
        emit('update:isDrawerOpen', false);
      // }
      
      // emit('dataSave')
      
      
      isLoading.value = false
      
    }
  });
  
}
</script>

<template>
  <div v-if="editCategory"></div>
  <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
    
    <AppDrawerHeaderSection
      title="Edit Category"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
          <VCardText>
            <v-form ref="refForm" >
            <v-row>
              <v-col cols="12" md="12">
                  <v-text-field
                    v-model="name"
                   :rules="[requiredValidator]"
                    label="Name"
                    outlined
                    required
                    @input="generateSlug"
                  ></v-text-field>
                </v-col>
            </v-row>
              

          <v-row>
            <v-col cols="12" md="6">
          <v-select
            v-model="inTakeForm"
            :items="inTakeOptions"
            label="Intake Form"
            outlined
            required
            item-title="name"
            item-value="id"
          ></v-select>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="questiioneriesForm"
            :items="questionnaireOptions"
            label="Questionnaire Form"
            outlined
            required
            item-title="name"
            item-value="id"
          ></v-select>
        </v-col>
            <!-- Submit Button in a Separate Row, Centered -->
            <v-col cols="12">
              <v-btn @click="onSubmit" color="primary">Update</v-btn>
            </v-col>
          </v-row>
        </v-form>

        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
