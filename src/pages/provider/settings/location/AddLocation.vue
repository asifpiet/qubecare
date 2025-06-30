<script setup>
import { useLocationStore } from '@/stores/locationStore';
import { statesList } from '@/utils/states';
import { useStore } from 'vuex';

const locationStore = useLocationStore()
const store = useStore()
const refVForm = ref()
const name = ref()
const address = ref()
const city = ref()
const country = ref()
const state = ref()
const zipcode = ref()
const phoneNumber = ref()
const npiNumber = ref()
const states = statesList;

const formatPhoneNumber = (inputValue) => {
  const numericValue = inputValue.replace(/\D/g, '');
  if (numericValue.length <= 10) {
    // Change formatting to XXX-XXX-XXXX  
    return numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  } else {
    const truncatedValue = numericValue.slice(0, 10);
    // Change formatting to XXX-XXX-XXXX  
    return truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
};

const updatePhone = (field, event) => {
  const formattedValue = formatPhoneNumber(event.target.value);
  if (field === 'phoneNumber') {
    phoneNumber.value = formattedValue;
  } else {

  }
};
const emit = defineEmits(['submit'])
const submitForm = async () => {

  const { valid } = await refVForm.value.validate()
  if (valid) {
    await locationStore.saveLocation(
      {
        name: name.value,
        city: city.value,
        state: state.value,
        country: country.value,
        zipcode: zipcode.value,
        address: address.value,
        phoneNumber: phoneNumber.value,
        npiNumber: npiNumber.value,
      }
    )

    emit('submit', 'success')
    resetForm();
  }


}
const cancelForm = () => {
  resetForm();
  console.log('Form canceled');
};
const resetForm = () => {
  name.value = null;
  city.value = null;
  country.value = null;
  zipcode.value = null;
  address.value = null;
  phoneNumber.value = null;
  npiNumber.value = null;

};  
</script>
<template>

  <VCard title="">
    <VCardText>
      <VForm class="mt-2" ref="refVForm">
        <VRow>
          <VCol md="6" cols="12">
            <AppTextField v-model="name" :label="$t('Name')" :placeholder="$t('Name')" :rules="[requiredValidator]" />
          </VCol>

          <VCol md="6" cols="12">
            <AppTextField v-model="city" :label="$t('City')" :placeholder="$t('City')" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="4">
            <AppSelect v-model="state" :label="$t('State')" :placeholder="$t('State')" :rules="[requiredValidator]"
              :items="states" item-title="name" item-value="abbreviation" />
          </VCol>
          <VCol cols="12" md="4">
            <AppTextField v-model="country" :label="$t('Country')" :placeholder="$t('Country')"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="4">
            <AppTextField v-model="zipcode" type="number" :label="$t('ZipCode')" :placeholder="$t('ZipCode')"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol md="12" cols="12">
            <AppTextField v-model="address" :label="$t('Address')" :placeholder="$t('Address')" />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="phoneNumber" pattern="^\(\d{3}\) \d{3}-\d{4}$"
              :rules="[requiredValidator, validUSAPhoneADD]" :label="$t('Phone Number')" max="14"
              @input="(e) => updatePhone('phoneNumber', e)" placeholder="i.e. (000) 000-0000" />

          </VCol>
          <VCol cols="12" md="6">

            <AppTextField v-model="npiNumber" type="number" :label="$t('NPI Number')" :placeholder="$t('NPI Number')"
              :rules="[validateNpiNumber]" />
          </VCol>


          <VCol cols="12">

            <VBtn class="mr-2" @click="submitForm"> {{ $t('Submit') }}</VBtn>
            <VBtn color="secondary" variant="tonal" @click="cancelForm">
              {{ $t('Cancel') }}
            </VBtn>
          </VCol>
        </VRow>

      </VForm>
    </VCardText>
  </VCard>
</template>
