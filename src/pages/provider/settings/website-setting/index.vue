<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Company Settings View',
  },
})
import { useRegisterSetupStore } from '@/stores/registerSetupStore';
import { statesList } from '@/utils/states';
import avatar8 from '@images/avatars/profile-5.webp';
const providerStore = useRegisterSetupStore()
const states = statesList
const sortedStates = computed(() => {
  return states.slice().sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});
const accountData = {
  favicon: '',
  company_name: '',
  company_email: '',
  comapny_phone: '',
  domain_name: '',
  logo: avatar8,
  address: '',
  city: null,
  state: null,
  zip: null,
  id: '',
  header_scripts: '',
  footer_scripts: '',
}
const refVForm = ref(null)
const refInputEl = ref()
const refInputElFavicon = ref()
const isConfirmDialogOpen = ref(false)
const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || 'Please confirm account deactivation']
const selectedLogo = ref(null)
const selectedFavicone = ref(null)

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal.value.logo = fileReader.result

      }

      selectedLogo.value = files[0]
    }
  }
}
const changeAvatarFavicon = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal.value.favicon = fileReader.result
      }
      selectedFavicone.value = files[0]
    }
  }
}
const formatPhoneNumber = (inputValue) => {
  const numericValue = inputValue.replace(/\D/g, '');
  if (numericValue.length <= 10) {
    return numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    const truncatedValue = numericValue.slice(0, 10);
    return truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};
const updatePhone = (field, event) => {
  const formattedValue = formatPhoneNumber(event.target.value);
  if (field === 'phoneNumber') {
    accountDataLocal.value.company_phone = formattedValue;
  } else {

  }
};
// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.logo = accountData.logo
}
const resetAvatarFavicon = () => {
  accountDataLocal.value.favicon = accountData.favicon
}
const timezones = [
  '(GMT-11:00) International Date Line West',
  '(GMT-11:00) Midway Island',
  '(GMT-10:00) Hawaii',
  '(GMT-09:00) Alaska',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-08:00) Tijuana',
  '(GMT-07:00) Arizona',
  '(GMT-07:00) Chihuahua',
  '(GMT-07:00) La Paz',
  '(GMT-07:00) Mazatlan',
  '(GMT-07:00) Mountain Time (US & Canada)',
  '(GMT-06:00) Central America',
  '(GMT-06:00) Central Time (US & Canada)',
  '(GMT-06:00) Guadalajara',
  '(GMT-06:00) Mexico City',
  '(GMT-06:00) Monterrey',
  '(GMT-06:00) Saskatchewan',
  '(GMT-05:00) Bogota',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT-05:00) Indiana (East)',
  '(GMT-05:00) Lima',
  '(GMT-05:00) Quito',
  '(GMT-04:00) Atlantic Time (Canada)',
  '(GMT-04:00) Caracas',
  '(GMT-04:00) La Paz',
  '(GMT-04:00) Santiago',
  '(GMT-03:30) Newfoundland',
  '(GMT-03:00) Brasilia',
  '(GMT-03:00) Buenos Aires',
  '(GMT-03:00) Georgetown',
  '(GMT-03:00) Greenland',
  '(GMT-02:00) Mid-Atlantic',
  '(GMT-01:00) Azores',
  '(GMT-01:00) Cape Verde Is.',
  '(GMT+00:00) Casablanca',
  '(GMT+00:00) Dublin',
  '(GMT+00:00) Edinburgh',
  '(GMT+00:00) Lisbon',
  '(GMT+00:00) London',
]

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'BRL',
  'CAD',
  'CNY',
  'CZK',
  'DKK',
  'HKD',
  'HUF',
  'INR',
]
onMounted(async () => {
  await providerStore.getCompanySetting()
  let list = await providerStore.companySetting
  console.log('list', list)
  accountDataLocal.value.logo = list.logo
  accountDataLocal.value.favicon = list.favicon
  accountDataLocal.value.company_name = list.name
  accountDataLocal.value.company_email = list.email
  accountDataLocal.value.company_phone = list.phone
  accountDataLocal.value.address = list.address
  accountDataLocal.value.city = list.city
  accountDataLocal.value.state = list.state
  accountDataLocal.value.zip = list.zip
  accountDataLocal.value.domain_name = list.domain_name
  accountDataLocal.value.id = list.id
  accountDataLocal.value.header_scripts = list.header_scripts || ''
  accountDataLocal.value.footer_scripts = list.footer_scripts || ''
  selectedLogo.value = list.logo
});

