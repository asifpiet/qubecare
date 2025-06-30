import { inventoryService } from '@/services/inventoryService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'


const inventory = {
    id: '',
    inventoryType: '',
    item_name: '',
    manufPartNo: '',
    barcode: '',
    isTaxable: '',
    vendor_name: '',
    price: '',
    cost: '',
    onhand: '',
    expirationDate: '',
    sizeWeightNumber: '',
    typicalDosageQty: '',
    reorderPoint: '',
    minimumOHDesired: '',
    secondaryVendor: '',
    secondaryVendorPartNo: '',
    secondaryVendorBarcode: '',
    lotNo: '',
    description: '',
    categorizationSubType: '',
    cogsFactor: '',
    categorizationType: '',
    location: '',
    osmolarityMOsmml: '',
    isIV: '',
    isTinchure: '',
    isHormone: '',
    isHerbalFormula: '',
    isPharmaCompound: '',
    other: '',
    beforeBreakfast: '',
    breakfast: '',
    beforeLunch: '',
    lunch: '',
    beforeDinner: '',
    dinner: '',
    beforeSleep: '',
    notes: '',
    healthBenefits: '',
}

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        // id: null,
        inventory: { ...inventory },
        isDrawerOpen: false,
    }),
    actions: {



        unloadInventory() {
            this.inventory = { ...inventory }
        },

        async loadInventory(id) {
            showLoader()
            await inventoryService.getInventory(id).then((response) => {
                this.inventory = response;
                this.inventory.isIV = response.isIV == 1 ? true : false;
                this.inventory.isTinchure = response.isTinchure == 1 ? true : false;
                this.inventory.isHormone = response.isHormone == 1 ? true : false;
                this.inventory.isHerbalFormula = response.isHerbalFormula == 1 ? true : false;
                this.inventory.isPharmaCompound = response.isPharmaCompound == 1 ? true : false;
                this.inventory.other = response.other == 1 ? true : false;
                console.log("inventory", this.inventory, response);
            })
            hideLoader()
        },
        async saveInventory(id) {
            showLoader()
            await inventoryService.saveInventory(this.inventory, id).then((response) => {
                if (response && response?.message) {
                    addAlert(response?.message, 'success')
                }
                else {
                    addAlert(response?.error, 'error')
                }
            })
            hideLoader()
        },

        async deleteInventory(id) {
            showLoader()
            await inventoryService.deleteInventory(id)
            hideLoader()
            addAlert('Deleted successfully', 'success')

        },

    },
    getters: {

    },
})    
