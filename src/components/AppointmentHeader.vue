<script setup>
import { usePatientStore } from '@/stores/patientStore';
import actions from '@/views/provider/patients/actions.vue';

const patientStore = usePatientStore()
const isActionDialogVisible = ref(false)

const calculateAge = (birthDateString = null) => {
    if (!birthDateString) return null
    // Split the birth date string
    const [birthYear, birthMonth, birthDay] = birthDateString.split("-").map(Number);

    // Get current date from the system using a basic approximation
    const currentDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const [currentYear, currentMonth, currentDay] = currentDate.split("-").map(Number);

    // Calculate age
    let age = currentYear - birthYear;

    // Adjust if the birthday hasn't occurred yet this year
    if (
        currentMonth < birthMonth ||
        (currentMonth === birthMonth && currentDay < birthDay)
    ) {
        age--;
    }

    return age;
}
</script>

<template>
    <VCard>

        <VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-4">
            <div class="d-flex h-0">
                <VAvatar rounded size="50" :image="patientStore.demographic.profilePicture ?? '/images/avatar.png'"
                    class="" />
            </div>

            <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">

                <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3">
                    <div class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-3">
                        <span class="align-center">
                            <h4>{{ patientStore.demographic?.fullName }}</h4>
                            <div class="text-body-1 font-weight-medium">
                                {{ patientStore.demographic?.email }}
                            </div>
                        </span>

                        <span class="align-center">
                            <h5>Gender</h5>
                            <div class="text-body-1 font-weight-medium">
                                {{ patientStore.demographic?.genderIdentity }}
                            </div>
                        </span>

                        <span class="align-center">
                            <h5>Age</h5>
                            <div class="text-body-1 font-weight-medium">
                                {{ calculateAge(patientStore.demographic.dateOfBirth) ?
                                    `${calculateAge(patientStore.demographic.dateOfBirth)}Yrs` : '' }}
                            </div>
                        </span>

                        <span class="align-center">
                            <h5>DOB</h5>
                            <div class="text-body-1 font-weight-medium">
                                {{ dateFormat(patientStore.demographic?.dateOfBirth) }}
                            </div>
                        </span>

                        <span class="align-center">
                            <h5>Phone</h5>
                            <div class="text-body-1 font-weight-medium">
                                {{ patientStore.demographic?.preferredPhone }}
                            </div>
                        </span>
                    </div>

                    <!-- <VBtn prepend-icon="tabler-plus" variant="outlined">
                        New Appointment
                    </VBtn> -->
                    <VBtn icon="tabler-dots" rounded color="secondary" variant="outlined"
                        @click="[isActionDialogVisible = true]" />
                </div>
            </div>
        </VCardText>
    </VCard>
    <actions :patient="patientStore" v-model:showDialog="isActionDialogVisible" />
</template>

<style lang="scss">
.user-profile-avatar {
    border: 5px solid rgb(var(--v-theme-surface));
    background-color: rgb(var(--v-theme-surface)) !important;
    inset-block-start: -3rem;

    .v-img__img {
        border-radius: 0.125rem;
    }
}
</style>
