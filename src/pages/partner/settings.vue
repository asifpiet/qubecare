<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Partner Settings View',
    },
});

import { partnerAuthService } from '@/services/auth/partnerService';
import { usePartnerStore } from '@/stores/partnerStore';
import {
    alphabeticValidator,
    emailValidator,
    requiredValidator,
    validUSAPhone
} from '@core/utils/validators';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

let user = await partnerAuthService.fetchProfile()

const { currentUser, currentRole, logout } = useAuth()
const partnerStore = usePartnerStore()
const router = useRouter();
const userData = currentUser
// Form state
const formRef = ref(null);
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const email = ref(user.userData?.email ?? null)
const password = ref(null)
const password_confirmation = ref(null)
const name = ref(user.userData?.first_name ?? null)
const last_name = ref(user.userData?.last_name ?? null)
const phone = ref(user.userData?.phone_no ?? null)
const account_type = ref("checking")
const bank_name = ref(null)
const account_number = ref(null);
const routing_number = ref(null);
const ach = ref(null);
const address = ref(null);
const email_notifications = ref(false);
const payment_alerts = ref(false);
const refferal_updates = ref(false);
const sms_notifications = ref(false);


const account_types = ref([
    { name: 'Checking', abbreviation: 'checking' },
    { name: 'Savings', abbreviation: 'savings' },
    { name: 'Business', abbreviation: 'business' },
]);

const errors = ref({
    name: undefined,
    last_name: undefined,
    phone_no: undefined,
    email: undefined,
    password: undefined,
    confirm_password: undefined,
})

onMounted(async () => {
    await partnerStore.getPartnerAccountData(userData.value?.id)
    account_number.value = partnerStore.partnerAccount?.account_number ?? null;
    routing_number.value = partnerStore.partnerAccount?.routing_number ?? null;
    ach.value = partnerStore.partnerAccount?.ach ?? null;
    address.value = partnerStore.partnerAccount?.address ?? null;
    bank_name.value = partnerStore.partnerAccount?.bank_name ?? null;
    account_type.value = partnerStore.partnerAccount?.account_type ?? 'checking';
    email_notifications.value = partnerStore.partnerAccount?.email_notifications ?? false;
    payment_alerts.value = partnerStore.partnerAccount?.payment_alerts ?? false;
    refferal_updates.value = partnerStore.partnerAccount?.refferal_updates ?? false;
    sms_notifications.value = partnerStore.partnerAccount?.sms_notifications ?? false;
});

const confirmedValidator = (value) => {
    if (!password.value) return true; // Skip validation if password is empty
    return value === password.value || 'The Confirm Password field confirmation does not match';
};

const passwordStrengthValidator = value => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(value) || 'Password must be at least 8 characters long and include a number and a special character.'
}

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

// Submit handler
const handleSubmit = async () => {
    // Clear any existing password errors first
    errors.value.password = undefined;
    errors.value.confirm_password = undefined;

    // If there's a password entered, validate it
    if (password.value) {
        const passwordValid = passwordStrengthValidator(password.value) === true;

        if (!passwordValid) {
            // Only set error if validation fails
            errors.value.password = 'Password must be at least 8 characters long and include a number and a special character.';
            return;
        }

        // If there's a confirmation password, validate it matches
        if (password_confirmation.value && password_confirmation.value !== password.value) {
            errors.value.confirm_password = 'The Confirm Password field confirmation does not match';
            return;
        }
    }

    // Proceed with form validation
    formRef.value?.validate().then(async ({ valid: isValid }) => {
        if (isValid) {
            await saveAccountSetting();
            await updateProfile();
        }
    });
};

watch(password, (newValue) => {
    if (newValue && passwordStrengthValidator(newValue) === true) {
        errors.value.password = undefined;
    }
});

watch(password_confirmation, (newValue) => {
    if (newValue === password.value) {
        errors.value.confirm_password = undefined;
    }
});

const saveAccountSetting = async () => {
    await partnerStore.savePartnerAccount(
        {
            partner_id: userData.value?.id,
            account_number: account_number.value,
            routing_number: routing_number.value,
            ach: ach.value,
            address: address.value,
            bank_name: bank_name.value,
            account_type: account_type.value,
            email_notifications: email_notifications.value,
            payment_alerts: payment_alerts.value,
            refferal_updates: refferal_updates.value,
            sms_notifications: sms_notifications.value,
        }
    )
};

