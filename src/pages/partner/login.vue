<script setup>
definePage({
    meta: {
        layout: 'blank',
        unauthenticatedOnly: true,
    },
})

import { useAuth } from '@/composables/useAuth';
import { hideLoader, showLoader } from '@/utils/showLoader';
import NavBarI18n from '@core/components/I18n.vue';
// import { useAppAbility } from '@/plugins/casl/useAppAbility';
import { themeConfig } from '@themeConfig';
import { onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const { currentRole, authService } = useAuth()
const router = useRouter()
const route = useRoute()
const isMobile = ref(window.innerWidth <= 768);
const refVForm = ref()
const email = ref()
const password = ref(null)
const isPasswordVisible = ref(false)

const inavlid = ref(false);
const InvalidCredential = ref()
const passwordCheck = ref(false)
const errors = ref({
    password: undefined,
    email: undefined,
})


onBeforeMount(async () => {
})
onMounted(async () => {
})
onUnmounted(() => {
});

const onSubmit = async () => {

    refVForm.value?.validate().then(async ({ valid: isValid }) => {
        console.log('isValid ', isValid)
        if (isValid) {

            passwordCheck.value = false
            await handleSubmit()
        }

    })
}

const handleSubmit = async () => {

    try {
        showLoader()
        await authService.value.login(email.value, password.value)
        hideLoader()
        await nextTick(() => {
            router.replace(route.query.to ? String(route.query.to) : '/partner/dashboard')
        })
    } catch (err) {
        hideLoader()
        if (err.response?.status === 401) {
            addAlert('Incorrect email or password', 'error');
        } else {
            // Handle other errors
            addAlert(err.response?._data?.message ?? err.message, 'error');
        }
        console.error(err)
    }
}

</script>
<template>
    <div class="language-dropdown">
      <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
                  :languages="themeConfig.app.i18n.langConfig" 
                  class="language" />
    </div>
    <div class="container">
        <div class="left-panel">
            <div class="branding">
                <div class="logo">
                    <div class="logo-icon">
                        <i class="fas fa-cube"></i>
                    </div>
                    <div class="logo-text">Qube<span>Care</span></div>
                </div>
                <h1 class="tagline">{{ $t('Expand Your Practice Through Our Partner Program') }}</h1>
                <p class="description">
                    {{ $t('Join fellow chiropractors who are enhancing patient care while generating') }}
                    {{ $t('additional revenue streams for their practice.') }}
                </p>

                <div class="benefits">
                    <div class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="benefit-text">{{ $t('Refer patients to complementary services') }}</div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="benefit-text">{{ $t('Earn up to 30% commission on referrals') }} </div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="benefit-text">{{ $t('Access to exclusive professional resources') }}</div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="benefit-text">{{ $t('Integration with your practice management') }} </div>
                    </div>
                </div>
            </div>

            <div class="testimonial">
                <p class="testimonial-quote">

                    {{ $t('As a chiropractor, partnering with QubeCare has been a game-changer.') }}
                    {{ $t('My patients appreciate the comprehensive care approach, and the additional income has') }}
                    {{ $t('helped fund practice improvements.') }}

                </p>
                <div class="testimonial-author">
                    <div class="author-avatar">DR</div>
                    <div class="author-info">
                        <div class="author-name">Dr. Sarah Richards</div>
                        <div class="author-role">{{ $t('Family Chiropractic Center') }}</div>
                    </div>
                </div>
            </div>

            <!-- SVG Spine Icon (Watermark) -->
            <svg class="spine-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor"
                    d="M256 112c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16s16 7.2 16 16v16c0 8.8-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm0 32c-8.8 0-16-7.2-16-16v-16c0-8.8 7.2-16 16-16s16 7.2 16 16v16c0 8.8-7.2 16-16 16zm96-320c-8.8 0-16-7.2-16-16s7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32zm0 64c-8.8 0-16-7.2-16-16s7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32zm0 64c-8.8 0-16-7.2-16-16s7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32zm0 64c-8.8 0-16-7.2-16-16s7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32zm0 64c-8.8 0-16-7.2-16-16s7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32zm0 64c-8.8 0-16-7.2-16-16s7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32zM128 144c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16h32zm0 64c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16h32zm0 64c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16h32zm0 64c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16h32zm0 64c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16h32zm0 64c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16h32z" />
            </svg>
        </div>

        <div class="right-panel">
            <!-- <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
    :languages="themeConfig.app.i18n.langConfig" class="language" /> -->
            <div class="form-header">
                <h2 class="form-title">{{ $t('Qube Partner Portal') }}</h2>
                <p class="form-subtitle">{{ $t('Sign in to access your exclusive dashboard') }}</p>
            </div>

            <VForm ref="refVForm" @submit.prevent="onSubmit" class="login-form">
                <div class="form-group">
                    <label for="username" class="form-label">{{ $t('Email') }}</label>
                    <VTextField v-model="email" :placeholder="$t('Enter your email')" type="email"
                        :rules="[requiredValidator, emailValidator]" :error-messages="errors.email"
                        density="comfortable" />
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">{{ $t('Password') }} </label>
                    <VTextField v-model="password" label="" :placeholder="$t('Enter your password')"
                        :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                        :append-inner-icon="isPasswordVisible ? 'tabler-eye' : 'tabler-eye-off '"
                        @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                </div>

                <div class="form-options">
                    <div class="remember-me">
                        <label class="remember-checkbox">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                        </label>
                        <span class="checkbox-label">{{ $t('Remember me') }}</span>
                    </div>
                    <router-link :to="'/partner/forgot'" class="forgot-password">
                        {{ $t('Forgot Password?') }}</router-link>
                </div>
                <VBtn type="submit" class="login-button" block>
                    {{ $t('Sign In') }}
                </VBtn>

                <div class="divider">{{ $t('or') }} </div>

                <div class="signup-link">
                    {{ $t('New to our partner program?') }} <router-link :to="'/partner/register'"
                        class="text-primary underline">{{ $t('Join as a Partner') }} </router-link>
                </div>
            </VForm>
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
}

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
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(21, 110, 77, 0.03) 0%, transparent 400px),
        radial-gradient(circle at 80% 70%, rgba(21, 110, 77, 0.03) 0%, transparent 400px);
}

