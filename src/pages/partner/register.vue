<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})
import { useAuth } from '@/composables/useAuth';
import NavBarI18n from '@core/components/I18n.vue';
import {
    emailValidator,
    requiredValidator,
    validUSAPhone
} from '@core/utils/validators';
import { themeConfig } from '@themeConfig';
// import axios from '@axios';
import { onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { VDateInput } from 'vuetify/lib/labs/components.mjs';

const { currentRole, authService } = useAuth()
const router = useRouter()
const isMobile = ref(window.innerWidth <= 768);
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const email = ref()
const password = ref()
const password_confirmation = ref(null)
const isTopLoadingVisible = ref(false);
const isDisabled = ref(true)
const isDialogVisible = ref(false)
const refVForm = ref()
const name = ref()
const last_name = ref()
const termAndCondtiton = ref()
const receviceSMs = ref()
const dob = ref()
const phone = ref()
const isPolicy = ref(false);
const inavlid = ref(false);
const InvalidCredential = ref()
const errors = ref({
    name: undefined,
    last_name: undefined,
    phone_no: undefined,
    email: undefined,
    password: undefined,
    dob: undefined,
    termAndCondtiton: undefined,
    receviceSMs: undefined,
    isPolicy: undefined,
})
const settingSite = ref();
const gender = ref(null)
const genders = ref([
    { name: 'Male', abbreviation: 'Male' },
    { name: 'Female', abbreviation: 'Female' },
    { name: 'Other', abbreviation: 'Other' },
]);

const confirmedValidator = (value) => {
    return value === password.value || 'The Confirm Password field confirmation does not match';
};

const passwordStrengthValidator = value => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(value) || 'Password must be at least 8 characters long and include a number and a special character.'
}
watch(isPolicy, (newVal) => {
    isTopLoadingVisible.value = false;
    // window.addEventListener('click', closeDialogOnOutsideClick);
});
const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
const onSubmit = async () => {
    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {
            console.log('Age', calculateAge(dob.value))
            if (calculateAge(dob.value) >= 18) {
                await register()
            } else {
                addAlert('You must be 18+', 'error')
            }

        }

    })
}

onBeforeMount(() => { })
onMounted(async () => {
    window.addEventListener('resize', checkIfMobile);
})
onUnmounted(() => { });

