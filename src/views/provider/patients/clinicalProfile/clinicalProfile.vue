<script setup>
import { useClinicalProfileStore } from '@/stores/clinicalProfileStore';
import EditClinicalProfile from '@/views/provider/patients/clinicalProfile/EditClinicalProfile.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useStore } from 'vuex';
const clinicalProfileStore = useClinicalProfileStore()
clinicalProfileStore.unloadClinicalProfile()
const store = useStore()
const isDialogVisible = ref(false)
const drugAllergyNotes = ref('');
const route = useRoute();
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },

})
const isCardDetailsVisible = ref(false)
clinicalProfileStore.getClinicalProfile(props.patient.id)

const closePpup = () => {
  isDialogVisible.value = false;
  clinicalProfileStore.getClinicalProfile(props.patient.id)
}

</script>

<template>
  <VRow>

    <VCol cols="12" md="12" sm="12">
      <VCard>
        <VCardActions>
          <div class="px-3 py-2">
            <VBtn prepend-icon="tabler-edit" @click="isDialogVisible = true">
              {{ $t('Edit Clinical Profile')}}
            </VBtn>

          </div>
        </VCardActions>
        <VCardText class=" pt-0">
          <VTable class="mb-4 border rounded pt-0" v-if="$can('read', 'General')">
            <thead>
              <tr>
                <th><b>{{ $t('General') }}</b></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $t('Blood Group') }}</td>
                <td> {{ clinicalProfileStore.generalProfile.bloodGroup }} </td>
              </tr>
              <tr>
                <td>{{ $t('Smoking') }}:</td>
                <td>{{ clinicalProfileStore.generalProfile.smoking }}</td>
              </tr>
              <tr>
                <td>{{ $t('General Notes') }}</td>
                <td>{{ clinicalProfileStore.generalProfile.generalNotes }}</td>
              </tr>
              <tr>
                <td>{{ $t('Food Allergies') }}</td>
                <td>
                  <p>
                    <VChip v-for="(allergy, index) in clinicalProfileStore.generalProfile.selectedAllergies"
                      :key="index" color="primary" class="mr-1 mt-1">
                      {{ allergy }}
                    </VChip>
                  </p>
                  <p>{{ $t('Note') }}: </p>
                </td>
              </tr>
              <tr>
                <td>{{ $t('Herb/Drug Allergies') }}</td>
                <td>
                  <p></p>
                  <p>
                    <VChip v-for="(drug, index) in clinicalProfileStore.generalProfile.additionalDrugAllergies"
                      :key="index" color="primary" class="mr-1 mt-1">
                      {{ drug }}
                    </VChip>
                  </p>
                  <p>{{ $t('Note:')}}  {{ drugAllergyNotes }}</p>
                </td>
              </tr>
              <tr>
                <td>{{ $t('Ineffective Meds') }}</td>
                <td>
                  <p></p>
                  <p>
                    <VChip v-for="(med, index) in clinicalProfileStore.generalProfile.ineffectiveMeds" :key="index"
                      color="primary" class="mr-1 mt-1">
                      {{ med }}
                    </VChip>
                  </p>

                  <p>{{ $t('Note:')}}  {{ clinicalProfileStore.generalProfile.ineffectiveMedsNotes }}</p>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>

        <VCardActions>
          <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
            {{ $t('Show More')}} 
          </VBtn>

          <VSpacer />

          <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
            <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <VCardText>
              <VTable class="mb-4 border rounded pt-0" v-if="$can('read', 'Diet and other Restrictions')">
                <thead>
                  <tr>
                    <th><b>{{ $t('Dietary Restrictions') }}</b></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ $t('Diet Restriction') }}</td>
                    <td>
                      <p></p>
                      <p>
                        <VChip v-for="(diet, index) in clinicalProfileStore.diet.selected_deit_restrictions"
                          :key="index" color="primary" class="mr-1 mt-1">
                          {{ diet }}
                        </VChip>
                      </p>
                      <p>{{ $t('Note:')}}  {{ clinicalProfileStore.diet.restrictions_notes }}</p>
                    </td>
                  </tr>
                </tbody>
              </VTable>
              <VTable class="mb-4 border rounded pt-0" v-if="$can('read', 'Immunization')">
                <thead>
                  <tr>
                    <th><b>{{ $t('Immunization') }}</b></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ $t('Immunization') }}</td>
                    <td>
                      <p>
                        <VChip v-for="(item, index) in clinicalProfileStore.Immunizations.selectedImmunizations"
                          :key="index" color="primary" class="mr-1 mt-1">
                          {{ item }}
                        </VChip>
                      </p>
                      <p>{{ $t('Other:') }} <VChip color="primary" class="mr-1 mt-1">{{
                        clinicalProfileStore.Immunizations.immunizationsNotes }}</VChip>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </VTable>
              <VTable class="mb-4 border rounded pt-0" v-if="$can('read', 'Reproductive Section')">
                <thead>
                  <tr>
                    <th><b>{{ $t('Reproductive Section') }}</b></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> {{ $t('Sexually Active')}}</td>
                    <td>
                      {{ clinicalProfileStore.reproductive.sexuallyActive == 'true'? 'Yes': 'No' }}
                    </td>
                  </tr>
                  <tr>
                    <td> {{ $t('Sexual Orientation')}} </td>
                    <td>
                      {{ clinicalProfileStore.reproductive && clinicalProfileStore.reproductive.sexualOrientation }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
  </VRow>

  <VNavigationDrawer v-model="isDialogVisible" temporary :width="800" location="end"
        class="scrollable-content">
        <AppDrawerHeaderSection  :title="$t('Edit Clinical Profile')"
          @cancel="[isDialogVisible = false,closePpup()]" />
        <PerfectScrollbar :options="{ wheelPropagation: false }">
          <VCardText>
          <EditClinicalProfile :patient="props.patient" />
          </VCardText>
        </PerfectScrollbar>
  </VNavigationDrawer>



  <!-- <VDialog v-model="isDialogVisible" max-width="1300" persistent>
    <DialogCloseBtn @click="closePpup" />
    <VCard title="Edit Clinical Profile">
      <VCardText>
        <EditClinicalProfile :patient="props.patient" />
      </VCardText>
    </VCard>
  </VDialog> -->
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 3px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

// membership pricing
.member-pricing-bg {
  position: relative;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}

.membership-pricing {
  sup {
    inset-block-start: 9px;
  }
}

.v-btn {
  transform: none;
}
</style>
