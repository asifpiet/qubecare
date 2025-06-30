import { productService } from '@/services/productService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const product = {
    name: '',
    slug: '',
    description: '',
    price: '',
    type: '',
    isPrescription: '',
    inTakeForm_id: '',
    questiioneriesForm_id: '',
    category_id: '',
    sku: 'null',
    status: ''
}

export const useProductStore = defineStore('products', {
    state: () => ({
        id: null,
        product: { ...product },
        isDrawerOpen: false,
        products: [],
    }),
    actions: {

        async productsList() {
            await productService.getProductsList().then((response) => {
                this.products = response
            })
        },
        async getProductsListForPatientPortal(id) {
            await productService.getProductsListForPatientPortal(id).then((response) => {
                this.products = response
            })
        },



        async loadProduct(data) {
            this.id = data.id
            this.product = data.product
        },

        unloadProduct() {
            this.id = null
            this.product = { ...product }
        },

        async saveProduct() {
            showLoader()
            if (this.product.sku == '') {
                this.product.sku = 'null'
            }
            let response = await productService.saveProduct(this.product, this.id);
            if (response && response?.success) {
                addAlert(response?.success, 'success')
            }
            else if (response && response?.message) {
                addAlert(response?.message, 'success')
            }
            else if (response && response?.error) {
                addAlert(response?.error, 'error')
            }

            hideLoader()
        },

        async deleteProduct(id) {
            showLoader()
            await productService.deleteProduct(id)
            hideLoader()
            addAlert('Deleted successfully', 'success')

        },



    },
    getters: {

    },
})

