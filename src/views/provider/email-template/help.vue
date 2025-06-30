<script setup>
</script>

<template>
  <VCard>
    <VCardText>
      {{ $t(`This document outlines the email templates used in the system and the variables required for each template.
      The variables are dynamically inserted into the email content to personalize the messages.`) }}
    </VCardText>
    <VCardText v-html="` {{ $patient->fname }},  {{ $patient->lname }} {{  $patient->email }}
         {{  $mail }}`"></VCardText>

    <VCardText v-html="`{{ $appointment->pc_eventDate }},  {{ $appointment_date }} {{  $appointment_time }}
          {{  $appointment_link }}, `"></VCardText>


    <VCardText v-html="`{{ $appointment->pc_eventDate }},  {{ $appointment_date }} {{  $appointment_time }}
          {{  $appointment_link }},`"></VCardText>

    <VCardText v-html="`{{ $task }}`"></VCardText>


  </VCard>
</template>
