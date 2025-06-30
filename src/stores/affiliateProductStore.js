import { affiliateProductService } from '@/services/affiliateProductService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const affiliateProduct = {
    product_id: '',
    builder_id: '',
    referral_fee: '',
    status: false
}

export const useAffiliateProductStore = defineStore('affiliateProducts', {
    state: () => ({
        id: null,
        affiliateProduct: { ...affiliateProduct },
        isDrawerOpen: false,
        affiliateProducts: [],
    }),
    actions: {

        async loadAffiliateProduct(data) {
            this.id = data.id
            this.affiliateProduct = data.affiliateProduct
        },

        unloadAffiliateProduct() {
            this.id = null
            this.affiliateProduct = { ...affiliateProduct }
        },

        async saveAffiliateProduct() {
            showLoader()
            let response = await affiliateProductService.saveAffiliateProduct(this.affiliateProduct, this.id);
            if (response && response?.data) {
                addAlert('Saved successfully', 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }

            hideLoader()
        },

        async deleteAffiliateProduct(id) {
            showLoader()
            await affiliateProductService.deleteAffiliateProduct(id)
            hideLoader()
            addAlert('Deleted successfully', 'success')

        },

    },
    getters: {

    },
})

