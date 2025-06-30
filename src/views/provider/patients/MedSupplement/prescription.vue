<script setup>
import { useMedicationStore } from '@/stores/medicationStore';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';

const medicationStore = useMedicationStore()
const firstName = ref('')
const email = ref('')
const mobile = ref()
const password = ref()
const checkbox = ref(false)
const getPrintData = ref([]);

const props = defineProps({
    itemProps: {
        type: Array,
        required: false,
    },
})


const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust the days and months if negative
    if (days < 0) {
        months -= 1;
        let previousMonth = today.getMonth() - 1;
        if (previousMonth < 0) {
            previousMonth = 11; // December
        }
        const daysInPreviousMonth = new Date(today.getFullYear(), previousMonth + 1, 0).getDate();
        days += daysInPreviousMonth;
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Return the largest unit that is non-zero
    if (years > 0) {
        return `${years} year${years !== 1 ? 's' : ''}`;
    } else if (months > 0) {
        return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
        return `${days} day${days !== 1 ? 's' : ''}`;
    }
};

const changeDateFormat = (dateFormat) => {
    const dateParts = dateFormat.split('-'); // Assuming date is in yyyy-mm-dd format
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]); // No need for padding
    const day = parseInt(dateParts[2]); // No need for padding

    // Create a new Date object with the parsed values
    const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript Date object

    // Format the date as mm-dd-yyyy
    const formattedDate = month + '-' + day + '-' + date.getFullYear();

    return formattedDate;
}