const save = async () => {
  const { valid } = await refVForm.value.validate()
  console.log(valid)
  if (valid) {
    try {
      let data = {
        company_name: accountDataLocal.value.company_name,
        company_phone: accountDataLocal.value.company_phone,
        company_email: accountDataLocal.value.company_email,
        domain_name: accountDataLocal.value.domain_name,

        address: accountDataLocal.value.address,
        city: accountDataLocal.value.city,
        state: accountDataLocal.value.state,
        zip: accountDataLocal.value.zip,
        id: accountDataLocal.value.id,
        logo: selectedLogo.value, //ecelData,
        favicon: selectedFavicone.value,//imageBase64.value
        header_scripts: accountDataLocal.value.header_scripts,
        footer_scripts: accountDataLocal.value.footer_scripts
      }
      console.log(data)
      await providerStore.saveCompanySetting(data)



    } catch (error) {
      console.error(error)
    }
    // await providerStore.getCompanySetting()
    // let list = await providerStore.companySetting
    // console.log('list', list)
    // accountDataLocal.value.logo = list.logo
    // accountDataLocal.value.favicon = list.favicon
    // accountDataLocal.value.company_name = list.name
    // accountDataLocal.value.company_email = list.email
    // accountDataLocal.value.comapny_phone = list.phone
    // accountDataLocal.value.address = list.address
    // accountDataLocal.value.city = list.city
    // accountDataLocal.value.state = list.state
    // accountDataLocal.value.zip = list.zip
  }
}
</script>

