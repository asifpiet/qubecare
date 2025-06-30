<template>  
  <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">  
    <div class="p-6 text-gray-900">  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">  
        <a  
          v-for="user in users"  
          :key="user.id"  
          @click="selectUser(user)"  
          class="bg-gray-100 p-4 rounded-lg shadow-md block hover:bg-gray-200 cursor-pointer"  
        >  
          <h3 class="text-lg font-semibold">{{ user.fullName }}</h3>  
          <p>{{ user.email }}</p>  
        </a>  
      </div>  
    </div>  
  </div>  
</template>  

<script setup>  
import axios from 'axios';
import { onMounted, ref } from 'vue';

const emit = defineEmits(['user-selected']);  
const users = ref([]);  

const fetchUsers = async () => {  
  try {  
    const response = await axios.get('https://apiopenerm.codelfi.com/api/patients', {  
      headers: {  
        Authorization: `Bearer ${useCookie('accessToken').value}`,
        AccessToken:`${useCookie('accessToken').value}`  // Set the Bearer token in the headers
      },  
    });  
    users.value = response.data.data;  
  } catch (error) {  
    console.error("Failed to fetch users:", error);  
  }  
};  

const selectUser = (user) => {  
  emit('user-selected', user);  
};  

onMounted(() => {  
  fetchUsers();  
});  
</script>  

<style scoped>  
/* Add any styles specific to this component here */  
</style>