</script>
<template>
    <VCardText>
    <!-- <VCard class="px-3"> -->
    <div class="data pb-0">
        <div
            class="invoice-header-preview d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row  backgroundColor gap-6 rounded pa-5 mb-1">
            <!-- 👉 Left Content -->
            <div>
                <h3 class="mb-1">
                    {{ $t(' {practitioner_name}', { 'practitioner_name': props.itemProps.practitioner_name }) }}
                </h3>
            </div>

            <!-- 👉 Right Content -->
            <div>
                <!-- 👉 Invoice ID -->

                <div class="d-flex align-center app-logo">
                    <!-- 👉 Logo -->
                    <VNodeRenderer :nodes="themeConfig.app.logo" />

                    <!-- 👉 Title -->
                    <h6 class="app-logo-title">
                        {{ themeConfig.app.title }}
                    </h6>
                </div>

                <!-- 👉 Issue Date -->
                <!-- <h6 class="text-h6 font-weight-regular">
                    <span>Date Issued: </span>
                    <span>347895648</span>
                </h6> -->

                <!-- 👉 Due Date -->
                <!-- <h6 class="text-h6 font-weight-regular">
                    <span>Due Date: </span>
                    <span>76576</span>
                </h6> -->
            </div>
        </div>
        <div style="line-height:25px;">
            <v-row class="px-3">

                <v-col cols="12" md="12" class="d-flex   align-items-center pb-0 pl-0 pr-0">
                    <label class="v-label text-body-2 text-high-emphasis text-primary-sign print_info"
                        for="mobile">{{ $t('Name:') }} </label>
                    <div class="border-bottom font-style"><span class="bottomlined_value">
                            {{ props.itemProps.patient_name }}
                            <!-- {{ props.itemProps.first_name }} {{ props.itemProps.last_name }}-->
                        </span></div>
                    <!-- <v-text-field class="cross text-primary" variant="underlined"></v-text-field> -->
                </v-col>
            </v-row>
            <!-- <v-row>
                <v-col cols="12" md="12" class="cross d-flex   align-items-center pb-0">
                    <label class="v-label text-body-2 text-high-emphasis text-primary-sign print_info"
                        for="mobile">Address:
                    </label>
                    <div class="border-bottom font-style">
                        <span class="bottomlined_value">
                            {{ props.itemProps.patient_address }}
                        </span>
                    </div>
                </v-col>
            </v-row> -->
            <v-row>
                <v-col cols="4" md="4" sm="4" class="cross d-flex   align-items-center pb-0">
                    <label class="v-label text-body-2 text-high-emphasis text-primary-sign print_info" for="mobile">{{ $t('Dob:') }}
                    </label>
                    <div class="border-bottom fs-0 font-style"><span class="bottomlined_value">

                            {{
                                calculateAge(props.itemProps.patient_dob)
                            }}
                        </span>
                    </div>
                    <!-- <v-text-field class="text-primary" variant="underlined"></v-text-field> -->
                </v-col>

                <v-col cols="4" md="4" sm="4" class="cross d-flex w-100   align-items-center pb-0">
                    <label class="v-label text-body-2 text-high-emphasis text-primary-sign print_info" for="mobile">{{ $t('Sex:') }}
                    </label>
                    <div class="border-bottom font-style"><span class="bottomlined_value">
                            {{ props.itemProps.gender
                            }}
                        </span> </div>
                    <!-- <v-text-field class="text-primary" variant="underlined"></v-text-field> -->
                </v-col>

                <v-col cols="4" md="4" sm="4" class="cross d-flex   align-items-center pb-0 pl-0">
                    <label class="v-label text-body-2 text-high-emphasis text-primary-sign print_info"
                        for="mobile">{{ $t('Date:') }}  </label>
                    <div class="border-bottom font-style pl-2"><span class="bottomlined_value">
                            {{
                                props.itemProps.date }}
                        </span> </div>
                </v-col>
            </v-row>
        </div>
        <v-row class="px-3 py-5 mt-5 pb-5 mb-9">
            <div v-for="prescription in medicationStore.prescription.newPrescription" :key="prescription.medicine_id"
                class="w-100 ml-5">
                <!-- Medicine Name -->
                <v-col cols="12" md="12" sm="12" class="cross d-flex align-items-center pb-0">
                    <div class="prescription font-style ml-5 mt-3 text-prescriptin-color">
                        <span class="bottomlined_value">
                            {{ prescription.drug_name }} {{ prescription.variation_name }}
                        </span>
                    </div>
                </v-col>

                <!-- Prescription Dose, Frequency, Duration -->
                <v-col cols="12" md="12" sm="12" class="cross d-flex align-items-center pb-0">
                    <div class="prescription font-style ml-5 mt-3 text-prescriptin-color">
                        <span class="bottomlined_value">
                            {{ prescription.dose }} - {{ prescription.duration }}
                        </span>
                        <span class="bottomlined_value">
                            {{ prescription.frequency }}
                        </span>
                    </div>
                    <div class="prescription font-style ml-5 mt-3 text-prescriptin-color">
                        <span class="bottomlined_value">
                            {{ prescription.when }}
                        </span>
                    </div>
                    <div class="prescription font-style ml-5 mt-3 text-prescriptin-color">
                        <span class="bottomlined_value">
                            {{ prescription.notes }}
                        </span>
                    </div>

                </v-col>
            </div>
        </v-row>

        <v-row class="px-3 py-5 mt-5 pb-5 mb-9"></v-row>

        <v-row class="px-3 py-5 mt-5 pb-5 mb-9"></v-row>
        <v-row class="p-0 py-5 m-0 pt-1 ">
            <v-col cols="6" offset="6" class="cross bottom-input d-flex align-items-center">
                <!-- <label class=" text-body-2 text-primary-color mb-0 physician-sign" for="physician-sign">Physician
                    sign's:</label> -->
                <div class="signature-border-bottom font-style ">
                    <span class="d-flex justify-end mt-2">
                        <img :src="medicationStore.signature" width="150" />
                        <!-- {{ props.itemProps.agent_sign }} -->
                    </span>
                </div>
                <!-- <v-text-field class="cross text-primary" variant="underlined" id="physician-sign"></v-text-field> -->
            </v-col>


        </v-row>
        <h3 class="mb-1 text-right">
            {{ props.itemProps.practitioner_name }}
        </h3>






    </div>
    </VCardText>
    <!-- </VCard> -->
