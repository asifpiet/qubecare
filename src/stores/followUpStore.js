import { followUpService } from '@/services/followUpService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'


const vitalData = {
    provider: '',
    provider_id: '',
    weight_lbs: '',
    weight_oz: '',
    temperature: '',
    height_ft: '',
    height_in: '',
    bmi: '',
    blood_presssure: '',
    diastolic: '',
    respiratory_rate: '',
    pulse: '',
    bloodSugar: '',
    fasting: '',
    saturation: '',
    headCircumference_in: '',
    neck_in: '',
    shoulders_in: '',
    chest_in: '',
    waist_in: '',
    hips_in: '',
    lean_body_mass_lbs: '',
    left_forearm_in: '',
    left_wrist_in: '',
    right_forearm_in: '',
    right_wrist_in: '',
    left_bicep_in: '',
    right_bicep_in: '',
    left_thigh_in: '',
    right_thigh_in: '',
    left_calf_in: '',
    right_calf_in: '',
    body_fat: '',
    activity_level: '',
    hip_to_waist: '',
    resting_metabolic_rate_kcal: '',
    with_activity_metabolic_rate_kcal: '',
    fluid: '',
    fluid_oz: '',
    protein: '',
    protein_gms: '',
    protein_bmi: '',
    frame: '',
    ideal_body_weight_lbs: '',
    ibw_percentage: '',
    adjusted_body_weight_abw_lbs: '',
    recommendation_weight: '',
    notes: '',
    subjective_notes: '',
    due_datesdasd: '',
    catagri_template: '',
}
const ortherdata = {
    objectiveNotes: '',
    assesmentDiagonist: '',
    practitionerNotes: '',
    generalNotes: ''
}
const prescriptions = [
    {
        formula: null,
        beforeBreakfast: null,
        breakfast: null,
        beforeLunch: null,
        lunch: null,
        beforeDinner: null,
        dinner: null,
        beforeSleep: null,
        notes: null,
        rx: null,
    },
];
const planPractioner = {
    note: '',
    prescriptions: prescriptions,
    returnToClinic: ''
}




const json_data = {
    type: '',
    vital: vitalData,
    otherData: ortherdata,
    planPractioner: planPractioner,
}

export const useFollowUpStore = defineStore('followUp', {
    state: () => ({
        // id: null,
        json_data: { ...json_data },
        returnOptions: [
            '1Wk', '2Wks', '3Wks', '1Mth', '2Mths', '3Mths', '4Mths', '5Mths', '6Mths'
        ],
        annontableImage: '',
        isDrawerOpen: false,
    }),
    actions: {



        async saveClinicalData(id) {
            console.log("clicnicalData", id,);
            showLoader()
            await followUpService.saveClinicalData(this.json_data, this.annontableImage, id).then((response) => {
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