const getCurrentDate = () => {
    const today = new Date();
    console.log("today", today);
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${month}-${day}-${year}`;
};
const register = async () => {
    inavlid.value = false;
    InvalidCredential.value = null;
    const parts = String(dob.value).split(" ");
    const monthMap = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    };

    // Extract the year, month, and day, and map the month to a number
    const year = parts[3];
    const month = monthMap[parts[1]];
    const day = parts[2].padStart(2, '0');  // Ensure day is two digits

    // Combine into desired format
    const formattedDate = `${year}-${month}-${day}`;
    let dataForm = {
        first_name: name.value,
        last_name: last_name.value,
        phone_no: phone.value,
        email: email.value,
        dob: formattedDate,
        gender: gender.value.toLowerCase(),
        password: password.value
    }
    showLoader()
    try {
        await authService.value.register(dataForm);
        await router.push({ name: 'partner-dashboard' });
    } catch (e) {
        console.error('Error Response:', e.response);

        if (e.response?.status === 422) {
            const errorMessages = e.response?._data?.error;
            if (errorMessages) {
                const formattedMessages = Object.values(errorMessages)
                    .flat()
                    .join(' ');
                addAlert(formattedMessages, 'error');
            } else {
                addAlert('Email or phone number already exist.', 'error');
            }
        } else {
            addAlert(e.response?.data?.message ?? e.message, 'error');
        }
    }


    hideLoader()
};

const formatPhoneNumber = () => {
    // Remove non-numeric characters from the input
    const numericValue = phone.value.replace(/\D/g, '');

    // Apply formatting logic
    if (numericValue.length <= 10) {
        phone.value = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
        // Limit the input to a maximum of 14 characters
        const truncatedValue = numericValue.slice(0, 10);
        phone.value = truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};


</script>
<template>
   <div class="language-dropdown">
      <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
                  :languages="themeConfig.app.i18n.langConfig" 
                  class="language" />
    </div>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">
                    <i class="fas fa-cube"></i>
                </div>
                <div class="logo-text">Qube<span>Care</span></div>
            </div>
            <div class="login-link">
                {{ $t('Already have an account?') }} <router-link :to="'/partner/login'">{{ $t('Sign In')
                }}</router-link>
                 
            </div>
        </div>
       

        <div class="signup-container">
            <div class="signup-sidebar">
                <div class="sidebar-content">
                    <h2 class="signup-title">{{ $t('Join Our Partner Network') }}</h2>
                    <p>

                        {{ $t(`Complete the registration process to get started with QubeCare's`) }}
                        {{ $t(`chiropractor partnership program`) }}

                    </p>

                    <ul class="signup-steps">
                        <li class="step-item active">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <div class="step-title">{{ $t('Account Information') }}</div>
                                <div class="step-description">{{ $t('Create your login credentials') }} </div>
                            </div>
                        </li>
                    </ul>

                    <div class="step-guide">
                        <h3 class="step-guide-title">{{ $t('Why Join QubeCare?') }}</h3>
                        <p class="step-guide-text">
                            {{ $t(`As a chiropractor partner, you'll gain access to additional revenue`) }}
                            {{ $t('streams while providing more comprehensive care options for your patients.') }}</p>
                    </div>

                    <div class="signup-support">
                        <h4 class="support-title">{{ $t('Need Help?') }}</h4>
                        <p class="support-text">
                            {{ $t('Our partner support team is available to assist you with your registration.') }}</p>
                        <div class="support-contact">
                            <span class="support-icon"><i class="fas fa-envelope"></i></span>
                            partners@qubecare.com
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="signup-form-container">
                <div class="form-header">
                    <h1 class="form-title">{{ $t('Create Your Partner Account') }}</h1>
                    <p class="form-subtitle">
                        {{ $t('Please fill out the information below to begin your registration.') }}
                        {{ $t('Fields marked with an asterisk (*) are required.') }}
                    </p>
                </div>

                <VForm id="signup-form" ref="refVForm" @submit.prevent="onSubmit">
                    <div class="form-section">
                        <h3 class="section-title"><i class="fas fa-user"></i> {{ $t('Personal Information') }}</h3>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="first-name" class="form-label required-label">{{ $t('First Name') }}</label>
                                <VTextField v-model="name" label="" type="text" :rules="[requiredValidator]"
                                    :error-messages="errors.name" density="comfortable" />
                            </div>
                            <div class="form-group">
                                <label for="last-name" class="form-label required-label">{{ $t('Last Name') }}</label>
                                <VTextField v-model="last_name" label="" type="text" :rules="[requiredValidator]"
                                    :error-messages="errors.last_name" density="comfortable" />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="email" class="form-label required-label">{{ $t('Email Address') }}</label>
                                <VTextField v-model="email" label="" type="email"
                                    :rules="[requiredValidator, emailValidator]" :error-messages="errors.email"
                                    density="comfortable" />
                                <div class="input-hint">{{ $t(`We'll send verification and updates to this email`) }}
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="phone" class="form-label required-label">{{ $t('Phone Number') }}</label>
                                <VTextField v-model="phone" label="" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                                    :rules="[requiredValidator, validUSAPhone]" :error-messages="errors.phone_no"
                                    @input="formatPhoneNumber" max="14" density="comfortable" />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="email" class="form-label required-label">{{ $t('Gender') }}</label>
                                <v-select v-model="gender" label="" :items="genders" item-title="name"
                                    item-value="abbreviation" :rules="[requiredValidator]"
                                    :error-messages="errors.gender" density="comfortable">
                                </v-select>
                            </div>
                            <div class="form-group">
                                <label for="phone" class="form-label required-label">{{ $t('Date of Birth') }}</label>
                                <v-date-input v-model="dob" :max="getCurrentDate()" :rules="[requiredValidator]"
                                    :error-messages="errors.dob" label="" :placeholder="$t('Date of Birth')"
                                    prepend-icon="" variant="outlined" density="comfortable" ok-text="OK"
                                    cancel-text="Cancel"></v-date-input>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3 class="section-title"><i class="fas fa-lock"></i>{{ $t('Account Credentials') }}</h3>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="password" class="form-label required-label">{{ $t('Password') }}</label>
                                <VTextField v-model="password" label=""
                                    :rules="[requiredValidator, passwordStrengthValidator]"
                                    :error-messages="errors.password" autofocus
                                    :type="isPasswordVisible ? 'text' : 'password'" minlength="8"
                                    :append-inner-icon="isPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                                <!-- <div class="input-hint">Must be at least 8 characters with a number and special
                                    character</div> -->
                            </div>
                            <div class="form-group">
                                <label for="confirm-password" class="form-label required-label">
                                    {{ $t('Confirm Password') }}</label>
                                <VTextField v-model="password_confirmation" label="" minlength="8"
                                    :rules="[requiredValidator, confirmedValidator]"
                                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />

                            </div>
                        </div>
                    </div>

                    <div class="terms-container">


                        <div class="d-flex align-items-center">
                            <div>
                                <VCheckbox v-model="isPolicy"></VCheckbox>
                            </div>
                            <div>
                                <span class="text-muted" style="cursor: pointer;top: 8px;position: relative;">
                                    {{ $t('I agree to the') }} <a href="#">{{ $t('Terms of Service') }}</a> {{
                                        $t('and') }} <a href="#">{{ $t('Privacy Policy') }}</a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Sign Up Button -->
                    <VBtn type="submit" class="signup-button">
                        <i class="fas fa-user-plus"></i> {{ $t('Sign Up') }}
                    </VBtn>
                </VForm>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

:root {
    --primary-color: #156e4d;
    --primary-light: #1d8e63;
    --primary-dark: #0e5238;
    --secondary-color: #1f2937;
    --accent-color: #00c9a7;
    --text-color: #333333;
    --light-text: #6b7280;
    --bg-color: #f9fafb;
    --white: #ffffff;
    --error-color: #ef4444;
    --border-color: #e5e7eb;
    --input-bg: #f3f4f6;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --success-color: #10b981;
}
/* .language {
    position: absolute;
    
    right: 4%;
} */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    background-color: #f9fafb;
    color: #333333;
    min-height: 100vh;
    padding: 20px;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(21, 110, 77, 0.03) 0%, transparent 400px),
        radial-gradient(circle at 80% 70%, rgba(21, 110, 77, 0.03) 0%, transparent 400px);
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 0;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}

