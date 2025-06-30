import { widgetBuilderService } from '@/services/widgetBuilderService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

export const useWidgetBuilderStore = defineStore('widgetBuilder', {
    state: () => ({
        layout: [
            {
                type: 'row-widget',
                metaConfig: {
                    card: true,
                    title: true,
                    divider: true,
                    editBtn: false,
                    addBtn: false,
                    deleteBtn: false,
                    backgroundColor: '#FFFFFF',
                },
                child: [
                    {
                        type: 'col-widget',
                        cols: '8',
                        metaConfig: {
                            card: true,
                            title: true,
                            divider: true,
                            editBtn: false,
                            addBtn: false,
                            deleteBtn: false,
                            backgroundColor: '#FFFFFF',
                        },
                        child: [

                        ]
                    },
                    {

                        type: 'col-widget',
                        cols: '4',
                        metaConfig: {
                            card: true,
                            title: true,
                            divider: true,
                            editBtn: false,
                            addBtn: false,
                            deleteBtn: false,
                            backgroundColor: '#FFFFFF',
                        },
                        child: [

                        ]
                    }
                ]
            }
        ],
        isDialog: false,
        apendChild: [],
        draggedIndex: null,
        widgetDataNew: {},
        chartData: [],
        tagData: [],
        imagePointValue: [],
        chartImage: null,
        isDrawerOpen: false,
        formField: [],
        intakeFormList: null,
        widgetListData: null,
        multiFormRenderData: null,
        pageData: {},
        metaSelect: {
            card: true,
            title: true,
            divider: true,
            editBtn: false,
            addBtn: false,
            deleteBtn: false,
            backgroundColor: '#FFFFFF',
        },
        editBuilderCofigDialog: false,
        metaConfigChild: {},
        configType: null,
        addWidget: {
            form: null,
            datafrom: null,
            agrigateBy: null,
            dataSetBy: null,
            formType: null,
            formField: [],
            dataSetByList: ['Date', 'Month', 'Year'],
            mergedFields: [],
            fieldArray: [],
            filedObject: { name: null, key: null, label: null, sortable: false, searchable: false, isForm: false },
            chartSampleData: {},
            visulizImageDialog: false,
            visulizeImageData: {
                uploadedImage: null,
                imageUrl: '',
                dialog: false,
                bgImage: null,
                newPoint: { x: 0, y: 0, label: '', key: '', value: '', angle: 0, length: 100 }, // Added length
                points: [],
                imageFile: null

            },
            patienField: [
                { label: 'Patient ID', name: 'patient_data.id', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Full Name', name: 'patient_data.full_name', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'First Name', name: 'patient_data.fname', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Last Name', name: 'patient_data.lname', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Avatar URL', name: 'patient_data.avatar', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Middle Name', name: 'patient_data.mname', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Email Address', name: 'patient_data.email', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Date of Birth', name: 'patient_data.DOB', key: null, isForm: false, sortable: false, searchable: false },
                //{ label: 'Sex at Birth', name: 'patient_extra_data.sex_at_birth', key: null, isForm: false, sortable: false, searchable: false },
                //{ label: 'Preferred Phone', name: 'patient_extra_data.preferred_phone', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Contact Phone', name: 'patient_data.phone_contact', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Cell Phone', name: 'patient_data.phone_cell', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Street', name: 'patient_data.street', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Zip', name: 'patient_data.postal_code', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'City', name: 'patient_data.city', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'State', name: 'patient_data.state', key: null, isForm: false, sortable: false, searchable: false },
            ],
            invoiceField: [
                { label: 'Invoice ID', name: 'invoices.id', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Invoice Number', name: 'invoices.invoice_id', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Issue Date', name: 'invoices.created_at', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Total', name: 'invoices.grand_total', key: null, isForm: false, sortable: false, searchable: false },
                { label: 'Status', name: 'invoices.status', key: null, isForm: false, sortable: false, searchable: false },

            ]
        }
    }),
    actions: {
        async saveWidget(data) {
            showLoader()
            //addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await widgetBuilderService.saveWidget(data).then((response) => {
                console.log(response.message)
                //this.apendChild[this.draggedIndex] = response.data
                console.log(response.data)
                this.apendChild.splice(this.draggedIndex, 0, {
                    ...response.data, metaConfig: {
                        card: true,
                        title: true,
                        divider: true,
                        editBtn: false,
                        addBtn: false,
                        deleteBtn: false
                    },
                })
                if (response.message) {
                    addAlert('succesfully widget Add', 'success')
                    this.addWidget.fieldArray = []
                    this.addWidget.mergedFields = []
                    this.addWidget.formField = []
                } else {
                    addAlert('succesfully widget Add', 'error')
                }
            })

            hideLoader()
        },
        async saveWidgetBuilder(data, page) {
            showLoader()
            //addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await widgetBuilderService.saveWidgetBuilder(data, page).then((response) => {
                console.log(response.message)
                if (response.message) {
                    addAlert('succesfully widget Add', 'success')
                } else {
                    addAlert('succesfully widget Add', 'error')
                }
            })

            hideLoader()
        },
        async getWidgetBuilder(page) {
            showLoader()
            //addAlert('Loading Patient', 'info')
            // addAlert('Loading Patient', 'primary')
            await widgetBuilderService.getWidgetBuilder(page).then((response) => {
                if (response.pages_layout) {
                    this.layout = response.pages_layout
                }


            })

            hideLoader()
        },
        async loadImage(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();

                img.src = url;
                img.onload = () => {
                    bgImage.value = img
                };
                img.onload = () => resolve(img);
                img.onerror = (err) => reject(err);
            })
        },
        async getChartData(widget_type, widget_id, patientId) {
            console.log(patientId)
            // showLoader()
            await widgetBuilderService.getChartData(widget_type, widget_id, patientId).then((response) => {

                this.chartData = response
            })

            //hideLoader()
        },
        async getChartImage(widget_type, widget_id, patientId) {
            // showLoader()
            await widgetBuilderService.getChartData(widget_type, widget_id, patientId).then(async (response) => {
                console.log(response)
                this.chartData = response

                this.chartImage = await this.loadImage(response.image)
                this.imagePointValue = response.chartSampleData[0]

            })

            //hideLoader()
        },

        async multiFormRender(widget_type, widget_id, patientId) {

            await widgetBuilderService.getMultiFormRender(widget_type, widget_id, patientId).then(async (response) => {
                this.multiFormRenderData = response

            })

        },
        async listView(widget_type, widget_id, patientId) {
            //showLoader()
            await widgetBuilderService.getChartData(widget_type, widget_id, patientId).then(async (response) => {
                console.log('sssss', response.data)
                this.chartData = response.data
                this.tagData = response.data


            })

            //hideLoader()
        },
        async deleteWidget(id) {
            showLoader()
            await widgetBuilderService.deleteWidget(id).then(async (response) => {
            })

            hideLoader()
        },
        async getFormField(id) {
            showLoader()
            await widgetBuilderService.getFormField(id).then(async (response) => {
                this.formField = response
            })

            hideLoader()
        },
        async getIntakeFormsList() {
            showLoader()
            await widgetBuilderService.getIntakeFormsList().then(async (response) => {
                this.intakeFormList = response
            })

            hideLoader()
        },
        async widgetList() {
            showLoader()
            await widgetBuilderService.widgetList().then(async (response) => {
                this.widgetListData = response
            })

            hideLoader()
        },
        async getPage(type, page_name) {
            showLoader()
            await widgetBuilderService.getPage(type, page_name).then(async (response) => {
                console.log(response)
                this.pageData = response
            })

            hideLoader()
        },

    },

    getters: {
        getNewWidgetData: (state) => state.widgetDataNew,
    },
})