.container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px;
    background-color: white;
    min-height: 600px;
    margin: 20px auto;
}

.left-panel {
    flex: 1;
    background: linear-gradient(135deg, #0e5238, #156e4d);
    padding: 40px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
}

.left-panel::before {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 50%;
    top: -100px;
    right: -100px;
}

.left-panel::after {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 50%;
    bottom: -50px;
    left: -50px;
}

.branding {
    position: relative;
    z-index: 2;
}

.logo {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
}

.logo-icon i {
    color: #156e4d;
    font-size: 24px;
}

.logo-text {
    font-size: 24px;
    font-weight: 700;
}

.logo-text span {
    font-weight: 400;
    opacity: 0.9;
}

.tagline {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.3;
    color: white;
}

.description {
    font-size: 16px;
    margin-bottom: 40px;
    line-height: 1.6;
    opacity: 0.9;
}

.benefits {
    margin-top: 40px;
}

.benefit-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.benefit-icon {
    width: 24px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
}

.benefit-icon i {
    color: white;
    font-size: 12px;
}

.benefit-text {
    font-size: 14px;
}

.testimonial {
    position: relative;
    z-index: 2;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    margin-top: 40px;
}

.testimonial-quote {
    font-style: italic;
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 1.6;
}

.testimonial-author {
    display: flex;
    align-items: center;
}

.author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: #156e4d;
    font-weight: 600;
}

.author-info {
    font-size: 14px;
}

.author-name {
    font-weight: 600;
}

.author-role {
    font-size: 12px;
    opacity: 0.8;
}

.right-panel {
    flex: 1;
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.form-header {
    text-align: center;
    margin-bottom: 30px;
}

.form-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
}

.form-subtitle {
    font-size: 14px;
    color: #6b7280;
}

.login-form {
    max-width: 380px;
    margin: 0 auto;
    width: 100%;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
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

.input-wrapper {
    position: relative;
}

.password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    cursor: pointer;
    font-size: 16px;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.remember-me {
    display: flex;
    align-items: center;
}

.remember-checkbox {
    position: relative;
    margin-right: 8px;
}

.checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.checkbox-custom {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #e5e7eb;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
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

.checkbox-label {
    font-size: 14px;
    color: #6b7280;
    cursor: pointer;
}

.forgot-password {
    font-size: 14px;
    color: #156e4d;
    text-decoration: none;
    transition: all 0.3s;
}

.forgot-password:hover {
    color: #0e5238;
    text-decoration: underline;
}

.login-button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(45deg, #156e4d, #1d8e63);
    color: white;
    border: none;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 6px rgba(21, 110, 77, 0.2);
}

.login-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(21, 110, 77, 0.3);
}

.login-button:active {
    transform: translateY(0);
}

.divider {
    text-align: center;
    margin: 30px 0;
    color: #6b7280;
    display: flex;
    align-items: center;
    font-size: 14px;
}

.divider::before,
.divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #e5e7eb;
}

.divider::before {
    margin-right: 15px;
}

.divider::after {
    margin-left: 15px;
}

.signup-link {
    text-align: center;
    font-size: 14px;
    color: #6b7280;
}

.signup-link a {
    color: #156e4d;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
}

.signup-link a:hover {
    color: #0e5238;
    text-decoration: underline;
}

.spine-icon {
    position: absolute;
    right: 40px;
    top: 40%;
    opacity: 0.06;
    transform: rotate(15deg);
    z-index: 0;
    width: 200px;
    height: 200px;
}

@media (max-width: 992px) {
    .container {
        flex-direction: column;
        max-width: 600px;
    }

    .left-panel {
        padding: 30px;
        display: none;
    }

    .right-panel {
        padding: 40px 30px;
    }
}

@media (max-width: 576px) {
    .right-panel {
        padding: 30px 20px;
    }

    .form-options {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
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
