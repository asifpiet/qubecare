import { medicationService } from '@/services/medicationService';
import { showLoader } from '@/utils/showLoader';
import { defineStore } from 'pinia';


const medication = {
    presherb_name: '',
    presherb_dispense_days: '',
    presherb_dispense_refills: '',
    presherb_dispense_subtitution: '',
    presherb_notes: '',
    presherb_start_on: '',
    presherb_discontinue: '',
    presherb_src: '',
    BB: '',
    B: '',
    BL: '',
    L: '',
    BD: '',
    D: '',
    status: '',
    prescription_id: '',
}
const prescription = {

    newPrescription: [
        {
            medicine_id: '',
            variation_id: '',
            dose: '',
            when: '',
            frequency: '',
            duration: '',
            notes: '',
        },
        {
            medicine_id: '',
            variation_id: '',
            dose: '',
            when: '',
            frequency: '',
            duration: '',
            notes: '',
        }

    ],

}

const medicineLists = [

    {
        id: "NDA020688",
        set_id: "E56D80B1-1535-4E74-9D71-D6EC8EBC7E47",
        drug_name: "Tylenol",
        active_ingredient: "Acetaminophen",
        dosage_form: "Tablet",
        route_of_administration: "Oral",
        labeler_name: "McNeil Consumer Healthcare",
        manufactured_by: "McNeil Consumer Healthcare"
    },
    {
        id: "NDA020904",
        set_id: "8E9A0C5F-6E92-4B6D-B72E-9F019703F032",
        drug_name: "Panadol",
        active_ingredient: "Acetaminophen",
        dosage_form: "Tablet",
        route_of_administration: "Oral",
        labeler_name: "GlaxoSmithKline"
    }
]