.logo {
    display: flex;
    align-items: center;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background-color: #156e4d;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    color: white;
}

.logo-icon i {
    font-size: 24px;
}

.logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #156e4d;
}

.logo-text span {
    font-weight: 400;
    color: #1f2937;
}

.login-link {
    font-size: 14px;
    color: #6b7280;
}

.login-link a {
    color: #156e4d;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
    margin-left: 5px;
}

.login-link a:hover {
    color: #0e5238;
    text-decoration: underline;
}

.signup-container {
    display: flex;
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px;
}

.signup-sidebar {
    flex: 0 0 300px;
    background: linear-gradient(135deg, #0e5238, #156e4d);
    padding: 40px 30px;
    color: white;
    position: relative;
    overflow: hidden;
}

.sidebar-content {
    position: relative;
    z-index: 2;
}

.signup-sidebar::before {
    content: "";
    position: absolute;
    width: 250px;
    height: 250px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 50%;
    top: -100px;
    right: -100px;
    z-index: 1;
}

.signup-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 20px;
    color: white
}

.signup-steps {
    list-style: none;
    margin-top: 40px;
}

.step-item {
    display: flex;
    margin-bottom: 25px;
    opacity: 0.7;
    transition: all 0.3s;
}

.step-item.active {
    opacity: 1;
}

.step-number {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    margin-right: 12px;
    flex-shrink: 0;
}

