<script setup>  
import axios from 'axios';
import { ref } from 'vue';

const name = ref('');  
const email = ref('');  
const priority = ref('');  
const suggestions = ref([]);  
const error = ref('');  
const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // Use environment variable for API key  

const priorityOptions = ['High', 'Medium', 'Low'];  

// Function to fetch name suggestions  
const fetchSuggestions = async () => {  
  if (name.value.length > 2) {  
    try {  
      const response = await axios.post(  
        'https://api.openai.com/v1/chat/completions',  
        {  
          model: 'gpt-3.5-turbo',  
          messages: [{ role: 'user', content: `Suggest names similar to: ${name.value}` }],  
          max_tokens: 10,  
        },  
        {  
          headers: {  
            'Authorization': `Bearer ${apiKey}`,  
            'Content-Type': 'application/json'  
          }  
        }  
      );  
      suggestions.value = response.data.choices.map(choice => choice.message.content.trim());  
    } catch (err) {  
      error.value = "Error fetching suggestions: " + (err.response ? err.response.data : err.message);  
    }  
  } else {  
    suggestions.value = [];  
  }  
};  

// Select a name suggestion  
const selectSuggestion = (suggestion) => {  
  name.value = suggestion;  
  suggestions.value = [];  
  provideFeedback(`You selected the name: ${suggestion}. Please say your email.`);  
  startListening('email'); // Go directly to email field  
};  

// Submit form function  
const submitForm = () => {  
  console.log({  
    name: name.value,  
    email: email.value,  
    priority: priority.value,  
  });  
  // Implement further form submission logic here (e.g., POST request to a backend)  
  clearForm(); // Clear the form after submission  
};  

// Function to clear the form fields  
const clearForm = () => {  
  name.value = '';  
  email.value = '';  
  priority.value = '';  
  suggestions.value = [];  
  error.value = '';  
  startListening('name'); // Reset and start over  
};  

// Function to provide audio feedback  
const provideFeedback = (message) => {  
  const utterance = new SpeechSynthesisUtterance(message);  
  window.speechSynthesis.speak(utterance);  
};  

// Start listening based on the current field  
const startListening = (field) => {  
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();  
  recognition.continuous = false;  
  recognition.interimResults = false;  

  recognition.onstart = () => {  
    provideFeedback(`Listening for ${field}. Please speak...`);  
  };  

  recognition.onresult = (event) => {  
    const transcript = event.results[0][0].transcript.toLowerCase();  

    if (field === 'name') {  
      name.value = transcript;  
      fetchSuggestions();  // Fetch suggestions after name input  
      provideFeedback(`You said: ${transcript}. Now, please say your email.`);  
      automaticallyAdvanceToNextField('name');  
    } else if (field === 'email') {  
      email.value = transcript;  
      provideFeedback(`You said: ${transcript}. Now, please select your priority.`);  
      automaticallyAdvanceToNextField('email');  
    } else if (field === 'priority') {  
      if (priorityOptions.map(option => option.toLowerCase()).includes(transcript)) {  
        priority.value = transcript.charAt(0).toUpperCase() + transcript.slice(1);  
        provideFeedback(`Priority set to ${priority.value}. Please submit the form.`);  
      } else {  
        error.value = "Unrecognized priority. Please say 'High', 'Medium', or 'Low'.";  
        provideFeedback(error.value);  
      }  
    }  
  };  

  recognition.onerror = (event) => {  
    error.value = "Error recognizing speech: " + event.error;  
    provideFeedback(error.value);  
  };  

  recognition.onend = () => {  
    console.log('Voice recognition ended.');  
  };  

  recognition.start();  
};  

// Function to move to the next input field automatically  
const automaticallyAdvanceToNextField = (currentField) => {  
  if (currentField === 'name') {  
    startListening('email'); // Start listening for email  
  } else if (currentField === 'email') {  
    startListening('priority'); // Start listening for priority  
  }  
};  

// Initialize the listening process by starting with the 'name' prompt  
startListening('name');  

</script>  

<template>  
  <v-container>  
    <v-form @submit.prevent="submitForm">  
      <v-text-field  
        v-model="name"  
        label="Name"  
        @input="fetchSuggestions"  
      ></v-text-field>  

      <v-text-field  
        v-model="email"  
        label="Email"  
      ></v-text-field>  

      <v-select  
        v-model="priority"  
        :items="priorityOptions"  
        label="Priority"  
      ></v-select>  

      <v-btn type="submit" color="primary">Add Patient</v-btn>  
    </v-form>  

    <!-- Display suggestions -->  
    <v-list v-if="suggestions.length">  
      <v-list-item-group>  
        <v-list-item  
          v-for="(suggestion, index) in suggestions"  
          :key="index"  
          @click="selectSuggestion(suggestion)"  
        >  
          <v-list-item-content>{{ suggestion }}</v-list-item-content>  
        </v-list-item>  
      </v-list-item-group>  
    </v-list>  

    <v-alert  
      v-if="error"  
      type="error"  
    >  
      {{ error }}  
    </v-alert>  
  </v-container>  
</template>  

<style scoped>  
/* Add any necessary styles */  
</style>
