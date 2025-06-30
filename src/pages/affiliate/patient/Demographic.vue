<script setup>
import { useAppStore } from '@/stores/appStore';
import { usePatientStore } from '@/stores/patientStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import avatar1 from '@images/avatars/profile-5.webp';
const practitionerStore = usePractitionerStore()
const patientStore = usePatientStore()
const { currentUser, currentRole } = useAuth()
const appStore = useAppStore()
const isLoading = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const refInputEl = ref()
const props = defineProps({
    patient: {
        type: Object,
        default: null,
        required: false,
    }
})
const practitionerOptions = computed(() => {
    return practitionerStore.practitioners.map(user => ({
        ...user,
        fullName: `${user.fname || ''} ${user.lname || ''}`.trim(),
    }))
})




const states = statesList;
const accountData = {
    avatarImg: avatar1
}
const accountDataLocal = ref(structuredClone(accountData))
practitionerStore.affiliatePatientPractitionersList(props.patient.provider_id)
onMounted(async () => {
    if (patientStore.demographic.timezone == null) {
        patientStore.demographic.timezone = currentUser.value.time_zone;
    }
    console.log("practitionerOptions", practitionerOptions.value)
    if (patientStore.demographic.profilePicture) {
        accountDataLocal.value.avatarImg = patientStore.demographic.profilePicture
    }
})
const resetAvatar = () => {
    accountDataLocal.value.avatarImg = accountData.avatarImg
}

const file = ref(null);
const changeAvatar = async (event) => {
    file.value = event.target.files[0];
    console.log("file", file.value);
    const fileReader = new FileReader()
    const files = event.target.files;
    if (files && files.length) {
        fileReader.readAsDataURL(files[0])
        fileReader.onload = async () => {
            if (typeof fileReader.result === 'string')
                accountDataLocal.value.avatarImg = fileReader.result
            console.log("asds", accountDataLocal.value.avatarImg);
        }
    }
};


const timezoneMap = [
    { title: 'EST', value: 'America/New_York' },
    { title: 'PST', value: 'America/Los_Angeles' },
    { title: 'CST', value: 'America/Chicago' },
    { title: 'MST', value: 'America/Denver' },
    { title: 'UTC', value: 'UTC' },
]