</template>
<style scoped>
.backgroundColor {
    background-color: #e0f2ef;
}

.physician-sign {
    width: 162px;

}

.sr-no {
    width: 60px;
}

.ptr-no {
    width: 67px;
}

.lic-no {
    width: 56px;
}

.print_info {
    position: relative;
    top: 7px;
}

.border-bottom1 {
    border-bottom: 1px solid black;
    /* Adjust thickness and color as needed */
    width: 100%;
    /* font-weight: 800; */
    /* Ensure the underline spans the entire width */
}

.data {
    display: block;
    position: relative;
    height: 100%;
    width: 100%;


}

.data::after {
    content: "";
    background: url('@images/watermark.png') no-repeat;
    /* color: red; */
    opacity: 0.1;
    top: 50%;
    left: 30%;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: 1;
    height: 50%;
    width: 50%;
}

@media screen and (max-width:567px) {
    .data::after {
        content: "";
        background: url('@images/watermark.png') no-repeat;
        opacity: 0.1;
        top: 50%;
        left: 20%;
        bottom: 0;
        right: 0;
        position: absolute;
        z-index: 1;
        height: 50%;
        width: 100%;
    }
}

.font-style {
    font-size: 12px;
}

h1::after {

    opacity: 0.2;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    height: 100%;
    width: 100%;
}

@font-face {
    font-family: 'ReceiptDemo';
    src: url('@/assets/fontawesome/ReceiptDemo.ttf') format('truetype');
}

@font-face {
    font-family: 'Shatomi-PKrrg';
    src: url('@/assets/fontawesome/Shatomi-PKrrg.ttf') format('truetype');
}

@font-face {
    font-family: 'doctor-signature';
    src: url('@/assets/fontawesome/doctor-signature.ttf') format('truetype');
}


.bottomlined_value {
    font-family: 'Shatomi-PKrrg' !important;
    position: relative;
    top: 5px;
    left: 10px;
}

.cross {
    padding-top: 0px;
    padding-bottom: 0px
}

label.v-label.text-body-2.text-high-emphasis.text-primary {
    position: relative;
    top: 18px;
    right: 5px;
}

.text-primary-color {
    position: relative;
    top: 5px;
    /* right: 0px; */
    /* left: 10px; */
    color: #909fea !important;
    font-family: 'ui-serif !important' !important;
    /* font-size: 15px !important; */
}

.text-primary-sign {
    position: relative;
    top: 8px;
    /* right: 0px; */
    /* left: 10px; */
    color: #909fea !important;
    /* font-family: 'ui-serif !important' !important; */
}

.text-prescriptin-color {
    position: relative;
    top: 7px;
    /* right: 0px; */
    /* left: 10px; */
    color: #060606 !important;
    font-family: 'ReceiptDemo' !important;
}

span {
    font-family: 'Shatomi-PKrrg' !important;
}

.border-bottom {
    border-bottom: 1px solid #909fea !important;
    width: 100%;
    /* margin-left: 3px; */
    /* margin-top: 5px; */
    font-weight: 800;
    color: #060606 !important;
    font-family: 'Shatomi-PKrrg' !important;
    /* font-size: 15px; */
}

.signature-border-bottom {
    /* border-bottom: 1px solid #909fea !important; */
    width: 100%;
    /* margin-left: 3px; */
    /* margin-top: 5px; */
    font-weight: 800;
    color: #060606 !important;
    font-family: 'Shatomi-PKrrg' !important;
    /* font-size: 15px; */
}

.prescription {
    /* border-bottom: 1px solid #7680AD !important; */
    width: 100%;
    margin-left: 10px;
    margin-top: 5px;
    font-weight: 800;
    font-family: 'Shatomi-PKrrg' !important;
}

.field-laypout {
    padding-top: 0px
}

.v-text-field--underlined .v-input__control::before {
    border-bottom-width: 100px;
    /* Adjust the thickness as needed */
}
</style>
