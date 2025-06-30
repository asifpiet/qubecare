<template>
  <v-container>
    <div v-if="setPatientFamilyData"></div>
    <v-form>
      <div class="tw-om-box-content">
        <v-row class="mt-4">
          <v-col cols="12" sm="6" md="6">
            <div class="d-flex align-center mb-2">
              <v-text-field class="mr-2" v-model="search" :label="$t('Search for Health Condition')" />
              <div>
                <v-btn @click="addConditionRelation" color="primary">{{ $t('Add More') }}</v-btn>
              </div>

            </div>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col v-for="(relation, index) in clinicalProfileStore.patientFamilyHisotry.items" :key="index" cols="12"
            sm="6" md="10">
            <v-row>
              <!-- Condition Field -->
              <v-col cols="12" sm="6" md="4">
                <v-textarea v-model="relation.conditions" :label="$t('Condition')" rows="1"></v-textarea>
              </v-col>

              <!-- Relation Field with Button -->
              <v-col cols="12" sm="6" md="4">
                <div class="d-flex align-center mb-2" style="flex-wrap: wrap;">
                  <v-textarea v-model="relation.relations" :label="$t('Relation')" rows="1" class="flex-grow-1"></v-textarea>
                  <v-btn @click="removeConditionRelation(index)" class="ml-2 mt-2">
                    {{ $t('Remove') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

      </div>

      <v-row class="mb-8">
        <v-col cols="12" sm="6">
          <v-textarea v-model="clinicalProfileStore.patientFamilyHisotry.familyHistoryNotes"
            :label="$t('Family History Notes')" rows="3"></v-textarea>
        </v-col>

        <VCol cols="12">
          <VBtn @click="onSubmitFamilyHistory" class="me-3">
            {{ $t('Update Family History') }}
          </VBtn>

        </VCol>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { useClinicalProfileStore } from '@/stores/clinicalProfileStore';
import { ref } from 'vue';
const clinicalProfileStore = useClinicalProfileStore()
const search = ref('');
const familyHistoryNotes = ref();
const addConditionRelation = () => {
  clinicalProfileStore.patientFamilyHisotry.items.push({ conditions: '', relations: '' });
};
const emit = defineEmits([
  'onSavePatientFamilyHistory'
]);
const props = defineProps({
  patientfamily: {
    type: Object,
    required: true,
  },
  patient: {
    type: Object,
    required: true,
  },

})

const removeConditionRelation = (index) => {
  clinicalProfileStore.patientFamilyHisotry.items.splice(index, 1);
};

const onSubmitFamilyHistory = () => {
  return clinicalProfileStore.savePatientFamilyCondition(props.patient.id)

}
</script>

<style scoped>
.tw-om-input-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.tw-om-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