.step-item.active .step-number {
    background-color: white;
    color: #156e4d;
}

.step-content {
    padding-top: 2px;
}

.step-title {
    font-weight: 500;
    margin-bottom: 4px;
}

.step-description {
    font-size: 12px;
    opacity: 0.8;
}

.step-guide {
    margin-top: 60px;
}

.step-guide-title {
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 16px;
    color: white;
}

.step-guide-text {
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.6;
}

.signup-support {
    margin-top: 40px;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
}

.support-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
    color: white;
}

.support-text {
    font-size: 12px;
    opacity: 0.9;
    margin-bottom: 10px;
}

.support-contact {
    display: flex;
    align-items: center;
    font-size: 13px;
}

.support-icon {
    margin-right: 8px;
}

.signup-form-container {
    flex: 1;
    padding: 40px;
    max-height: 85vh;
    overflow-y: auto;
}

.form-header {
    margin-bottom: 30px;
}

.form-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 10px;
}

.form-subtitle {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
}

.form-section {
    margin-bottom: 30px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.section-title i {
    color: #156e4d;
    margin-right: 8px;
}

.form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
}

.form-group {
    flex: 1;
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
}

.required-label::after {
    content: "*";
    color: var(--error-color);
    margin-left: 3px;
}

.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    transition: all 0.3s;
    background-color: #f3f4f6;
}

.form-input:focus {
    outline: none;
    border-color: #156e4d;
    box-shadow: 0 0 0 3px rgba(21, 110, 77, 0.1);
    background-color: white;
}

.input-hint {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
}

.checkbox-group {
    margin-bottom: 20px;
}

.checkbox-label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
}

.checkbox-custom-container {
    position: relative;
    width: 18px;
    height: 18px;
    margin-right: 10px;
    margin-top: 2px;
}

.checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.checkbox-custom {
    position: absolute;
    top: 0;
    left: 0;
    width: 18px;
    height: 18px;
    border: 2px solid #e5e7eb;
    border-radius: 4px;
    transition: all 0.3s;
}

.checkbox-input:checked+.checkbox-custom {
    background-color: #156e4d;
    border-color: #156e4d;
}

.checkbox-input:checked+.checkbox-custom::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.checkbox-text {
    font-size: 14px;
    color: #333333;
}

.checkbox-text a {
    color: #156e4d;
    text-decoration: none;
    font-weight: 500;
}

.checkbox-text a:hover {
    text-decoration: underline;
}

/* Sign Up Button Style */
.signup-button {
    display: block;
    width: 100%;
    /* padding: 15px 20px; */
    margin-top: 30px;
    background: linear-gradient(45deg, #156e4d, #1d8e63);
    color: white;
    border: none;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    box-shadow: 0 4px 6px rgba(21, 110, 77, 0.2);
}

.signup-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(21, 110, 77, 0.3);
}

.signup-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(21, 110, 77, 0.2);
}

.signup-button i {
    margin-right: 8px;
}

/* Terms and conditions checkbox */
.terms-container {
    margin-top: 20px;
}

@media (max-width: 992px) {
    .signup-container {
        flex-direction: column;
    }

    .signup-sidebar {
        flex: 0 0 auto;
        padding: 30px;
    }

    .signup-form-container {
        padding: 30px;
    }

    .form-row {
        flex-direction: column;
        gap: 0;
    }
}

@media (max-width: 576px) {
    .container {
        padding: 20px 0;
    }

    .signup-form-container {
        padding: 20px;
    }

    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .login-link {
        align-self: flex-end;
    }
}
</style>
<style scoped>
.language-dropdown {
  position: fixed;
  top: 10px;  /* Adjust the distance from the top */
  right: 10px; /* Adjust the distance from the right */
  z-index: 1000; /* Ensure it's above other content */
}

.language-dropdown .language {
  cursor: pointer;
  padding: 5px 10px;
  background-color: transparent;
  /* border-radius: 5px; */
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.language-dropdown .language:hover {
  /* background-color: #f0f0f0; */
}
</style>