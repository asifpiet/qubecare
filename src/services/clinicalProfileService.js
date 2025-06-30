// import { dateFormat } from '@/plugins/globalFunctions';
import baseService from './baseService';

class ClinicalProfileService extends baseService {

    async saveGeneralProfile(data, id) {
        return $api(`${POST_ALLERGY_API}/${id}`, {
            method: 'POST',
            body: data,
        })
    }
    async saveDiet(data, id) {
        return $api(`${SAVE_DIET_API}/${id}`, {
            method: 'POST',
            body: data,
        })
    }
    async saveImmunization(data, id) {
        return $api(`${SAVE_IMMUNIZATION_API}/${id}`, {
            method: 'POST',
            body: data,
        })
    }
    async savePersnalFamilyHistory(data, id) {
        return $api(`${STORE_FAMILY_HISTORY_API}/${id}`, {
            method: 'POST',
            body: {
                familyInfo: data,
                selectedConditions: data.selectedConditions
            },
        })
    }

    async saveReproductive(data, id) {
        return $api(`${SAVE_REPRODUCTIVE_API}/${id}`, {
            method: 'POST',
            body: data,
        })
    }
    async savePatientFamilyCondition(data, id) {
        return $api(`${STORE_PATIENT_FAMILY_CONDITION_API}/${id}`, {
            method: 'POST',
            body: data,
        })
    }


    async getGeneralProfile(id) {
        let res = await $api(`${GET_ALLERGY_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }
    async getDiet(id) {
        let res = await $api(`${GET_DIET_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }
    async getImmunization(id) {
        let res = await $api(`${GET_IMMUNIZATION_API}/${id}`, {
            method: 'GET',
        })
        if (Array.isArray(res.payload)) {
            return res.payload.map(this.mapSectionData);
            // return this.mapSectionData(res.payload)
        } else {
            return res.payload;
        }




    }
    mapSectionData(data) {
        if (data !== null || Array.isArray(data)) {
            console.log('asd', data);
            return {
                selectedImmunizations: data.selectedImmunizations,
                selectedCovidVaccine: data.selectedCovidVaccine,
                immunizationsNotes: data.immunizationsNotes,
                immunizationsEntries: data.immunizationsEntries,
                sections: data?.sections.map(section => ({
                    info: section.description,
                    title: section.title
                }))
            };
        }
    }
    async getPersnalFamilyHistory(id) {
        let res = await $api(`${GET_FAMILY_HISTORY_API}/${id}`, {
            method: 'GET',
        })

        return res
    }
    async getReproductive(id) {
        let res = await $api(`${GET_REPRODUCTIVE_API}/${id}`, {
            method: 'POST',
        })

        return res.data
    }
    async getPatientFamilyCondition(id) {
        let res = await $api(`${GET_PATIENT_FAMILY_CONDITION_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }
}

export const clinicalProfileService = new ClinicalProfileService()
