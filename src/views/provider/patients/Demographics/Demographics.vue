<script setup>
import { usePatientStore } from '@/stores/patientStore';
const patientStore = usePatientStore()
</script>

<template>
    <VCard>
        <VCardText>
            <VRow>

                <!-- 👉 Full name -->
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.firstName" :rules="[requiredValidator]"
                    :label="$t('First Name')" :placeholder="$t('First Name')" readonly />
                </VCol>
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.middleName" 
                    :label="$t('Middle Name')"
                    :placeholder="$t('Middle Name')" readonly />
                </VCol>
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.lastName" :rules="[requiredValidator]"
                    :label="$t('Last Name')"
                    :placeholder="$t('Last Name')"  readonly />
                </VCol>

                <!-- 👉 Username -->
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.preferredName" :label="$t('Preferred Name')"
                    :placeholder="$t('preferred Name')" readonly />
                </VCol>

                <!-- 👉 Email -->
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.email" :rules="[emailValidator]"  :label="$t('Email')"
                    :placeholder="$t('Email')" readonly />
                </VCol>

                <VCol cols="12" md="6">
                    <AppSelect v-model="patientStore.demographic.timezone"  :label="$t('Timezone')" :placeholder="$t('Timezone')"
                        :rules="[requiredValidator]" :items="timezoneMap" item-title="title" item-value="value"
                        disabled />
                </VCol>

                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.contactMethod":label="$t('Contact Method')"
                    :placeholder="$t('Contact Method')" :items="['Pre Contact Method', 'Email', 'Phone', 'Email/Phone']"
                        disabled />
                </VCol>

                <!-- 👉 Contact -->
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.personalID" type="number" :label="$t('Personal ID')"
                    :placeholder="$t('Personal ID')" readonly />
                </VCol>
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.dateOfBirth" type="date"
                        :rules="[requiredValidator]" :label="$t('Date Of Birth')" :placeholder="$t('Date Of Birth')" readonly />
                </VCol>

                <!-- 👉 Role -->
                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.sexatBirth" :label="$t('Sex at Birth')"
                    :placeholder="$t('Sex at Birth')" :items="['Male', 'Female', 'Other']" disabled />
                </VCol>

                <!-- 👉 Plan -->
                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.genderIdentity" :label="$t('Gender Identity')"
                    :placeholder="$t('Gender Identity')"  :items="['Choose Not to disclose',
                            'Male',
                            'Female',
                            'FTM(Female-to-male/Transgender Male/Trans Man)',
                            'MTF(Male-to-female/Transgender Female/Trans Women)',
                            'Genderqueer',
                            'Unknown'
                        ]" disabled />
                </VCol>

                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.race" disabled :label="$t('Race')" :placeholder="$t('Race')"
                        :items="['American Indian or Alaska Native', 'Asian', 'Black or African Amercian', 'White', 'Hispanic or Latino', 'Native Hawaiian or Other Pacfic Islander', 'Unknown']" />
                </VCol>

                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.pronoun" disabled :label="$t('Pronoun')" :placeholder="$t('Pronoun')"
                        :items="['He', 'She', 'They', 'Unknown']" />
                </VCol>
                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.AgeGroup" disabled :label="$t('Age Group')" :placeholder="$t('Age Group')" :items="['Child', 'Adult']" />
                </VCol>

                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.preferredPhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                        :rules="[requiredValidator, validUSAPhone]" :label="$t('Preferred Phone')" max="14"
                        placeholder="i.e. (000) 000-0000" readonly />
                </VCol>
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.alternativePhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                        :rules="[validUSAPhone]" :label="$t('Alternative Phone')" max="14" placeholder="i.e. (000) 000-0000"
                        readonly />
                </VCol>

                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.textmsgNumber" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                        :rules="[validUSAPhone]" :label="$t('Text Msg Number')" max="14" placeholder="i.e. (000) 000-0000"
                        readonly />
                </VCol>

                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.address" :rules="[requiredValidator]"
                    :label="$t('Address')"
                    :placeholder="$t('Address')"  readonly />
                </VCol>
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.city" :rules="[requiredValidator]" :label="$t('City')"
                    :placeholder="$t('City')" readonly />
                </VCol>
                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.state" :label="$t('State')" :placeholder="$t('State')"
                        :rules="[requiredValidator]" :items="states" item-title="name" item-value="abbreviation"
                        disabled />
                </VCol>
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.zipcode" type="number" :rules="[requiredValidator]"
                    :label="$t('Zipcode')" :placeholder="$t('Zipcode')" readonly />
                </VCol>
                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.primaryPractitioner" :rules="[requiredValidator]"
                    :label="$t('Primary Practitioner')" :placeholder="$t('Primary Practitioner')" :items="practitionerOptions"
                        item-title="fullName" item-value="id" disabled />
                </VCol>

                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.primaryCarePhysician" :label="$t('Primary Care Physician')"
                    :placeholder="$t('Primary Care Physician')" readonly />
                </VCol>

                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.guardian" lab:label="$t('Guardian')"
          :placeholder="$t('Guardian')"
                        readonly />
                </VCol>

                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.emergencyContactNumber"
                        pattern="^\(\d{3}\) \d{3}-\d{4}$" :rules="[validUSAPhone]" :label="$t('Emergency Contact Number')" 
                        max="14" placeholder="i.e. (000) 000-0000" readonly />
                </VCol>
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.emergencyContactNameRelation"
                         :label="$t('Emergency Contact Name Relation')" :placeholder="$t('Emergency Contact Name Relation')"
                        readonly />
                </VCol>

                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.patientMaritalStatus" :label="$t('Patient Marital Status')"
          :placeholder="$t('Patient Marital Status')"
                        :items="['Single', 'Married', 'Divorced', 'Seperated', 'Widow', 'Cohabitating', 'Partner', 'Other']"
                        disabled />
                </VCol>
                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.occupation" :label="$t('Occupation')"
          :placeholder="$t('Occupation')"
                        :items="['Occupation', 'Employed', 'UnEmployed', 'Full Time Student', 'Part Time Student', 'Retired']"
                        disabled />
                </VCol>
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.referredBy" :label="$t('Referred By')"
                    :placeholder="$t('Referred By')" readonly />
                </VCol>

                <VCol cols="12">
                    <v-textarea v-model="patientStore.demographic.patientNote" :label="$t('PatientNotes')" rows="5"
                    :placeholder="$t('PatientNotes')" readonly />
                </VCol>
                <VCol cols="12">{{ $t('Add Credentials') }}</VCol>
                <!-- <VCol cols="6">
        <AppTextField v-model="patientStore.demographic.username" label="Username" placeholder="Username" />
      </VCol> -->
                <VCol cols="6">
                    <AppTextField v-model="patientStore.demographic.password" :label="$t('Password')"
          :placeholder="$t('Password')"
                        readonly />
                </VCol>
                <VCol cols="6">
                    <AppSelect v-model="patientStore.demographic.status" :label="$t('Status')" :rules="[requiredValidator]"
                    :placeholder="$t('Status')" :items="['Active', 'InActive']" disabled />
                </VCol>
                <VCol cols="12">
                    <VCheckbox v-model="patientStore.demographic.isportalAccess" :label="$t('Access To Patient Portal')" />
                </VCol>
            </VRow>
        </VCardText>
    </VCard>
</template>
