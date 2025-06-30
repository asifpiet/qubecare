<script setup>
definePage({
  meta: {
    layout: 'blank',
    public: true
  },
})
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const setTokens = (accessToken) => {
  const cookieOptions = { maxAge: undefined, path: '/' }  // Session cookie
  useCookie('patient-accessToken', cookieOptions).value = accessToken
  useCookie('patient-refreshToken', cookieOptions).value = accessToken
}

// router.replace('/patient/thankyou')
const url = urlSaveDecode(route.query.url);

let res = await $api(url, {
  method: 'GET',
})
console.log('res', res);

let accessToken = res.accessToken;
let appointmentId = null;
if (res.url) {
  const urlParams = new URLSearchParams(res.url.split('?')[1]);
  appointmentId = urlParams.get('appointment_id');
}

if (appointmentId) {
  try {
    const verifyRes = await $api(`/appointment/verify/${appointmentId}`, {
      method: 'GET',
    });
    console.log('Appointment verification:', verifyRes);
    if (verifyRes.status === 'ok') {
      setTokens(accessToken)
      let newUrl = res.url
      router.replace(newUrl)
    } else {
      // Verification failed
      router.replace('/patient/link-expired?message=appointment_verification_failed');
    }

    // Continue with redirect after verification
    // router.replace(res.url);
  } catch (error) {
    console.error('Error verifying appointment:', error);
    router.replace('/patient/link-expired?message=appointment_verification_failed');
  }
}






</script>
<template></template>