const formatPhoneNumber = (inputValue) => {
    const numericValue = inputValue.replace(/\D/g, '');
    if (numericValue.length <= 10) {
        return numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else {
        const truncatedValue = numericValue.slice(0, 10);
        return truncatedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};

const updatePhone = (field, event) => {
    const formattedValue = formatPhoneNumber(event.target.value);
    if (field === 'preferredPhone') {
        patientStore.demographic.preferredPhone = formattedValue;
    } else if (field === 'alternativePhone') {
        patientStore.demographic.alternativePhone = formattedValue;
    } else if (field === 'textmsgNumber') {
        patientStore.demographic.textmsgNumber = formattedValue;
    }
    else if (field === 'emergencyContactNumber') {
        patientStore.demographic.emergencyContactNumber = formattedValue;
    }
};


const saveAndClose = async () => {
    if (await onSubmit())
        patientStore.isDrawerOpen = false
}

const onSubmit = async () => {
    isLoading.value = true;
    return refForm.value?.validate().then(async ({ valid }) => {
        if (valid) {
            let formData = null;
            if (file.value) {
                formData = new FormData();
                formData.append('document', file.value);
                formData.append('type', 'avatar');
                console.log("formData", formData);
            }
            return patientStore.affiliateSaveDemographic(
                formData,
            )

        } else {
            return false;
        }


    })



}

const allowPositiveNumbers = (event) => {
    const value = event.target.value;
    event.target.value = value.replace(/\D/g, '');
};
resetAvatar();
</script>
<template>

    <VCardText class="d-flex pl-0 pt-0">
        <!-- 👉 Avatar -->

        <VAvatar rounded size="115" class="me-5" :image="accountDataLocal.avatarImg" />

        <!-- 👉 Upload Photo -->
        <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-4">
                <VBtn color="primary" size="small" @click="refInputEl?.click()">
                    <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                    <span class="d-none d-sm-block"> {{ $t('Upload new photo') }}</span>
                </VBtn>

                <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
                    @input="changeAvatar">

                <VBtn type="reset" size="small" color="secondary" variant="tonal" @click="resetAvatar">
                    <span class="d-none d-sm-block"> {{ $t('Reset') }}</span>
                    <VIcon icon="tabler-refresh" class="d-sm-none" />
                </VBtn>
            </div>

            <p class="text-body-1 mb-0">
                {{ $t('Allowed JPG, GIF or PNG. Max size of 800K') }}

            </p>
        </form>
    </VCardText>
    <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
        <VRow>

            <!-- 👉 Full name -->
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.firstName" :rules="[requiredValidator]"
                    :label="$t('First Name')" :placeholder="$t('First Name')" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.middleName" :label="$t('Middle Name')"
                    :placeholder="$t('Middle Name')" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.lastName" :rules="[requiredValidator]"
                    :label="$t('Last Name')" :placeholder="$t('Last Name')" />
            </VCol>

            <!-- 👉 Username -->
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.preferredName" :label="$t('Preferred Name')"
                    :placeholder="$t('preferred Name')" />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.email" :rules="[emailValidator]" :label="$t('Email')"
                    :placeholder="$t('Email')" />
            </VCol>

            <VCol cols="12" md="6">
                <AppSelect v-model="patientStore.demographic.timezone" :label="$t('Timezone')"
                    :placeholder="$t('Timezone')" :rules="[requiredValidator]" :items="timezoneMap" item-title="title"
                    item-value="value" />
            </VCol>

            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.contactMethod" :label="$t('Contact Method')"
                    :placeholder="$t('Contact Method')"
                    :items="['Pre Contact Method', 'Email', 'Phone', 'Email/Phone']" />
            </VCol>

            <!-- 👉 Contact -->
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.personalID" type="number" :label="$t('Personal ID')"
                    :placeholder="$t('Personal ID')" @input="allowPositiveNumbers" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.dateOfBirth" type="date" :rules="[requiredValidator]"
                    :label="$t('Date Of Birth')" :placeholder="$t('Date Of Birth')" />
            </VCol>

            <!-- 👉 Role -->
            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.sexatBirth" :label="$t('Sex at Birth')"
                    :placeholder="$t('Sex at Birth')" :items="['Male', 'Female', 'Other']" />
            </VCol>

            <!-- 👉 Plan -->
            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.genderIdentity" :label="$t('Gender Identity')"
                    :placeholder="$t('Gender Identity')" :items="['Choose Not to disclose',
                        'Male',
                        'Female',
                        'FTM(Female-to-male/Transgender Male/Trans Man)',
                        'MTF(Male-to-female/Transgender Female/Trans Women)',
                        'Genderqueer',
                        'Unknown'
                    ]" />
            </VCol>

            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.race" :label="$t('Race')" :placeholder="$t('Race')"
                    :items="['American Indian or Alaska Native', 'Asian', 'Black or African Amercian', 'White', 'Hispanic or Latino', 'Native Hawaiian or Other Pacfic Islander', 'Unknown']" />
            </VCol>

            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.pronoun" :label="$t('Pronoun')"
                    :placeholder="$t('Pronoun')" :items="['He', 'She', 'They', 'Unknown']" />
            </VCol>
            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.AgeGroup" :label="$t('Age Group')"
                    :placeholder="$t('Age Group')" :items="['Child', 'Adult']" />
            </VCol>

            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.preferredPhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                    :rules="[requiredValidator, validUSAPhone]" :label="$t('Preferred Phone')" max="14"
                    @input="(e) => updatePhone('preferredPhone', e)" placeholder="i.e. (000) 000-0000" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.alternativePhone" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                    :rules="[validUSAPhone]" :label="$t('Alternative Phone')" max="14"
                    @input="(e) => updatePhone('alternativePhone', e)" placeholder="i.e. (000) 000-0000" />
            </VCol>

            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.textmsgNumber" pattern="^\(\d{3}\) \d{3}-\d{4}$"
                    :rules="[validUSAPhone]" :label="$t('Text Msg Number')" max="14"
                    @input="(e) => updatePhone('textmsgNumber', e)" placeholder="i.e. (000) 000-0000" />
            </VCol>

            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.address" :rules="[requiredValidator]"
                    :label="$t('Address')" :placeholder="$t('Address')" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.city" :rules="[requiredValidator]" :label="$t('City')"
                    :placeholder="$t('City')" />
            </VCol>
            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.state" :label="$t('State')" :placeholder="$t('State')"
                    :rules="[requiredValidator]" :items="states" item-title="name" item-value="abbreviation" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.zipcode" type="number" :rules="[requiredValidator]"
                    :label="$t('Zipcode')" :placeholder="$t('Zipcode')" />
            </VCol>
            <!-- <VCol cols="6">
                <AppSelect
                  v-model="patientStore.demographic.primaryPractitioner"
                  label="Primary Practitioner"
                  placeholder="Primary Practitioner"
                  :items="['David Robison', 'Patient Testing']"
                />
              </VCol> -->
            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.primaryPractitioner" :rules="[requiredValidator]"
                    :label="$t('Primary Practitioner')" :placeholder="$t('Primary Practitioner')"
                    :items="practitionerOptions" item-title="fullName" item-value="id" />
            </VCol>

            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.primaryCarePhysician"
                    :label="$t('Primary Care Physician')" :placeholder="$t('Primary Care Physician')" />
            </VCol>

            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.guardian" :label="$t('Guardian')"
                    :placeholder="$t('Guardian')" />
            </VCol>

            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.emergencyContactNumber"
                    pattern="^\(\d{3}\) \d{3}-\d{4}$" :rules="[validUSAPhone]" :label="$t('Emergency Contact Number')"
                    max="14" @input="(e) => updatePhone('emergencyContactNumber', e)"
                    placeholder="i.e. (000) 000-0000" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.emergencyContactNameRelation"
                    :label="$t('Emergency Contact Name Relation')"
                    :placeholder="$t('Emergency Contact Name Relation')" />
            </VCol>

            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.patientMaritalStatus" :label="$t('Patient Marital Status')"
                    :placeholder="$t('Patient Marital Status')"
                    :items="['Single', 'Married', 'Divorced', 'Seperated', 'Widow', 'Cohabitating', 'Partner', 'Other']" />
            </VCol>
            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.occupation" :label="$t('Occupation')"
                    :placeholder="$t('Occupation')"
                    :items="['Occupation', 'Employed', 'UnEmployed', 'Full Time Student', 'Part Time Student', 'Retired']" />
            </VCol>
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.referredBy" :label="$t('Referred By')"
                    :placeholder="$t('Referred By')" />
            </VCol>

            <VCol cols="12">
                <v-textarea v-model="patientStore.demographic.patientNote" :label="$t('PatientNotes')" rows="5"
                    :placeholder="$t('PatientNotes')" />
            </VCol>
            <VCol cols="12">{{ $t('Add Credentials') }}</VCol>
            <!-- <VCol cols="6">
        <AppTextField v-model="patientStore.demographic.username" label="Username" placeholder="Username" />
      </VCol> -->
            <VCol cols="6">
                <AppTextField v-model="patientStore.demographic.password" :label="$t('Password')"
                    :placeholder="$t('Password')" />
            </VCol>
            <VCol cols="6">
                <AppSelect v-model="patientStore.demographic.status" :label="$t('Status')" :rules="[requiredValidator]"
                    :placeholder="$t('Status')" :items="['Active', 'InActive']" />
            </VCol>
            <VCol cols="12">
                <VCheckbox v-model="patientStore.demographic.isportalAccess" :label="$t('Access To Patient Portal')" />
            </VCol>


            <!-- <VCheckbox v-model="patientStore.demographic.status" label="InActive" /> -->
            <VCol cols="12">
                <VBtn @click="saveAndClose" :disabled="appStore.showLoader" class="me-3">
                    {{ $t('Save and Close') }}
                </VBtn>
                <VBtn @click="onSubmit()" :disabled="appStore.showLoader" class="me-3">
                    {{ $t('Save') }}
                </VBtn>
                <VBtn type="reset" variant="tonal" color="error" class="me-3 mt-1"
                    @click="patientStore.isDrawerOpen = false">
                    {{ $t('Close') }}

                </VBtn>
            </VCol>
        </VRow>
    </VForm>
</template>
