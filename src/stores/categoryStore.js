import { categoryService } from '@/services/categoryService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const category = {
    name: '',
    inTakeForm_id: '',
    questiioneriesForm_id: '',
}

export const useCategoryStore = defineStore('category', {
    state: () => ({
        id: null,
        category: { ...category },
        isDrawerOpen: false,
        categories: [],
    }),
    actions: {

        async getCategoryList() {
            showLoader()
            await categoryService.getCategoryList().then((response) => {
                this.categories = response
            })
            hideLoader()
        },

        async loadCategory(data) {
            this.id = data.id
            this.category = data.category
        },

        unloadCategory() {
            this.id = null
            this.category = { ...category }
        },

        async saveCategory() {
            showLoader()
            let response = await categoryService.saveCategory(this.category, this.id);
            if (response && response?.success) {
                addAlert(response?.success, 'success')
            }
            else if (response && response?.message) {
                addAlert(response?.message, 'success')
            }
            else {
                addAlert('Something went wrong', 'error')
            }

            hideLoader()
        },

    },
    getters: {

    },
})

