import { clinicalProfileService } from '@/services/clinicalProfileService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const generalProfile = {
    smoking: '',
    pastSmoking: '',
    bloodGroup: '',
    generalNotes: '',
    selectedAllergies: [],
    foodAllergyNotes: '',
    additionalFoodAllergies: [],
    additionalDrugAllergies: [],
    isKnownDrugAllergies: '',
    drugAllergyNotes: '',
    // additinalIneffectiveMeds: [],
    ineffectiveMeds: [],
    ineffectiveMedsNotes: '',
}
const diet = {
    selected_deit_restrictions: [],
    restrictions_notes: '',
}
const sections = [
    { title: 'Xrays and Special Studies', info: '' },
    { title: 'Surgical History', info: '' },
    { title: 'Antibiotic History', info: '' },
    { title: 'Accidents/Injuries/Transfusions', info: '' },
    { title: 'Hospitalization', info: '' },
    { title: 'Screening Tests', info: '' },
    { title: 'Dental History', info: '' },
    { title: 'Recent Lab Work', info: '' },
]

const Immunizations = {
    selectedImmunizations: [],
    selectedCovidVaccine: '',
    immunizationsNotes: '',
    immunizationsEntries: [
        {
            date: '',
            name: '',
            nameKey: 'UNK',
            practitionerLocation: '',
            administered: 'false',
            reason: '',
            type: '',
            typeKey: 'UNK',
            administeredLocation: '',
            administeredLocationKey: 'UNK',
            fundingSource: '',
            vfcEligibility: '',
            batch: '',
            manufacturer: '',
            manufacturerKey: 'UNK',
            expiryDate: '',
            administeredBy: '',
            consent: '',
            quantity: '',
            comments: '',
            manufacturer: '',
            manufacturerKey: 'UNK',
            expiryDate: '',
            administeredBy: '',
            consent: '',
            quantity: '',
            comments: '',
        }
    ],
    sections: sections
}

const patientFamilyHisotry = {
    items: [
        {
            conditions: '', relations: ''
        }

    ],
    familyHistoryNotes: ''
}
const personalFamilyHistoy = {
    Mother: '',
    Father: '',
    Sibling: '',
    MaternalGrandmother: '',
    MaternalGrandfather: '',
    PaternalGrandmother: '',
    PaternalGrandfather: '',
    selectedConditions: []
}
const reproductive = {
    sexuallyActive: '',
    pastSexuallyActive: '',
    sexualOrientation: '',
    periods_started_at_age: '',
    periodLength: '',
    lastDateofMenses: '',
    breastselfExams: '',
    menopause: '',
    lastPapSmear: '',
    childbirth: '',
    misscarriages: '',
    hormones: '',
    mammography: '',
    abnormalVaginalBleeding: '',
    notes: '',


}


export const useClinicalProfileStore = defineStore('clinicalProfile', {

    state: () => ({
        isDrawerOpen: false,
        patients: [],
        generalProfile: { ...generalProfile },
        diet: { ...diet },
        Immunizations: { ...Immunizations },
        patientFamilyHisotry: { ...patientFamilyHisotry },
        personalFamilyHistoy: { ...personalFamilyHistoy },
        reproductive: { ...reproductive },
    }),
    actions: {

        async getClinicalProfile(id) {
            console.log("getClinicalProfileid", id);
            showLoader()
            await clinicalProfileService.getGeneralProfile(id).then((response) => {
                if (response && response.id)
                    this.generalProfile = response;
                console.log("generalProfile", this.generalProfile);
            })
            await clinicalProfileService.getDiet(id).then((response) => {
                if (response)
                    this.diet = response;
                console.log("diet", this.diet);
            })
            await clinicalProfileService.getImmunization(id).then((response) => {
                if (response && Object.keys(response).length > 0) {



                    if (response.sections && response.sections.length > 0) {
                        response.sections = response.sections.map(section => ({
                            title: section.title,
                            info: section.description || '' // Map description to info
                        }));
                    } else {
                        response.sections = sections;
                    }
                    this.Immunizations = response;
                    console.log("ImmunizationsDB", this.Immunizations);
                } else {
                    console.log("responseNull", this.Immunizations);
                    // Initialize with default structure if no data returned
                    this.Immunizations = {
                        selectedImmunizations: [],
                        selectedCovidVaccine: '',
                        immunizationsNotes: '',
                        immunizationsEntries: JSON.parse(JSON.stringify(Immunizations.immunizationsEntries)),
                        sections: sections || []
                    };
                }





                // console.log("Immunizations", this.Immunizations, response.sections.length);
            })
            await clinicalProfileService.getPersnalFamilyHistory(id).then((response) => {
                if (response && response.data)
                    this.personalFamilyHistoy = response.data;
                console.log("personalFamilyHistoy", this.personalFamilyHistoy);
            })
            await clinicalProfileService.getReproductive(id).then((response) => {
                if (response) {
                    console.log("Reproductibe", response);
                    this.reproductive = response;
                }
                console.log("reporductive", this.reproductive);
            })
            await clinicalProfileService.getPatientFamilyCondition(id).then((response) => {
                if (response == '' || response == undefined) {
                    console.log("getPatientFamilyCondition", response);
                    this.patientFamilyHisotry.items =
                        [
                            {
                                conditions: '', relations: ''
                            }

                        ];
                    this.patientFamilyHisotry.familyHistoryNotes = '';
                } else {

                    this.patientFamilyHisotry = response;
                    console.log("patientFamilyHistoy", this.patientFamilyHisotry, response);
                }

            })
            hideLoader()
        },

        unloadClinicalProfile() {
            this.diet = { ...diet },
                this.generalProfile = { ...generalProfile },
                this.Immunizations = { ...Immunizations },
                this.patientFamilyHisotry = { ...patientFamilyHisotry },
                this.personalFamilyHistoy = { ...personalFamilyHistoy },
                this.reproductive = { ...reproductive }
        },
        async saveClinicalProfile(id) {
            showLoader()
            await clinicalProfileService.saveGeneralProfile(this.generalProfile, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },
        async saveDiet(id) {
            showLoader()
            await clinicalProfileService.saveDiet(this.diet, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },
        async saveImmunization(id) {
            showLoader()
            await clinicalProfileService.saveImmunization(this.Immunizations, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },
        async savePersnalFamilyHistory(id) {
            showLoader()
            await clinicalProfileService.savePersnalFamilyHistory(this.personalFamilyHistoy, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },
        async saveReproductive(id) {
            showLoader()
            await clinicalProfileService.saveReproductive(this.reproductive, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },

        async savePatientFamilyCondition(id) {
            showLoader()
            await clinicalProfileService.savePatientFamilyCondition(this.patientFamilyHisotry, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },



    },
    getters: {

    },
})    
