import { builderService } from '@/services/builderService'
import { defineStore } from 'pinia'

const defaultTemplate = [
    { "title": "Login/Signup", "type": "login", "config": {} },
    { "title": "Products", "type": "products", "config": { products: null } }
]
export const useBuilderStore = defineStore('builder', {
    state: () => ({
        id: null,
        name: null,
        layout: [...defaultTemplate],
        provider_id: null,
        selectedWidget: {},
        isDialog: false,
        apendChild: [],
        draggedIndex: null,

        dragableItems: [
            { title: 'Payment', value: 'payment', isSideBar: true, isDisable: false, icon: 'tabler-wallet', clone: false },
            { title: 'Appointment', value: 'appointment', isSideBar: true, isDisable: false, icon: 'tabler-calendar', clone: false },
            { title: 'Forms', value: 'forms', isSideBar: true, isDisable: false, icon: 'tabler-clipboard', clone: true, },
            { title: 'Combo Forms', value: 'comboforms', isSideBar: true, isDisable: false, icon: 'tabler-clipboard-text', clone: true, },
            { title: 'Multiple Forms', value: 'multipleforms', isSideBar: true, isDisable: false, icon: 'tabler-clipboard-text', clone: true, },
            { title: 'Product Form', value: 'productForm', isSideBar: true, isDisable: false, icon: 'tabler-clipboard-list', clone: true, },
            { title: 'Category Form', value: 'categoryForm', isSideBar: true, isDisable: false, icon: 'tabler-category', clone: true, },
            { title: 'Products', value: 'products', isSideBar: true, isDisable: false, icon: 'tabler-package', clone: false },
            { title: 'Blank Page', value: 'blank', isSideBar: true, isDisable: false, icon: 'tabler-crop-landscape', clone: false },
        ],


        builders: [],
        themesList: [],
        builder: {},
    }),
    actions: {

        addItem(data) {
            this.apendChild.splice(this.draggedIndex, 0, {
                ...data
            })
            console.log('layout', this.layout)
        },

        resetBuilder() {
            this.id = null
            this.name = null
            this.layout = [...defaultTemplate]
        },

        async getUnauthBuilderById(id) {
            let response = await builderService.getUnauthBuilderById(id);
            this.id = response.id
            this.layout = response.data
            this.name = response.name
            this.provider_id = response.provider_id
        },

        async getNewBuilderById(id) {
            let response = await builderService.getNewBuilderById(id);
            this.id = response.id
            this.layout = response.data
            this.name = response.builder_name
        },

        async saveNewBuilder() {
            showLoader()
            let response = await builderService.saveNewBuilder({ name: this.name, data: this.layout }, this.id);
            console.log("response", response);
            addAlert('Saved successfully', 'success')

            hideLoader()
        },

        async getBuildersList(id) {
            await builderService.getBuildersList(id).then((response) => {
                this.builders = response
            })
        },

        async deleteBuilder(id) {
            showLoader()
            await builderService.deleteBuilder(id)
            addAlert('Deleted successfully', 'success')
            hideLoader()
        },

        async getAllThemesList(id) {
            await builderService.getAllThemesList(id).then((response) => {
                this.themesList = response
            })
        },

        async saveBuilder(data, id = null) {
            showLoader()
            let response = await builderService.saveBuilder(data, id);
            console.log("response", response);
            this.builder = response
            addAlert('Saved successfully', 'success')

            hideLoader()
        },

        async saveBuilderConfig(data, type, id = null) {
            showLoader()
            let response = await builderService.saveBuilderConfig(data, type, id);
            hideLoader()
        },

        async getBuilderItem(id) {
            await builderService.getBuilderItem(id).then((response) => {
                this.builder = response
            })
        },

    },
    getters: {

    },
})