<template>
  <VRow>

    <VCol cols="12">
      <VCard>
        <VCardText>
          <div class="d-flex mb-10">
            <!-- 👉 Avatar -->

            <VAvatar rounded size="90" class="me-6" :image="accountDataLocal.logo" />

            <!-- 👉 Upload Photo -->
            <form class="d-flex flex-column justify-center gap-4">
              <div class="d-flex flex-wrap gap-4">
                <VBtn color="primary" size="small" @click="refInputEl?.click()">
                  <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                  <span class="d-none d-sm-block"> {{ $t('Upload Logo') }}</span>
                </VBtn>

                <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF,image/webp,.webp" hidden
                  @input="changeAvatar">

                <VBtn type="reset" size="small" color="secondary" variant="tonal" @click="resetAvatar">
                  <span class="d-none d-sm-block">{{ $t('Reset') }}</span>
                  <VIcon icon="tabler-refresh" class="d-sm-none" />
                </VBtn>
              </div>

              <p class="text-body-1 mb-0">
                {{ $t('Allowed Only PNG.Max size of 800K') }}

              </p>
            </form>
          </div>



          <!-- 👉 Form -->
          <VForm ref="refVForm">
            <VRow>




              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.company_name" :label="$t('Company Name')"
                  :placeholder="$t('Company Name')" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.company_email" :label="$t('Company Email')" type="email"
                  :placeholder="$t('Company Email')" :rules="[requiredEmail, emailValidator]" />
              </VCol>
              <VCol cols="6">
                <AppTextField v-model="accountDataLocal.company_phone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  :rules="[requiredValidator, validUSAPhone]" :label="$t('Company phone Number')" max="14"
                  @input="(e) => updatePhone('phoneNumber', e)" placeholder="i.e. (000) 000-0000" />


              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.domain_name" :label="$t('Domain')" type="text"
                  :placeholder="$t('Domain')" :rules="[requiredValidator]" />
                <span class="text-caption text-disabled mt-1 d-block">
                  {{ $t('Connect to IP (e.g., example.com)') }}
                </span>
              </VCol>
              <!-- 👉 Phone -->


              <!-- 👉 Address -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.address" :label="$t('Address')"
                  :placeholder="$t('123 Main St, New York, NY 10001')" :rules="[requiredValidator]" />
              </VCol>

              <!-- 👉 State -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.city" :label="$t('City')" :placeholder="$t('City')"
                  :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12" md="6">
                <!-- <AppTextField v-model="accountDataLocal.state" :label="$t('State')" :placeholder="$t('State')"
                  :rules="[requiredValidator]" /> -->
                <label class="v-label mb-1 text-body-2 text-wrap" for="" style="line-height: 15px;">{{
                  $t('State') }}</label>
                <v-autocomplete clearable v-model="accountDataLocal.state" :items="sortedStates" item-title="name"
                  item-value="abbreviation" :rules="[requiredValidator]" density="comfortable">
                </v-autocomplete>
              </VCol>

              <!-- 👉 Zip Code -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.zip" :label="$t('Zip Code')" placeholder="Zip Code"
                  :rules="[requiredValidator]" />
              </VCol>

              <!-- 👉 Header Scripts -->
              <VCol cols="12">
                <label class="v-label mb-1 text-body-2 text-wrap" style="line-height: 15px;">{{
                  $t('Header Scripts and Tags') }}</label>
                <VTextarea v-model="accountDataLocal.header_scripts"
                  :placeholder="$t('Enter scripts or tracking tags to be added to the header (e.g., Google Analytics, Facebook Pixel, etc.)')"
                  rows="4" density="comfortable" variant="outlined" />
                <span class="text-caption text-disabled mt-1 d-block">
                  {{ $t('These scripts will be added to the head section of all pages') }}
                </span>
              </VCol>

              <!-- 👉 Footer Scripts -->
              <VCol cols="12">
                <label class="v-label mb-1 text-body-2 text-wrap" style="line-height: 15px;">{{
                  $t('Footer Scripts and Tags') }}</label>
                <VTextarea v-model="accountDataLocal.footer_scripts"
                  :placeholder="$t('Enter scripts or tracking tags to be added before closing body tag')" rows="4"
                  density="comfortable" variant="outlined" />
                <span class="text-caption text-disabled mt-1 d-block">
                  {{ $t('These scripts will be added before the closing body tag of all pages') }}
                </span>
              </VCol>

              <!-- 👉 Timezone -->
              <VCol cols="12" md="6" style="display: none;">
                <AppSelect v-model="accountDataLocal.timezone" :label="$t('Timezone')"
                  :placeholder="$t('Select Timezone')" :items="timezones" :menu-props="{ maxHeight: 200 }" />
              </VCol>



              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="save"> {{ $t('Save Changes') }} </VBtn>


              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" style="display: none;">
      <!-- 👉 Delete Account -->
      <VCard :title="$t('Delete Account')">
        <VCardText>
          <!-- 👉 Checkbox and Button  -->
          <div>
            <VCheckbox v-model="isAccountDeactivated" :rules="validateAccountDeactivation"
              :label="$t('I confirm my account deactivation')" />
          </div>

          <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-3" @click="isConfirmDialogOpen = true">
            {{ $t('Deactivate Account') }}
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Confirm Dialog -->
  <ConfirmDialog v-model:isDialogVisible="isConfirmDialogOpen"
    :confirmation-question="$t('Are you sure you want to deactivate your account?')" :confirm-title="$t('Deactivated!')"
    :confirm-msg="$t('Your account has been deactivated successfully.')" :cancel-title="$t('Cancelled')"
    :cancel-msg="$t('Account Deactivation Cancelled!')" />
</template>
