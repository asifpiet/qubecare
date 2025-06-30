<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Location View',
  },
})

import AddLocation from '@/pages/provider/settings/location/AddLocation.vue';
import SetupFaxCredential from '@/pages/provider/settings/location/faxCredential.vue';
import Rooms from '@/pages/provider/settings/location/rooms.vue';
import UpdateLocations from '@/pages/provider/settings/location/updateLocation.vue';
import { useLocationStore } from '@/stores/locationStore';
import { hideLoader, showLoader } from '@/utils/showLoader';

const locationStore = useLocationStore()
const tab = ref('personal-info')
const isDialogVisible = ref(false)
const isLocationDialogVisible = ref(false)
const twitterLink = ref('')
const facebookLink = ref('')
const googlePlusLink = ref('')
const linkedInLink = ref('')
const instagramLink = ref('')
const quoraLink = ref('')
const sFaxAccount = ref()
const nonFaxAccount = ref()
const selectLocation = ref(null);
const locationList = ref([])
const editData = ref({})

const loadLocations = async () => await locationStore.getLocations()
onMounted(async () => {
  await loadLocations()
  locationList.value = locationStore.locations
})

const handleSubmit = async (msg) => {
  if (msg == 'success') {
    isLocationDialogVisible.value = false
    await loadLocations()

    locationList.value = locationStore.locations


  }
}
watch(selectLocation, async (newValue) => {


  console.log("Selected Location:", newValue);
  showLoader()
  const res = await $api(`${EDIT_LOCATIONS_API}/` + newValue, {
    method: 'GET',
  });
  console.log('res', res);
  editData.value = res
  hideLoader()

});

</script>



<template>

  <VCard flat>
    <VCardText class="d-flex flex-wrap gap-4">


      <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">

        <div style="inline-size: 15.625rem;">
          <AppSelect v-model="selectLocation" :label="$t('Filter')" :placeholder="$t('Filter')" :items="locationList"
            item-value="uuid" item-title="name" />
        </div>


        <VBtn class="mt-7" prepend-icon="tabler-plus" @click="isLocationDialogVisible = true"
          v-if="$can('read', 'Location Add')">
          {{ $t('Add Location') }}

        </VBtn>
      </div>
    </VCardText>
    <VCardText>
      <VTabs v-model="tab">
        <VTab value="location">
          {{ $t('Location') }}

        </VTab>
        <!-- <VTab value="fax-account">
        Fax Account
      </VTab>
      <VTab value="rooms">
        Rooms
      </VTab>-->
        <!-- <VTab value="taxt-rates">
        Tax Rates
      </VTab> -->
      </VTabs>
    </VCardText>

    <VCardText>
      <VWindow v-model="tab" class="disable-tab-transition">
        <VWindowItem value="location">
          <UpdateLocations @submit="handleSubmit" :edit-data="editData" v-if="$can('read', 'Location Edit')" />

        </VWindowItem>

        <VWindowItem value="fax-account">
          <VForm class="mt-2">
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField v-model="sFaxAccount" label="Qube (SFax) Account" placeholder="Fax No" readOnly />
                <VChip size="small" class="mt-1"> {{ $t('The fax number is setup & managed through Qube.') }} </VChip>
                <VBtn size="small" class="mt-2" @click="isDialogVisible = true">{{ $t('Setup SFax Credential') }}
                </VBtn>
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="nonFaxAccount" label="Non-Qube Fax No" placeholder="" />
                <VChip size="small" class="mt-1">
                  {{ $t(' If you have a fax number, please save it here (for e-Prescribing use only)') }}
                </VChip>
                <VBtn size="small" class="mt-2"> {{ $t('Save') }}</VBtn>
              </VCol>

            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="rooms">
          <Rooms />
        </VWindowItem>

        <VWindowItem value="taxt-rates">
          <VForm class="mt-2">
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField v-model="twitterLink" :label="$t('Twitter')" placeholder="https://twitter.com/username" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="facebookLink" :label="$t('Facebook')"
                  placeholder="https://facebook.com/username" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="googlePlusLink" :label="$t('Google+')"
                  placeholder="https://plus.google.com/username" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="linkedInLink" :label="$t('LinkedIn')"
                  placeholder="https://linkedin.com/username" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="instagramLink" :label="$t('Instagram')"
                  placeholder="https://instagram.com/username" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField v-model="quoraLink" :label="$t('Quora')" placeholder="https://quora.com/username" />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>

    <VDivider />


  </VCard>
  <VDialog v-model="isDialogVisible" max-width="600">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
    <SetupFaxCredential />
  </VDialog>




  <VNavigationDrawer v-model="isLocationDialogVisible" temporary :width="600" location="end" class="scrollable-content">
    <AppDrawerHeaderSection :title="$t('Add Location')" @cancel="isLocationDialogVisible = false" />
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <AddLocation @submit="handleSubmit" />
    </PerfectScrollbar>
  </VNavigationDrawer>


</template>
