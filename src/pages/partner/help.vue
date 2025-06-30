<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Partner Dashboard View',
    },
})

import { usePartnerStore } from '@/stores/partnerStore';
import {
    requiredValidator
} from '@core/utils/validators';

const partnerStore = usePartnerStore()

const formRef = ref(null);

const subject = ref(null);
const category = ref(null);
const priority = ref(null);
const description = ref(null);
const attachment = ref(null);

const categories = ref([
    { name: 'Account Access', abbreviation: 'Account Access' },
    { name: 'Payments & Commissions', abbreviation: 'Payments & Commissions' },
    { name: 'Referral Program', abbreviation: 'Referral Program' },
    { name: 'Product Information', abbreviation: 'Product Information' },
    { name: 'Technical Issue', abbreviation: 'Technical Issue' },
    { name: 'Other', abbreviation: 'Other' },
]);

const priorities = ref([
    { name: 'Normal', abbreviation: 'Normal' },
    { name: 'High', abbreviation: 'High' },
    { name: 'Urgent', abbreviation: 'Urgent' },
]);

const errors = ref({
    subject: undefined,
    category: undefined,
    priority: undefined,
    description: undefined,
})

// Submit handler
const handleSubmit = async () => {
    formRef.value?.validate().then(async ({ valid: isValid }) => {


        if (isValid) {
            await createSupportTicket();
        }
    });
};

const createSupportTicket = async () => {

    await partnerStore.createSupportTicket({
        subject: subject.value,
        category: category.value,
        priority: priority.value,
        description: description.value,
        attachment: attachment.value,
    })
};
</script>
<template>
    <!-- Main Content -->
    <main class="main-content">
        <!-- Contact Options -->
        <div class="card">
            <div class="card-header">
                <div class="card-icon">
                    <VIcon>tabler-headset</VIcon>
                </div>
                <div class="card-title">{{ $t('Contact Us') }}</div>
            </div>

            <div class="card-content">
                <p class="intro-text">
                    {{ $t(`Need help? Our support team is ready to assist you.`) }}
                    {{ $t('Choose one of the options below to get in touch with us.') }}
                </p>

                <div class="contact-options">
                    <div class="contact-card">
                        <div class="contact-icon">
                            <VIcon>tabler-mail-filled</VIcon>
                        </div>
                        <div class="contact-info">
                            <div class="contact-title">{{ $t('Email Support') }}</div>
                            <div class="contact-description">support@qubecare.com</div>
                        </div>
                    </div>

                    <div class="contact-card">
                        <div class="contact-icon">
                            <VIcon>tabler-phone-filled</VIcon>
                        </div>
                        <div class="contact-info">
                            <div class="contact-title">{{ $t('Phone Support') }}</div>
                            <div class="contact-description">(800) 123-4567</div>
                        </div>
                    </div>

                    <div class="contact-card">
                        <div class="contact-icon">
                            <VIcon>tabler-message-filled</VIcon>
                        </div>
                        <div class="contact-info">
                            <div class="contact-title">{{ $t('Live Chat') }}</div>
                            <div class="contact-description">{{ $t('Available') }} 9 AM - 5 PM EST</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Support Ticket -->
        <div class="card">
            <div class="card-header">
                <div class="card-icon">
                    <VIcon>tabler-ticket</VIcon>
                </div>
                <div class="card-title">{{ $t('Create Support Ticket') }}</div>
            </div>

            <div class="card-content">
                <p class="intro-text">
                    {{ $t(`Submit a support ticket and a member of our team will respond as soon as possible.`) }}
                    {{ $t(`Please provide as much detail as possible to help us resolve your issue quickly.`) }}
                </p>

                <VForm ref="formRef">
                    <div class="form-group">
                        <AppTextField class="field-required" v-model="subject" :label="$t('Subject')" type="text"
                            :placeholder="$t('Enter ticket subject')" :rules="[requiredValidator]"
                            :error-messages="errors.subject" density="comfortable" />
                    </div>

                    <div class="form-row">
                        <div class="form-group" style="flex: 1;">
                            <AppSelect class="field-required" v-model="category" :label="$t('Category')"
                                :items="categories" item-title="name" item-value="abbreviation"
                                :rules="[requiredValidator]" density="comfortable">
                            </AppSelect>
                        </div>

                        <div class="form-group" style="flex: 1;">
                            <AppSelect class="field-required" v-model="priority" :label="$t('Priority')"
                                :items="priorities" item-title="name" item-value="abbreviation"
                                :rules="[requiredValidator]" density="comfortable">
                            </AppSelect>
                        </div>
                    </div>

                    <div class="form-group">
                        <AppTextarea v-model="description" :label="$t('Description')"
                            placeholder="Please describe your issue in detail" />
                    </div>

                    <div class="form-group">
                        <VFileInput v-model="attachment" :label="$t('Attachments (Optional)')" />
                    </div>

                    <v-btn color="primary" class="btn btn-primary" @click="handleSubmit">
                        <VIcon>tabler-send</VIcon>{{ $t('Submit Ticket') }}
                    </v-btn>
                </VForm>
            </div>
        </div>
    </main>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

:root {
    --primary-color: #006d46;
    --primary-light: #008753;
    --primary-dark: #00573a;
    --secondary-color: #1f2937;
    --warning: #ffb74d;
    --danger: #ff7b7b;
    --success: #4caf50;
    --light: #f5f7fa;
    --dark: #333;
    --text-color: #333333;
    --text-secondary: #6b7280;
    --text-muted: #757F8C;
    --bg-color: #f8fafc;
    --sidebar-width: 240px;
    --header-height: 60px;
    --border-radius: 16px;
    --box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    --border-color: #e5e7eb;
    --card-bg: white;
    --sidebar-bg: white;
}

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

/* Help Page Styles */
.card {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
    overflow: hidden;
}

.card-header {
    display: flex;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #e5e7eb;
}

.card-icon {
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

.card-title {
    font-size: 17px;
    font-weight: 600;
    color: #333333;
}

.card-content {
    padding: 25px;
}

.intro-text {
    color: #6b7280;
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 25px;
}

/* Contact Options */
.contact-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.contact-card {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    cursor: pointer;
}

.contact-card:hover {
    border-color: #006d46;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.contact-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    background-color: #f0faf5;
    color: #006d46;
    font-size: 22px;
}

.contact-info {
    flex: 1;
}

.contact-title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 5px;
}

.contact-description {
    color: #6b7280;
    font-size: 14px;
}

/* Create Ticket Form */
.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 14px;
}

.form-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
}

.form-input:focus {
    outline: none;
    border-color: #006d46;
    box-shadow: 0 0 0 3px rgba(0, 109, 70, 0.1);
}

.form-select {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236b7280' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
}

.form-textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    min-height: 150px;
    resize: vertical;
    transition: all 0.3s;
}

.form-textarea:focus {
    outline: none;
    border-color: #006d46;
    box-shadow: 0 0 0 3px rgba(0, 109, 70, 0.1);
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    display: inline-flex;
    align-items: center;
}

.btn-primary {
    background-color: #006d46 !important;
    color: white;
}

.btn-primary:hover {
    background-color: #00573a !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 109, 70, 0.2);
}

.btn i {
    margin-right: 8px;
}

/* Responsive */
@media (max-width: 992px) {

    .form-row {
        flex-direction: column;
        gap: 15px;
    }
}

@media (max-width: 768px) {
    .main-content {
        padding: 20px;
        padding-top: calc(var(--header-height) + 20px);
    }

    .header {
        padding: 0 20px;
    }

    .contact-options {
        grid-template-columns: 1fr;
    }
}
</style>
