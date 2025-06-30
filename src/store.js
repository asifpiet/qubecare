import { createStore } from 'vuex';
import { GET_CATEGORY_API, REFRESH_ABLITIES_LINK, SAVE_PATIENT_AVATER_API } from './utils/constants';
export default createStore({
    state: {
        isLoading: false,
        dashboardStats: [],
        affiliateAccount: null,
        partnerAccount: null,
        affiliateDashbardStats: {
            total_revenue: null,
            total_withdrawals: null,
            total_affiliate_users: null,
            weekly_revenue: null,
            weekly_affiliate_users: null,
            weekly_withdrawals: null,
            line_chart: {
                data: [],
                labels: []
            }
        },
        forgotMgs: null,
        prescriptionReport: [],
        providerProfile: [],
        providerStats: [],
        patientStats: [],
        invoiceReport: [],
        orderTimeLine: [],
        partnerDashbardStats: {
            total_revenue: null,
            total_withdrawals: null,
            total_affiliate_users: null,
            weekly_revenue: null,
            weekly_affiliate_users: null,
            weekly_withdrawals: null,
            line_chart: {
                data: [],
                labels: []
            }
        },
        practitionerProducts: {},
        affiliateProfile: {
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            phone_no: null,
            gender: null,
            dob: null,

        },
        partnerProfile: {
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            phone_no: null,
            gender: null,
            dob: null,

        },
        patientPortalProfile: [],
        patientDashbaordPortalStats: {},
        patientProfile: {
            avater: null,
            patientId: null,
            uuid: null,
            fullName: null,
            firstName: null,
            lastName: null,
            middleName: null,
            preferredName: null,
            PreferredPhone: null,
            email: null,
            contactMethod: null,
            personalID: null,
            dateOfBirth: null,
            sexatBirth: null,
            genderIdentity: null,
            race: null,
            pronoun: null,
            ageGroup: null,
            address: null,
            city: null,
            state: null,
            zipcode: null,
            preferredPhone: null,
            alternativePhone: null,
            textmsgNumber: null,
            primaryPractitioner: null,
            primaryCarePhysician: null,
            guardian: null,
            emergencyContactNumber: null,
            emergencyContactNameRelation: null,
            patientMaritalStatus: null,
            occupation: null,
            referredBy: null,
            patientNote: null,
            appiontment: null,
            alert: null,
            avatar: null,
            avatarImg: null,
            role: null,
            status: null,
            isportalAccess: null,
            plan: null,
            nextKinRelation: null,
            nextkinFirstName: null,
            nextkinLastName: null,
            nextkinPhone: null,
            nextkinAddress: null,
            nextkinCity: null,
            nextkinState: null,
            nextkinZipCode: null,
            nextKinGuarantor: null,
            insurance: null,
            insuredPlanOrProgramName: null,
            insuredIDNumber: null,
            insuredGroupNameNo: null,
            employersSchoolName: null,
            relationshiptoInsured: null,
            insuredName: null,
            insuredDateOfBirth: null,
            insuredGender: null,
            coPayment: null,
            coInsurance: null,
            insuranceDeductible: null,
            insuredAddress: null,
            insuredCity: null,
            insuredState: null,
            insuredZip: null,
            insuredPhone: null,
            payerName: null,
            payerID: null,
            payerAddress: null,
            payerCity: null,
            payerState: null,
            payerZip: null,
            referringProviderName: null,
            referringProviderNPI: null,
            referringProviderTaxonomy: null,
            inNetworkCalPlanStart: null,
            inNetworkOOPMax: null,
            inNetworkMet: null,
            inNetworkDeductible: null,
            inNetworkUsed: null,
            outOfNetworkCalPlanStart: null,
            outOfNetworkOOPMax: null,
            outOfNetworkMet: null,
            outOfNetworkDeductible: null,
            outOfNetworkUsed: null,
            LabsINCopayCoIns: null,
            LabsOONCopayCoIns: null,
            preAuthRequiredRorACUCHIROPT: null,
            coveredUnderCHIROPT: null,
            coverageDetails: null,
            patientInsuranceDeductible: null,
            patientInsuranceMet: null,
            patientInsuracnePercentage: null,
            copayCoinsurance: null,
            limitsYear: null,
            howManyUsed: null,
            dollarAmountVisit: null,
            outOfNetworkCopayCoIns: null,
            outOfNetworkDeductibleSecond: null,
            outOfNetworkMetSecond: null,
            outOfNetworkOOPMaxSecond: null,
            outOfNetworkOOPMaxMetSecond: null,
            diagnosisExclusions: null,
            eMCodesCovered: null,
            modalitiesCovered: null,
            patientInsuraceCoverageNotes: null,
            secInsurance: null,
            secInsuredPlanORProgramName: null,
            secInsuredIDNumber: null,
            secInsuredGroupNameNo: null,
            secEmployersSchoolName: null,
            secRelationshipToInsured: null,
            secInsuredName: null,
            secInsuredDateOfBirth: null,
            secGender: null,
            secInsuredAddress: null,
            secInsuredCity: null,
            secSelectState: null,
            secInsuredZip: null,
            secInsuredPhone: null,
            secPayerName: null,
            secPayerID: null,
            secPayerAddress: null,
            secPayerCity: null,
            secPayerState: null,
            secZip: null,
            cardholderFirstname: null,
            cardholderLastname: null,
            cardNumber: null,
            securityCode: null,
            expiration: null,
            billingAddress: null,
            billingCity: null,
            billingState: null,
            billingPostalCode: null,
            billingCountry: null,
            payerType: null,
            practitioner: null,
            typeOfCoverage: null,
            officeAllyPayer: null,
            payerPortalLogin: null,
            portalPass: null,
            preAuth: [],
            textMessage: [],
            tasks: [],
            vitals: [],
            healthMantaince: [],
            documents: []
        },
        patientInsurance: {
            insurance: null,
            insuredPlanOrProgramName: null,
            insuredIDNumber: null,
            insuredGroupNameNo: null,
            employersSchoolName: null,
            relationshiptoInsured: null,
            insuredName: null,
            insuredDateOfBirth: null,
            insuredGender: null,
            coPayment: null,
            coInsurance: null,
            insuranceDeductible: null,
            insuredAddress: null,
            insuredCity: null,
            insuredState: null,
            insuredZip: null,
            insuredPhone: null,
            payerName: null,
            payerID: null,
            payerAddress: null,
            payerCity: null,
            payerState: null,
            payerZip: null,
            referringProviderName: null,
            referringProviderNPI: null,
            referringProviderTaxonomy: null,
            uuid: null
        },
        patientTags: [],
        locations: {
            name: null,
            address: null,
            city: null,
            state: null,
            country: null,
            zipcode: null,
            phoneNumber: null,
            npiNumber: null,
            cliaNumber: null,
            sfax_no: null,
            non_fax_no: null,
            consultTax: null,
            procedureTax: null,
            labTax: null,
            suppliesTax: null,
            aPIKey: null,
            encryptionKey: null,
            faxNoAcc: null,
            userName: null,
            vector: null,
            rooms: [],
        },
        loginUser: [],
        locations: [],
        labdiagnostics: null,
        appiontments: [],
        gappiontments: [],
        availabilityList: [],
        userList: [],
        ipAccessList: [],
        phoneLogList: [],
        messageList: [],
        subjectMessageList: null,
        emailList: null,
        subjectEmailList: null,
        showMessage: null,
        timeout: null,
        isErrorMsg: false,
        isSuccessMsg: false,
        inventory: {
            id: null,
            inventoryType: null,
            item_name: null,
            manufPartNo: null,
            barcode: null,
            isTaxable: null,
            vendor_name: null,
            pirce: null,
            cost: null,
            onhand: null,
            onOrder: null,
            dateOfBirth: null,
            expirationDate: null,
            sizeWeightNumber: null,
            typicalDosageQty: null,
            reorderPoint: null,
            minimumOHDesired: null,
            secondaryVendor: null,
            secondaryVendorPartNo: null,
            secondaryVendorBarcode: null,
            lotNo: null,
            description: null,
            categorizationSubType: null,
            cogsFactor: null,
            categorizationType: null,
            location: null,
            osmolarityMOsmml: null,
            isIV: null,
            isTinchure: null,
            isHormone: null,
            isHerbalFormula: null,
            isPharmaCompound: null,
            other: null,
            ingredientFor: null,
            beforeBreakfast: null,
            breakfast: null,
            beforeLunch: null,
            lunch: null,
            beforeDinner: null,
            dinner: null,
            beforeSleep: null,
            notes: null,
            healthBenefits: null,
            mnp: null,
        },
        practitioners: [],
        locationData: [],
        VendorData: [],
        inventoryVendorData: [],
        taskList: [],
        patients: [],
        vitalsList: [],
        loctionByID: {},
        getVitalById: {},
        vitalsList: [],
        intakeQuestions: [],
        intakeQuestion: {
            id: null,
            name: null,
            description: null,
            status: null,
            data: {}
        },
        vitalData: {},
        intakeForms: {
            id: null,
            name: null
        },
        intakeFormId: null,
        intakeFormData: {
            name: null,
            data: {}
        },
        patientIntakeFormData: {
            data: {}
        },
        questionerQuestions: [],
        questionerQuestion: {
            id: null,
            name: null,
            description: null,
            status: null,
            data: {}
        },
        questionerForms: {
            id: null,
            name: null
        },
        questionerFormId: null,
        questionerFormData: {
            name: null,
            data: {}
        },
        patientQuestionerFormData: {
            data: {}
        },
        patientIntakeForms: [],
        consentForms: [],
        consentForm: {
            id: null,
            uuid: null,
            name: null,
            description: null,
            status: null,
            data: {}
        },
        consentFormsList: {
            id: null,
            name: null
        },
        consentFormId: null,
        patientConsentFormItem: {},
        practitionerId: null,
        consentFormData: {
            name: null,
            description: null,
            data: {}
        },
        patientConsentForms: [],
        patientConsentFormData: {
            id: null,
            practationer_id: null,
            uuid: null,
            name: null,
            description: null,
            data: {},
            signature: null
        },
        generalProfile: [],
        diet: [],
        immunization: [],
        reporductive: [],
        personnalFamilyHistoy: [],
        patientFamilyHisotry: [],
        submittedIntakes: [],
        submittedIntakeForm: {},
        medAndSupplementData: [],
        productsList: [],
        themesList: [],
        categories: [],
        builderData: {},
        emailCheck: null,
        errors: null,
        access_token: null,
        paymentProcessed: false,
        calendlyAvailableTimes: {},
        selectedTimezone: null,
        providerSlots: [],
        singleRole: null,
        permissionsRole: null,
        roleList: [],
        refreshAbilities: null,
        saveInvoiceData: null,
        registerProvider: null,
        wizardSetup: null,
        clickedAppointment: null,
        formField: null,
        widgetDataChart: null,
        widgetList: null,
    },
    mutations: {
        setWidgetList(state, payload) {
            state.widgetList = payload
        },
        setWidgetDataChart(state, payload) {
            state.widgetDataChart = payload
        },
        setClickedAppointment(state, payload) {
            state.clickedAppointment = payload
        },
        addFormField(state, field) {
            state.formField.push(field);
        },
        setClickedAppointment(state, payload) {
            state.clickedAppointment = payload
        },
        setAffiliateAccount(state, payload) {
            state.affiliateAccount = payload
        },
        setRegisterProvider(state, payload) {
            state.registerProvider = payload
        },
        setPartnerAccount(state, payload) {
            state.partnerAccount = payload
        },
        setAffiliateDashbardStats(state, payload) {
            state.affiliateDashbardStats = payload
        },
        setPartnerDashbardStats(state, payload) {
            state.partnerDashbardStats = payload
        },
        setPractationerProducts(state, payload) {
            state.practitionerProducts = payload
        },
        setAffiliateProfile(state, payload) {
            state.affiliateProfile.id = payload.id;
            state.affiliateProfile.uuid = payload.uuid;
            state.affiliateProfile.email = payload.email;
            state.affiliateProfile.firstName = payload.firstName;
            state.affiliateProfile.lastName = payload.lastName;
            state.affiliateProfile.phone = payload.phone;
            state.affiliateProfile.gender = payload.gender;
            state.affiliateProfile.dob = payload.dob;
        },
        setPartnerProfile(state, payload) {
            state.partnerProfile.id = payload.id;
            state.partnerProfile.uuid = payload.uuid;
            state.partnerProfile.email = payload.email;
            state.partnerProfile.firstName = payload.firstName;
            state.partnerProfile.lastName = payload.lastName;
            state.partnerProfile.phone = payload.phone;
            state.partnerProfile.gender = payload.gender;
            state.partnerProfile.dob = payload.dob;
        },
        setLoading(state, payload) {
            console.log('payload');
            state.isLoading = payload
        },
        setSelectedTimezone(state, payload) {
            state.selectedTimezone = payload;
        },
        setRefreshAbilities(state, payload) {
            state.refreshAbilities = payload;
        },

        setCalendlyAvailableTImes(state, payload) {
            state.calendlyAvailableTimes = payload;
        },
        setPaymentProcessed(state, payload) {
            state.paymentProcessed = payload;
        },
        setAccessToken(state, payload) {
            state.access_token = payload;
        },
        setSaveInvoiceData(state, payload) {
            state.saveInvoiceData = payload;
        },

        setErrors(state, payload) {
            state.errors = payload;
        },
        setEmailCheck(state, payload) {
            state.emailCheck = payload
        },
        setLoginUser(state, payload) {
            console.log('payload');
            state.loginUser = payload
        },

        setProviderSlots(state, payload) {
            state.providerSlots = payload
        },
        setSingleRole(state, payload) {
            state.singleRole = payload;
        },
        setSingleInvoice(state, payload) {
            state.singleInvoice = payload;
        },
        setInvoiceState(state, payload) {
            state.invoiceState = payload;
        },
        setPermissionsRole(state, payload) {
            state.permissionsRole = payload;
        },
        setBuilderData(state, payload) {
            state.builderData = payload
        },
        setThemesList(state, payload) {
            state.themesList = payload
        },
        setProductsList(state, payload) {
            state.productsList = payload
        },
        setSubmittedIntakeForm(state, payload) {
            state.submittedIntakeForm = payload
        },
        setAppiontmentReport(state, payload) {
            state.appiontmentReport = payload
        },
        setSubmittedIntakes(state, payload) {
            state.submittedIntakes = payload
        },
        setPatientConsentForms(state, payload) {
            state.patientConsentForms = payload
        },
        setPatientConsentFormData(state, payload) {
            state.patientConsentFormData = payload
        },
        setConsentFormData(state, payload) {
            state.consentFormData = payload
        },
        setPractitionerId(state, payload) {
            state.practitionerId = payload
        },
        setConsentFormId(state, payload) {
            state.consentFormId = payload
        },
        setVitalById(state, payload) {
            state.getVitalById = payload
        },

        setPatientConsentFormItem(state, payload) {
            state.patientConsentFormItem = payload
        },
        setConsentForms(state, payload) {
            state.consentForms = payload
        },
        setConsentForm(state, payload) {
            state.consentForm = payload
        },
        setConsentFormsList(state, payload) {
            state.consentForms = payload
        },
        setPatientIntakeFormsList(state, payload) {
            state.patientIntakeForms = payload
        },

        setPatientQuestionerFormData(state, payload) {
            state.patientQuestionerFormData = payload
        },
        setQuestionerFormData(state, payload) {
            state.questionerFormData = payload
        },
        setQuestionerFormId(state, payload) {
            state.questionerFormId = payload
        },
        setQuestionerForms(state, payload) {
            state.questionerForms = payload
        },
        setQuestionerQuestion(state, payload) {
            state.questionerQuestion = payload
        },
        setQuestionerQuestions(state, payload) {
            state.questionerQuestions = payload
        },
        setPatientIntakeFormData(state, payload) {
            state.patientIntakeFormData = payload
        },
        setIntakeFormData(state, payload) {
            state.intakeFormData = payload
        },
        setIntakeFormId(state, payload) {
            state.intakeFormId = payload
        },
        setIntakeForms(state, payload) {
            state.intakeForms = payload
        },
        setFormField(state, payload) {
            state.formField = payload
        },
        setPatientTags(state, payload) {
            console.log('payloadtag', payload);
            state.patientTags = payload;
        },
        setVitalClinic(state, payload) {
            console.log('payloadtag', payload);
            state.vitalData = payload;
        },
        setIntakeQuestion(state, payload) {
            state.intakeQuestion = payload
        },
        setIntakeQuestions(state, payload) {
            state.intakeQuestions = payload
        },
        setLabdiagnostics(state, payload) {
            state.labdiagnostics = payload
        },
        setGAppointments(state, payload) {
            console.log('payload');
            state.gappiontments = payload
        },
        setAppointments(state, payload) {
            console.log('payload');
            state.appiontments = payload
        },
        setAvailability(state, payload) {
            console.log('payload');
            state.availabilityList = payload
        },

        setErrorMsg(state, payload) {
            console.log('payload');
            clearTimeout(state.timeout)
            state.isErrorMsg = payload
            state.timeout = setTimeout(() => {
                state.isErrorMsg = false
            }, 5000)
        },
        setSuccessMsg(state, payload) {
            console.log('payload');
            clearTimeout(state.timeout)
            state.isSuccessMsg = payload
            state.timeout = setTimeout(() => {
                state.isSuccessMsg = false
            }, 5000)
        },
        setShowMsg(state, payload) {
            console.log('payload');
            state.showMessage = payload

        },
        setPatientProfile(state, payload) {
            console.log("payloadPatient", payload);
            state.patientProfile.patientId = payload.id;
            state.patientProfile.patient_id = payload.patientId;
            state.patientProfile.uuid = payload.uuid;
            state.patientProfile.firstName = payload.firstName;
            state.patientProfile.lastName = payload.lastName;
            // state.patientProfile.middleName = payload.middleName;
            state.patientProfile.address = payload.address;
            state.patientProfile.city = payload.city;
            state.patientProfile.state = payload.state;
            state.patientProfile.zipcode = payload.zipcode;
            state.patientProfile.preferredPhone = payload.preferredPhone;
        },

        setPatientAvater(state, payload) {
            console.log("setPatientAvater", payload);
            state.patientProfile.avater = payload;
        },
        setPatientPortalProfile(state, payload) {
            state.patientPortalProfile = payload;
        },
        setEditPatientProfile(state, payload) {
            console.log('payload.pid ==== ', payload.pid)


            if (payload.pid) {
                localStorage.setItem('patient_id_data', payload.pid)
                state.patientProfile.patientId = payload.pid;
                state.patientProfile.patient_id = payload.pid;
            } else {
                state.patientProfile.patientId = payload.id;
            }


            state.patientProfile.uuid = payload.uuid;
            state.patientProfile.fullName = payload.firstName + + payload.lastName;
            state.patientProfile.firstName = payload.firstName;
            state.patientProfile.lastName = payload.lastName;
            state.patientProfile.middleName = payload.middleName;
            state.patientProfile.preferredName = payload.preferredName;
            state.patientProfile.email = payload.email;
            state.patientProfile.ageGroup = payload.ageGroup;
            state.patientProfile.contactMethod = payload.contactMethod;
            state.patientProfile.personalID = payload.personalID;
            state.patientProfile.dateOfBirth = payload.dateOfBirth;
            state.patientProfile.sexatBirth = payload.sexatBirth;
            state.patientProfile.genderIdentity = payload.genderIdentity;
            state.patientProfile.pronoun = payload.pronoun;
            state.patientProfile.race = payload.race;
            state.patientProfile.address = payload.address;
            state.patientProfile.city = payload.city;
            state.patientProfile.state = payload.state;
            state.patientProfile.zipcode = payload.zipcode;
            state.patientProfile.preferredPhone = payload.preferredPhone;
            state.patientProfile.alternativePhone = payload.alternativePhone
            state.patientProfile.textmsgNumber = payload.textmsgNumber
            state.patientProfile.PreferredPhone = payload.PreferredPhone;
            state.patientProfile.primaryPractitioner = payload.primaryPractitioner
            state.patientProfile.primaryCarePhysician = payload.primaryCarePhysician
            state.patientProfile.guardian = payload.guardian
            state.patientProfile.emergencyContactNumber = payload.emergencyContactNumber
            state.patientProfile.emergencyContactNameRelation = payload.emergencyContactRelation
            state.patientProfile.patientMaritalStatus = payload.patientMaritalStatus
            state.patientProfile.occupation = payload.occupation
            state.patientProfile.referredBy = payload.referrerID
            state.patientProfile.patientNote = payload.patientNote
            state.patientProfile.appiontment = payload.appiontment
            state.patientProfile.alert = payload.alert
            state.patientProfile.avatar = payload.avatar
            state.patientProfile.avatarImg = payload.avatarImg
            state.patientProfile.status = payload.status
            state.patientProfile.isportalAccess = payload.allow_patient_portal
            state.patientProfile.nextKinRelation = payload.guardianrelationship
            state.patientProfile.nextkinFirstName = payload.guardiansname
            state.patientProfile.nextkinLastName = payload.nextkinLastName
            state.patientProfile.nextkinPhone = payload.guardianphone
            state.patientProfile.nextkinAddress = payload.guardianaddress
            state.patientProfile.nextkinCity = payload.guardiancity
            state.patientProfile.nextkinState = payload.guardianstate
            state.patientProfile.nextkinZipCode = payload.guardianpostalcode
            state.patientProfile.nextKinGuarantor = payload.nextKinGuarantor
            state.patientProfile.insurance = payload.insurance
            state.patientProfile.insuredPlanOrProgramName = payload.insuredPlanOrProgramName
            state.patientProfile.insuredIDNumber = payload.insuredIDNumber
            state.patientProfile.insuredGroupNameNo = payload.insuredGroupNameNo
            state.patientProfile.employersSchoolName = payload.employersSchoolName
            state.patientProfile.relationshiptoInsured = payload.relationshiptoInsured
            state.patientProfile.insuredName = payload.insuredName
            state.patientProfile.insuredDateOfBirth = payload.insuredDateOfBirth
            state.patientProfile.insuredGender = payload.insuredGender
            state.patientProfile.coPayment = payload.coPayment
            state.patientProfile.coInsurance = payload.coInsurance
            state.patientProfile.insuranceDeductible = payload.insuranceDeductible
            state.patientProfile.insuredAddress = payload.insuredAddress
            state.patientProfile.insuredCity = payload.insuredCity
            state.patientProfile.insuredState = payload.insuredState
            state.patientProfile.insuredZip = payload.insuredZip
            state.patientProfile.insuredPhone = payload.insuredPhone
            state.patientProfile.payerName = payload.payerName
            state.patientProfile.payerID = payload.payerID
            state.patientProfile.payerAddress = payload.payerAddress
            state.patientProfile.payerCity = payload.payerCity
            state.patientProfile.payerState = payload.payerState
            state.patientProfile.payerZip = payload.payerZip
            state.patientProfile.referringProviderName = payload.referringProviderName
            state.patientProfile.referringProviderNPI = payload.referringProviderNPI
            state.patientProfile.referringProviderTaxonomy = payload.referringProviderTaxonomy
            state.patientProfile.inNetworkCalPlanStart = payload.inNetworkCalPlanStart
            state.patientProfile.inNetworkOOPMax = payload.inNetworkOOPMax
            state.patientProfile.inNetworkMet = payload.inNetworkMet
            state.patientProfile.inNetworkDeductible = payload.inNetworkDeductible
            state.patientProfile.inNetworkUsed = payload.inNetworkUsed
            state.patientProfile.outOfNetworkCalPlanStart = payload.outOfNetworkCalPlanStart
            state.patientProfile.outOfNetworkOOPMax = payload.outOfNetworkOOPMax
            state.patientProfile.outOfNetworkOOPMax = payload.outOfNetworkOOPMax
            state.patientProfile.outOfNetworkDeductible = payload.outOfNetworkDeductible
            state.patientProfile.outOfNetworkUsed = payload.outOfNetworkUsed
            state.patientProfile.LabsINCopayCoIns = payload.LabsINCopayCoIns
            state.patientProfile.LabsOONCopayCoIns = payload.LabsOONCopayCoIns
            state.patientProfile.preAuthRequiredRorACUCHIROPT = payload.preAuthRequiredRorACUCHIROPT
            state.patientProfile.coveredUnderCHIROPT = payload.coveredUnderCHIROPT
            state.patientProfile.coverageDetails = payload.coverageDetails
            state.patientProfile.patientInsuranceDeductible = payload.patientInsuranceDeductible
            state.patientProfile.patientInsuranceMet = payload.patientInsuranceMet
            state.patientProfile.patientInsuracnePercentage = payload.patientInsuracnePercentage
            state.patientProfile.copayCoinsurance = payload.copayCoinsurance
            state.patientProfile.limitsYear = payload.limitsYear
            state.patientProfile.howManyUsed = payload.howManyUsed
            state.patientProfile.dollarAmountVisit = payload.dollarAmountVisit
            state.patientProfile.outOfNetworkCopayCoIns = payload.outOfNetworkCopayCoIns
            state.patientProfile.outOfNetworkDeductibleSecond = payload.outOfNetworkDeductibleSecond
            state.patientProfile.outOfNetworkMetSecond = payload.outOfNetworkMetSecond
            state.patientProfile.outOfNetworkOOPMaxSecond = payload.outOfNetworkOOPMaxSecond
            state.patientProfile.outOfNetworkOOPMaxMetSecond = payload.outOfNetworkOOPMaxMetSecond
            state.patientProfile.diagnosisExclusions = payload.diagnosisExclusions
            state.patientProfile.eMCodesCovered = payload.eMCodesCovered
            state.patientProfile.modalitiesCovered = payload.modalitiesCovered
            state.patientProfile.patientInsuraceCoverageNotes = payload.patientInsuraceCoverageNotes
            state.patientProfile.secInsurance = payload.secInsurance
            state.patientProfile.secInsuredPlanORProgramName = payload.secInsuredPlanORProgramName
            state.patientProfile.secInsuredIDNumber = payload.secInsuredIDNumber
            state.patientProfile.secInsuredGroupNameNo = payload.secInsuredGroupNameNo
            state.patientProfile.secEmployersSchoolName = payload.secEmployersSchoolName
            state.patientProfile.secRelationshipToInsured = payload.secRelationshipToInsured
            state.patientProfile.secInsuredName = payload.secInsuredName
            state.patientProfile.secInsuredDateOfBirth = payload.secInsuredDateOfBirth
            state.patientProfile.secGender = payload.secGender
            state.patientProfile.secInsuredAddress = payload.secInsuredAddress
            state.patientProfile.secInsuredCity = payload.secInsuredCity
            state.patientProfile.secSelectState = payload.secSelectState
            state.patientProfile.secInsuredZip = payload.secInsuredZip
            state.patientProfile.secInsuredPhone = payload.secInsuredPhone
            state.patientProfile.secPayerName = payload.secPayerName
            state.patientProfile.secPayerID = payload.secPayerID
            state.patientProfile.secPayerAddress = payload.secPayerAddress
            state.patientProfile.secPayerCity = payload.secPayerCity
            state.patientProfile.secPayerState = payload.secPayerState
            state.patientProfile.secZip = payload.secZip
            state.patientProfile.cardholderFirstname = payload.cardholderFirstname
            state.patientProfile.cardholderLastname = payload.cardholderLastname
            state.patientProfile.cardNumber = payload.cardNumber
            state.patientProfile.securityCode = payload.securityCode
            state.patientProfile.expiration = payload.expiration
            state.patientProfile.billingAddress = payload.billingAddress
            state.patientProfile.billingCity = payload.billingCity
            state.patientProfile.billingState = payload.billingState
            state.patientProfile.billingPostalCode = payload.billingPostalCode
            state.patientProfile.billingCountry = payload.billingCountry
            state.patientProfile.payerType = payload.payerType
            state.patientProfile.practitioner = payload.practitioner
            state.patientProfile.typeOfCoverage = payload.typeOfCoverage
            state.patientProfile.officeAllyPayer = payload.officeAllyPayer
            state.patientProfile.payerPortalLogin = payload.payerPortalLogin
            state.patientProfile.portalPass = payload.portalPass
            state.patientProfile.preAuth = payload.preAuth
            state.patientProfile.textMessage = payload.textMessage
            state.patientProfile.tasks = payload.tasks
            state.patientProfile.vitals = payload.vitals
            state.patientProfile.healthMantaince = payload.healthMantaince
            state.patientProfile.documents = payload.documents

        },
        setLocation(state, payload) {
            state.locations = payload
        },
        setSingleInventory(state, payload) {
            state.inventory = payload
        },
        setUser(state, payload) {
            state.userList = payload
        },
        setIpAccessList(state, payload) {
            state.ipAccessList = payload
        },
        setPhoneLogList(state, payload) {
            state.phoneLogList = payload
        },
        setMessageList(state, payload) {
            state.messageList = payload
        },
        setSubjectMessageList(state, payload) {
            state.subjectMessageList = payload
        },
        setEmailList(state, payload) {
            state.emailList = payload
        },
        setSubjectEmailList(state, payload) {
            state.subjectEmailList = payload
        },
        setPractitioners(state, payload) {
            state.practitioners = payload
        },
        setLocationData(state, payload) {
            state.locationData = payload
        },
        setVendorData(state, payload) {
            state.VendorData = payload
        },
        setSingleInventoryData(state, payload) {
            state.inventoryVendorData = payload
        },
        setTaskList(state, payload) {
            state.taskList = payload
        },
        setPatientList(state, payload) {
            state.patients = payload
        },
        setVitalsList(state, payload) {
            state.vitalsList = payload
        },
        setProviderProfile(state, payload) {
            state.providerProfile = payload
        },
        setPatientIsursance(state, payload) {
            if (payload) {
                state.patientInsurance = payload
                state.patientInsurance.insuredName = payload.insuredPlanOrProgramName
                state.patientInsurance.insuredPlanOrProgramName = payload.insuredPlanOrProgramName
                state.patientInsurance.insuredDateOfBirth = payload.insuredDateOfBirth
                state.patientInsurance.insuredGender = payload.insuredGender
                state.patientInsurance.coPayment = payload.coPayment
                state.patientInsurance.coInsurance = payload.coInsurance
                state.patientInsurance.insuranceDeductible = payload.insuranceDeductible
                state.patientInsurance.insuredAddress = payload.insuredAddress
                state.patientInsurance.insuredCity = payload.insuredCity
                state.patientInsurance.insuredState = payload.insuredState
                state.patientInsurance.insuredZip = payload.insuredZip
                state.patientInsurance.insuredPhone = payload.insuredPhone
                state.patientInsurance.payerName = payload.payerName
                state.patientInsurance.payerID = payload.payerID
                state.patientInsurance.payerAddress = payload.payerAddress
                state.patientInsurance.payerCity = payload.payerCity
                state.patientInsurance.payerState = payload.payerState
                state.patientInsurance.payerZip = payload.payerZip
                state.patientInsurance.referringProviderName = payload.referringProviderName
                state.patientInsurance.referringProviderNPI = payload.referringProviderNPI
                state.patientInsurance.referringProviderTaxonomy = payload.referringProviderTaxonomy
                state.patientInsurance.uuid = payload.uuid
            }
        },
        setLocationByID(state, payload) {
            state.loctionByID = payload
        },
        setDietData(state, payload) {
            state.diet = payload
        },
        setImmunizationData(state, payload) {
            state.immunizations = payload
        },
        setReproductiveData(state, payload) {
            state.reporductive = payload
        },
        setPatientFamilyConditiondData(state, payload) {
            state.personnalFamilyHistoy = payload
        },
        setGeneralProfileData(state, payload) {
            state.generalProfile = payload
        },
        setPatientFamilyHistoryData(state, payload) {
            state.patientFamilyHisotry = payload
        },
        setMedAndSupplementData(state, payload) {
            state.medAndSupplementData = payload
        },
        setCategories(state, payload) {
            state.categories = payload
        },
        setRoleList(state, payload) {
            state.roleList = payload
        },
        setDashboardStats(state, payload) {
            state.dashboardStats = payload
        },
        setProviderStats(state, payload) {
            state.providerStats = payload
        },
        setPatientStats(state, payload) {
            state.patientStats = payload
        },
        setInvoiceReport(state, payload) {
            state.invoiceReport = payload
        },
        setOrderTimeLine(state, payload) {
            state.orderTimeLine = payload
        },
        setPrescriptionReport(state, payload) {
            state.prescriptionReport = payload
        },

        setPatientDashbaordPortalStats(state, payload) {
            state.patientDashbaordPortalStats = payload
        },

        setForgotMessage(state, payload) {
            state.forgotMgs = payload
        },
        setWizardSetup(state, payload) {
            state.wizardSetup = payload
        },















    },
    actions: {
        updateFormField({ commit }, field) {
            commit('addFormField', field);
        },
        async saveClickedAppointment({ commit }, payload) {
            commit('setClickedAppointment', payload)
        },
        async saveAffiliatePorfile({ commit }, payload) {
            commit('setAffiliateProfile', payload)
        },
        async savePartnerPorfile({ commit }, payload) {
            commit('setPartnerProfile', payload)
        },

        async updateSelectedTimezone({ commit }, payload) {
            console.log("setSelectedTimezone", payload);
            commit("setSelectedTimezone", payload);
        },
        async updatePaymentProcessed({ commit }, payload) {
            commit("setPaymentProcessed", payload);
        },
        async updateAccessToken({ commit }, payload) {
            commit('setAccessToken', payload)
        },
        async updateErrors({ commit }, payload) {
            commit('setErrors', payload)
        },
        async updateSuccessIsTonalSnackbar({ commit }, payload) {
            commit('setSuccessMsg', payload)
        },
        async updateIsTonalSnackbar({ commit }, payload) {
            commit('setErrorMsg', payload)
        },
        async updateErrorMessage({ commit }, payload) {
            commit('setShowMsg', payload)
        },
        async updateIsLoading({ commit }, payload) {
            commit('setLoading', payload)
        },
        async savePatientPorfile({ commit }, payload) {
            commit('setLoading', true)
            commit('setPatientProfile', payload)
            commit('setLoading', false)
        },
        async saveVitalData({ commit }, payload) {
            //commit('setLoading', true)
            commit('setVitalClinic', payload)
            //commit('setLoading', false)
        },
        async updatePractitionerId({ commit }, payload) {
            commit('setPractitionerId', payload)
        },
        async updateConsentFormId({ commit }, payload) {
            commit('setConsentFormId', payload)
        },
        async updatePatientConsentFormItem({ commit }, payload) {
            commit('setPatientConsentFormItem', payload)
        },
        async updateQuestionerFormId({ commit }, payload) {
            commit('setQuestionerFormId', payload)
        },
        async updateIntakeFormId({ commit }, payload) {
            commit('setIntakeFormId', payload)
        },

        async widgetList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DROP_WIDGET_LIST, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                    commit('setLoading', false)
                },
            }

            )
            commit('setWidgetList', res.data)
            commit('setLoading', false)
        },
        async widgetDataChart({ commit }, payload) {
            commit('setLoading', true)
            let patient_id = ''
            if (payload.patient_id) {
                patient_id = '/' + payload.patient_id
            }
            const res = await $api(WIDGT_DATA + '/' + payload.chart + '/' + payload.id + patient_id, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                    commit('setLoading', false)
                },
            }

            )
            commit('setWidgetDataChart', res)
            commit('setLoading', false)
        },
        async wizardStup({ commit }, payload) {
            //commit('setLoading', true)
            const res = await $api(WIZARD_SETUPE_API, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            commit('setWizardSetup', res)
            //commit('setLoading', false)
        },
        async saveUser({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADD_USER_API, {
                method: 'POST',
                body: {
                    firstname: payload.firstName,
                    lastname: payload.lastName,
                    emailAddress: payload.emailAddress,
                    textMessageNumber: payload.textMessageNumber,
                    accessRights: payload.accessRights,
                    chartCoSigner: payload.chartCoSigner,
                    replyToEmail: payload.replyToEmail,
                    supervisor: payload.supervisor,
                    copyDetailsFrom: payload.copyDetailsFrom,
                    sendEmail: payload.sendEmail,
                    analytics: payload.analytics,
                    newUserPassword: payload.newUserPassword,
                    adminPassword: payload.adminPassword,
                    username: payload.username,
                    role_id: payload.role,
                    type: payload.type
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async providerRegister({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(PROVIDER_REGISTER_API, {
                method: 'POST',
                body: payload,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setErrorMsg', true)
                    commit('setShowMsg', response._data.data)
                },
            }

            )
            if (res.message) {
                ///commit('setSuccessMsg', true)
                commit('setRegisterProvider', res)
                //commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.data)
            }

            commit('setLoading', false)
        },

        async getPatientPortalProfile({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_PORTAL_API + '/' + payload.id, {
                method: 'GET',
            })
            commit('setPatientPortalProfile', res.profile)
            console.log("setPatientPortalProfile", res.profile)
            commit('setLoading', false)


        },

        async sendEmailForgotEmail({ commit }, payload) {
            commit('setLoading', true); // Set loading state
            try {
                const res = await $api(PATIENT_FORGOT_PASSWORD_PORTAL_API, {
                    method: 'POST',
                    body: {
                        email: payload.email
                    }
                });

                // Handle successful response
                console.log("message", res.message);
                commit('setForgotMessage', res.message)
                commit('setErrorMsg', false);
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)

            } catch (error) {
                // Handle errors
                console.error('Error sending forgot password email:', error);

                // Check if the error response contains specific error fields
                if (error.response) {
                    console.log("sad", error.response);
                    const errorData = error.response.data;
                    commit('setErrorMsg', true); // Set error state to true
                    commit('setShowMsg', error.response._data.message);

                }
            }


            commit('setLoading', false)

        },
        async resetPassword({ commit }, payload) {
            commit('setLoading', true); // Set loading state
            try {
                const res = await $api(PATIENT_RESET_PASSWORD_PORTAL_API, {
                    method: 'POST',
                    body: {
                        email: payload.email,
                        passcode: payload.passcode,
                        password: payload.password,
                        password_confirmation: payload.password_confirmation
                    }
                });

                // Handle successful response
                console.log(res);
                commit('setErrorMsg', false);
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)




            } catch (error) {
                // Handle errors
                console.error('Error sending forgot password email:', error);

                // Check if the error response contains specific error fields
                if (error.response) {
                    console.log("sad", error.response);
                    const errorData = error.response.data;
                    commit('setErrorMsg', true); // Set error state to true
                    commit('setShowMsg', error.response._data.message);

                }
            }


            commit('setLoading', false)

        },

        async getProviderProfile({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PROVIDER_API + '/' + payload.id, {
                method: 'GET',
            })
            commit('setProviderProfile', res.data)
            console.log("setProviderProfile", res.data)
        },

        async updatePatientPortalProfile({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_PATIENT_PORTAL_API + '/' + payload.id, {
                method: 'POST',
                body: {
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    dateOfBirth: payload.dateOfBirth,
                    sexatBirth: payload.sexatBirth,
                    address: payload.address,
                    zipcode: payload.zipcode,
                    city: payload.city,
                    state: payload.state,
                    race: payload.race,
                    genderIdentity: payload.genderIdentity,
                    patientNote: payload.patientNote,
                    password: payload.newUserPassword,
                    patientMaritalStatus: payload.patientMaritalStatus,
                    primaryCarePhysician: payload.primaryCarePhysician,
                    emergencyContactNumber: payload.emergencyContactNumber,
                    alternativePhone: payload.alternativePhone,
                    preferredPhone: payload.preferredPhone,
                    ageGroup: payload.ageGroup,
                    contactMethod: payload.contactMethod,
                    emergencyContactNameRelation: payload.emergencyContactNameRelation,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setErrorMsg', true)
                    commit('setShowMsg', response._data.message)
                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message);
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }

            commit('setLoading', false)
        },
        async updateProviderProfile({ commit }, payload) {
            console.log("updateProviderProfile", payload);
            commit('setLoading', true)
            const formData = new FormData();
            for (const key in payload) {
                formData.append(key, payload[key]);
            }
            const res = await $api(UPDATE_PROVIDER_API + '/' + payload.id, {
                method: 'POST',
                headers: {
                    'Accept': 'multipart/form-data',

                },
                body: formData,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setErrorMsg', true)
                    commit('setShowMsg', response._data.message)
                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message);
                // let id = localStorage.getItem('LoginUserUUId');
                // const provider = await $api(GET_PROVIDER_API+'/'+id, {
                //     method: 'GET',
                // })
                // const userData = useCookie('userData');

                // if(userData){
                // useCookie('userData').value = {};
                // userData.avatar = 'shajdkas';
                // }


            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },

        async updateUser({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_USER_API + '/' + payload.id, {
                method: 'PUT',
                body: {
                    firstname: payload.firstName,
                    lastname: payload.lastName,
                    emailAddress: payload.emailAddress,
                    textMessageNumber: payload.textMessageNumber,
                    accessRights: payload.accessRights,
                    chartCoSigner: payload.chartCoSigner,
                    replyToEmail: payload.replyToEmail,
                    supervisor: payload.supervisor,
                    copyDetailsFrom: payload.copyDetailsFrom,
                    sendEmail: payload.sendEmail,
                    analytics: payload.analytics,
                    newUserPassword: payload.newUserPassword,
                    adminPassword: payload.adminPassword,
                    username: payload.username,
                    role_id: payload.role,
                    type: payload.userType
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setErrorMsg', true)
                    commit('setShowMsg', response._data.message)
                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async updateUserStatus({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_USER_STATUS_API + '/' + payload.id, {
                method: 'PUT',
                body: {

                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            //commit('setUser', payload)
            commit('setLoading', false)
        },

        // async getPatientList({ commit }, payload) {
        //     commit('setLoading', true)
        //     const res = await $api(PATIENT_API, {
        //         method: 'GET',
        //     })
        //     commit('setPatientList', res.data)
        //     console.log("setPatientList",res.data)  
        // },

        async getListIpAccess({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_LIST_IP_ACCESS_API, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            },


            )
            commit('setIpAccessList', res.iplist)
            commit('setLoading', false)
        },
        async updateIpAccess({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_IP_ACCESS_API, {
                method: 'POST',
                body: {
                    ip: payload.ip,
                    description: payload.description
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )

            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async getListTask({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_TASK_API_LIST + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            },


            )
            commit('setTaskList', res)
            commit('setLoading', false)
        },

        async getPatientTags({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(PATIENT_TAGS_API + '/' + payload.id, {
                method: 'GET',

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            },
            )
            // console.log("asdatags", res);  
            commit('setPatientTags', res.data);
            commit('setLoading', false)
        },
        async addTask({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_IP_ACCESS_API, {
                method: 'POST',
                body: {
                    ip: payload.ip,
                    description: payload.description
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )

            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async setFakeipAccess({ commit }, payload) {
            commit('setLoading', true)
            commit('setIpAccessList', payload)
            commit('setLoading', false)
        },
        async getUser({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_USERS_LIST, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setUser', res.userList)
            commit('setLoading', false)
        },
        async getPatientPortalPractitioners({ commit }, payload) {
            if (payload && payload.idPage != 'calender') {
                commit('setLoading', true)
            }

            const res = await $api(PATIENT_USER_LIST_API, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            })

            commit("setPractitioners", res.userList)
            commit('setLoading', false)
        },
        async getPractitioners({ commit }, payload) {
            if (payload && payload.idPage != 'calender') {
                commit('setLoading', true)
            }

            const res = await $api(GET_PRACTITIONER_LIST, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            })

            commit("setPractitioners", res.data)
            commit('setLoading', false)
        },
        async getLocations({ commit }, payload) {
            if (payload && payload.idPage != 'calender') {
                commit('setLoading', true)
            }
            const res = await $api(LOCATIONS_API, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            })


            commit('setLocationData', res.data)
            commit('setLoading', false)
        },
        async saveLocation({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADD_LOCATIONS_API, {
                method: 'POST',
                body: payload,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log(res)
            if (res.error) {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.error)
            } else {
                commit('setSuccessMsg', true)
                commit('setShowMsg', 'Successfully Location Created !')
            }
            //commit('setLocation', payload.res)
            //console.log("asdas", payload.res);

            commit('setLoading', false)
            //   commit('setErrorMsg', false)
            // commit('setSuccessMsg', false)
        },
        async upadetLocation({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_LOCATIONS_API + '/' + payload.uuid, {
                method: 'POST',
                body: payload,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.error) {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.error)
            } else {
                commit('setSuccessMsg', true)
                commit('setShowMsg', 'Successfully Location Updated !')
            }
            commit('setLoading', false)
            //commit('setErrorMsg', false)
            //commit('setSuccessMsg', false)
        },
        async getLocationbyId({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(EDIT_LOCATIONS_API + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setLocationByID', payload.res)
            //console.log("asdas", payload.res);
            commit('setLoading', false)
        },
        async getVitalByIdAction({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_VITAL_BY_ID + '/' + payload.pid + '/' + payload.eid + '/' + payload.vid + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setVitalById', res)
            //console.log("asdas", payload.res);
            commit('setLoading', false)
        },

        async getVendors({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(INVENTORY_API, {
                method: 'GET',
                vendor_name: payload.vendor_name, // Send vendor_name as a parameter
            });
            console.log("setVendorData", res.inventory)
            commit('setVendorData', res.inventory)
            commit('setLoading', false)
        },
        async getSingleVendors({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_SINGLE_INVENTORY_API + '/' + payload.id, {
                method: 'GET',
            })
            console.log("setSingleInventoryData", res)
            commit('setSingleInventoryData', res)
            commit('setLoading', false)
        },

        async editPatientProfile({ commit }, payload) {
            console.log("payload", payload);
            commit('setLoading', true)
            commit('setPatientAvater', payload.avater);
            const res = await $api(GET_SINGLE_PATIENT_API + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            });
            console.log("editPatientProfile", res.data);
            commit('setEditPatientProfile', res.data)
            commit('setLoading', false)
        },
        async editGetPatientProfile({ commit }, payload) {
            console.log("payload", payload);
            commit('setLoading', true)
            commit('setPatientAvater', payload.avater);
            const res = await $api(GET_SINGLE_GET_PATIENT_API + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            });
            console.log("editPatientProfile", res.data);
            commit('setEditPatientProfile', res.data)
            commit('setLoading', false)
        },
        async getPatientData({ commit }, payload) {
            console.log("payload", payload);
            commit('setLoading', true)
            // const res = await $api(PATIENT_API+'/'+payload.id, {
            //     method: 'POST',
            //     onResponseError({ response }) {
            //         commit('setLoading', false)
            //         console.log(response)

            //     },
            //   });
            console.log("12312", payload.item);
            //commit('setEditPatientProfile', payload.item)
            commit('setLoading', false)
        },
        async getPatientInsursance({ commit }, payload) {
            console.log("payload", payload);
            commit('setLoading', true)
            const res = await $api(GET_INSURACNE_API + '/' + payload.id, {
                method: 'POST',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            });
            console.log("patientInsursanceData", res.data[0]);
            commit('setPatientIsursance', res.data[0])
            commit('setLoading', false)
        },

        async addDocument({ commit }, payload) {
            commit('setLoading', true)
            const formData = new FormData();
            for (const key in payload) {
                formData.append(key, payload[key]);
            }
            try {
                //https://apiopenerm.codelfi.com/api/emr/store-document/1?path=labreport
                const res = await $api(ADD_DOCUMENT_NEW + '/' + payload.id + '?path=' + payload.path, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'multipart/form-data',

                    },
                    onResponseError({ response }) {
                        commit('setLoading', false);
                        console.log(response);
                    },
                });
                // const accessToken = useCookie('accessToken').value;
                // const res = await axios.post(`https://apiopenerm.codelfi.com/api/emr/store-document/${payload.id}?path=${payload.path}`, formData, {  
                //     headers: {  
                //         'Accept': 'multipart/form-data', 
                //         Authorization: `Bearer ${accessToken}`,
                //         AccessToken:`${accessToken}`
                //     },  
                //   });  

                console.log(res)
                if (res.error) {
                    commit('setErrorMsg', true)
                    commit('setShowMsg', res.error)
                }
                if (res.message) {
                    commit('setSuccessMsg', true)
                    commit('setShowMsg', 'Successfully Document Added !')
                }
                commit('setLoading', false)
                //commit('setErrorMsg', false)
                //commit('setSuccessMsg', false) 
            } catch (error) {
                console.error(error);
                commit('setLoading', false)
                // Handle error case  
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async addClinicalRecard({ commit }, payload) {
            commit('setLoading', true)
            const formData = new FormData();
            for (const key in payload) {
                formData.append(key, payload[key]);
            }
            try {
                //https://apiopenerm.codelfi.com/api/emr/store-document/1?path=labreport
                const res = await $api(CLICNIC_VITAL_API + '/' + payload.uuid, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'multipart/form-data',

                    },
                    onResponseError({ response }) {
                        commit('setLoading', false);
                        console.log(response);
                    },
                });
                // const accessToken = useCookie('accessToken').value;
                // const res = await axios.post(`https://apiopenerm.codelfi.com/api/emr/store-document/${payload.id}?path=${payload.path}`, formData, {  
                //     headers: {  
                //         'Accept': 'multipart/form-data', 
                //         Authorization: `Bearer ${accessToken}`,
                //         AccessToken:`${accessToken}`
                //     },  
                //   });  

                console.log(res)
                if (res.error) {
                    commit('setErrorMsg', true)
                    commit('setShowMsg', res.error)
                }
                if (res.message == "success") {
                    commit('setSuccessMsg', true)
                    commit('setShowMsg', 'Successfully  Added !')
                }
                commit('setLoading', false)
                //commit('setErrorMsg', false)
                //commit('setSuccessMsg', false) 
            } catch (error) {
                console.error(error);
                commit('setLoading', false)
                // Handle error case  
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async updateDocument({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api('/api/apps/users/' + payload.id, {
                method: 'PUT',
                body: payload,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            })
            //commit('setUser', payload)
            commit('setLoading', false)
        },

        async getPhoneLogList({ commit }, payload) {
            commit('setLoading', true)

            const res = await $api(GET_LIST_PHONE_LOG_API + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.phoneLogList) {
                commit('setPhoneLogList', res.phoneLogList)
            } else {
                commit('setPhoneLogList', res)
            }

            commit('setLoading', false)
        },
        async AddPhoneLog({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADD_PHONE_LOG + '/' + payload.uuid, {
                method: 'POST',
                body: {
                    provider: payload.provider,
                    user_uuid: payload.user_uuid,
                    message: payload.message
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Phone Log Created !')
            //commit('setPhoneLogList', res.phoneLogList)
            commit('setLoading', false)
        },
        async setPhoneLogList({ commit }, payload) {
            commit('setLoading', true)
            commit('setIpAccessList', payload)
            commit('setLoading', false)
        },
        async getMessageList({ commit }, payload) {
            commit('setLoading', true)

            const res = await $api(GET_MESSAGE_LIST + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.messageList) {
                commit('setMessageList', res.messageList)
            } else {
                commit('setMessageList', res)
            }

            commit('setLoading', false)
        },
        async AddMessage({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(Add_MESSAGE_API + '/' + payload.uuid, {
                method: 'POST',

                body: {
                    subject: payload.subject,
                    message: payload.message,
                    with_name: payload.with_name
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Message Created !')
            //commit('setPhoneLogList', res.phoneLogList)
            commit('setLoading', false)
        },
        async setMessageList({ commit }, payload) {
            commit('setLoading', true)
            commit('setMessageList', payload)
            commit('setLoading', false)
        },
        async getMessageListSubject({ commit }, payload) {
            commit('setLoading', true)

            const res = await $api(GET_SUBJECT_MESSAGE + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log(res)
            commit('setSubjectMessageList', res)
            commit('setLoading', false)
        },
        async setMessageSubject({ commit }, payload) {
            commit('setLoading', true)
            commit('setSubjectMessageList', payload)
            commit('setLoading', false)
        },
        async AddMessageOnBaseSubject({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADD_MESSAGE_ON_BASE_SUBJECT + '/' + payload.subject, {
                method: 'POST',
                body: {
                    message: payload.message
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )

            //commit('setPhoneLogList', res.phoneLogList)
            commit('setLoading', false)
        },

        async getAppointmentsList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_APPOINTMENTS + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setAppointments', res.data)
            commit('setLoading', false)
        },
        async getEmailList({ commit }, payload) {
            commit('setLoading', true)

            const res = await $api(GET_EMAIL_LIST + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.emailList) {
                commit('setEmailList', res.emailList)
            } else {
                commit('setEmailList', res)
            }

            commit('setLoading', false)
        },
        async AddEmail({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADD_EMAIL_API + '/' + payload.uuid, {
                method: 'POST',
                body: {
                    practitioner: payload.practitioner,
                    messageText: payload.messageText,
                    to_email: payload.to_email,
                    from_email: payload.from_email,
                    emailTempalte: payload.emailTempalte,
                    subject: payload.subject
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Email Added !')
            //commit('setPhoneLogList', res.phoneLogList)

        },
        async getEmailMessageBySubject({ commit }, payload) {
            commit('setLoading', true)

            const res = await $api(GET_EMAIL_MESSAGE_BY_SUBJECT + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log(res)
            commit('setSubjectEmailList', res.subjectEmailList)
            commit('setLoading', false)
        },
        //Inventory 
        async getInvoiceReport({ commit }, payload) {
            commit('setLoading', true)
            console.log("report", payload);
            const res = await $api(INVOICE_REPORT_API, {
                method: 'POST',
                body: {
                    start_date: payload.start_date,
                    end_date: payload.end_date,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setInvoiceReport", res);
            commit('setInvoiceReport', res)
            commit('setLoading', false)
        },

        async getOrderTimeLineReport({ commit }, payload) {
            commit('setLoading', true)
            console.log("report", payload);
            const res = await $api(ORDER_TIMELINE_REPORT, {
                method: 'POST',
                body: {
                    start_date: payload.start_date,
                    end_date: payload.end_date,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setOrderTimeLine", res);
            commit('setOrderTimeLine', res)
            commit('setLoading', false)
        },
        async getPatientStats({ commit }, payload) {
            commit('setLoading', true)
            console.log("report", payload);
            const res = await $api(PATIENT_REPORT_API, {
                method: 'POST',
                body: {
                    start_date: payload.start_date,
                    end_date: payload.end_date,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setPatientStats", res);
            commit('setPatientStats', res)
            commit('setLoading', false)
        },

        async getPatientDashbaordPortalStats({ commit }, payload) {
            commit('setLoading', true)
            console.log("report", payload);
            let id = localStorage.getItem('LoginUserId');
            const res = await $api(PATIENT_DASHBOARD_PORTAL_API + '/' + id, {
                method: 'POST',
                body: {
                    start_date: payload.start_date,
                    end_date: payload.end_date,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setPatientDashbaordPortalStats", res);
            commit('setPatientDashbaordPortalStats', res)
            commit('setLoading', false)
        },
        async getProviderStats({ commit }, payload) {
            commit('setLoading', true)
            console.log("report", payload);
            const res = await $api(PROVIDER_STATS_API, {
                method: 'POST',
                body: {
                    start_date: payload.start_date,
                    end_date: payload.end_date,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setProviderStats", res);
            commit('setProviderStats', res)
            commit('setLoading', false)
        },
        async getPrescriptionReport({ commit }, payload) {
            commit('setLoading', true)
            console.log("report", payload);
            const res = await $api(PRESCRIPTION_REPORT, {
                method: 'POST',
                body: {
                    start_date: payload.start_date,
                    end_date: payload.end_date,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setPrescriptionReport", res);
            commit('setPrescriptionReport', res)
            commit('setLoading', false)
        },
        async getDashbaordStats({ commit }, payload) {
            commit('setLoading', true)
            console.log("report", payload);
            const res = await $api(DASHBOARD_API, {
                method: 'POST',
                body: {
                    start_date: payload.start_date,
                    end_date: payload.end_date,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setDashboardStats", res);
            commit('setDashboardStats', res)
            commit('setLoading', false)
        },

        async getAppointmentsReport({ commit }, payload) {
            commit('setLoading', true)
            console.log("report", payload);
            const res = await $api(APPIONMENT_REPORT_API, {
                method: 'POST',
                body: {
                    start_date: payload.start_date,
                    end_date: payload.end_date,
                    provider: payload.provider,
                    status: payload.status,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setAppiontmentReport", res);
            commit('setAppiontmentReport', res)
            commit('setLoading', false)
        },
        async isAppiontmentExcelFile({ commit }, payload) {
            commit('setLoading', true);
            console.log("Downloading Excel report with payload:", payload);

            try {
                // Make the API call to fetch the Excel file
                const res = await $api(
                    `${DOWNLOAD_APPIONMENT_CSV_REPORT_API}?start_date=${payload.start_date}&end_date=${payload.end_date}&provider=${payload.provider}`,
                    {
                        method: 'GET',
                        responseType: 'blob', // Ensure the response is treated as a binary file
                    }
                );

                // Create a URL for the blob and initiate the download
                // const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                const downloadUrl = window.URL.createObjectURL(res);

                // Create a temporary link element
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `Appointment_Report_${payload.start_date}.csv`; // Name the file
                document.body.appendChild(link);
                link.click();

                // Clean up the link
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);

            } catch (error) {
                console.error('Error downloading Excel file:', error);
            } finally {
                commit('setLoading', false);
            }
        },

        async isAppiontmentPDFFile({ commit }, payload) {
            try {
                commit('setLoading', true);
                console.log('report', payload);

                // Construct the URL with query parameters
                const url = `${DOWNLOAD_APPIONMENT_PDF_REPORT_API}?start_date=${payload.start_date}&end_date=${payload.end_date}&provider=${payload.provider}`;

                // Make the API call with responseType as 'blob'
                const res = await $api(url, {
                    method: 'GET',
                    responseType: 'blob', // Ensure the response is treated as a Blob
                    onResponseError({ response }) {
                        console.error('Error:', response);
                        commit('setLoading', false);
                    },
                });
                console.log("pdf", res);
                // Create a Blob URL for the PDF
                const urlBlob = window.URL.createObjectURL(res);

                // Create a link element
                const link = document.createElement('a');
                link.href = urlBlob;

                // Set the file name dynamically or use a default name
                const fileName = `appointment-report-${payload.start_date}-${payload.end_date}.pdf`;
                link.setAttribute('download', fileName);

                // Append the link to the document body and trigger download
                document.body.appendChild(link);
                link.click();

                // Clean up the URL object and DOM element
                link.remove();
                window.URL.revokeObjectURL(urlBlob);

            } catch (error) {
                console.error('Error downloading the PDF:', error);
            } finally {
                commit('setLoading', false);
            }
        },

        async isInvoiceExcelFile({ commit }, payload) {
            commit('setLoading', true);
            console.log("Downloading Excel report with payload:", payload);

            try {
                // Make the API call to fetch the Excel file
                const res = await $api(
                    `${INVOICE_CSV_REPORT_API}?start_date=${payload.start_date}&end_date=${payload.end_date}`,
                    {
                        method: 'GET',
                        responseType: 'blob', // Ensure the response is treated as a binary file
                    }
                );

                // Create a URL for the blob and initiate the download
                // const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                const downloadUrl = window.URL.createObjectURL(res);

                // Create a temporary link element
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `Invoice_Report_${payload.start_date}.csv`; // Name the file
                document.body.appendChild(link);
                link.click();

                // Clean up the link
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);

            } catch (error) {
                console.error('Error downloading Excel file:', error);
            } finally {
                commit('setLoading', false);
            }
        },

        async isInvoicePDFFile({ commit }, payload) {
            try {
                commit('setLoading', true);
                console.log('report', payload);

                // Construct the URL with query parameters
                const url = `${INVOICE_PDF_REPORT_API}?start_date=${payload.start_date}&end_date=${payload.end_date}`;

                // Make the API call with responseType as 'blob'
                const res = await $api(url, {
                    method: 'GET',
                    responseType: 'blob', // Ensure the response is treated as a Blob
                    onResponseError({ response }) {
                        console.error('Error:', response);
                        commit('setLoading', false);
                    },
                });
                console.log("pdf", res);
                // Create a Blob URL for the PDF
                const urlBlob = window.URL.createObjectURL(res);

                // Create a link element
                const link = document.createElement('a');
                link.href = urlBlob;

                // Set the file name dynamically or use a default name
                const fileName = `invoice-report-${payload.start_date}-${payload.end_date}.pdf`;
                link.setAttribute('download', fileName);

                // Append the link to the document body and trigger download
                document.body.appendChild(link);
                link.click();

                // Clean up the URL object and DOM element
                link.remove();
                window.URL.revokeObjectURL(urlBlob);

            } catch (error) {
                console.error('Error downloading the PDF:', error);
            } finally {
                commit('setLoading', false);
            }
        },

        async isPatientExcelFile({ commit }, payload) {
            commit('setLoading', true);
            console.log("Downloading Excel report with payload:", payload);

            try {
                // Make the API call to fetch the Excel file
                const res = await $api(
                    `${PATIENT_STATS_CSV}?start_date=${payload.start_date}&end_date=${payload.end_date}`,
                    {
                        method: 'GET',
                        responseType: 'blob', // Ensure the response is treated as a binary file
                    }
                );

                // Create a URL for the blob and initiate the download
                // const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                const downloadUrl = window.URL.createObjectURL(res);

                // Create a temporary link element
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `patient_Report_${payload.start_date}.csv`; // Name the file
                document.body.appendChild(link);
                link.click();

                // Clean up the link
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);

            } catch (error) {
                console.error('Error downloading Excel file:', error);
            } finally {
                commit('setLoading', false);
            }
        },

        async isPatientPDFFile({ commit }, payload) {
            try {
                commit('setLoading', true);
                console.log('report', payload);

                // Construct the URL with query parameters
                const url = `${PATIENT_REPORT_PDF}?start_date=${payload.start_date}&end_date=${payload.end_date}`;

                // Make the API call with responseType as 'blob'
                const res = await $api(url, {
                    method: 'GET',
                    responseType: 'blob', // Ensure the response is treated as a Blob
                    onResponseError({ response }) {
                        console.error('Error:', response);
                        commit('setLoading', false);
                    },
                });
                console.log("pdf", res);
                // Create a Blob URL for the PDF
                const urlBlob = window.URL.createObjectURL(res);

                // Create a link element
                const link = document.createElement('a');
                link.href = urlBlob;

                // Set the file name dynamically or use a default name
                const fileName = `patient-report-${payload.start_date}-${payload.end_date}.pdf`;
                link.setAttribute('download', fileName);

                // Append the link to the document body and trigger download
                document.body.appendChild(link);
                link.click();

                // Clean up the URL object and DOM element
                link.remove();
                window.URL.revokeObjectURL(urlBlob);

            } catch (error) {
                console.error('Error downloading the PDF:', error);
            } finally {
                commit('setLoading', false);
            }
        },

        async isProviderExcelFile({ commit }, payload) {
            commit('setLoading', true);
            console.log("Downloading Excel report with payload:", payload);

            try {
                // Make the API call to fetch the Excel file
                const res = await $api(
                    `${PROVIDER_STATS_CSV}?start_date=${payload.start_date}&end_date=${payload.end_date}`,
                    {
                        method: 'GET',
                        responseType: 'blob', // Ensure the response is treated as a binary file
                    }
                );

                // Create a URL for the blob and initiate the download
                // const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                const downloadUrl = window.URL.createObjectURL(res);

                // Create a temporary link element
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `provider_Report_${payload.start_date}.csv`; // Name the file
                document.body.appendChild(link);
                link.click();

                // Clean up the link
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);

            } catch (error) {
                console.error('Error downloading Excel file:', error);
            } finally {
                commit('setLoading', false);
            }
        },

        async isProviderPDFFile({ commit }, payload) {
            try {
                commit('setLoading', true);
                console.log('report', payload);

                // Construct the URL with query parameters
                const url = `${PROVIDER_REPORT_PDF}?start_date=${payload.start_date}&end_date=${payload.end_date}`;

                // Make the API call with responseType as 'blob'
                const res = await $api(url, {
                    method: 'GET',
                    responseType: 'blob', // Ensure the response is treated as a Blob
                    onResponseError({ response }) {
                        console.error('Error:', response);
                        commit('setLoading', false);
                    },
                });
                console.log("pdf", res);
                // Create a Blob URL for the PDF
                const urlBlob = window.URL.createObjectURL(res);

                // Create a link element
                const link = document.createElement('a');
                link.href = urlBlob;

                // Set the file name dynamically or use a default name
                const fileName = `provider-report-${payload.start_date}-${payload.end_date}.pdf`;
                link.setAttribute('download', fileName);

                // Append the link to the document body and trigger download
                document.body.appendChild(link);
                link.click();

                // Clean up the URL object and DOM element
                link.remove();
                window.URL.revokeObjectURL(urlBlob);

            } catch (error) {
                console.error('Error downloading the PDF:', error);
            } finally {
                commit('setLoading', false);
            }
        },


        async getSingleInventory({ commit }, payload) {
            commit('setLoading', true)

            const res = await $api(GET_SINGLE_INVENTORY_API + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log("setSingleInventory", res);
            commit('setSingleInventory', res)
            commit('setLoading', false)
        },

        async saveLoginUser({ commit }, payload) {
            commit('setLoading', true)

            console.log("setLoginUser", payload.res.userData);
            commit('setLoginUser', payload.res.userData)
            localStorage.setItem('LoginUserId', payload.res.userData.id)
            localStorage.setItem('LoginUserUUId', payload.res.userData.uuid)
            commit('setLoading', false)
        },
        async saveInventoryData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADD_INVENTORY_API, {
                method: 'POST',
                body: {
                    inventoryType: payload.inventoryType,
                    item_name: payload.item_name,
                    manufPartNo: payload.manufPartNo,
                    barcode: payload.barcode,
                    isTaxable: payload.isTaxable,
                    vendor_name: payload.vendor_name,
                    price: payload.price,
                    cost: payload.cost,
                    onhand: payload.onhand,
                    expirationDate: payload.expirationDate,
                    sizeWeightNumber: payload.sizeWeightNumber,
                    typicalDosageQty: payload.typicalDosageQty,
                    reorderPoint: payload.reorderPoint,
                    minimumOHDesired: payload.minimumOHDesired,
                    secondaryVendor: payload.secondaryVendor,
                    secondaryVendorPartNo: payload.secondaryVendorPartNo,
                    secondaryVendorBarcode: payload.secondaryVendorBarcode,
                    lotNo: payload.lotNo,
                    description: payload.description,
                    categorizationSubType: payload.categorizationSubType,
                    cogsFactor: payload.cogsFactor,
                    categorizationType: payload.categorizationType,
                    location: payload.location,
                    osmolarityMOsmml: payload.osmolarityMOsmml,
                    isIV: payload.isIV,
                    isTinchure: payload.isTinchure,
                    isHormone: payload.isHormone,
                    isHerbalFormula: payload.isHerbalFormula,
                    isPharmaCompound: payload.isPharmaCompound,
                    other: payload.other,
                    beforeBreakfast: payload.beforeBreakfast,
                    breakfast: payload.breakfast,
                    beforeLunch: payload.beforeLunch,
                    lunch: payload.lunch,
                    beforeDinner: payload.beforeDinner,
                    dinner: payload.dinner,
                    beforeSleep: payload.beforeSleep,
                    notes: payload.notes,
                    healthBenefits: payload.healthBenefits
                },

            }

            )
            commit('setLoading', false)
        },
        async updateInventoryData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_INVENTORY_API + '/' + payload.id, {
                method: 'PUT',
                body: {
                    inventoryType: payload.inventoryType,
                    item_name: payload.item_name,
                    manufPartNo: payload.manufPartNo,
                    barcode: payload.barcode,
                    isTaxable: payload.isTaxable,
                    vendor_name: payload.vendor_name,
                    price: payload.price,
                    cost: payload.cost,
                    onhand: payload.onhand,
                    expirationDate: payload.expirationDate,
                    sizeWeightNumber: payload.sizeWeightNumber,
                    typicalDosageQty: payload.typicalDosageQty,
                    reorderPoint: payload.reorderPoint,
                    minimumOHDesired: payload.minimumOHDesired,
                    secondaryVendor: payload.secondaryVendor,
                    secondaryVendorPartNo: payload.secondaryVendorPartNo,
                    secondaryVendorBarcode: payload.secondaryVendorBarcode,
                    lotNo: payload.lotNo,
                    description: payload.description,
                    categorizationSubType: payload.categorizationSubType,
                    cogsFactor: payload.cogsFactor,
                    categorizationType: payload.categorizationType,
                    location: payload.location,
                    osmolarityMOsmml: payload.osmolarityMOsmml,
                    isIV: payload.isIV,
                    isTinchure: payload.isTinchure,
                    isHormone: payload.isHormone,
                    isHerbalFormula: payload.isHerbalFormula,
                    isPharmaCompound: payload.isPharmaCompound,
                    other: payload.other,
                    beforeBreakfast: payload.beforeBreakfast,
                    breakfast: payload.breakfast,
                    beforeLunch: payload.beforeLunch,
                    lunch: payload.lunch,
                    beforeDinner: payload.beforeDinner,
                    dinner: payload.dinner,
                    beforeSleep: payload.beforeSleep,
                    notes: payload.notes,
                    healthBenefits: payload.healthBenefits
                },
                onResponseError({ response }) {
                    console.log('gggggg ', response)
                    commit('setLoading', false)
                },

            }

            )
            commit('setLoading', false)
        },

        async deleteInventory({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DELETE_INVENTORY_API + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                    commit('setLoading', false)
                },
            }

            )
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async deleteProduct({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DELETE_PRODUCT + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                    commit('setLoading', false)
                },
            }

            )
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async addOrder({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADD_ORDER_API, {
                method: 'POST',
                body: {
                    practitioner_name: payload.practitioner_name,
                    vendor_type: payload.vendorType,
                    vendor_name: payload.selectedVendor,
                    description: payload.description,
                    location: payload.location,
                    orderedTotalPrice: '324',
                    actualPOTotalprice: '324',
                    status: payload.status,
                    date: payload.date,
                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Order Added !')
            //commit('setPhoneLogList', res.phoneLogList)

        },
        async fetchFiltereAvailability({ commit }, payload) {
            console.log('payload', payload)
            commit('setLoading', true)
            const res = await $api(GET_PROVIDER_AVAILABILITY_LIST, {
                method: 'POST',
                body: {
                    start_date: payload.startDate,
                    end_date: payload.endDate,
                    practitioner_id: payload.practitioner_id
                },

            }

            )
            commit('setAvailability', res)
            commit('setLoading', false)

        },
        async fetchPatientPortalAppointments({ commit }, payload) {
            console.log('payload', payload)
            let id = localStorage.getItem('LoginUserId')
            const res = await $api(PATIENT_PORTAL_APPOINTMENTS_API + '/' + id, {
                method: 'POST',
                body: {
                    start_date: payload.startDate,
                    end_date: payload.endDate,
                },

            }

            )
            commit('setAppointments', res.appointments)
            commit('setGAppointments', res.googel_events)
            commit('setLoading', false)
            // try {
            //     // commit('setLoading', true)
            //     const res = await $api(GET_FILTERED_APPOINTMENT, {
            //         method: 'POST',
            //         body: {
            //             start_date:payload.startDate,
            //             end_date:payload.endDate,
            //         },
            //         onResponseError({ response }) {
            //             // commit('setLoading', false)
            //             console.log('Error fetching appointments:', response)
            //             throw new Error(response.data?.message || 'Failed to fetch appointments')
            //         },
            //     })

            //     commit('setAppointments', res.appointments)
            //     commit('setLoading', false)
            // } catch (error) {
            //     console.error('Error in fetchFilteredAppointments:', error)
            //     throw error
            // } finally {
            //     // commit('setLoading', false)
            // }
        },
        async fetchFilteredAppointments({ commit }, payload) {
            console.log('payload', payload)
            const res = await $api(GET_FILTERED_APPOINTMENT, {
                method: 'POST',
                body: {
                    start_date: payload.startDate,
                    end_date: payload.endDate,
                },

            }

            )
            commit('setAppointments', res.appointments)
            commit('setGAppointments', res.googel_events)
            commit('setLoading', false)
            // try {
            //     // commit('setLoading', true)
            //     const res = await $api(GET_FILTERED_APPOINTMENT, {
            //         method: 'POST',
            //         body: {
            //             start_date:payload.startDate,
            //             end_date:payload.endDate,
            //         },
            //         onResponseError({ response }) {
            //             // commit('setLoading', false)
            //             console.log('Error fetching appointments:', response)
            //             throw new Error(response.data?.message || 'Failed to fetch appointments')
            //         },
            //     })

            //     commit('setAppointments', res.appointments)
            //     commit('setLoading', false)
            // } catch (error) {
            //     console.error('Error in fetchFilteredAppointments:', error)
            //     throw error
            // } finally {
            //     // commit('setLoading', false)
            // }
        },

        async saveAppointment({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_NEW_APPOINTMENT, {
                method: 'POST',
                body: {
                    practitioner_id: payload.practitioner_id,
                    patient_id: payload.patient_id,
                    title: payload.title,
                    date: payload.date,
                    start_time: payload.start_time,
                    end_time: payload.end_time,
                    status: payload.status,
                    service: payload.service,
                    location: payload.location,
                    room: payload.room,
                    appointment_type: payload.appointment_type,
                    payment_type: payload.payment_type,
                    notes: payload.notes,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setSuccessMsg', true)
                    commit('setShowMsg', 'Appointment Booked Successfully!')

                },
            })
            if (res && res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            commit('setLoading', false)
        },
        async saveAvailability({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(PROVIDER_ADD_AVAILABILITY, {
                method: 'POST',
                body: payload,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setErrorMsg', true)
                    commit('setShowMsg', 'something wrong!')

                },
            })
            if (res && res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            }
            commit('setLoading', false)
        },
        async updateAvailability({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(PROVIDER_UPDATE_AVAILABILITY + '/' + payload.id, {
                method: 'POST',
                body: payload,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setErrorMsg', true)
                    commit('setShowMsg', 'something wrong!')

                },
            })
            if (res && res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            }

            commit('setLoading', false)
        },
        async deleteAvailability({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(PROVIDER_DELETE_AVAILABILITY + '/' + payload.id, {
                method: 'POST',
                body: payload,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setErrorMsg', true)
                    commit('setShowMsg', 'something wrong!')

                },
            })
            if (res && res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            }

            commit('setLoading', false)
        },
        async getLabDiagnosticsList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_LABDIAGNOSTICS + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setLabdiagonostics', res.labdiagnostics)
            commit('setLoading', false)
        },

        async saveLabDiagnostics({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_LABDIAGONOSTICS, {
                method: 'POST',
                body: {
                    practitioner_id: payload.practitioner_id,
                    location: payload.location,
                    lab: payload.lab,
                    courtesy: {
                        copy: payload.courtesy.copy,
                        fax_number: payload.courtesy.fax_number,
                        fax_attn: payload.courtesy.fax_attn,
                        account_attn: payload.courtesy.account_attn,
                    },
                    payer: payload.payer,
                    includeSecIns: payload.includeSecIns,
                    isWorkersComp: payload.isWorkersComp,
                    orderPSC: payload.orderPSC,
                    DiagnosisCode: {
                        diagnosisCode: payload.DiagnosisCode.diagnosisCode,
                        diagnosticTests: payload.DiagnosisCode.diagnosticTests,
                    },
                    orderDetails: {
                        priority: payload.orderDetails.priority,
                        collectionDateTime: payload.orderDetails.collectionDateTime,
                        collectionDate: payload.orderDetails.collectionDate,
                        specimenSource: payload.orderDetails.specimenSource,
                        relevantClinicalInfo: payload.orderDetails.relevantClinicalInfo,
                        notes: payload.orderDetails.notes,
                        sourceSiteDetails: payload.orderDetails.sourceSiteDetails,
                        race: payload.orderDetails.race,
                        hispanicHeritage: payload.orderDetails.hispanicHeritage,
                        specimenActionCode: payload.orderDetails.specimenActionCode,
                        height: payload.orderDetails.height,
                        weight: payload.orderDetails.weight,
                        volume: payload.orderDetails.volume,
                    },
                    maternalScreening: {
                        insulinDependent: payload.maternalScreening.insulinDependent,
                        numberOfFetuses: payload.maternalScreening.numberOfFetuses,
                        otherIndications: payload.maternalScreening.otherIndications,
                        additionalInfo: payload.maternalScreening.additionalInfo,
                        donorEgg: payload.maternalScreening.donorEgg,
                        ageOfDonor: payload.maternalScreening.ageOfDonor,
                        typeOfEggDonor: payload.maternalScreening.typeOfEggDonor,
                        gestationalAgeWeeks: payload.maternalScreening.gestationalAgeWeeks,
                        gestationalAgeDays: payload.maternalScreening.gestationalAgeDays,
                        gestationalAgeDecimal: payload.maternalScreening.gestationalAgeDecimal,
                        gestationalAgeDate: payload.maternalScreening.gestationalAgeDate,
                        crownRumpLength: payload.maternalScreening.crownRumpLength,
                        sonographerLastName: payload.maternalScreening.sonographerLastName,
                        sonographerFirstName: payload.maternalScreening.sonographerFirstName,
                        sonographerId: payload.maternalScreening.sonographerId,
                        nuchalTranslucency: payload.maternalScreening.nuchalTranslucency,
                        nuchalTranslucencyTwinB: payload.maternalScreening.nuchalTranslucencyTwinB,
                    },
                    bethesdaCytology: {
                        cervix: payload.bethesdaCytology.cervix,
                        endocervix: payload.bethesdaCytology.endocervix,
                        labiaVulva: payload.bethesdaCytology.labiaVulva,
                        vagina: payload.bethesdaCytology.vagina,
                        endometrium: payload.bethesdaCytology.endometrium,
                        labiumMajus: payload.bethesdaCytology.labiumMajus,
                        labiumMinus: payload.bethesdaCytology.labiumMinus,
                        vulva: payload.bethesdaCytology.vulva,
                        lmpMenoDate: payload.bethesdaCytology.lmpMenoDate,
                        none: payload.bethesdaCytology.none,
                        coniza: payload.bethesdaCytology.coniza,
                        colpBX: payload.bethesdaCytology.colpBX,
                        laserVap: payload.bethesdaCytology.laserVap,
                        cryo: payload.bethesdaCytology.cryo,
                        radiation: payload.bethesdaCytology.radiation,
                        datesResults: payload.bethesdaCytology.datesResults,
                        pregnant: payload.bethesdaCytology.pregnant,
                        lactating: payload.bethesdaCytology.lactating,
                        oralContraceptives: payload.bethesdaCytology.oralContraceptives,
                        menopausal: payload.bethesdaCytology.menopausal,
                        swabSpatula: payload.bethesdaCytology.swabSpatula,
                        brushSpatula: payload.bethesdaCytology.brushSpatula,
                        spatulaAlone: payload.bethesdaCytology.spatulaAlone,
                        brushAlone: payload.bethesdaCytology.brushAlone,
                        broomAlone: payload.bethesdaCytology.broomAlone,
                        otherCollectionTechnique: payload.bethesdaCytology.otherCollectionTechnique,
                        estroRX: payload.bethesdaCytology.estroRX,
                        pmpBleeding: payload.bethesdaCytology.pmpBleeding,
                        postPart: payload.bethesdaCytology.postPart,
                        iud: payload.bethesdaCytology.iud,
                        allOtherPat: payload.bethesdaCytology.allOtherPat,
                        negative: payload.bethesdaCytology.negative,
                        atypical: payload.bethesdaCytology.atypical,
                        caInSitu: payload.bethesdaCytology.caInSitu,
                        invasive: payload.bethesdaCytology.invasive,
                        otherPreviousInfo: payload.bethesdaCytology.otherPreviousInfo,
                        hysterectomyTotal: payload.bethesdaCytology.hysterectomyTotal,
                        hysterectomyPartial: payload.bethesdaCytology.hysterectomyPartial,
                        dysplasiaLow: payload.bethesdaCytology.dysplasiaLow,
                        dysplasiaHigh: payload.bethesdaCytology.dysplasiaHigh,
                    },
                    includeElectronicSignature: payload.includeElectronicSignature,
                    printOrderDetails: payload.printOrderDetails,
                    emailOrderDetails: payload.emailOrderDetails,
                    shareRequisitionOnPatientPortal: payload.shareRequisitionOnPatientPortal,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            })
            commit('setLoading', false)
        },

        async getPatientList({ commit }, payload) {
            if (payload && payload.idPage != 'calender') {
                commit('setLoading', true)
            }
            const res = await $api(PATIENT_API_DATATABLE, {
                method: 'GET',
            })
            commit('setLoading', false)
            commit('setPatientList', res.data)
            console.log("setPatientList", res.data)
        },
        async getVitalsList({ commit }, payload) {
            //commit('setLoading', true)

            const res = await $api(GET_VITAL + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.messageList) {
                commit('setVitalsList', res.messageList)
            } else {
                commit('setVitalsList', res)
            }

            commit('setLoading', false)
        },
        async AddVitals({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(Add_MESSAGE_API + '/' + payload.id, {
                method: 'POST',

                body: {
                    subject: payload.subject,
                    message: payload.message,
                    with_name: payload.with_name
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Message Created !')
            //commit('setPhoneLogList', res.phoneLogList)
            commit('setLoading', false)
        },
        async getIntakeQuestionsFormList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_INTAKE_QUESTIONS, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.intakeQuestions', res.data)
            commit('setIntakeQuestions', res.data)
            commit('setLoading', false)
        },
        async AddIntakeQuestionsForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_INTAKE_QUESTIONS, {
                method: 'POST',

                body: {
                    name: payload.name,
                    description: payload.description,
                    status: payload.status,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Created !')
            commit('setLoading', false)
        },
        async getIntakeQuestionsFormById({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_INTAKE_QUESTION_BY_ID + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setIntakeQuestion', res.data)
            commit('setLoading', false)
        },
        async updateIntakeQuestionsForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_INTAKE_QUESTION_BY_ID + '/' + payload.id, {
                method: 'POST',

                body: {
                    name: payload.name,
                    description: payload.description,
                    status: payload.status,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Updated !')
            commit('setLoading', false)
        },
        async deleteIntakeQuestionsForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DELETE_INTAKE_QUESTION_BY_ID + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
        },
        async getIntakeFormsList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_INTAKE_FORMS_LIST, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.intakeForms', res)
            commit('setIntakeForms', res)
            commit('setLoading', false)
        },
        async getFormField({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_INTAKE_FORM_DATA + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setIntakeFormData', res)
            commit('setLoading', false)
        },
        async storeIntakeFormData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_INTAKE_FORM_DATA, {
                method: 'POST',

                body: {
                    form_id: payload.id,
                    uuid: payload.uuid,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)
        },
        async getPatientIntakeFormsData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_INTAKE_FORM_DATA + '/' + payload.id + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.intakeForms', res.data)
            commit('setPatientIntakeFormData', res.data)
            commit('setLoading', false)
        },

        async getCategoryList({ commit }, payload) {
            // commit('setLoading', true)
            const res = await $api(GET_CATEGORY_API, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('categories', res.data)
            commit('setCategories', res.data)
            // commit('setLoading', false)
        },
        async getQuestionerQuestionsFormList({ commit }, payload) {
            if (payload && payload.loader) {
                commit('setLoading', true)
            }

            const res = await $api(GET_QUESTIONER_QUESTIONS, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.questionerQuestions', res.data)
            commit('setQuestionerQuestions', res.data)
            commit('setLoading', false)
        },
        async AddQuestionerQuestionsForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_QUESTIONER_QUESTIONS, {
                method: 'POST',

                body: {
                    name: payload.name,
                    description: payload.description,
                    status: payload.status,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Created !')
            commit('setLoading', false)
        },
        async getQuestionerQuestionsFormById({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_QUESTIONER_QUESTION_BY_ID + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setQuestionerQuestion', res.data)
            commit('setLoading', false)
        },
        async updateQuestionerQuestionsForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_QUESTIONER_QUESTION_BY_ID + '/' + payload.id, {
                method: 'POST',

                body: {
                    name: payload.name,
                    description: payload.description,
                    status: payload.status,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Updated !')
            commit('setLoading', false)
        },
        async deleteQuestionerQuestionsForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DELETE_QUESTIONER_QUESTION_BY_ID + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
        },
        async getQuestionerFormsList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_QUESTIONER_FORMS_LIST, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.questionerForms', res)
            commit('setQuestionerForms', res)
            commit('setLoading', false)
        },
        async getQuestionerFormDataById({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_QUESTIONER_FORM_DATA + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setQuestionerFormData', res)
            commit('setLoading', false)
        },
        async storeQuestionerFormData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_QUESTIONER_FORM_DATA, {
                method: 'POST',

                body: {
                    form_id: payload.id,
                    uuid: payload.uuid,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)
        },
        async getPatientQuestionerFormsData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_QUESTIONER_FORM_DATA + '/' + payload.id + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.QuestionerForms', res.data)
            commit('setPatientQuestionerFormData', res.data)
            commit('setLoading', false)
        },
        async getConsentFormList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_CONSENT_FORMS, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.consentForms', res.data)
            commit('setConsentForms', res.data)
            commit('setLoading', false)
        },
        async AddConsentForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_CONSENT_FORM, {
                method: 'POST',

                body: {
                    uuid: payload.uuid,
                    name: payload.name,
                    description: payload.description,
                    status: payload.status,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Created !')
            commit('setLoading', false)
        },
        async getConsentFormById({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_CONSENT_FORM_BY_ID + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            commit('setConsentFormData', res.data)
            commit('setLoading', false)
        },
        async updateConsentForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_CONSENT_FORM_BY_ID + '/' + payload.id, {
                method: 'POST',

                body: {
                    uuid: payload.uuid,
                    name: payload.name,
                    description: payload.description,
                    status: payload.status,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Updated !')
            commit('setLoading', false)
        },
        async deleteConsentForm({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DELETE_CONSENT_FORM_BY_ID + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
        },
        async getConsentFormsList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_CONSENT_FORMS_LIST, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.consentForms', res)
            commit('setConsentForms', res)
            commit('setLoading', false)
        },
        async getPatientIntakeFormList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_INTAKE_FORMS_LIST + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.setPatientIntakeFormsList', res)
            commit('setPatientIntakeFormsList', res)
            commit('setLoading', false)
        },
        async getPatientConsentFormList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_CONSENT_FORMS + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.patientConsentForms', res)
            commit('setPatientConsentForms', res)
            commit('setLoading', false)
        },
        async storePatientConsentFormData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_PATIENT_CONSENT_FORM, {
                method: 'POST',

                body: {
                    form_id: payload.form_id,
                    uuid: payload.uuid,
                    practitioner_id: payload.practitioner_id,
                    data: payload.data,
                    name: payload.name,
                    signature: payload.signature
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)
        },
        async getPatientConsentFormData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_CONSENT_FORM_DATA + '/' + payload.id + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.patientConsentFormData', res.data)
            commit('setPatientConsentFormData', res.data)
            commit('setLoading', false)
        },
        async getProfileImages({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_AVATER_API + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log("GETiNAGE", response)

                },
            }

            )
            console.log("getProfile", res)
            commit('getProfile', res)
            commit('setLoading', false)
        },

        async updatePatientPortalAvater({ commit }, payload) {
            commit('setLoading', true)
            console.log("image", payload.avatarImage);

            const response = await $api(UPDATE_PATIENT_PROFILE_PORTAL_API + '/' + payload.patientId, {
                method: 'POST',
                body: payload

            });
            commit('setLoading', false)
            console.log('Response:', response);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully updated !')
            commit('setLoading', false)
        },
        async updatePatientAvater({ commit }, payload) {
            commit('setLoading', true)
            console.log("image", payload.document);
            const response = await $api(SAVE_PATIENT_AVATER_API + '/' + payload.patientId + '?path=patientinformation/patientphotograph', {
                method: 'POST',
                body: payload.formData,
            });
            commit('setLoading', false)
            console.log('Response:', response);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully updated !')
            commit('setLoading', false)
        },
        // async getGeneralProfile({ commit }, payload) {
        //     commit('setLoading', true)
        //     console.log("saveDietAndRestriction",payload);
        //     const res = await $api(GENERAL_PROFILE_API+'?uuid='+payload.patientId+'&action=getAllergies', {
        //         method: 'GET',
        //         onResponseError({ response }) {
        //             commit('setLoading', false)
        //             console.log(response)
        //         },
        //         }
        //     )
        //     console.log('Gprofile',res);
        //     commit('setGeneralProfileData', res)
        //     commit('setLoading', false)
        //     console.log('Response:', res);
        //     commit('setLoading', false)
        // },
        async getClinicalProfile({ commit }, payload) {
            commit('setLoading', true)
            console.log("getClinicalProfile", payload);
            const allergies = await $api(GET_ALLERGY_API + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            // console.log('setGeneralProfileData',allergies);
            commit('setGeneralProfileData', allergies)

            const diet = await $api(GET_DIET_API + '/' + payload.patientId, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            console.log('setDietData', diet.data);
            commit('setDietData', diet.data)


            const immunization = await $api(GET_IMMUNIZATION_API + '/' + payload.patientId, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            console.log('setImmunizationData', immunization.payload);
            commit('setImmunizationData', immunization.payload)

            const familyHistory = await $api(GET_FAMILY_HISTORY_API + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            console.log("patientFamily", familyHistory);
            commit('setPatientFamilyHistoryData', familyHistory)


            const reproductive = await $api(GET_REPRODUCTIVE_API + '/' + payload.patientId, {
                method: 'POST',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            console.log("setReproductiveData", reproductive.data);
            commit('setReproductiveData', reproductive.data)

            const patinetFamilyCondition = await $api(GET_PATIENT_FAMILY_CONDITION_API + '/' + payload.patientId, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )

            commit('setPatientFamilyConditiondData', patinetFamilyCondition.data)
            commit('setLoading', false)
        },


        async saveClinicalProfile({ commit }, payload) {
            commit('setLoading', true)
            console.log("saveClinicalProfile", payload);
            const res = await $api(POST_ALLERGY_API + '/' + payload.id, {
                method: 'POST',
                body: {
                    smoking: 'no',
                    pastSmoking: payload.pastSmoking,
                    bloodGroup: payload.bloodGroup,
                    generalNotes: payload.generalNotes,
                    selectedAllergies: payload.selectedAllergies,
                    drugAllergyNotes: payload.drugAllergyNotes,
                    isKnownDrugAllergies: payload.isKnownDrugAllergies,
                    // foodAllergyNotes: payload.foodAllergyNotes,
                    additionalFoodAllergies: payload.additionalAllergies,
                    additionalDrugAllergies: payload.additionalDrug,
                    ineffectiveMeds: payload.ineffectiveMeds,
                    ineffectiveMedsNotes: payload.ineffectiveMedsNotes
                },


                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Created !')
            commit('setLoading', false)
        },
        async saveDietAndRestriction({ commit }, payload) {
            commit('setLoading', true)
            console.log("saveDietAndRestriction", payload);
            const res = await $api(SAVE_DIET_API + '/' + payload.patientId, {
                method: 'POST',
                body: JSON.stringify(payload), // Stringify payload for JSON format
                headers: {
                    'Content-Type': 'application/json', // Set Content-Type for JSON
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully updated !')
            commit('setLoading', false)
        },
        // async getDietAndRestriction({ commit }, payload) {
        //     commit('setLoading', true)
        //     console.log("saveDietAndRestriction",payload);
        //     const res = await $api(GET_DIET_API+'/'+payload.patientId, {
        //         method: 'GET',
        //         onResponseError({ response }) {
        //             commit('setLoading', false)
        //             console.log(response)
        //         },
        //         }
        //     )
        //     commit('setDietData', res.data)
        //     commit('setLoading', false)
        //     console.log('Response:', res);
        //     commit('setLoading', false)
        // },
        async onSubmitImmunization({ commit }, payload) {
            commit('setLoading', true);
            console.log("onSubmitImmunization", payload);
            const sanitizedImmunizations = payload.selectedImmunizations.map(item =>
                item.replace(/[^\x00-\x7F]/g, "")
            );
            try {
                const res = await $api(SAVE_IMMUNIZATION_API + '/' + payload.id, {
                    method: 'POST',
                    body: JSON.stringify({
                        selectedImmunizations: sanitizedImmunizations,
                        selectedCovidVaccine: payload.selectedCovidVaccine,
                        immunizationsNotes: payload.immunizationsNotes,
                        immunizationsEntries: payload.data.immunizationsEntries,
                        sections: payload.data.sections
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    onResponseError({ response }) {
                        commit('setLoading', false);
                        console.log(response);
                    },
                });
                commit('setSuccessMsg', true);
                commit('setShowMsg', 'Successfully updated!');
                console.log('Response:', res);
            } catch (error) {
                console.error("Error:", error);
                if (error.response) {
                    console.log(error.response);
                }
            } finally {
                commit('setLoading', false);
            }
        },
        // async getImmunization({ commit }, payload) {
        //     commit('setLoading', true)
        //     console.log("saveDietAndRestriction",payload);
        //     const res = await $api(GET_IMMUNIZATION_API+'/'+payload.patientId, {
        //         method: 'GET',
        //         onResponseError({ response }) {
        //             commit('setLoading', false)
        //             console.log(response)
        //         },
        //         }
        //     )
        //     commit('setImmunizationData', res.payload)
        //     commit('setLoading', false)
        //     console.log('Response:', res);
        //     commit('setLoading', false)
        // },

        // async getPersonalFamilyHistory({ commit }, payload) {
        //     commit('setLoading', true)
        //     console.log("getPersonalFamilyHistory",payload);
        //     const res = await $api(GENERAL_PROFILE_API+'?uuid='+payload.patientId+'&action=getFamilyHistory', {
        //         method: 'GET',
        //         onResponseError({ response }) {
        //             commit('setLoading', false)
        //             console.log(response)
        //         },
        //         }
        //     )
        //     console.log("patientFamily", res);
        //     commit('setPatientFamilyHistoryData', res)
        //     commit('setLoading', false)
        //     console.log('Response:', res);
        //     commit('setLoading', false)
        // },
        async onSubmitPersonalFamilyHistory({ commit }, payload) {
            // commit('setLoading', true)
            console.log("onSubmitPersonalFamilyHistory", payload);
            const res = await $api(STORE_FAMILY_HISTORY_API + '/' + payload.id, {
                method: 'POST',
                body: {
                    familyInfo: {
                        Mother: payload.data.Mother,
                        Father: payload.data.Father,
                        Sibling: payload.data.Sibling,
                        MaternalGrandmother: payload.data.MaternalGrandmother,
                        MaternalGrandfather: payload.data.MaternalGrandfather,
                        PaternalGrandmother: payload.data.PaternalGrandmother,
                        PaternalGrandfather: payload.data.PaternalGrandfather
                    },
                    selectedConditions: payload.data.selectedConditions
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully updated !')
            commit('setLoading', false)
        },


        // async onSubmitImmunization({ commit }, payload) {
        //     commit('setLoading', true);
        //     console.log("onSubmitImmunization", payload);
        //     const sanitizedImmunizations = payload.selectedImmunizations.map(item =>
        //         item.replace(/[^\x00-\x7F]/g, "")
        //     );
        //     try {
        //         const res = await $api(SAVE_IMMUNIZATION_API + '/' + payload.id, {
        //             method: 'POST',
        //             body: JSON.stringify({
        //                 selectedImmunizations: sanitizedImmunizations,
        //                 selectedCovidVaccine: payload.selectedCovidVaccine,
        //                 immunizationsNotes: payload.immunizationsNotes,
        //                 immunizationsEntries: payload.data.immunizationsEntries,
        //                 sections: payload.data.sections
        //             }),
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             onResponseError({ response }) {
        //                 commit('setLoading', false);
        //                 console.log(response);
        //             },
        //         });
        //       commit('setSuccessMsg', true);
        //       commit('setShowMsg', 'Successfully Created!');
        //       console.log('Response:', res);
        //     } catch (error) {
        //       console.error("Error:", error);
        //       if (error.response) {
        //         console.log(error.response);
        //       }
        //     } finally {
        //       commit('setLoading', false);
        //     }
        // },
        //   
        async savePaymentMethod({ commit }, payload) {
            commit('setLoading', true)
            console.log("saveCategory", payload);
            const res = await $api(SAVE_PAYMENT_METHOD_API, {
                method: 'POST',
                body: {
                    name: payload.paymentMethod,
                    config: { apiKey: payload.apiKey, apiSecret: payload.apiSecret },

                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            // commit('setSuccessMsg', true)
            if (res.error) {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.error)
            } else {
                commit('setSuccessMsg', true)
                commit('setShowMsg', 'Successfully Set Payment method !')
            }
            commit('setLoading', false)
        },
        async saveCategory({ commit }, payload) {
            commit('setLoading', true)
            console.log("saveCategory", payload);
            const res = await $api(SAVE_CATEGORY_API, {
                method: 'POST',
                body: {
                    name: payload.category.name,
                    inTakeForm_id: payload.category.inTakeForm,
                    questiioneriesForm_id: payload.category.questiioneriesForm,
                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            // commit('setSuccessMsg', true)
            if (res.error) {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.error)
            } else {
                commit('setSuccessMsg', true)
                commit('setShowMsg', 'Successfully Created !')
            }
            commit('setLoading', false)
        },

        async updateCategory({ commit }, payload) {
            commit('setLoading', true)
            console.log("updateCategory", payload);
            const res = await $api(UPDATE_CATEGORY_API + '/' + payload.category.id, {
                method: 'POST',
                body: {
                    name: payload.category.name,
                    inTakeForm_id: payload.category.inTakeForm,
                    questiioneriesForm_id: payload.category.questiioneriesForm,
                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log("errorResponse", response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            // commit('setSuccessMsg', '');
            // commit('setShowMsg', 'Successfully Updated !')
            if (res.error) {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.error)
            } else {
                commit('setSuccessMsg', true)
                commit('setShowMsg', 'Successfully updated !')
            }
            commit('setLoading', false)
        },

        async saveProduct({ commit }, payload) {
            commit('setLoading', true)
            console.log("saveProduct", payload);
            const res = await $api(SAVE_PRODUCT_API, {
                method: 'POST',
                body: {
                    name: payload.product.name,
                    slug: payload.product.slug,
                    description: payload.product.description,
                    type: payload.product.type,
                    price: payload.product.price,
                    category_id: payload.product.categporyId,
                    prescription: payload.product.isPrescription,
                    sku: payload.product.sku,
                    inTakeForm_id: payload.product.inTakeForm,
                    questiioneriesForm_id: payload.product.questiioneriesForm,
                    status: payload.product.status
                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Created !')
            commit('setLoading', false)
        },

        async updateProduct({ commit }, payload) {
            commit('setLoading', true)
            console.log("updateProduct", payload);
            const res = await $api(UPDATE_PRODUCT_API + '/' + payload.product.product_id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: payload.product.name,
                    slug: payload.product.slug,
                    description: payload.product.description,
                    type: payload.product.type,
                    price: payload.product.price,
                    prescription: payload.product.isPrescription,
                    sku: payload.product.sku,
                    inTakeForm_id: payload.product.inTakeForm,
                    questiioneriesForm_id: payload.product.questiioneriesForm,
                    status: payload.product.status,
                    category_id: payload.product.categporyId
                }),

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully updated !')
            commit('setLoading', false)
        },

        async saveMedican({ commit }, payload) {
            commit('setLoading', true)
            console.log("saveMedican", payload);
            const res = await $api(STORE_MEDICAN_API + '/' + payload.uuid, {
                method: 'POST',
                body: {
                    presherb_name: payload.medican.presherbname,
                    presherb_dispense_days: payload.medican.presherbdispdays,
                    presherb_dispense_refills: payload.medican.presherbdisprefills,
                    presherb_dispense_subtitution: payload.medican.presherbdispsubs,
                    presherb_notes: payload.medican.presherbnotes,
                    presherb_start_on: payload.medican.presherbstarton,
                    presherb_discontinue: payload.medican.presherbdisconton,
                    presherb_src: payload.medican.presherbsrc,
                    BB: payload.medican.bb,
                    B: payload.medican.bx,
                    BL: payload.medican.bl,
                    L: payload.medican.lx,
                    BD: payload.medican.bd,
                    D: payload.medican.dx,
                    status: payload.medican.status
                },


                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Created !')
            commit('setLoading', false)
        },
        async updateMedican({ commit }, payload) {
            commit('setLoading', true)
            console.log("updateMedican", payload);
            const res = await $api(UPDATE_PATIENT_MEDICAN_DATA + '/' + payload.medican.prescriptions_id, {
                method: 'POST',
                body: {
                    presherb_name: payload.medican.presherbname,
                    presherb_dispense_days: payload.medican.presherbdispdays,
                    presherb_dispense_refills: payload.medican.presherbdisprefills,
                    presherb_dispense_subtitution: payload.medican.presherbdispsubs,
                    presherb_notes: payload.medican.presherbnotes,
                    presherb_start_on: payload.medican.presherbstarton,
                    presherb_discontinue: payload.medican.presherbdisconton,
                    presherb_src: payload.medican.presherbsrc,
                    BB: payload.medican.bb,
                    B: payload.medican.bx,
                    BL: payload.medican.bl,
                    L: payload.medican.lx,
                    BD: payload.medican.bd,
                    D: payload.medican.dx,
                    status: payload.medican.status
                },


                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully updated !')
            commit('setLoading', false)
        },

        async getMedSupplement({ commit }, payload) {
            commit('setLoading', true)
            console.log("getMedSupplement", payload);
            const query = new URLSearchParams({
                src: payload.src || 'all',
                status: payload.status || 'all'
            }).toString();
            const res = await $api(`${GET_PATIENT_MEDICAN_DATA}/${payload.id}?${query}`, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false);
                    console.error(response);
                }
            })
            console.log('getMedSupplementxyz', res.data);
            commit('setMedAndSupplementData', res.data)
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setLoading', false)
        },

        // async getPersonalFamilyHistory({ commit }, payload) {
        //     commit('setLoading', true)
        //     console.log("getPersonalFamilyHistory",payload);
        //     const res = await $api(GENERAL_PROFILE_API+'?uuid='+payload.patientId+'&action=getFamilyHistory', {
        //         method: 'GET',
        //         onResponseError({ response }) {
        //             commit('setLoading', false)
        //             console.log(response)
        //         },
        //         }
        //     )
        //     console.log("patientFamily", res);
        //     commit('setPatientFamilyHistoryData', res)
        //     commit('setLoading', false)
        //     console.log('Response:', res);
        //     commit('setLoading', false)
        // },
        // async getMedAndSupplement({ commit }, payload) {
        //     // commit('setLoading', true)
        //     console.log("onSubmitPersonalFamilyHistory",payload);
        //     const res = await $api(GENERAL_PROFILE_API+'?uuid='+payload.id+'&action=storeFamilyHistory', {
        //     method: 'POST',
        //         body: {
        //             familyInfo:{
        //                 Mother: payload.data.Mother,
        //                 Father: payload.data.Father,
        //                 Sibling: payload.data.Sibling,
        //                 MaternalGrandmother: payload.data.MaternalGrandmother,
        //                 MaternalGrandfather: payload.data.MaternalGrandfather,
        //                 PaternalGrandmother: payload.data.PaternalGrandmother,
        //                 PaternalGrandfather: payload.data.PaternalGrandfather
        //             },
        //             selectedConditions:payload.data.selectedConditions
        //         },
        //         onResponseError({ response }) {
        //             commit('setLoading', false)
        //             console.log(response)

        //         },

        //       }

        //     )
        //     commit('setLoading', false)
        //     console.log('Response:', res);
        //     commit('setSuccessMsg', true)
        //     commit('setShowMsg', 'Successfully Created !')
        //     commit('setLoading', false)
        // },

        // async getReporductiveData({ commit }, payload) {
        //     commit('setLoading', true)
        //     console.log("getReporductiveData",payload);
        //     const res = await $api(GET_REPRODUCTIVE_API+'/'+payload.patientId, {
        //         method: 'POST',
        //         onResponseError({ response }) {
        //             commit('setLoading', false)
        //             console.log(response)
        //         },
        //         }
        //     )

        //     commit('setReproductiveData', res.data)
        //     commit('setLoading', false)
        //     console.log('Response:', res);
        //     commit('setLoading', false)
        // },
        async onSubmitReproductive({ commit }, payload) {
            commit('setLoading', true)
            console.log("saveMedican", payload);
            const res = await $api(SAVE_REPRODUCTIVE_API + '/' + payload.id, {
                method: 'POST',
                body: JSON.stringify(payload.data),

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully updated !')
            commit('setLoading', false)
        },
        // async getPatientFamilyCondition({ commit }, payload) {
        //     commit('setLoading', true)
        //     console.log("getPatientFamilyCondition",payload);
        //     const res = await $api(GET_PATIENT_FAMILY_CONDITION_API+'/'+payload.patientId, {
        //         method: 'GET',
        //         onResponseError({ response }) {
        //             commit('setLoading', false)
        //             console.log(response)
        //         },
        //         }
        //     )

        //     commit('setPatientFamilyConditiondData', res.data)
        //     commit('setLoading', false)
        //     console.log('Response:', res);
        //     commit('setLoading', false)
        // },
        async onSubmitPatientFamilyCondition({ commit }, payload) {
            commit('setLoading', true)
            console.log("onSubmitPatientFamilyCondition", payload);
            const res = await $api(STORE_PATIENT_FAMILY_CONDITION_API + '/' + payload.patientId, {
                method: 'POST',
                body: JSON.stringify(payload.data),

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully updated !')
            commit('setLoading', false)
        },
        async getSubmittedIntakesList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_SUBMITTED_INTAKES + '/' + payload.uuid, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.submittedIntakes', res.data)
            commit('setSubmittedIntakes', res.data)
            commit('setLoading', false)
        },
        async getSubmittedIntakeFormData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_SUBMITTED_INTAKE_DATA + '/' + payload.form_id + '/' + payload.type, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.submittedIntakeForm', res)
            commit('setSubmittedIntakeForm', res)
            commit('setLoading', false)
        },

        async updateAppointment({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_APPOINTMENT + '/' + payload.id, {
                method: 'POST',
                body: {
                    practitioner_id: payload.practitioner_id,
                    patient_id: payload.patient_id,
                    title: payload.title,
                    date: payload.date,
                    start_time: payload.start_time,
                    end_time: payload.end_time,
                    status: payload.status,
                    service: payload.service,
                    location: payload.location,
                    room: payload.room,
                    appointment_type: payload.appointment_type,
                    payment_type: payload.payment_type,
                    notes: payload.notes,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setSuccessMsg', true)
                    commit('setShowMsg', 'Appointment Updated Successfully!')

                },
            })
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            commit('setLoading', false)
            return res
        },

        async cancelPatientPortalAppointment({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(PATIENT_PORTAL_CANCEL_APPOINTMENT_API + '/' + payload.id, {
                method: 'POST',
                body: {},
                onResponseError({ response }) {
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Appointment Canceled Successfully!')
        },
        async cancelAppointment({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(CANCEL_APPOINTMENT + '/' + payload.id, {
                method: 'POST',
                body: {},
                onResponseError({ response }) {
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Appointment Canceled Successfully!')
        },
        async getAllProductsList({ commit }, payload) {
            if (payload && payload.loader) {
                commit('setLoading', true)
            }
            //GET_PRODUCTS_LIST
            const res = await $api(GET_PRODUCT_API, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.productsList', res)
            commit('setProductsList', res.data)
            commit('setLoading', false)
        },
        async getAllThemesList({ commit }, payload) {
            if (payload && payload.loader) {
                commit('setLoading', true)
            }
            const res = await $api(GET_THEMES_LIST, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.themesList', res)
            commit('setThemesList', res.data)
            commit('setLoading', false)
        },
        async storeBuilder({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_BUILDER, {
                method: 'POST',
                body: {
                    builder_name: payload.builder_name,
                    practitioner_id: payload.practitioner_id,
                    intakes: payload.intakes,
                    questionnaire: payload.questionnaire,
                    products: payload.products,
                    paymentOption: payload.paymentOption,
                    patientFlow: payload.patientFlow
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)

            return res
        },
        async storeBuilderConfig({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_BUILDER_CONFIG + '/' + payload.id, {
                method: 'POST',
                body: {
                    theme: payload.theme,
                    bgColor: payload.bgColor,
                    btncolor: payload.btncolor,
                    textColor: payload.textColor,
                    practitioner_fee: payload.practitioner_fee,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setLoading', false)

            return res
        },
        async getBuilderItem({ commit }, payload) {
            if (payload && payload.loader) {
                commit('setLoading', true)
            }
            const res = await $api(GET_BUILDER_DATA + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.builderData', res.data)
            commit('setBuilderData', res.data)
            commit('setLoading', false)
        },
        async updateBuilder({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_BUILDER + '/' + payload.id, {
                method: 'POST',
                body: {
                    builder_name: payload.builder_name,
                    practitioner_id: payload.practitioner_id,
                    intakes: payload.intakes,
                    questionnaire: payload.questionnaire,
                    products: payload.products,
                    paymentOption: payload.paymentOption,
                    patientFlow: payload.patientFlow
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)

            return res
        },
        async updateBuilderConfig({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_BUILDER_CONFIG + '/' + payload.id, {
                method: 'POST',
                body: {
                    theme: payload.theme,
                    bgColor: payload.bgColor,
                    btncolor: payload.btncolor,
                    textColor: payload.textColor,
                    practitioner_fee: payload.practitioner_fee
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setLoading', false)

            return res
        },
        async deleteBuilder({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DELETE_BUILDER + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
        },
        async getBuilderByPractitioner({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_BUILDER_DATA_BY_ID + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.builderData', res.data)
            commit('setBuilderData', res.data)
            commit('setLoading', false)
        },
        async checkPatientEmail({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PATIENT_EMAIL_CHECK, {
                method: 'POST',
                body: {
                    email: payload.email,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setLoading', false)

            return res
        },
        async saveShippingInformation({ commit, state }, payload) {
            commit("setLoading", true);
            commit("setPaymentProcessed", false);
            commit("setShowMsg", null);
            commit("setErrorMsg", false);
            const res = await $api(STORE_PATIENT_ORDER_CREATE, {
                method: 'POST',

                body: {
                    uuid: payload.uuid,
                    patient_id: payload.patient_id,
                    shipping_address1: payload.shipping_address1,
                    shipping_address2: payload.shipping_address2,
                    shipping_city: payload.shipping_city,
                    shipping_state: payload.shipping_state,
                    shipping_zipcode: payload.shipping_zipcode,
                    shipping_country: payload.shipping_country,
                    shipping_amount: payload.shipping_amount,
                    total_amount: payload.total_amount,
                    items: payload.items,
                    card_number: payload.card_number,
                    cvv: payload.cvv,
                    expiration_month: payload.expiration_month,
                    expiration_year: payload.expiration_year,
                    affiliate_email: payload.affiliate_email,
                    prescreption_required: payload.prescreption_required,
                    practitioner_fee: payload.practitioner_fee,
                    provider_id: payload.provider_id
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )

            commit('setSuccessMsg', true);
            commit('setShowMsg', 'Payment processed !');
            commit("setPaymentProcessed", true);
            commit("setLoading", false);

        },
        async storePatientQuestionnairFormData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_REG_QUESTIONNAIRE_DATA, {
                method: 'POST',

                body: {
                    form_id: payload.form_id,
                    pid: payload.pid,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)
        },
        async storePatientIntakeFormData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_REG_INTAKE_DATA, {
                method: 'POST',

                body: {
                    form_id: payload.form_id,
                    pid: payload.pid,
                    data: payload.data,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },

            }

            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)
        },
        async getPatientPortalCalendlyAvailableSlots({ commit, state }, payload) {
            commit("setLoading", true);
            console.log(payload)
            // const builderData = JSON.parse(localStorage.getItem('builderData'));
            const res = await $api(GET_AVAILABLE_SLOTS_DATA + '/' + payload.uuid, {
                method: 'POST',
                body: {
                    month: payload.month,
                    timezone: payload.timezone
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.slots', res)
            localStorage.setItem('getCalendlyAvailableTImes', JSON.stringify(res))
            commit("setCalendlyAvailableTImes", res);
            commit('setLoading', false)
        },
        async getCalendlyAvailableSlots({ commit, state }, payload) {
            commit("setLoading", true);

            const builderData = JSON.parse(localStorage.getItem('builderData'));
            const res = await $api(GET_AVAILABLE_SLOTS_DATA + '/' + builderData.practitioner_id, {
                method: 'POST',
                body: {
                    month: payload.month,
                    timezone: payload.timezone
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            console.log('res.slots', res)
            localStorage.setItem('getCalendlyAvailableTImes', JSON.stringify(res))
            commit("setCalendlyAvailableTImes", res);
            commit('setLoading', false)
        },
        async savePatientPortalAppointment({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(PATIENT_PORTAL_BOOK_APPOINTMENT_API + '/' + payload.patient_id, {
                method: 'POST',
                body: {
                    practitioner_id: payload.practitioner_id,
                    patient_id: payload.patient_id,
                    title: payload.title,
                    date: payload.date,
                    start_time: payload.start_time,
                    end_time: payload.end_time,
                    status: payload.status,
                    service: payload.service,
                    location: payload.location,
                    room: payload.room,
                    appointment_type: payload.appointment_type,
                    payment_type: payload.payment_type,
                    notes: payload.notes,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setSuccessMsg', true)
                    commit('setShowMsg', 'Appointment Booked Successfully!')

                },
            })
            commit('setLoading', false)
        },
        async savePatientAppointment({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_PATIENT_BOOK_APPOINTMENT, {
                method: 'POST',
                body: {
                    practitioner_id: payload.practitioner_id,
                    patient_id: payload.patient_id,
                    title: payload.title,
                    date: payload.date,
                    start_time: payload.start_time,
                    end_time: payload.end_time,
                    status: payload.status,
                    service: payload.service,
                    location: payload.location,
                    room: payload.room,
                    appointment_type: payload.appointment_type,
                    payment_type: payload.payment_type,
                    notes: payload.notes,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                    commit('setSuccessMsg', true)
                    commit('setShowMsg', 'Appointment Booked Successfully!')

                },
            })
            localStorage.removeItem('patient_appointment_details');
            localStorage.removeItem('getCalendlyAvailableTImes');

            commit('setLoading', false)
        },

        async getProviderSlots({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PROVIDER_SLOTS + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            },
            )
            commit('setProviderSlots', res)
            commit('setLoading', false)
        },
        async saveRole({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADMIN_GET_ROLES_SAVE_API, {
                method: 'POST',
                body: {
                    name: payload.name,
                    guard_name: payload.guard,
                    status: payload.status,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async deleteRole({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADMIN_DELETE_ROLES_BY_ID_API + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async getRoleByID({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADMIN_GET_ROLES_BY_ID_API + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            commit('setSingleRole', res.data)
            commit('setLoading', false)
        },
        async updateRole({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADMIN_UPDATE_ROLES_BY_ID_API + '/' + payload.id, {
                method: 'PUT',
                body: {
                    name: payload.name,
                    guard_name: payload.guard,
                    status: payload.status,
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async permissionsUpdate({ commit }, payload) {
            commit('setLoading', true)
            const permissionsArray = payload.permisssions.split(',').map(permission => permission.trim());
            const res = await $api(ADMIN_UPDATE_PERMISSION_API + '/' + payload.id, {
                method: 'POST',
                body: { permissions: permissionsArray },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },

        async refreshAbilities({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(REFRESH_ABLITIES_LINK, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                    commit('setLoading', false)
                },
            }
            )
            commit('setRefreshAbilities', res.permissions)
            commit('setLoading', false)
        },
        async permissionsRole({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADMIN_GET_PERMISSION_ROLE_API + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                    commit('setLoading', false)
                },
            }

            )
            commit('setPermissionsRole', res.data)
            commit('setLoading', false)
        },
        async roleList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ROLES_LIST_DROPDOWN_API, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            commit('setRoleList', res.data)
            commit('setLoading', false)
        },
        async saveInvoice({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(ADD_INVOICE_API, {
                method: 'POST',
                body: {
                    invoice: payload.invoice,
                    purchasedProducts: payload.purchasedProducts,
                    diagnoses: payload.diagnoses,
                    otherLineItem: payload.otherLineItem
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
                commit('setSaveInvoiceData', res.data)

            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }

            commit('setLoading', false)
        },
        async getInvoiceByID({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(INVOICE_GET_BY_ID + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            commit('setSingleInvoice', res.data)
            commit('setLoading', false)
        },
        async updateInvoice({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_INVOICE_API + '/' + payload.invoice_primary_id, {
                method: 'PUT',
                body: {
                    invoice: payload.invoice,
                    purchasedProducts: payload.purchasedProducts,
                    diagnoses: payload.diagnoses,
                    otherLineItem: payload.otherLineItem
                },
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async payInvoice({ commit }, payload) {
            console.log('payload', payload.invoice_id)
            commit('setLoading', true)
            const res = await $api(PAY_INVOICE, {
                method: 'POST',
                body: payload,
                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)

                },
            }

            )
            if (res.message) {
                commit('setSuccessMsg', true)
                commit('setShowMsg', res.message)
            } else {
                commit('setErrorMsg', true)
                commit('setShowMsg', res.message)
            }
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async getInvoiceState({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(INVOICE_STATE, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            commit('setInvoiceState', res.data)
            commit('setLoading', false)
        },
        async getPractitionerProductsList({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PRACTITIONER_PRODUCTS, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            commit('setPractationerProducts', res.data)
            commit('setLoading', false)
        },
        async saveAffiliateProduct({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_AFFILIATE_PRODUCTS, {
                method: 'POST',
                body: {
                    status: payload.product.status,
                    referral_fee: payload.product.referral_fee,
                    product_id: payload.product.product_id,
                    builder_id: payload.product.builder_id,

                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Created !')
            commit('setLoading', false)
        },

        async saveWidget({ commit }, payload) {
            commit('setLoading', true)
            console.log(payload)
            const formData = new FormData();
            for (const key in payload) {
                formData.append(key, payload[key]);
            }
            const resp = await $api(SAVE_WIDGET, {
                method: 'POST',
                headers: {
                    'Accept': 'multipart/form-data',

                },
                body: formData,

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', resp);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Created !')
            commit('setLoading', false)


        },
        async updateAffiliateProduct({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(UPDATE_AFFILIATE_PRODUCTS_BY_ID + '/' + payload.product.id, {
                method: 'PUT',
                body: {
                    status: payload.product.status,
                    referral_fee: payload.product.referral_fee,
                    product_id: payload.product.product_id,
                    builder_id: payload.product.builder_id,
                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Updated !')
            commit('setLoading', false)
        },

        async deleteWidget({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DELETE_WIDGET + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async deleteAffiliatedProducts({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(DELETE_AFFILIATE_PRODUCTS_BY_ID + '/' + payload.id, {
                method: 'DELETE',
                body: {

                },
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            //commit('setUser', payload)
            commit('setLoading', false)
        },
        async getPartnerDashboardData({ commit }, payload) {
            commit('setLoading', true);
            try {
                // Construct query parameters
                const query = new URLSearchParams(payload).toString();
                const url = `${GET_PARTNER_DASHBOARD_STATS}?${query}`;

                const res = await $api(url, {
                    method: 'GET',
                    onResponseError({ response }) {
                        console.error(response);
                    }
                });
                commit('setPartnerDashbardStats', res);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                commit('setLoading', false);
            }
        },
        async getAffiliateDashboardData({ commit }, payload) {
            commit('setLoading', true);
            try {
                // Construct query parameters
                const query = new URLSearchParams(payload).toString();
                const url = `${GET_AFFILIATE_DASHBOARD_STATS}?${query}`;

                const res = await $api(url, {
                    method: 'GET',
                    onResponseError({ response }) {
                        console.error(response);
                    }
                });
                commit('setAffiliateDashbardStats', res);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                commit('setLoading', false);
            }
        },
        async getPartnerAccountData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_PARTNER_ACCOUNT + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            commit('setPartnerAccount', res.data)
            commit('setLoading', false)
        },
        async savePartnerAccount({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_PARTNER_ACCOUNT, {
                method: 'POST',
                body: {
                    partner_id: payload.partner_id,
                    account_number: payload.account_number,
                    routing_number: payload.routing_number,
                    ach: payload.ach,
                    address: payload.address

                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)
        },
        async getAffiliateAccountData({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(GET_AFFILIATE_ACCOUNT + '/' + payload.id, {
                method: 'GET',
                onResponseError({ response }) {
                    console.log(response)
                },
            }

            )
            commit('setAffiliateAccount', res)
            commit('setLoading', false)
        },
        async saveAffiliateAccount({ commit }, payload) {
            commit('setLoading', true)
            const res = await $api(STORE_AFFILIATE_ACCOUNT, {
                method: 'POST',
                body: {
                    affiliate_id: payload.affiliate_id,
                    account_number: payload.account_number,
                    routing_number: payload.routing_number,
                    ach: payload.ach,
                    address: payload.address

                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Successfully Saved !')
            commit('setLoading', false)
        },
        async perocessPartnerWithdaw({ commit }, payload) {
            commit('setLoading', true)
            commit('setShowMsg', null)
            commit("setPaymentProcessed", false);
            const res = await $api(POST_PARTNER_WITHDRAWLS, {
                method: 'POST',
                body: {
                    partner_id: payload.partner_id,
                    amount: payload.amount,
                    account_number: payload.account_number,
                    routing_number: payload.routing_number,
                    ach: payload.ach,
                    address: payload.address

                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Request processed succcessfully!')
            commit("setPaymentProcessed", true);
            commit('setLoading', false)
        },
        async perocessAffiliateWithdaw({ commit }, payload) {
            commit('setLoading', true)
            commit('setShowMsg', null)
            commit("setPaymentProcessed", false);
            const res = await $api(POST_AFFILIATE_WITHDRAWLS, {
                method: 'POST',
                body: {
                    affiliate_id: payload.affiliate_id,
                    amount: payload.amount,
                    account_number: payload.account_number,
                    routing_number: payload.routing_number,
                    ach: payload.ach,
                    address: payload.address

                },

                onResponseError({ response }) {
                    commit('setLoading', false)
                    console.log(response)
                },
            }
            )
            commit('setLoading', false)
            console.log('Response:', res);
            commit('setSuccessMsg', true)
            commit('setShowMsg', 'Request processed succcessfully!')
            commit("setPaymentProcessed", true);
            commit('setLoading', false)
        },
    },
    getters: {
        getClickedAppointment(state) {
            return state.clickedAppointment;
        },
        getAffiliateAccount(state) {
            return state.affiliateAccount;
        },
        getPartnerAccount(state) {
            return state.partnerAccount;
        },
        getAffiliateDashbardStats(state) {
            return state.affiliateDashbardStats;
        },
        getPartnerDashbardStats(state) {
            return state.partnerDashbardStats;
        },
        getPractitionerProducts(state) {
            return state.practitionerProducts;
        },
        getAffiliatePorfile(state) {
            return state.affiliateProfile;
        },
        getPartnerPorfile(state) {
            return state.partnerProfile;
        },
        getSelectedTimezone(state) {
            return state.selectedTimezone;
        },
        getCalendlyAvailableTImes(state) {
            return state.calendlyAvailableTimes;
        },
        getPaymentProcessed(state) {
            return state.paymentProcessed;
        },
        getAccessToken(state) {
            return state.access_token;
        },
        getErrors(state) {
            return state.errors;
        },
        getLoginUser(state) {
            return state.loginUser;
        },
        getBuilderData(state) {
            return state.builderData;
        },
        getPermissionsRole(state, payload) {
            return state.permissionsRole
        },
        getThemesList(state) {
            return state.themesList;
        },
        getProductsList(state) {
            return state.productsList;
        },
        getSubmittedIntakeForm(state) {
            return state.submittedIntakeForm;
        },
        getSubmittedIntakeForm(state) {
            return state.submittedIntakeForm;
        },
        getSubmittedIntakes(state) {
            return state.submittedIntakes;
        },
        getPatientConsentForms(state) {
            return state.patientConsentForms;
        },
        getPatientIntakeList(state) {
            return state.patientIntakeForms;
        },
        getPatientConsentFormData(state) {
            return state.patientConsentFormData;
        },
        getConsentFormData(state) {
            return state.consentFormData;
        },
        getPatientConsentFormItem(state) {
            return state.patientConsentFormItem;
        },
        getPatientConsentFormId(state) {
            return state.consentFormId;
        },
        getConsentFormId(state) {
            return state.consentFormId;
        },
        getPractitionerId(state) {
            return state.practitionerId;
        },
        getConsentForms(state) {
            return state.consentForms;
        },
        getConsentForm(state) {
            return state.consentForm;
        },
        getConsentForms(state) {
            return state.consentForms;
        },
        getPatientQuestionerFormData(state) {
            return state.patientQuestionerFormData;
        },
        getQuestionerFormData(state) {
            return state.questionerFormData;
        },
        getQuestionerFormId(state) {
            return state.questionerFormId;
        },
        getQuestionerForms(state) {
            return state.questionerForms;
        },
        getQuestionerQuestion(state) {
            return state.questionerQuestion;
        },
        getQuestionerQuestions(state) {
            return state.questionerQuestions;
        },
        getPatientIntakeFormData(state) {
            return state.patientIntakeFormData;
        },
        getIntakeFormData(state) {
            return state.intakeFormData;
        },
        getIntakeFormId(state) {
            return state.intakeFormId;
        },
        getIntakeForms(state) {
            return state.intakeForms;
        },
        getIntakeQuestion(state) {
            return state.intakeQuestion;
        },
        getIntakeQuestions(state) {
            return state.intakeQuestions;
        },
        getLabDiagnostics(state) {
            return state.labdiagnostics;
        },
        getAppointments(state) {
            return state.appiontments;
        },
        getGAppointments(state) {
            return state.gappiontments;
        },
        getPatientPorfile(state) {
            return state.patientProfile;
        },
        getLocation(state) {
            return state.locations;
        },
        getUserList(state) {
            return state.userList;
        },
        getPractitioners(state) {
            return state.practitioners;
        },
        getLocationData(state) {
            return state.locationData;
        },
        getVendorData(state) {
            return state.VendorData;
        },


        getIpAccessList(state) {
            return state.ipAccessList;
        },
        getPhoneLogList(state) {
            return state.phoneLogList;
        },
        getMessageList(state) {
            return state.messageList;
        },
        getSubjectMessageList(state) {
            return state.subjectMessageList;
        },
        getEmailList(state) {
            return state.emailList;
        },
        getSubjectEmailList(state) {
            return state.subjectEmailList
        },
        getIsLoading(state) {
            return state.isLoading
        },
        getErrorMsg(state) {
            return state.isErrorMsg
        },
        getSuccessMsg(state) {
            console.log('payload');
            return state.isSuccessMsg
        },
        getShowMsg(state) {
            console.log('payload');
            return state.showMessage
        },
        getSingleInventory(state) {
            return state.inventoryVendorData;
        },
        getTaskList(state) {
            return state.taskList;
        },
        getPatientList(state) {
            return state.patients;
        },
        getVitalsList(state) {
            return state.vitalsList;
        },
        getPatientIsursance(state) {
            return state.patientInsurance;
        },
        getPatientTags(state) {
            return state.patientTags;
        },
        getLocationByID(state) {
            return state.loctionByID;
        },
        getVitalClinic(state) {
            return state.vitalData
        },
        getDietData(state) {
            return state.diet;
        },
        getImmunizationData(state) {
            return state.immunizations;
        },
        getReporductiveData(state) {
            return state.reporductive;
        },
        getPatientFamilyConditiondData(state) {
            return state.personnalFamilyHistoy;
        },
        getGeneralProfileData(state) {
            return state.generalProfile;
        },
        getPatientFamilyHistoryData(state) {
            return state.patientFamilyHisotry;
        },
        getVitalByIdData(state) {
            return state.getVitalById;
        },
        getMedAndSupplementData(state) {
            return state.medAndSupplementData;
        },
        getCategoryList(state) {
            return state.categories;
        },
        getAvailabilityList(state) {
            return state.availabilityList;
        },

        getProviderSlots(state) {
            return state.providerSlots;
        },
        getSingleRole(state) {
            return state.singleRole
        },
        getRoleList(state) {
            return state.roleList
        },
        getRefreshAbilities(state) {
            return state.refreshAbilities
        },
        getSingleInvoice(state) {
            return state.singleInvoice
        },
        getAppiontmentReport(state) {
            return state.appiontmentReport
        },
        getInvoiceState(state) {
            return state.invoiceState
        },
        getInvoiceState(state) {
            return state.invoiceState
        },
        getDashboardStats(state) {
            return state.dashboardStats
        },
        getPatientStats(state) {
            return state.patientStats
        },
        getProviderStats(state) {
            return state.providerStats
        },

        getSaveInvoiceData(state) {
            return state.saveInvoiceData
        },
        getProviderProfile(state) {
            return state.providerProfile
        },
        getInvoiceReport(state) {
            return state.invoiceReport
        },
        getOrderTimeLine(state) {
            return state.orderTimeLine
        },
        getPrescriptionReport(state) {
            return state.prescriptionReport
        },
        getPatientPortalProfile(state) {
            return state.patientPortalProfile
        },
        getPatientDashbaordPortalStats(state) {
            return state.patientDashbaordPortalStats
        },
        getForgotMessage(state) {
            return state.forgotMgs
        },


        getProviderRegister(state) {
            return state.registerProvider
        },
        getWizardSetup(state) {
            return state.wizardSetup
        },
        getformField(state) {
            return state.formField
        },
        getWidgetDataChart(state) {
            return state.widgetDataChart
        },
        getWidgetList(state) {
            return state.widgetList
        },

    },
});
