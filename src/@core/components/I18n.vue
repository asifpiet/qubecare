<script setup>
import { useProviderStore } from '@/stores/providerStore';
import { useRouter } from 'vue-router';
const providerStore = useProviderStore()

const router = useRouter();
const route = useRoute()
const currentPath = route.path;
const props = defineProps({
  languages: {
    type: Array,
    required: true,
  },
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
})

const { locale } = useI18n({ useScope: 'global' })

watch(
    () => locale.value,
    (newLang) => {
      providerStore.langauge = newLang;
      console.log("Locale changed to Qube i18n:", newLang);

      // calendarOptions.locale = newLang;
      // console.log("Locale changed to:", calendarOptions.locale);
    }
  );

</script>

<template>
  <IconBtn :class="[
    currentPath === '/provider/login' ||
    currentPath === '/provider/register' ||
    currentPath === '/partner/login' ||
    currentPath === '/partner/register' ||
    currentPath === '/patient/login' ||
    currentPath === '/patient/register' || 
    currentPath === '/affiliate/register' ||
    currentPath === '/patient/cart' ||
    currentPath === '/provider/forgot-password' || 
    currentPath === '/patient/forgot' || 
    currentPath === '/provider/register-setup' || 
    currentPath === '/patient/products' ||
    currentPath === '/patient/payment' ||
    currentPath === '/patient/schedule' || 
    currentPath === '/patient/thankyou' || 
    
    currentPath === '/affiliate/login' 
      ? 'mx-9' : 'mx-0',
    'language-icon'
  ]">
    <VIcon icon="tabler-world" />
    <span v-if="currentPath === '/provider/login' ||
     currentPath === '/provider/register' ||
     currentPath === '/provider/register-setup' || 
      currentPath === '/partner/register' || 
      currentPath === '/partner/login' ||
      currentPath === '/patient/login' ||
      currentPath === '/patient/register' || 
      currentPath === '/affiliate/register' || 
      currentPath === '/provider/forgot-password' || 
      currentPath === '/patient/payment' ||
      currentPath === '/patient/cart' || 
      currentPath === '/patient/forgot' || 
      currentPath === '/patient/products' ||
      currentPath === '/patient/schedule' ||
      currentPath === '/patient/thankyou' || 
      
      
      
      
      currentPath === '/affiliate/login'">{{ providerStore.label}}</span> <!-- Removed trailing || -->
    <!-- Menu -->
    <VMenu
      activator="parent"
      :location="props.location"
      offset="30px"
      width="175"
    >
      <!-- List -->
      <VList
        :selected="[locale]"
        color="primary"
      >
        <!-- List item -->
        <VListItem
          v-for="lang in props.languages"
          :key="lang.i18nLang"
          :value="lang.i18nLang"
          @click="[locale = lang.i18nLang, providerStore.label= lang.label]"
          class="language-item"
        >
          <!-- Language label -->
          <VListItemTitle>
            {{ lang.label }}
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
<style scoped>
.language-icon:hover {
  background-color: transparent !important; /* Replace with your desired color */
}

/* You can also change the hover color for list items */
.language-item:hover {
  background-color: transparent !important;
}
</style>