const updateProfile = async () => {
    await partnerStore.updateProfile(
        {
            first_name: name.value,
            last_name: last_name.value,
            email: email.value,
            phone_no: phone.value,
            password: password.value,
        }
    )
};



</script>
<template>
    <!-- Main Content -->
    <main class="main-content">
        <div class="settings-card">
            <VForm ref="formRef">
                <!-- Account Information Section -->
                <div class="card-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="section-title">{{ $t('Account Information') }}</div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <AppTextField class="field-required" v-model="name" :label="$t('First Name')" type="text"
                                :rules="[requiredValidator]" :error-messages="errors.name" density="comfortable" />
                        </div>

                        <div class="form-group">
                            <AppTextField class="field-required" v-model="last_name" :label="$t('Last Name')"
                                type="text" :rules="[requiredValidator]" :error-messages="errors.last_name"
                                density="comfortable" />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <AppTextField class="field-required" v-model="email" :label="$t('Email Address')"
                                type="email" :rules="[requiredValidator, emailValidator]" :error-messages="errors.email"
                                density="comfortable" />
                        </div>

                        <div class="form-group">
                            <AppTextField class="field-required" v-model="phone" :label="$t('Phone Number')"
                                pattern="^\(\d{3}\) \d{3}-\d{4}$" :rules="[requiredValidator, validUSAPhone]"
                                :error-messages="errors.phone_no" @input="formatPhoneNumber" max="14"
                                density="comfortable" />
                        </div>
                    </div>
                </div>

                <!-- Banking Information Section -->
                <div class="card-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-university"></i>
                        </div>
                        <div class="section-title">{{ $t('Banking Information') }} </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <AppTextField class="field-required" v-model="ach" :label="$t('Account Name')"
                                :rules="[requiredValidator, alphabeticValidator]" outlined />
                        </div>

                        <div class="form-group">
                            <AppSelect class="field-required" v-model="account_type" :label="$t('Account Type')"
                                :items="account_types" item-title="name" item-value="abbreviation"
                                :rules="[requiredValidator]" density="comfortable">
                            </AppSelect>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <AppTextField class="field-required" v-model="bank_name" :label="$t('Bank Name')"
                                :rules="[requiredValidator]" outlined />
                        </div>

                        <div class="form-group">
                            <AppTextField class="field-required" v-model="routing_number" :label="$t('Routing Number')"
                                :rules="[requiredValidator]" outlined />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <AppTextField class="field-required" v-model="account_number" :label="$t('Account Number')"
                                :rules="[requiredValidator]" outlined />
                        </div>

                        <div class="form-group">
                            <AppTextField class="field-required" v-model="address" :label="$t('Address')"
                                :rules="[requiredValidator]" outlined />
                        </div>
                    </div>

                </div>

                <!-- Notification Preferences -->
                <div class="card-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-bell"></i>
                        </div>
                        <div class="section-title">{{ $t('Notifications') }} </div>
                    </div>

                    <div class="toggle-row">
                        <div class="toggle-info">
                            <div class="toggle-label">{{ $t('Email Notifications') }} </div>
                            <div class="toggle-description">
                                {{ $t(`Receive updates about your referrals and payments via email`) }}
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="email_notifications" class="toggle-input" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="toggle-row">
                        <div class="toggle-info">
                            <div class="toggle-label">{{ $t('Payment Alerts') }} </div>
                            <div class="toggle-description"> {{ $t('Get notified when a payment is processed') }} </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="payment_alerts" class="toggle-input" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="toggle-row">
                        <div class="toggle-info">
                            <div class="toggle-label"> {{ $t('Referral Updates') }} </div>
                            <div class="toggle-description">{{ $t('Get notified about the status of your referrals') }}
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="refferal_updates" class="toggle-input" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="toggle-row">
                        <div class="toggle-info">
                            <div class="toggle-label">{{ $t('SMS Notifications') }} </div>
                            <div class="toggle-description">{{ $t('Receive time-sensitive alerts via text message') }}
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="sms_notifications" class="toggle-input">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- Change Password -->
                <div class="card-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="section-title">{{ $t('Password') }} </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <AppTextField v-model="password" :label="$t('New Password')"
                                :error-messages="errors.password" autofocus
                                :type="isPasswordVisible ? 'text' : 'password'" minlength="8"
                                :append-inner-icon="isPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                                @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                        </div>

                        <div class="form-group">
                            <AppTextField v-model="password_confirmation" :label="$t('Confirm Password')"
                                :error-messages="errors.confirm_password" minlength="8" :rules="[confirmedValidator]"
                                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                                :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                                @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
                        </div>
                    </div>
                </div>

                <!-- Footer with Actions -->
                <div class="card-footer">
                    <button class="btn btn-outline">{{ $t('Cancel') }} </button>
                    <!-- <button class="btn btn-primary">Save Changes</button> -->
                    <v-btn color="primary" class="btn btn-primary" @click="handleSubmit">
                        {{ $t('Save Changes') }}
                    </v-btn>
                </div>
            </VForm>
        </div>
    </main>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');


* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f8fafc;
    color: #333333;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(0, 109, 70, 0.05) 0%, transparent 400px),
        radial-gradient(circle at 80% 70%, rgba(0, 109, 70, 0.05) 0%, transparent 400px);
}

:deep(.field-required)>label:after {
    content: '*';
    color: rgb(var(--v-theme-error));

}

.dashboard {
    display: flex;
    min-height: 100vh;
}

/* Settings Card */
.settings-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
    overflow: hidden;
}

.card-section {
    padding: 25px 30px;
    border-bottom: 1px solid #e5e7eb;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.section-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    background-color: #006d46;
    color: white;
    font-size: 16px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
}

/* Form Styles */
.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.form-group {
    flex: 1;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #6b7280;
}

.form-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    transition: all 0.3s;
}

.form-input:focus {
    outline: none;
    border-color: #006d46;
    box-shadow: 0 0 0 3px rgba(0, 109, 70, 0.1);
}

/* Toggle Switch */
.toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
}

.toggle-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.toggle-info {
    flex: 1;
}

.toggle-label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
}

.toggle-description {
    font-size: 12px;
    color: #6b7280;
}

.toggle-switch {
    position: relative;
    width: 44px;
    height: 24px;
}

.toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ddd;
    transition: 0.3s;
    border-radius: 24px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

.toggle-input:checked+.toggle-slider {
    background-color: #006d46;
}

.toggle-input:checked+.toggle-slider:before {
    transform: translateX(20px);
}

/* Card Footer */
.card-footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px 30px;
    background-color: rgba(0, 0, 0, 0.01);
    border-top: 1px solid #e5e7eb;
}

.btn {
    padding: 0px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
}

.btn-primary {
    background-color: #006d46 !important;
    color: white;
    margin-left: 10px;
}

.btn-primary:hover {
    background-color: #00573a !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 109, 70, 0.2);
}

.btn-outline {
    background: transparent;
    border: 1px solid #e5e7eb;
    color: #6b7280;
}

.btn-outline:hover {
    border-color: #006d46;
    color: #006d46;
    transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 992px) {
    .sidebar {
        width: 80px;
    }

    .logo-text,
    .menu-category {
        display: none;
    }

    .logo-container {
        justify-content: center;
        padding: 15px 0;
    }

    .logo-icon {
        margin: 0;
    }

    .nav-link {
        justify-content: center;
        padding: 15px 0;
    }

    .nav-icon {
        margin-right: 0;
    }

    .nav-text {
        display: none;
    }

    .main-content {
        margin-left: 80px;
        width: calc(100% - 80px);
    }

    .header {
        left: 80px;
    }

    .form-row {
        flex-direction: column;
        gap: 15px;
    }
}

@media (max-width: 768px) {
    .main-content {
        padding: 20px;
        padding-top: calc(60px + 20px);
    }

    .card-section {
        padding: 20px;
    }

    .header {
        padding: 0 20px;
    }

    .card-footer {
        padding: 15px 20px;
    }
}

@media (max-width: 576px) {
    .sidebar {
        bottom: 0;
        top: auto;
        width: 100%;
        height: 65px;
        overflow-x: auto;
        z-index: 1000;
    }

    .logo-container {
        display: none;
    }

    .sidebar-menu {
        display: flex;
        padding: 0;
    }

    .nav-menu {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }

    .nav-link {
        flex-direction: column;
        padding: 10px 5px;
        margin: 0;
        font-size: 10px;
        gap: 5px;
        height: 100%;
    }

    .nav-icon {
        font-size: 18px;
    }

    .nav-text {
        display: block;
        font-size: 10px;
    }

    .main-content {
        margin-left: 0;
        width: 100%;
        padding-bottom: 80px;
    }

    .header {
        left: 0;
    }
}
</style>