export const useMedicationStore = defineStore('medication', {
    state: () => ({
        // id: null,
        medication: { ...medication },
        medications: [],
        variations: [],
        prescription: { ...prescription },
        medicineLists: [],
        previousMedicineLists: [],
        templateMedicineLists: [],
        packages_list: [],
        statusHisotry: [],
        isReorderComplete: false,
        prescriptionId: null,
        isDrawerOpen: false,
        signature: null,
        signatureNote: null,
        needs_followup: null,
        numberOfDays: null,
        status: null,
        current_status: null,
        tracking_number: null
    }),
    actions: {

        async getMedicationList(id, src, status) {
            await medicationService.getMedicationList(id, src, status).then((response) => {
                this.medications = response
            })
        },


        unloadMedication() {
            // this.medication = { ...medication }
            this.prescription = JSON.parse(JSON.stringify({ ...prescription }))
            this.medicineLists = [];
        },

        async getTemplateMedicineList() {
            await medicationService.getTemplateMedicineList().then((response) => {
                this.templateMedicineLists = response
            })
        },


        async getMedicineList() {
            try {
                const response = await medicationService.getMedicineList();
                console.log("medicine response:", response);

                // Ensure response is valid
                const prescriptions = Array.isArray(response.previous_prescriptions) ? response.previous_prescriptions : [];
                const packages = Array.isArray(response.packages_list) ? response.packages_list : [];
                const medicines = Array.isArray(response.medicine_list) ? response.medicine_list : [];

                // Group Titles (Non-selectable)
                const groupedList = [
                    { header: "Recent" }, // Non-selectable
                    ...prescriptions.map(item => ({
                        drug_name: item.drug_name,
                        type: "previous",
                        variations: item.variations || [],
                        ...item
                    })),
                    { header: "Packages" }, // Non-selectable
                    ...packages.map(item => ({
                        drug_name: `${item.template_name} (${item.type})`,
                        variations: Array.isArray(item.prescription_items) ? item.prescription_items.map(pi => pi.variation) : [],
                        ...item
                    })),
                    { header: "Medicine" }, // Non-selectable
                    ...medicines.map(item => ({
                        drug_name: item.drug_name,
                        variations: item.variations || [],
                        ...item
                    })),
                ];

                // Store the formatted list
                this.medicineLists = groupedList;

                console.log("Final medicineLists:", this.medicineLists);
            } catch (error) {
                console.error("Error fetching medicine list:", error);
            }
        },




        // async getMedicineList() {
        //     await medicationService.getMedicineList().then((response) => {
        //         console.log("medinine", response);
        //         this.previousMedicineLists = response.previous_prescriptions.map(item => {
        //             return {
        //                 drug_name: item.drug_name,
        //                 type: 'Previous Saved',
        //                 variations: item.variations, // Extract variations from prescription_items
        //                 ...item  // Retain other properties of the package
        //             };
        //         });
        //         this.packages_list = response.packages_list.map(item => {
        //             return {
        //                 drug_name: `${item.template_name} (${item.type})`,
        //                 variations: item.prescription_items.map(pi => pi.variation), // Extract variations from prescription_items
        //                 ...item  // Retain other properties of the package
        //             };
        //         });
        //         this.medicineLists = response.medicine_list;


        //         this.medicineLists = [...this.previousMedicineLists, ...this.packages_list, ...this.medicineLists];
        //         // this.packages_list = response.packages_list;
        //         console.log("medicineLists", this.medicineLists);
        //     })
        // },
        async getStatusHisotry(id) {
            this.statusHisotry = [];
            await medicationService.getStatusHisotry(id).then((response) => {
                console.log("responsev", response);
                this.current_status = response.current_status
                this.tracking_number = response.tracking_id
                this.statusHisotry = response.history
            })
        },



        async getAffiliateStatusHisotry(id) {
            this.statusHisotry = [];
            await medicationService.getAffiliateStatusHisotry(id).then((response) => {
                console.log("responsev", response);
                this.current_status = response.current_status
                this.tracking_number = response.tracking_id
                this.statusHisotry = response.history
            })
        },

        async getPatientStatusHisotry(id) {
            this.statusHisotry = [];
            await medicationService.getPatientStatusHisotry(id).then((response) => {
                console.log("responsev", response);
                this.current_status = response.current_status
                this.tracking_number = response.tracking_id
                this.statusHisotry = response.history
            })
        },


        async deleteStatusHistory(id) {
            showLoader()
            await medicationService.deleteStatusHistory(id)
            hideLoader()
            addAlert('Deleted successfully', 'success')

        },



        async refillPrescriptionRequest(id, data) {
            try {
                showLoader();

                const response = await medicationService.refillPrescriptionRequest(id, data);
                console.log("response", response);

                if (response && response.message) {
                    addAlert(response.message, 'success');
                    this.isReorderComplete = true;
                }

                return response;
            } catch (error) {
                hideLoader(); // ensure loader is hidden before return

                // Try to get error details if available (e.g., from Axios)
                const errResponse = error?.response?.data || {
                    error: "Unknown error",
                    message: "Something went wrong while refilling the prescription."
                };

                // console.error("Refill error:", errResponse);
                // addAlert('', 'error');

                return errResponse; // return the actual error object
            } finally {
                hideLoader();
            }
        },






        unloadMedicineList() {
            // this.prescription = { ...prescription },
            this.medicineLists = { ...medicineLists }
            this.templateMedicineLists = [];
        },


        async getMedicine(id) {
            showLoader()
            await medicationService.getMedicine(id).then((response) => {
                this.medication = response;
                console.log("medication", this.medication);
            })
            hideLoader()
        },

        async viewPatientPrescription(id) {
            showLoader()
            await medicationService.viewPatientPrescription(id).then((response) => {
                this.medication = response;
                console.log("medication", this.medication);
            })
            hideLoader()
        },

        async updatePrescriptionStaus(id) {
            showLoader()
            await medicationService.updatePrescriptionStaus(this.needs_followup, this.numberOfDays, this.signature, this.signatureNote, this.status, this.tracking_number, id).then((response) => {
                console.log("medication", response);
                addAlert('update successfully', 'success')
                this.needs_followup = null;
                this.numberOfDays = null;
            })
            hideLoader()
        },





        async getPrescriptionById(id) {
            this.signature = null;
            showLoader()
            await medicationService.getPrescriptionById(id).then((response) => {
                console.log("medication1", response);
                this.prescription.newPrescription = response.prescription;
                this.signature = response.signature;
                console.log("medication", this.prescription);
            })
            hideLoader()
        },

        async getPatientPrescriptionById(id) {
            this.signature = null;
            showLoader()
            await medicationService.getPatientPrescriptionById(id).then((response) => {
                console.log("medication1", response);
                this.prescription.newPrescription = response.prescription;
                this.signature = response.signature;
                console.log("medication", this.prescription);
            })
            hideLoader()
        },





        async savePrescription(id) {
            showLoader()
            this.prescription.newPrescription = this.prescription.newPrescription.filter(item => {
                // Check if all fields are empty for this item
                return !(item.medicine_id === "" && item.variation_id === "" && item.dose === "" && item.when === "" && item.frequency === "" && item.duration === "" && item.notes === "");
            });
            await medicationService.savePrescription(this.prescription.newPrescription, id, this.prescriptionId).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                    this.prescription = {
                        newPrescription: [
                            {
                                medicine_id: null,
                                variation: null,
                                dose: null,
                                when: null,
                                frequency: null,
                                duration: null,
                                notes: null,
                            },
                            {
                                medicine_id: null,
                                variation: null,
                                dose: null,
                                when: null,
                                frequency: null,
                                duration: null,
                                notes: null,
                            }

                        ]
                    }

                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },
        async saveMedicine(id) {
            showLoader()
            await medicationService.saveMedicine(this.prescription, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },

        mapMedicanData(data) {

            this.medication = data;
            console.log("map", data, this.medication);
        }
    },
    getters: {

    },
})    
