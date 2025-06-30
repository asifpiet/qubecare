<script setup>
import { usePatientStore } from '@/stores/patientStore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const tags = ref([]);
const patientStore = usePatientStore()
const props = defineProps({
  userData: {
    type: Object,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const refInputEl = ref()

const emit = defineEmits([
  'submit',
  'update:isDialogVisible',
])

const onSubmit = async () => {
  isLoading.value = true;
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      await patientStore.updateTags()

    } else {
      isLoading.value = false;
    }
  })
  patientStore.isDrawerOpen = false
}



</script>

<template>

  <VNavigationDrawer v-model="props.isDialogVisible" temporary :width="600" location="end" class="scrollable-content">
    <AppDrawerHeaderSection title='Tags' @cancel="patientStore.isDrawerOpen = false" />
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VDivider />
      <!-- <VCard class="pa-sm-10 pa-2"> -->
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
            {{ $t('Patient Tags') }}
        </h4>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" class="mt-6" @submit.prevent="onSubmit">
          <VRow>
            <!-- 👉 First Name -->
            <VCol
              cols="12"
              
            >
            <AppCombobox
                v-model="patientStore.tags"
                :placeholder="$t('Add Tags')"
                label=""
                multiple
                chips
            />
            </VCol>

            <VCol cols="12" class="d-flex flex-wrap justify-end gap-4">
              <VBtn type="submit" size="small">
                {{ $t('Update')}}
              </VBtn>

            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <!-- </VCard> -->
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
