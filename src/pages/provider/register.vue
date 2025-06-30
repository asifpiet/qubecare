<script setup>
import { useConfigStore } from '@core/stores/config';
import { useAuth } from '@/composables/useAuth'
import NavBarI18n from '@core/components/I18n.vue'
import { themeConfig } from '@themeConfig'
import { addAlert, hideLoader, showLoader } from '@/utils/showLoader'
const { currentRole, authService } = useAuth()
import { useStore } from 'vuex';
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})
const storeApi = useStore()
const store = useConfigStore()
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)

store.skin = 'default'
const first_name = ref()
const last_name = ref()
const email = ref()
const username = ref()
const company_name = ref()
const on_your_domain = ref(false)
const dummy = ref('Provider')
const textMessageNumber = ref('');
const password = ref()
const cPassword = ref()
const ability = useAbility()
const router = useRouter()
const refVForm = ref()
const accessToken = useCookie('accessToken')
const accessRights = ref({
  admin: true,
  practitioner: false,
  patientPortal: false,
});

const errors = ref({
  name: undefined,
  email: undefined,
})
onMounted(async () => {
  console.log(accessToken.value)
  if (!accessToken.value) {

  } else {
    await router.push({ name: 'provider-register-setup' })
  }


})
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
    textMessageNumber.value = formattedValue;
  } else {

  }
};
const submitForm = async () => {
  const { valid } = await refVForm.value.validate()
  console.log(valid)
  if (valid) {
    let dataForm = {
      firstName: first_name.value,
      lastName: last_name.value,
      emailAddress: email.value,
      textMessageNumber: textMessageNumber.value,
      accessRights: accessRights.value,
      username: username.value,
      newUserPassword: password.value,
      confirm_password: cPassword.value,
      company_name: company_name.value,
      on_your_domain: on_your_domain.value,
      dummy: dummy.value == "Provider" ? 'false' : 'true',
    }
    console.log(dataForm)
    //return true

    showLoader()
    try {
      await authService.value.register(dataForm)
      addAlert('Registration Successful!', 'success')
      await router.push({ name: 'provider-register-setup' })
    } catch (e) {
      console.log(e)
      if (e.data.data) {
        addAlert(e.data.data, 'error')
      } else {
        addAlert(e.data.message, 'error')
      }

    }

    hideLoader()





  } else {
    console.error('Form is invalid');
  }
};

const transformPermissions = (permissionsData) => {
  const transformedPermissions = [];
  transformedPermissions.push({ action: 'read', subject: 'Profile Update' })
  const processPermissions = (permissions) => {
    for (const permission of permissions) {
      if (permission.ability === true) {
        transformedPermissions.push({
          action: 'read', // Adjust based on your permission model
          subject: permission.text,
        });
      }

      if (permission.children) {
        for (const child of permission.children) {
          if (child.ability === true) {
            transformedPermissions.push({
              action: 'read', // Adjust based on your permission model
              subject: child.text,
            });
          }
        }
      }
    }
  };

  for (const group of permissionsData) {
    processPermissions(group.permissions);
  }

  return transformedPermissions;
};
</script>

<template>
  <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
    :languages="themeConfig.app.i18n.langConfig" class="language" />
  <div class="checkout-page">
    <VContainer>
      <div class="checkout-card">
        <h5 class="text-h5 font-weight-bold mb-12"
          style="text-align: center; color:rgb(var(--v-theme-primary)) !important">
          <VIcon icon="tabler-user-plus" end class="flip-in-rtl" /> {{ $t('Register as a Provider') }}
        </h5>


        <VCard>
          <VCardText>
            <p style="text-align: center;">
              {{ $t('Please fill out the information below to create your provider account') }}</p>
          </VCardText>
          <VDivider />
          <VCardText>
            <VForm ref="refVForm" @submit.prevent="">
              <VRow>

                <VCol cols="12" md="6">
                  <AppTextField v-model="first_name" :label="$t('First Name')" type="name" :rules="[requiredFirstName]"
                    :error-messages="errors.first_name" density="comfortable" class="field-required" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="last_name" :label="$t('Last Name')" type="name" :rules="[requiredLastName]"
                    :error-messages="errors.last_name" density="comfortable" class="field-required" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="email" :label="$t('Email')" type="email"
                    :rules="[requiredEmail, emailValidator]" :error-messages="errors.email" density="comfortable"
                    class="field-required" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="textMessageNumber" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                    :rules="[requiredValidator, validUSAPhone]" :label="$t('Text Message Number')"
                    :hint="$t('For Password Reset')" max="14" @input="(e) => updatePhone('phoneNumber', e)"
                    placeholder="i.e. (000) 000-0000" class="field-required" />


                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="company_name" :label="$t('Company Name')" type="text" :rules="[requiredName]"
                    :error-messages="errors.company_name" density="comfortable" class="field-required" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="username" :label="$t('Username')" :rules="[requiredValidator]"
                    :placeholder="$t('Username')" class="field-required" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="password" :label="$t('Password')" placeholder="············"
                    :rules="[requiredValidator, passwordValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible" class="field-required" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="cPassword" :label="$t('Confirm Password')" placeholder="············"
                    :rules="[requiredValidator, confirmedValidator(cPassword, password)]"
                    :type="isCPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isCPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isCPasswordVisible = !isCPasswordVisible" class="field-required" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppSelect v-model="dummy" :label="$t('User Type')" :items="['Provider', 'Practitioner']"
                    :placeholder="$t('Select User Type')" :rules="[requiredValidator]" class="field-required" />
                </VCol>
                <VCol cols="12" md="6" style="margin-top: 10px;">
                  <div class="d-flex align-center justify-start">
                    <div>
                      <VSwitch id="client-notes" v-model="on_your_domain" />
                    </div>
                    <VLabel for="client-notes" class="ml-2">
                      {{ $t('White lable Domain') }}
                    </VLabel>
                  </div>
                </VCol>
                <VCol cols="12">
                  <div class="d-flex justify-end mt-8">
                    <VBtn color="success" type="button" @click="submitForm">
                      {{ $t('Register') }}
                    </VBtn>
                  </div>
                </VCol>
              </VRow>

            </VForm>
            <VCol cols="12" class="text-center">
              <span> {{ $t('If Already have Account?') }} </span>
              <RouterLink class="text-primary ms-1" :to="{ name: 'provider-login' }">
                {{ $t('Login') }}
              </RouterLink>
            </VCol>
          </VCardText>
        </VCard>
      </div>
    </VContainer>

  </div>
</template>
<style scoped>
:deep(.field-required)>label:after {
  content: '*';
  color: rgb(var(--v-theme-error));
  font-size: 15px;
  margin-left: 3px;
}
</style>
<style lang="scss">
.checkout-card {
  margin-block: 3.5rem 5.25rem;
}

@media (max-width: 960px) and (min-width: 600px) {
  .checkout-page {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}

@media (max-width: 600px) {
  .checkout-card {
    margin-block-start: 6rem;
  }
}

.language {
  position: relative;
  // left:100%;
  // right:30%;
  // top:10;
}
</style>
