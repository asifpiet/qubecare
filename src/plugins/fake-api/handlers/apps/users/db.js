
export const db = {
  clinicalProfile:[
    // fields: {
    //   "smoking": "Smoking",
    //   "pastSmoking": "Past_Smoking",
    //   "bloodGroup": "BloodGroup",
    //   "generalNotes": "patGeneralHistoryNotes"
    // }
      
  ],
  supplyTransction:[
    {
      id:1,
      user:'zeesahn',
      supply:'BPC - 157',
    }
  ],
  purchaseOrders:[
    {
      id:1,
      user_id:1, // //Practitioner
      practitioner_name:'test', 
      vendor_type:'primry',
      vendor_name:'Asif test',
      description:'test',
      location:'Test',
      orderedTotalPrice:'140.14',
      actualPOTotalprice:'12.10',
      date:'10-10-2024',
      status:'Sent',   //sent, paid, Recevied, Paid Recevice Close
      itemDetail:[
        {
          id:1,
          inventory_id:1,
          item_name: 'Test',
          itemVendorPartNo:'235234',
          itemVendorBarcode:'12432',
          unitPrice:'70.7',
          OrderQuantity:'6.05',
          total_amount: '12.10',
        },
        {
          id:2,
          item_name: 'Test',
          itemVendorPartNo:'235234',
          itemVendorBarcode:'12432',
          unitPrice:'70.7',
          OrderQuantity:'6.05',
          total_amount: '12.10',
        }
      ]
    },  
    {
      id:2,
      user_id:1, // //Practitioner
      practitioner_name:'Bilal', 
      vendor_type:'primry',
      vendor_name:'Asif test',
      description:'test',
      location:'Test',
      orderedTotalPrice:'140.14',
      actualPOTotalprice:'12.10',
      date:'10-10-2024',
      status:'Sent',   //sent, paid, Recevied, Paid Recevice Close
      itemDetail:[
        {
          id:1,
          inventory_id:1,
          item_name: 'Test',
          itemVendorPartNo:'235234',
          itemVendorBarcode:'12432',
          unitPrice:'70.7',
          OrderQuantity:'6.05',
          total_amount: '12.10',
          status:'',
          date:'',
        },
        {
          id:2,
          item_name: 'Test',
          itemVendorPartNo:'235234',
          itemVendorBarcode:'12432',
          unitPrice:'70.7',
          OrderQuantity:'6.05',
          total_amount: '12.10',
          status:'',
          date:'',
        }
      ]
    },
  ],
  inventory:[
    {
      id:1,
      inventoryType:'Inventory',
      item_name:'Test Muhammad',
      manufPartNo:'21312',
      barcode:'231',
      isTaxable:'Yes',
      vendor_name:'Test Vendor',
      orderQuantity:'',
      totalPrice:'',
      pirce:'2.9',
      cost:'2.0',
      onhand:'2.0',
      onOrder:'3.5',
      dateOfBirth: '10-10-2024',
      expirationDate:"10-18-2024",
      sizeWeightNumber:'2',
      typicalDosageQty:'2',
      isIV:true,
      isTinchure:true,
      isHormone:true,
      isHerbalFormula:true,
      isPharmaCompound:true,
      other:true,
      reorderPoint:'test',
      minimumOHDesired: '2.0',
      secondaryVendor:'tets',
      secondaryVendorPartNo:'234',
      secondaryVendorBarcode:'134',
      lotNo:'342',
      description:'tets',
      categorizationSubType:'Male',
      cogsFactor:'2',
      categorizationType:'Hormones',
      location:'TEST',
      osmolarityMOsmml:'TETS',
      ingredientFor:'IV',
      beforeBreakfast:'tets',
      breakfast:'tets',
      beforeLunch:'tets',
      lunch:'tets',
      beforeDinner:'tets',
      dinner:'tets',
      beforeSleep:'tets',
      notes:'tets',
      healthBenefits:'tets', 
      mnp:'test',
    },
    {
      id:2,
      inventoryType:'Inventory',
      item_name:'Test Asif',
      manufPartNo:'21312',
      barcode:'231',
      isTaxable:'Yes',
      vendor_name:'New Vendor',
      pirce:'2.9',
      cost:'2.0',
      onhand:'2.0',
      onOrder:'3.5',
      dateOfBirth: '10-10-2024',
      expirationDate:"10-18-2024",
      sizeWeightNumber:'2',
      typicalDosageQty:'2',
      reorderPoint:'test',
      minimumOHDesired: '2.0',
      isIV:true,
      isTinchure:true,
      isHormone:true,
      isHerbalFormula:true,
      isPharmaCompound:true,
      other:true,
      secondaryVendor:'tets',
      secondaryVendorPartNo:'234',
      secondaryVendorBarcode:'134',
      lotNo:'342',
      description:'tets',
      categorizationSubType:'Male',
      cogsFactor:'2',
      categorizationType:'Hormones',
      location:'TEST',
      osmolarityMOsmml:'TETS',
      ingredientFor:'IV',
      beforeBreakfast:'tets',
      breakfast:'tets',
      beforeLunch:'tets',
      lunch:'tets',
      beforeDinner:'tets',
      dinner:'tets',
      beforeSleep:'tets',
      notes:'tets',
      healthBenefits:'tets', 
      mnp:'test',
    }
  ],
  userList: [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe, MD",
      "emailAddress": "john.doe@example.com",
      "textMessageNumber": "(555) 123-4567",
      "accessRights": {
        "admin": true,
        "practitioner": false,
        "patientPortalMessaging": true
      },
      "analytics": "None",
      "replyToEmail": "john.doe@example.com",
      "chartCoSigner": 2,  //user id==
      "supervisor": 2,  //user id==
      "sendEmail": true,
      "notes": "Passwords can be set/reset by email or text on the Login page. An admin will have access to patient consult records.",
      "copyDetailsFrom": 2,//user id==
      "status": 1
    },
    {
      "id": 2,
      "firstName": "Nasir",
      "lastName": "Ali",
      "emailAddress": "nasir.doe@example.com",
      "textMessageNumber": "(555) 123-4567",
      "accessRights": {
        "admin": false,
        "practitioner": true,
        "patientPortalMessaging": false
      },
      "analytics": "None",
      "replyToEmail": "john.doe@example.com",
      "chartCoSigner": 2,
      "supervisor": 2,
      "sendEmail": true,
      "notes": "Passwords can be set/reset by email or text on the Login page. An admin will have access to patient consult records.",
      "copyDetailsFrom": 2,
      "status": 1
    },
    {
      "id": 3,
      "firstName": "Zeshan",
      "lastName": "Anjum",
      "emailAddress": "zee.doe@example.com",
      "textMessageNumber": "(555) 123-4567",
      "accessRights": {
        "admin": false,
        "practitioner": true,
        "patientPortalMessaging": false
      },
      "analytics": "None",
      "replyToEmail": "zee.doe@example.com",
      "chartCoSigner": 2,
      "supervisor": 2,
      "sendEmail": true,
      "notes": "Passwords can be set/reset by email or text on the Login page. An admin will have access to patient consult records.",
      "copyDetailsFrom": 2,
      "status": 1
    }
  ],
  ipAccess: [
    {
      id: 1,
      ip: '192.168.1.1',
      addedBy: 'John Doe',
      lastUpdated: '2024-10-18',
      description: 'Office network',
    },
    {
      id: 2,
      ip: '172.16.254.1',
      addedBy: 'Jane Smith',
      lastUpdated: '2024-10-17',
      description: 'Home network',
    },
    {
      id: 3,
      ip: '10.0.0.1',
      addedBy: 'Admin',
      lastUpdated: '2024-10-16',
      description: 'Data center',
    },
  ],
  locations: [
    {
      id: 1,
      name: 'Test',
      address: 'Test',
      city: 'Test',
      state: 'AL',
      country: 'USA',
      zipcode: '21312',
      phoneNumber: '(213) 123-1234',
      npiNumber: '213',
      cliaNumber: '213',
      sfax_no: '00123',
      non_fax_no: '00456',
      consultTax: 0,
      procedureTax: 0,
      labTax: 0,
      suppliesTax: '213',
      aPIKey: '3454353453453',
      encryptionKey: '3454353453453',
      faxNoAcc: '00123',
      userName: '00123',
      vector: 'test',
      rooms: [
        {
          id: 1,
          room_name: 'test'
        },
        {
          id: 2,
          room_name: 'test2'
        }
      ]
    },
    {
      id: 2,
      name: 'Location Test',
      address: 'Test',
      city: 'Test',
      state: 'AL',
      country: 'USA',
      zipcode: '21312',
      phoneNumber: '(213) 123-1234',
      npiNumber: '213',
      cliaNumber: '213',
      sfax_no: '0099',
      non_fax_no: '00920',
      consultTax: 0,
      procedureTax: 0,
      labTax: 0,
      suppliesTax: '213',
      aPIKey: 'test',
      encryptionKey: 'test',
      faxNoAcc: '23435',
      userName: '0099',
      vector: '0099',
      rooms: [
        {
          id: 1,
          room_name: 'test'
        },
        {
          id: 2,
          room_name: 'test2'
        }
      ]
    },
  ],
  patient:[
    {
      id: 4,
      firstName: 'David',
      lastName: 'David',
      fullName: 'David David',
      middleName: 'David',
      preferredName: 'Asim',
      email: 'gslixby0@abc.net.au',
      contactMethod: 'email',
      personalID: '12323',
      dateOfBirth: '1990-10-11',
      sexatBirth: '1990-10-11',
      genderIdentity: 'male',
      race: '1',
      pronoun: 'He',
      ageGroup: '2',
      preferredPhone: '(102) 702-5315',
      alternativePhone: '(102) 702-5315',
      textmsgNumber: '(102) 702-5315',
      address: 'Test USA',
      city: 'Chicago',
      state: 'CA',
      zipcode: '923441',
      primaryPractitioner: 'Test',
      primaryCarePhysician: 'Test',
      guardian: 'Test',
      emergencyContactNumber: '(102) 702-5315',
      emergencyContactNameRelation: 'Brother',
      patientMaritalStatus: 'Married',
      occupation: 'Gov. Job',
      referredBy: 'Asif',
      patientNote: 'This setup will align the "Edit" button at the top-right corner of the card while the list remains on the left.',
      appiontment: 'Last:31 Aug 2024 Next: NA',
      alert: '',
      avatar: '',
      role: 'admin',
      status: 0,   //0 is Active 1 is inaxctive
      isportalAccess: 1,   //0 is Active 1 is is not access
    }
  ],

  nextOfKin:[
    {
      patient:1,
      plan: '',
      nextKinRelation: 'self',
      nextkinFirstName: 'self',
      nextkinLastName: 'self',
      nextkinPhone: '(102) 702-5315',
      nextkinAddress: 'self',
      nextkinCity: 'self',
      nextkinState: 'AL',
      nextkinZipCode: '1234',
      nextKinGuarantor: '1',

    }
  ],
  eligibilityCheck:[
    {
      patient:1,
      plan: '',
      nextKinRelation: 'self',
      nextkinFirstName: 'self',
      nextkinLastName: 'self',
      nextkinPhone: '(102) 702-5315',
      nextkinAddress: 'self',
      nextkinCity: 'self',
      nextkinState: 'AL',
      nextkinZipCode: '1234',
      nextKinGuarantor: '1',

    }
  ],
  insurance:[
    {
      patient:1,
      insurance: 'Test',
      insuredPlanOrProgramName: 'Test',
      insuredIDNumber: '123',
      insuredGroupNameNo: '123',
      employersSchoolName: 'Test',
      relationshiptoInsured: '',
      insuredName: 'Test',
      insuredDateOfBirth: '1990-10-11',
      insuredGender: 'male',
      coPayment: 'Test',
      coInsurance: 'test',
      insuranceDeductible: 'test',
      insuredAddress: 'tets',
      insuredCity: 'tets',
      insuredState: 'AL',
      insuredZip: '123',
      insuredPhone: '(102) 702-5315',
      payerName: 'TEST',
      payerID: '213123',
      payerAddress: 'test',
      payerCity: 'test',
      payerState: 'AL',
      payerZip: '122',
      referringProviderName: 'TEST',
      referringProviderNPI: 'TEST',
      referringProviderTaxonomy: 'TETS',
    }
  ],
  users: [   //Patient
    {
      id: 4,
      firstName: 'David',
      lastName: 'David',
      fullName: 'David David',
      middleName: 'David',
      preferredName: 'Asim',
      email: 'gslixby0@abc.net.au',
      contactMethod: 'email',
      personalID: '12323',
      dateOfBirth: '1990-10-11',
      sexatBirth: '1990-10-11',
      genderIdentity: 'male',
      race: '1',
      pronoun: 'He',
      ageGroup: '2',
      preferredPhone: '(102) 702-5315',
      alternativePhone: '(102) 702-5315',
      textmsgNumber: '(102) 702-5315',
      address: 'Test USA',
      city: 'Chicago',
      state: 'CA',
      zipcode: '923441',
      primaryPractitioner: 'Test',
      primaryCarePhysician: 'Test',
      guardian: 'Test',
      emergencyContactNumber: '(102) 702-5315',
      emergencyContactNameRelation: 'Brother',
      patientMaritalStatus: 'Married',
      occupation: 'Gov. Job',
      referredBy: 'Asif',
      patientNote: 'This setup will align the "Edit" button at the top-right corner of the card while the list remains on the left.',
      appiontment: 'Last:31 Aug 2024 Next: NA',
      alert: '',
      avatar: '',
      role: 'admin',
      status: 0,   //0 is Active 1 is inaxctive
      isportalAccess: 1,   //0 is Active 1 is is not access
      plan: '',
      nextKinRelation: 'self',
      nextkinFirstName: 'self',
      nextkinLastName: 'self',
      nextkinPhone: '(102) 702-5315',
      nextkinAddress: 'self',
      nextkinCity: 'self',
      nextkinState: 'AL',
      nextkinZipCode: '1234',
      nextKinGuarantor: '1',
      insurance: 'Test',
      insuredPlanOrProgramName: 'Test',
      insuredIDNumber: '123',
      insuredGroupNameNo: '123',
      employersSchoolName: 'Test',
      relationshiptoInsured: '',
      insuredName: 'Test',
      insuredDateOfBirth: '1990-10-11',
      insuredGender: 'male',
      coPayment: 'Test',
      coInsurance: 'test',
      insuranceDeductible: 'test',
      insuredAddress: 'tets',
      insuredCity: 'tets',
      insuredState: 'AL',
      insuredZip: '123',
      insuredPhone: '(102) 702-5315',
      payerName: 'TEST',
      payerID: '213123',
      payerAddress: 'test',
      payerCity: 'test',
      payerState: 'AL',
      payerZip: '122',
      referringProviderName: 'TEST',
      referringProviderNPI: 'TEST',
      referringProviderTaxonomy: 'TETS',
      inNetworkCalPlanStart: 'test20',
      inNetworkOOPMax: 'asif',
      inNetworkMet: 'asif',
      inNetworkDeductible: 'asif',
      inNetworkUsed: 'asif',
      outOfNetworkCalPlanStart: 'asif',
      outOfNetworkOOPMax: 'asif',
      outOfNetworkMet: 'asif',
      outOfNetworkDeductible: 'asif',
      outOfNetworkUsed: 'asif',
      LabsINCopayCoIns: 'asif',
      LabsOONCopayCoIns: 'asif',
      preAuthRequiredRorACUCHIROPT: 'yes',
      coveredUnderCHIROPT: 'tes',
      coverageDetails: 'massage',
      patientInsuranceDeductible: 'asif',
      patientInsuranceMet: 'test',
      patientInsuracnePercentage: '200',
      copayCoinsurance: 'test',
      limitsYear: '2',
      howManyUsed: '10',
      dollarAmountVisit: '200',
      outOfNetworkCopayCoIns: 'test',
      outOfNetworkDeductibleSecond: 'test',
      outOfNetworkMetSecond: 'test',
      outOfNetworkOOPMaxSecond: 'test',
      outOfNetworkOOPMaxMetSecond: 'test',
      diagnosisExclusions: 'test',
      eMCodesCovered: 'test',
      modalitiesCovered: 'test',
      patientInsuraceCoverageNotes: 'test',
      secInsurance: 'insur',
      secInsuredPlanORProgramName: 'insur',
      secInsuredIDNumber: '2312',
      secInsuredGroupNameNo: '123312',
      secEmployersSchoolName: 'insur',
      secRelationshipToInsured: '',
      secInsuredName: 'insur',
      secInsuredDateOfBirth: '1990-11-11',
      secGender: 'male',
      secInsuredAddress: 'insur',
      secInsuredCity: 'insur',
      secSelectState: 'AL',
      secInsuredZip: '2312',
      secInsuredPhone: '(102) 702-5315',
      secPayerName: 'insure',
      secPayerID: '1233',
      secPayerAddress: 'insure',
      secPayerCity: 'insure',
      secPayerState: 'AL',
      secZip: '21312',
      cardholderFirstname: 'ASIF',
      cardholderLastname: 'Asif',
      cardNumber: '4242424242424242',
      securityCode: '123',
      expiration: '11/40',
      billingAddress: 'Test',
      billingCity: 'Test',
      billingState: 'AL',
      billingPostalCode: '2312',
      billingCountry: 'USA',
      payerType: 'primary',
      practitioner: 'test',
      typeOfCoverage: 'Consultation [3]',
      officeAllyPayer: '',
      payerPortalLogin: 'test',
      portalPass: 'test',
      preAuth: [
        {
          "authorization": "Test",
          "startDate": "2024-09-11",
          "endDate": "2024-09-11",
          "visits": "Test",
          "amount": "Test",
          "notes": "Test"
        },
        {
          "authorization": "Test",
          "startDate": "2024-09-11",
          "endDate": "2024-09-11",
          "visits": "Test",
          "amount": "Test",
          "notes": "Test"
        }
      ],
      textMessage: [
        {
          id: '1',
          date: '2024-10-01',
          message: 'Hi this is first mgs',
          sentTo: '12234234234'
        },
        {
          id: '2',
          date: '2024-09-03',
          message: 'Hi this is second mgs',
          sentTo: '12234234234'
        },
        {
          id: '3',
          date: '2024-06-19',
          message: 'Hi this is second mgs',
          sentTo: '12234234234'
        },
      ],
      tasks: [
        {
          id: 1,
          activityMessage: 'Lab Order - Lab Order follow up',
          activityDueDate: '2024-10-08T12:58:29.780Z',
          activityStatus: 'Created',
          patient_name: 'Test',
          owner: 'asif  | zeeshan',
          title: 'Lab Order follow up',
          priority: 'medium',
          task_type: 'Lab Order',
          due_date: '2024-10-08T12:58:29.780Z',
          task_owner: 'asif',
          task_watchers: 'zeeshan',
          access_restriction: 'creator and assignee',
          sendEmailtoPatientApplicationForTask: '1',
          notes: 'this is test notes',
        },
        {
          id: 2,
          activityMessage: 'IV Order - Lab Order follow up',
          activityDueDate: '2024-10-08T12:58:29.780Z',
          activityStatus: 'Created',
          owner: 'Bret Summers',
          patient_name: 'Test',
          title: 'Lab Order follow up',
          priority: 'medium',
          task_type: 'IV Order',
          due_date: '2024-10-08T12:58:29.780Z',
          status: 'created',
          task_owner: 'Bret Summers',
          task_watchers: 'zeeshan',
          access_restriction: 'creator and assignee',
          sendEmailtoPatientApplicationForTask: '1',
          notes: 'this is test notes',
        },
      ],
      vitals: [
        {
          id: 1,
          provider: 'Zeeshan Anjum',
          created_date: '10/02/2024 11:38',
          weight_lbs: '2',
          weight_oz: '2',
          temperature: '20',
          height_ft: '5',
          height_in: '23',
          ibm: '1',
          blood_presssure: '14.6',
          diastolic: '1',
          respiratory_rate: '2',
          pulse: '33.3',
          bloodSugar: '3',
          fasting: 'fasting',
          saturation: '3',
          headCircumference_in: '2',
          neck_in: '2',
          shoulders_in: '2',
          chest_in: '2',
          waist_in: '2',
          hips_in: '2',
          lean_body_mass_lbs: '2',
          left_forearm_in: '2',
          left_wrist_in: '2',
          right_forearm_in: '2',
          right_wrist_in: '2',
          left_bicep_in: '2',
          right_bicep_in: '2',
          left_thigh_in: '2',
          right_thigh_in: '2',
          left_calf_in: '2',
          right_calf_in: '2',
          body_fat: '2',
          activity_level: 'Lightly Active',
          hip_to_waist: '2',
          resting_metabolic_rate_kcal: '2',
          with_activity_metabolic_rate_kcal: '2',
          fluid: '2',
          fluid_oz: '2',
          protein: 'x1.0',
          protein_gms: '2',
          protein_bmi: 'N/A',
          frame: 'small',
          ideal_body_weight_lbs: '2',
          ibw_percentage: 'n/a',
          adjusted_body_weight_abw_lbs: '2',
          recommendation_weight: '2',
          notes: 'this is test noe for vital',
          subjective_notes: 'Patient is here today for Botox facial',
        }
      ],
      LabDiagnostics: [
        {
          id: 1,
          provider: 'Zeeshan Anjum',
          created_at: '10/02/2024 11:38',
          updated_at: '11/02/2024 11:38',
          lab: 'LabCorp',
          order_test: '36066772410111318 Allergen, Mites, Lepidoglyphus destructor|50143',
          patient_name: 'David',
          result: null,
          notes: 'test note for lab',
          courtesy: {
            copy: null,
            fax_number: null,
            fax_attn: null,
            account_attn: null,
          },
          payer: null,
          includeSecIns: null,
          isWorkersComp: null,
          orderPSC: null,
          DiagnosisCode: {
            diagnosisCode: null,
            diagnosticTests: null,
          },
          orderDetails: {
            priority: null,
            collectionDateTime: null,
            collectionDate: null,
            specimenSource: null,
            relevantClinicalInfo: null,
            notes: null,
            sourceSiteDetails: null,
            race: null,
            hispanicHeritage: null,
            specimenActionCode: null,
            height: null,
            weight: null,
            volume: null,
          },
          maternalScreening: {
            insulinDependent: null,
            numberOfFetuses: null,
            otherIndications: null,
            additionalInfo: '',
            donorEgg: null,
            ageOfDonor: '',
            typeOfEggDonor: null,
            gestationalAgeWeeks: '',
            gestationalAgeDays: '',
            gestationalAgeDecimal: '',
            gestationalAgeDate: '',
            crownRumpLength: '',
            sonographerLastName: '',
            sonographerFirstName: '',
            sonographerId: '',
            nuchalTranslucency: '',
            nuchalTranslucencyTwinB: '',
          },
          bethesdaCytology: {
            cervix: null,
            endocervix: null,
            labiaVulva: null,
            vagina: null,
            endometrium: null,
            labiumMajus: null,
            labiumMinus: null,
            vulva: null,
            lmpMenoDate: '',
            none: null,
            coniza: null,
            colpBX: null,
            laserVap: null,
            cryo: null,
            radiation: null,
            datesResults: '',
            pregnant: null,
            lactating: null,
            oralContraceptives: null,
            menopausal: null,
            swabSpatula: null,
            brushSpatula: null,
            spatulaAlone: null,
            brushAlone: null,
            broomAlone: null,
            otherCollectionTechnique: null,
            estroRX: null,
            pmpBleeding: null,
            postPart: null,
            iud: null,
            allOtherPat: null,
            negative: null,
            atypical: null,
            caInSitu: null,
            invasive: null,
            otherPreviousInfo: null,
            hysterectomyTotal: null,
            hysterectomyPartial: null,
            dysplasiaLow: null,
            dysplasiaHigh: null,
          },
          includeElectronicSignature: false,
          printOrderDetails: false,
          emailOrderDetails: false,
          shareRequisitionOnPatientPortal: false,
        },
      ],
      intakes: [
        {
          id: 1,
          provider: 'Zeeshan Anjum',
          patient_name: 'David',
          created_date: '10/02/2024 11:38',
          weight_lbs: '2',
          weight_oz: '2',
          temperature: '20',
          height_ft: '5',
          height_in: '23',
          ibm: '1',
          blood_presssure: '14.6',
          diastolic: '1',
          respiratory_rate: '2',
          pulse: '33.3',
          bloodSugar: '3',
          fasting: 'fasting',
          saturation: '3',
          headCircumference_in: '2',
          neck_in: '2',
          shoulders_in: '2',
          chest_in: '2',
          waist_in: '2',
          hips_in: '2',
          lean_body_mass_lbs: '2',
          left_forearm_in: '2',
          left_wrist_in: '2',
          right_forearm_in: '2',
          right_wrist_in: '2',
          left_bicep_in: '2',
          right_bicep_in: '2',
          left_thigh_in: '2',
          right_thigh_in: '2',
          left_calf_in: '2',
          right_calf_in: '2',
          body_fat: '2',
          activity_level: 'Lightly Active',
          hip_to_waist: '2',
          resting_metabolic_rate_kcal: '2',
          with_activity_metabolic_rate_kcal: '2',
          fluid: '2',
          fluid_oz: '2',
          protein: 'x1.0',
          protein_gms: '2',
          protein_bmi: 'N/A',
          frame: 'small',
          ideal_body_weight_lbs: '2',
          ibw_percentage: 'n/a',
          adjusted_body_weight_abw_lbs: '2',
          recommendation_weight: '2',
          notes: 'this is test noe for vital',
          subjective_notes: 'Patient is here today for Botox facial',
        }
      ],
      appointments: [
        {
          id: 1,
          practitioner: 'Zeeshan Anjum',
          practitioner_id: 1,
          patient_name: 'David',
          patient_id: 1,
          title: 'David Initial Appointment',
          appointment_date: '2024-10-19',
          start: '08:15 PM',
          end: '08:30 PM',
          status: 'TENTATIVE',
          service: '',
          location: 'TKO Wellness',
          room: 'room 1',
          appointment_type: '',
          payment_type: '',
          notes: 'here is 19 appt',
        }
      ],
      healthMantaince:[
        {
          id: 1,
          name: 'Health Problem',
          typeOfItem: 'Custom',
          lastDate: '2024-10-04',
          nextDate: '2025-04-04',
          screeningDetails: 'Test',
          flag: 'Normal',

        },
        {
          id: 2,
          name: 'Health Problem Weak',
          typeOfItem: 'Custom',
          lastDate: '2024-10-04',
          nextDate: '2025-04-04',
          screeningDetails: 'Test',
          flag: 'Normal',
          
        }
      ],
      supperBills: {
        patientTag: ['test1', 'test2'],
        dateOfVisit: '',
        location: '',
        services: '',
        servicesTemplate: '',
        packges: '',
        servicesFields: [
          {
            id: 1,
            cpt: '',
            quantity: '',
            charges: '',
            discount: '',
            amount_discount: '',
            net_charges: '',
          }
        ],
        dispensary: '',
        optiMantraDatabase: '',
        productsFields: [
          {
            id: 1,
            supplement: '',
            quantity: '',
            unitPrice: '',
            discount: '',
            amount_discount: '',
            net_charges: '',
          }
        ],
        notes: '',
        notesOnAccountStatements: '',
        sumaryChargesFields: [
          {
            id: 1,
            chargesType: '',
            gross: '',
            addtnlDisc: '',
            addtnlDiscAmt: '',
            total: '',
            tax: '',
            taxAmt: '',
            netConsultCharge: '',
          }
        ],
        subtotalCharges: '',
        tipsGratuity: '',
        insuranceAmountSubmittedToInsurance: '',
        previousBalanceNotRecommended: '',
        total: '',
        dateOfPayment: '',
        PaymentCash: '',
        prepaidAmount: '',
        prepaidAmountType: '',
        paymentBank: '',
        paymentBankType: '',
        checkNo: '',
        paymentCardAmount: '',
        paymentCardType: '',
        cardLastFourDigit: '',
        additionalPaymentType: '',
        additionalPaymentAmount: '',
        additionalPaymentDate: '',
        additionalDetail: '',
        balance: '',
        sendEmail: '',
        printPdf: '',
        additionalInformation: [
          {
            id: 1,
            paymentType: '',
            amount: '',
            paymentMethod: '',
            paymentDate: '',
            detail: '',
          }
        ]
      },
      patient_history: [
        {
          id: 1,
          date: '2024-10-09',
          patient_name: 'David David',
          appiontment: 'Last:31 Aug 2024 Next: NA',
          appiontment_note: ' this is test note for appiontment',
          superbills: [
            {
              total: '0.00',
              paid: '0.00',
            },
            {
              total: '2.00',
              paid: '1.00',
            },
            {
              total: '5.00',
              paid: '3.00',
            }
          ],
          claims: [
            {
              claimed: '0.00',
              paid: '0.00',
            },
            {
              claimed: '2.00',
              paid: '0.00',
            }
           
          ]
          
        },
        {
          id: 2,
          date: '2024-10-09',
          patient_name: 'David Test',
          appiontment: 'Last:31 Aug 2024 Next: NA',
          appiontment_note: ' this is test note for appiontment',
          superbills: [
            {
              total: '0.00',
              paid: '0.00',
            },
            {
              total: '2.00',
              paid: '1.00',
            }
            
          ],
          claims: [
            {
              claimed: '0.00',
              paid: '0.00',
            },
            {
              claimed: '2.00',
              paid: '0.00',
            },
            {
              claimed: '3.00',
              paid: '3.00',
            }
          ]
          
        }
      ],
    },
    {
      id: 5,
      firstName: 'Nasir',
      lastName: 'ilyas',
      fullName: 'Nasir ilyas',
      middleName: 'Nasir',
      preferredName: 'Asim',
      email: 'nasir@gmail.com',
      contactMethod: 'email',
      personalID: '12323',
      dateOfBirth: '1990-10-11',
      sexatBirth: '1990-10-11',
      genderIdentity: 'male',
      race: '1',
      pronoun: 'He',
      ageGroup: '2',
      preferredPhone: '(102) 702-5315',
      alternativePhone: '(102) 702-5315',
      textmsgNumber: '(102) 702-5315',
      address: 'Test USA',
      city: 'Chicago',
      state: 'CA',
      zipcode: '923441',
      primaryPractitioner: 'Test',
      primaryCarePhysician: 'Test',
      guardian: 'Test',
      emergencyContactNumber: '(102) 702-5315',
      emergencyContactNameRelation: 'Brother',
      patientMaritalStatus: 'Married',
      occupation: 'Gov. Job',
      referredBy: 'Asif',
      patientNote: 'This setup will align the "Edit" button at the top-right corner of the card while the list remains on the left.',
      appiontment: 'Last:31 Aug 2024 Next: NA',
      alert: '',
      avatar: '',
      role: 'admin',
      status: 0,   //0 is Active 1 is inaxctive
      isportalAccess: 1,   //0 is Active 1 is is not access
      plan: '',
      nextKinRelation: 'self',
      nextkinFirstName: 'self',
      nextkinLastName: 'self',
      nextkinPhone: '(102) 702-5315',
      nextkinAddress: 'self',
      nextkinCity: 'self',
      nextkinState: 'AL',
      nextkinZipCode: '1234',
      nextKinGuarantor: '1',
      insurance: 'Test',
      insuredPlanOrProgramName: 'Test',
      insuredIDNumber: '123',
      insuredGroupNameNo: '123',
      employersSchoolName: 'Test',
      relationshiptoInsured: '',
      insuredName: 'Test',
      insuredDateOfBirth: '1990-10-11',
      insuredGender: 'male',
      coPayment: 'Test',
      coInsurance: 'test',
      insuranceDeductible: 'test',
      insuredAddress: 'tets',
      insuredCity: 'tets',
      insuredState: 'AL',
      insuredZip: '123',
      insuredPhone: '(102) 702-5315',
      payerName: 'TEST',
      payerID: '213123',
      payerAddress: 'test',
      payerCity: 'test',
      payerState: 'AL',
      payerZip: '122',
      referringProviderName: 'TEST',
      referringProviderNPI: 'TEST',
      referringProviderTaxonomy: 'TETS',
      inNetworkCalPlanStart: 'test20',
      inNetworkOOPMax: 'asif',
      inNetworkMet: 'asif',
      inNetworkDeductible: 'asif',
      inNetworkUsed: 'asif',
      outOfNetworkCalPlanStart: 'asif',
      outOfNetworkOOPMax: 'asif',
      outOfNetworkMet: 'asif',
      outOfNetworkDeductible: 'asif',
      outOfNetworkUsed: 'asif',
      LabsINCopayCoIns: 'asif',
      LabsOONCopayCoIns: 'asif',
      preAuthRequiredRorACUCHIROPT: 'yes',
      coveredUnderCHIROPT: 'tes',
      coverageDetails: 'massage',
      patientInsuranceDeductible: 'asif',
      patientInsuranceMet: 'test',
      patientInsuracnePercentage: '200',
      copayCoinsurance: 'test',
      limitsYear: '2',
      howManyUsed: '10',
      dollarAmountVisit: '200',
      outOfNetworkCopayCoIns: 'test',
      outOfNetworkDeductibleSecond: 'test',
      outOfNetworkMetSecond: 'test',
      outOfNetworkOOPMaxSecond: 'test',
      outOfNetworkOOPMaxMetSecond: 'test',
      diagnosisExclusions: 'test',
      eMCodesCovered: 'test',
      modalitiesCovered: 'test',
      patientInsuraceCoverageNotes: 'test',
      secInsurance: 'insur',
      secInsuredPlanORProgramName: 'insur',
      secInsuredIDNumber: '2312',
      secInsuredGroupNameNo: '123312',
      secEmployersSchoolName: 'insur',
      secRelationshipToInsured: '',
      secInsuredName: 'insur',
      secInsuredDateOfBirth: '1990-11-11',
      secGender: 'male',
      secInsuredAddress: 'insur',
      secInsuredCity: 'insur',
      secSelectState: 'AL',
      secInsuredZip: '2312',
      secInsuredPhone: '(102) 702-5315',
      secPayerName: 'insure',
      secPayerID: '1233',
      secPayerAddress: 'insure',
      secPayerCity: 'insure',
      secPayerState: 'AL',
      secZip: '21312',
      cardholderFirstname: 'ASIF',
      cardholderLastname: 'Asif',
      cardNumber: '4242424242424242',
      securityCode: '123',
      expiration: '11/40',
      billingAddress: 'Test',
      billingCity: 'Test',
      billingState: 'AL',
      billingPostalCode: '2312',
      billingCountry: 'USA',
      payerType: 'primary',
      practitioner: 'test',
      typeOfCoverage: 'Consultation [3]',
      officeAllyPayer: '',
      payerPortalLogin: 'test',
      portalPass: 'test',
      preAuth: [
        {
          "authorization": "Test",
          "startDate": "2024-09-11",
          "endDate": "2024-09-11",
          "visits": "Test",
          "amount": "Test",
          "notes": "Test"
        },
        {
          "authorization": "Test",
          "startDate": "2024-09-11",
          "endDate": "2024-09-11",
          "visits": "Test",
          "amount": "Test",
          "notes": "Test"
        }
      ],
      textMessage: [
        {
          id: '1',
          date: '2024-10-01',
          message: 'Hi this is first mgs',
          sentTo: '12234234234'
        },
        {
          id: '2',
          date: '2024-09-03',
          message: 'Hi this is second mgs',
          sentTo: '12234234234'
        },
        {
          id: '3',
          date: '2024-06-19',
          message: 'Hi this is second mgs',
          sentTo: '12234234234'
        },
      ],
      tasks: [
        {
          id: 1,
          activityMessage: 'Lab Order - Lab Order follow up',
          activityDueDate: '2024-10-08T12:58:29.780Z',
          activityStatus: 'Created',
          patient_name: 'Test',
          owner: 'asif  | zeeshan',
          title: 'Lab Order follow up',
          priority: 'medium',
          task_type: 'Lab Order',
          due_date: '2024-10-08T12:58:29.780Z',
          task_owner: 'asif',
          task_watchers: 'zeeshan',
          access_restriction: 'creator and assignee',
          sendEmailtoPatientApplicationForTask: '1',
          notes: 'this is test notes',
        },
        {
          id: 2,
          activityMessage: 'IV Order - Lab Order follow up',
          activityDueDate: '2024-10-08T12:58:29.780Z',
          activityStatus: 'Created',
          owner: 'Bret Summers',
          patient_name: 'Test',
          title: 'Lab Order follow up',
          priority: 'medium',
          task_type: 'IV Order',
          due_date: '2024-10-08T12:58:29.780Z',
          status: 'created',
          task_owner: 'Bret Summers',
          task_watchers: 'zeeshan',
          access_restriction: 'creator and assignee',
          sendEmailtoPatientApplicationForTask: '1',
          notes: 'this is test notes',
        },
      ],
      vitals: [
        {
          id: 1,
          provider: 'Zeeshan Anjum',
          created_date: '10/02/2024 11:38',
          weight_lbs: '2',
          weight_oz: '2',
          temperature: '20',
          height_ft: '5',
          height_in: '23',
          ibm: '1',
          blood_presssure: '14.6',
          diastolic: '1',
          respiratory_rate: '2',
          pulse: '33.3',
          bloodSugar: '3',
          fasting: 'fasting',
          saturation: '3',
          headCircumference_in: '2',
          neck_in: '2',
          shoulders_in: '2',
          chest_in: '2',
          waist_in: '2',
          hips_in: '2',
          lean_body_mass_lbs: '2',
          left_forearm_in: '2',
          left_wrist_in: '2',
          right_forearm_in: '2',
          right_wrist_in: '2',
          left_bicep_in: '2',
          right_bicep_in: '2',
          left_thigh_in: '2',
          right_thigh_in: '2',
          left_calf_in: '2',
          right_calf_in: '2',
          body_fat: '2',
          activity_level: 'Lightly Active',
          hip_to_waist: '2',
          resting_metabolic_rate_kcal: '2',
          with_activity_metabolic_rate_kcal: '2',
          fluid: '2',
          fluid_oz: '2',
          protein: 'x1.0',
          protein_gms: '2',
          protein_bmi: 'N/A',
          frame: 'small',
          ideal_body_weight_lbs: '2',
          ibw_percentage: 'n/a',
          adjusted_body_weight_abw_lbs: '2',
          recommendation_weight: '2',
          notes: 'this is test noe for vital',
          subjective_notes: 'Patient is here today for Botox facial',
        }
      ],
      LabDiagnostics: [
        {
          id: 1,
          provider: 'Zeeshan Anjum',
          created_at: '10/02/2024 11:38',
          updated_at: '11/02/2024 11:38',
          lab: 'LabCorp',
          order_test: '36066772410111318 Allergen, Mites, Lepidoglyphus destructor|50143',
          patient_name: 'David',
          result: null,
          notes: 'test note for lab',
          courtesy: {
            copy: null,
            fax_number: null,
            fax_attn: null,
            account_attn: null,
          },
          payer: null,
          includeSecIns: null,
          isWorkersComp: null,
          orderPSC: null,
          DiagnosisCode: {
            diagnosisCode: null,
            diagnosticTests: null,
          },
          orderDetails: {
            priority: null,
            collectionDateTime: null,
            collectionDate: null,
            specimenSource: null,
            relevantClinicalInfo: null,
            notes: null,
            sourceSiteDetails: null,
            race: null,
            hispanicHeritage: null,
            specimenActionCode: null,
            height: null,
            weight: null,
            volume: null,
          },
          maternalScreening: {
            insulinDependent: null,
            numberOfFetuses: null,
            otherIndications: null,
            additionalInfo: '',
            donorEgg: null,
            ageOfDonor: '',
            typeOfEggDonor: null,
            gestationalAgeWeeks: '',
            gestationalAgeDays: '',
            gestationalAgeDecimal: '',
            gestationalAgeDate: '',
            crownRumpLength: '',
            sonographerLastName: '',
            sonographerFirstName: '',
            sonographerId: '',
            nuchalTranslucency: '',
            nuchalTranslucencyTwinB: '',
          },
          bethesdaCytology: {
            cervix: null,
            endocervix: null,
            labiaVulva: null,
            vagina: null,
            endometrium: null,
            labiumMajus: null,
            labiumMinus: null,
            vulva: null,
            lmpMenoDate: '',
            none: null,
            coniza: null,
            colpBX: null,
            laserVap: null,
            cryo: null,
            radiation: null,
            datesResults: '',
            pregnant: null,
            lactating: null,
            oralContraceptives: null,
            menopausal: null,
            swabSpatula: null,
            brushSpatula: null,
            spatulaAlone: null,
            brushAlone: null,
            broomAlone: null,
            otherCollectionTechnique: null,
            estroRX: null,
            pmpBleeding: null,
            postPart: null,
            iud: null,
            allOtherPat: null,
            negative: null,
            atypical: null,
            caInSitu: null,
            invasive: null,
            otherPreviousInfo: null,
            hysterectomyTotal: null,
            hysterectomyPartial: null,
            dysplasiaLow: null,
            dysplasiaHigh: null,
          },
          includeElectronicSignature: false,
          printOrderDetails: false,
          emailOrderDetails: false,
          shareRequisitionOnPatientPortal: false,
        },
      ],
      intakes: [
        {
          id: 1,
          provider: 'Zeeshan Anjum',
          patient_name: 'David',
          created_date: '10/02/2024 11:38',
          weight_lbs: '2',
          weight_oz: '2',
          temperature: '20',
          height_ft: '5',
          height_in: '23',
          ibm: '1',
          blood_presssure: '14.6',
          diastolic: '1',
          respiratory_rate: '2',
          pulse: '33.3',
          bloodSugar: '3',
          fasting: 'fasting',
          saturation: '3',
          headCircumference_in: '2',
          neck_in: '2',
          shoulders_in: '2',
          chest_in: '2',
          waist_in: '2',
          hips_in: '2',
          lean_body_mass_lbs: '2',
          left_forearm_in: '2',
          left_wrist_in: '2',
          right_forearm_in: '2',
          right_wrist_in: '2',
          left_bicep_in: '2',
          right_bicep_in: '2',
          left_thigh_in: '2',
          right_thigh_in: '2',
          left_calf_in: '2',
          right_calf_in: '2',
          body_fat: '2',
          activity_level: 'Lightly Active',
          hip_to_waist: '2',
          resting_metabolic_rate_kcal: '2',
          with_activity_metabolic_rate_kcal: '2',
          fluid: '2',
          fluid_oz: '2',
          protein: 'x1.0',
          protein_gms: '2',
          protein_bmi: 'N/A',
          frame: 'small',
          ideal_body_weight_lbs: '2',
          ibw_percentage: 'n/a',
          adjusted_body_weight_abw_lbs: '2',
          recommendation_weight: '2',
          notes: 'this is test noe for vital',
          subjective_notes: 'Patient is here today for Botox facial',
        }
      ],
      healthMantaince: [
        {
          id: 1,
          name: 'Health Problem',
          typeOfItem: 'Custom',
          lastDate: '2024-10-04',
          nextDate: '2025-04-04',
          screeningDetails: 'Test',
          flag: 'Normal',

        },
        {
          id: 2,
          name: 'Health Problem Weak',
          typeOfItem: 'Custom',
          lastDate: '2024-10-04',
          nextDate: '2025-04-04',
          screeningDetails: 'Test',
          flag: 'Normal',
          
        }
      ],
      supperBills: {
        patientTag: ['test1', 'test2'],
        dateOfVisit: '',
        location: '',
        services: '',
        servicesTemplate: '',
        packges: '',
        servicesFields: [
          {
            id: 1,
            cpt: '',
            quantity: '',
            charges: '',
            discount: '',
            amount_discount: '',
            net_charges: '',
          }
        ],
        dispensary: '',
        optiMantraDatabase: '',
        productsFields: [
          {
            id: 1,
            supplement: '',
            quantity: '',
            unitPrice: '',
            discount: '',
            amount_discount: '',
            net_charges: '',
          }
        ],
        notes: '',
        notesOnAccountStatements: '',
        sumaryChargesFields: [
          {
            id: 1,
            chargesType: '',
            gross: '',
            addtnlDisc: '',
            addtnlDiscAmt: '',
            total: '',
            tax: '',
            taxAmt: '',
            netConsultCharge: '',
          }
        ],
        subtotalCharges: '',
        tipsGratuity: '',
        insuranceAmountSubmittedToInsurance: '',
        previousBalanceNotRecommended: '',
        total: '',
        dateOfPayment: '',
        PaymentCash: '',
        prepaidAmount: '',
        prepaidAmountType: '',
        paymentBank: '',
        paymentBankType: '',
        checkNo: '',
        paymentCardAmount: '',
        paymentCardType: '',
        cardLastFourDigit: '',
        additionalPaymentType: '',
        additionalPaymentAmount: '',
        additionalPaymentDate: '',
        additionalDetail: '',
        balance: '',
        sendEmail: '',
        printPdf: '',
        additionalInformation: [
          {
            id: 1,
            paymentType: '',
            amount: '',
            paymentMethod: '',
            paymentDate: '',
            detail: '',
          }
        ]
      },
      patient_history: [
        {
          id: 1,
          date: '2024-10-09',
          patient_name: 'David David',
          appiontment: 'Last:31 Aug 2024 Next: NA',
          appiontment_note: ' this is test note for appiontment',
          superbills: [
            {
              total: '0.00',
              paid: '0.00',
            },
            {
              total: '2.00',
              paid: '1.00',
            },
            {
              total: '5.00',
              paid: '3.00',
            }
          ],
          claims: [
            {
              claimed: '0.00',
              paid: '0.00',
            },
            {
              claimed: '2.00',
              paid: '0.00',
            }
           
          ]
          
        },
        {
          id: 2,
          date: '2024-10-09',
          patient_name: 'David Test',
          appiontment: 'Last:31 Aug 2024 Next: NA',
          appiontment_note: ' this is test note for appiontment',
          superbills: [
            {
              total: '0.00',
              paid: '0.00',
            },
            {
              total: '2.00',
              paid: '1.00',
            }
            
          ],
          claims: [
            {
              claimed: '0.00',
              paid: '0.00',
            },
            {
              claimed: '2.00',
              paid: '0.00',
            },
            {
              claimed: '3.00',
              paid: '3.00',
            }
          ]
          
        }
      ],
      documents:[
        {
          id:1,
          type:'Bill',
          date:'2024-10-04',
          image_title:'family_history.png',
          image:'family_history.png',
          description:'your document is uploaded'
          
        },
        {
          id:2,
          type:'Letters',
          date:'2024-10-04',
          image_title:'test.png',
          image:'family_history.png',
          description:'If using a template tag causes issues with your dropdown, you can avoid it by customizing the items directly within your component setup without relying on slots.'
        }
      ]
    },
  ],

  healthMantaince:[
    {
        "title": "Health Problem Weak",
        "date": "2024-10-23 21:42:13",
        "uuid": "9d512d07-7509-4059-8b03-cf72cb8b3b42",
        "begdate": "2024-10-04 00:00:00",
        "enddate": "2025-04-04 00:00:00"
    },
    {
        "title": "Health Problem Weak",
        "date": "2024-10-23 21:46:12",
        "uuid": "9d512e73-aeb5-4e33-ab05-089b54d32d12",
        "begdate": "2024-10-04 00:00:00",
        "enddate": "2025-04-04 00:00:00"
    },
    {
        "title": "BCC",
        "date": "2024-10-23 22:10:29",
        "uuid": "9d5142f8-7c37-4b59-bcd7-1ca4fd711ecd",
        "begdate": "2024-10-24 03:43:00",
        "enddate": null
    }
  ],
  tasks: [
    {
      id: 1,
      patient:4,
      activityMessage: 'Lab Order - Lab Order follow up',
      activityDueDate: '2024-10-08T12:58:29.780Z',
      activityStatus: 'Created',
      patient_name: 'Test',
      owner: 'asif  | zeeshan',
      title: 'Lab Order follow up',
      priority: 'medium',
      task_type: 'Lab Order',
      due_date: '2024-10-08T12:58:29.780Z',
      task_owner: 'asif',
      task_watchers: 'zeeshan',
      access_restriction: 'creator and assignee',
      sendEmailtoPatientApplicationForTask: '1',
      notes: 'this is test notes',
    },
    {
      id: 2,
      patient:4,
      activityMessage: 'IV Order - Lab Order follow up',
      activityDueDate: '2024-10-08T12:58:29.780Z',
      activityStatus: 'Created',
      owner: 'Bret Summers',
      patient_name: 'Test',
      title: 'Lab Order follow up',
      priority: 'medium',
      task_type: 'IV Order',
      due_date: '2024-10-08T12:58:29.780Z',
      status: 'created',
      task_owner: 'Bret Summers',
      task_watchers: 'zeeshan',
      access_restriction: 'creator and assignee',
      sendEmailtoPatientApplicationForTask: '1',
      notes: 'this is test notes',
    },
  ],

  phoneLogList: [
    {
      "date": "10/17/2024 18:00",
      "provider": "nasir",
      "message": "Sample message 1",
      "pdfUrl": "https://example.com/file1.pdf"
    },
    {
      "date": "10/17/2024 18:00",
      "provider": "Zeeshan",
      "message": "Sample message 2",
      "pdfUrl": "https://example.com/file2.pdf"
    },
    {
      "date": "10/17/2024 18:00",
      "provider": "Zeeshan",
      "message": "Sample message 3",
      "pdfUrl": "https://example.com/file3.pdf"
    },
    {
      "date": "10/17/2024 18:12",
      "provider": "Zeeshan",
      "message": "Sample message 4",
      "pdfUrl": "https://example.com/file4.pdf"
    },
    {
      "date": "10/17/2024 18:12",
      "provider": "nasir",
      "message": "Sample message 5",
      "pdfUrl": "https://example.com/file5.pdf"
    },
    {
      "date": "10/17/2024 17:48",
      "provider": "Ron",
      "message": "Sample message 6",
      "pdfUrl": "https://example.com/file6.pdf"
    }
  ],

  messageList: [
    {
      "id": 1,
      "with_name": "John Doe",
      "subject": "Just Test",
      "date": "10/17/2024 18:00",
      "number_of_message": "1",
      "unread_message": '0'
    },
    {
      "id": 2,
      "with_name": "Jane Smith",
      "subject": "Just Test",
      "date": "10/17/2024 18:00",
      "number_of_message": "1",
      "unread_message": '0'
    },
    {
      "id": 3,
      "with_name": "Alice Johnson",
      "subject": "Just Test",
      "date": "10/17/2024 18:00",
      "number_of_message": "1",
      "unread_message": '0'
    },
    {
      "id": 4,
      "with_name": "Bob Brown",
      "subject": "Just Test",
      "date": "10/17/2024 18:00",
      "number_of_message": "1",
      "unread_message": '0'
    }
  ],
  subjectMessageList: {
    subject_id: 1,
    messages: [
      {
        message_id: 1,
        text: 'just test',
        message_by: 'Zeeshan Anjum',
        date: "2024-10-18T09:30:00Z"
        
      },
      {
        message_id: 2,
        text: 'just test 2',
        message_by: 'Zeeshan Anjum',
        date: "2024-10-18T09:30:00Z"
        
      },
    ]
  },

  labdiagnostics: [
    {
      id: 1,
      provider: 'Zeeshan Anjum',
      created_at: '10/02/2024 11:38',
      updated_at: '11/02/2024 11:38',
      lab: 'LabCorp',
      order_test: '36066772410111318 Allergen, Mites, Lepidoglyphus destructor|50143',
      patient_name: 'David',
      result: null,
      notes: 'test note for lab',
      courtesy: {
        copy: null,
        fax_number: null,
        fax_attn: null,
        account_attn: null,
      },
      payer: null,
      includeSecIns: null,
      isWorkersComp: null,
      orderPSC: null,
      DiagnosisCode: {
        diagnosisCode: null,
        diagnosticTests: null,
      },
      orderDetails: {
        priority: null,
        collectionDateTime: null,
        collectionDate: null,
        specimenSource: null,
        relevantClinicalInfo: null,
        notes: null,
        sourceSiteDetails: null,
        race: null,
        hispanicHeritage: null,
        specimenActionCode: null,
        height: null,
        weight: null,
        volume: null,
      },
      maternalScreening: {
        insulinDependent: null,
        numberOfFetuses: null,
        otherIndications: null,
        additionalInfo: '',
        donorEgg: null,
        ageOfDonor: '',
        typeOfEggDonor: null,
        gestationalAgeWeeks: '',
        gestationalAgeDays: '',
        gestationalAgeDecimal: '',
        gestationalAgeDate: '',
        crownRumpLength: '',
        sonographerLastName: '',
        sonographerFirstName: '',
        sonographerId: '',
        nuchalTranslucency: '',
        nuchalTranslucencyTwinB: '',
      },
      bethesdaCytology: {
        cervix: null,
        endocervix: null,
        labiaVulva: null,
        vagina: null,
        endometrium: null,
        labiumMajus: null,
        labiumMinus: null,
        vulva: null,
        lmpMenoDate: '',
        none: null,
        coniza: null,
        colpBX: null,
        laserVap: null,
        cryo: null,
        radiation: null,
        datesResults: '',
        pregnant: null,
        lactating: null,
        oralContraceptives: null,
        menopausal: null,
        swabSpatula: null,
        brushSpatula: null,
        spatulaAlone: null,
        brushAlone: null,
        broomAlone: null,
        otherCollectionTechnique: null,
        estroRX: null,
        pmpBleeding: null,
        postPart: null,
        iud: null,
        allOtherPat: null,
        negative: null,
        atypical: null,
        caInSitu: null,
        invasive: null,
        otherPreviousInfo: null,
        hysterectomyTotal: null,
        hysterectomyPartial: null,
        dysplasiaLow: null,
        dysplasiaHigh: null,
      },
      includeElectronicSignature: false,
      printOrderDetails: false,
      emailOrderDetails: false,
      shareRequisitionOnPatientPortal: false,
    },
  ],

  appointments: [
    {
      id: 1,
      practitioner: 'Zee',
      practitioner_id: 1,
      patient: 'David David',
      patient_id: 1,
      title: 'David Initial Appointment',
      start: '2024-10-17T20:00:00.000Z',
      end: '2024-10-17T20:15:00.000Z',
      date: '2024-10-17',
      start_time: '08:00 pm',
      end_time: '08:15 pm',
      allDay: false,
      status: 'TENTATIVE',
      service: 'Test',
      location: 'TKO Wellness',
      room: 'room 1',
      appointment_type: 'FOLLOW_UP',
      payment_type: 'Cash Only',
      notes: 'here is 19 appt',
      url: '',
      extendedProps: {
        calendar: 'Business',
        
      },
    }
  ],
  
  emailList: [
    {
      date: '2024-10-18T09:30:00Z',
      provider: 'Zeshan anjum',
      subject: 'Just Test',
      subject_id:1
      
    },
    {
      date: '2024-10-18T09:30:00Z',
      provider: 'Jasir',
      subject: 'Just Test',
      subject_id:2
      
    },
    {
      date: '2024-10-18T09:30:00Z',
      provider: 'Ilyas',
      subject: 'Just Test',
      subject_id:3
      
    }
  ],
  subjectEmailList: {
    subject_id: 1,
    messages: [
      {
        message_id: 1,
        text: 'just test',
        message_by: 'Zeeshan Anjum',
        date: "2024-10-18T09:30:00Z"
        
      },
    ]
  },
  intakeQuestions: [
    {
      id: 1,
      name: 'Weight Loss',
      description: 'Some text',
      data: {
            "id": "3b8a6fbf-099b-4b1a-98a1-a169eeb1afb1",
            "stages": {
                "d39d5596-83ea-48a6-a229-81ba6f90e427": {
                    "children": [
                        "854f855b-a181-418d-ad92-c5cb08da8735"
                    ],
                    "id": "d39d5596-83ea-48a6-a229-81ba6f90e427"
                }
            },
            "rows": {
                "854f855b-a181-418d-ad92-c5cb08da8735": {
                    "config": {
                        "fieldset": false,
                        "legend": "",
                        "inputGroup": false
                    },
                    "children": [
                        "e973ada4-5762-49f2-9c3d-df6614356551"
                    ],
                    "className": [
                        "formeo-row"
                    ],
                    "id": "854f855b-a181-418d-ad92-c5cb08da8735"
                }
            },
            "columns": {
                "e973ada4-5762-49f2-9c3d-df6614356551": {
                    "config": {
                        "width": "100%"
                    },
                    "children": [
                        "77492f24-12da-4296-9583-26c5f3ff3c89"
                    ],
                    "className": "formeo-column",
                    "id": "e973ada4-5762-49f2-9c3d-df6614356551"
                }
            },
            "fields": {
                "77492f24-12da-4296-9583-26c5f3ff3c89": {
                    "conditions": [
                        {
                            "if": [
                                {
                                    "source": "",
                                    "sourceProperty": "",
                                    "comparison": "",
                                    "target": "",
                                    "targetProperty": ""
                                }
                            ],
                            "then": [
                                {
                                    "target": "",
                                    "targetProperty": "",
                                    "assignment": "",
                                    "value": ""
                                }
                            ]
                        }
                    ],
                    "tag": "input",
                    "attrs": {
                        "required": false,
                        "type": "text",
                        "className": "",
                        "name": "target_weight"
                    },
                    "config": {
                        "label": "Target Weight"
                    },
                    "meta": {
                        "group": "common",
                        "icon": "text-input",
                        "id": "text-input"
                    },
                    "id": "77492f24-12da-4296-9583-26c5f3ff3c89"
                }
            }
      },
      status: true,
      created_at: '2024-10-27 00:00:00',
      updated_at: '2024-10-27 00:00:00',
    }
  ],
  intakeQuestion: {
    id: 1,
    name: 'Weight Loss',
    description: 'Some text',
    date: {
          "id": "3b8a6fbf-099b-4b1a-98a1-a169eeb1afb1",
          "stages": {
              "d39d5596-83ea-48a6-a229-81ba6f90e427": {
                  "children": [
                      "854f855b-a181-418d-ad92-c5cb08da8735"
                  ],
                  "id": "d39d5596-83ea-48a6-a229-81ba6f90e427"
              }
          },
          "rows": {
              "854f855b-a181-418d-ad92-c5cb08da8735": {
                  "config": {
                      "fieldset": false,
                      "legend": "",
                      "inputGroup": false
                  },
                  "children": [
                      "e973ada4-5762-49f2-9c3d-df6614356551"
                  ],
                  "className": [
                      "formeo-row"
                  ],
                  "id": "854f855b-a181-418d-ad92-c5cb08da8735"
              }
          },
          "columns": {
              "e973ada4-5762-49f2-9c3d-df6614356551": {
                  "config": {
                      "width": "100%"
                  },
                  "children": [
                      "77492f24-12da-4296-9583-26c5f3ff3c89"
                  ],
                  "className": "formeo-column",
                  "id": "e973ada4-5762-49f2-9c3d-df6614356551"
              }
          },
          "fields": {
              "77492f24-12da-4296-9583-26c5f3ff3c89": {
                  "conditions": [
                      {
                          "if": [
                              {
                                  "source": "",
                                  "sourceProperty": "",
                                  "comparison": "",
                                  "target": "",
                                  "targetProperty": ""
                              }
                          ],
                          "then": [
                              {
                                  "target": "",
                                  "targetProperty": "",
                                  "assignment": "",
                                  "value": ""
                              }
                          ]
                      }
                  ],
                  "tag": "input",
                  "attrs": {
                      "required": false,
                      "type": "text",
                      "className": "",
                      "name": "target_weight"
                  },
                  "config": {
                      "label": "Target Weight"
                  },
                  "meta": {
                      "group": "common",
                      "icon": "text-input",
                      "id": "text-input"
                  },
                  "id": "77492f24-12da-4296-9583-26c5f3ff3c89"
              }
          }
    },
    status: true,
    created_at: '2024-10-27 00:00:00',
    updated_at: '2024-10-27 00:00:00',
  },
  intakeForms: [
    {
      id: 1,
      name: 'Weight Loss',
    }
  ],
  intakeFormData: {
    name: 'Weight Loss',
    data: {
          "id": "3b8a6fbf-099b-4b1a-98a1-a169eeb1afb1",
          "stages": {
              "d39d5596-83ea-48a6-a229-81ba6f90e427": {
                  "children": [
                      "854f855b-a181-418d-ad92-c5cb08da8735"
                  ],
                  "id": "d39d5596-83ea-48a6-a229-81ba6f90e427"
              }
          },
          "rows": {
              "854f855b-a181-418d-ad92-c5cb08da8735": {
                  "config": {
                      "fieldset": false,
                      "legend": "",
                      "inputGroup": false
                  },
                  "children": [
                      "e973ada4-5762-49f2-9c3d-df6614356551"
                  ],
                  "className": [
                      "formeo-row"
                  ],
                  "id": "854f855b-a181-418d-ad92-c5cb08da8735"
              }
          },
          "columns": {
              "e973ada4-5762-49f2-9c3d-df6614356551": {
                  "config": {
                      "width": "100%"
                  },
                  "children": [
                      "77492f24-12da-4296-9583-26c5f3ff3c89"
                  ],
                  "className": "formeo-column",
                  "id": "e973ada4-5762-49f2-9c3d-df6614356551"
              }
          },
          "fields": {
              "77492f24-12da-4296-9583-26c5f3ff3c89": {
                  "conditions": [
                      {
                          "if": [
                              {
                                  "source": "",
                                  "sourceProperty": "",
                                  "comparison": "",
                                  "target": "",
                                  "targetProperty": ""
                              }
                          ],
                          "then": [
                              {
                                  "target": "",
                                  "targetProperty": "",
                                  "assignment": "",
                                  "value": ""
                              }
                          ]
                      }
                  ],
                  "tag": "input",
                  "attrs": {
                      "required": false,
                      "type": "text",
                      "className": "",
                      "name": "target_weight"
                  },
                  "config": {
                      "label": "Target Weight"
                  },
                  "meta": {
                      "group": "common",
                      "icon": "text-input",
                      "id": "text-input"
                  },
                  "id": "77492f24-12da-4296-9583-26c5f3ff3c89"
              }
          }
    }
  },
  patientIntakeFormData: {
    uuid: 'fdkfjsdk',
    name: 'Weight Loss',
    data: {
      "targeted_weight": "100",
      "height": "5"
    }
  },
  questionerQuestions: [
    {
      id: 1,
      name: 'Weight Loss',
      description: 'Some text',
      data: {
            "id": "3b8a6fbf-099b-4b1a-98a1-a169eeb1afb1",
            "stages": {
                "d39d5596-83ea-48a6-a229-81ba6f90e427": {
                    "children": [
                        "854f855b-a181-418d-ad92-c5cb08da8735"
                    ],
                    "id": "d39d5596-83ea-48a6-a229-81ba6f90e427"
                }
            },
            "rows": {
                "854f855b-a181-418d-ad92-c5cb08da8735": {
                    "config": {
                        "fieldset": false,
                        "legend": "",
                        "inputGroup": false
                    },
                    "children": [
                        "e973ada4-5762-49f2-9c3d-df6614356551"
                    ],
                    "className": [
                        "formeo-row"
                    ],
                    "id": "854f855b-a181-418d-ad92-c5cb08da8735"
                }
            },
            "columns": {
                "e973ada4-5762-49f2-9c3d-df6614356551": {
                    "config": {
                        "width": "100%"
                    },
                    "children": [
                        "77492f24-12da-4296-9583-26c5f3ff3c89"
                    ],
                    "className": "formeo-column",
                    "id": "e973ada4-5762-49f2-9c3d-df6614356551"
                }
            },
            "fields": {
                "77492f24-12da-4296-9583-26c5f3ff3c89": {
                    "conditions": [
                        {
                            "if": [
                                {
                                    "source": "",
                                    "sourceProperty": "",
                                    "comparison": "",
                                    "target": "",
                                    "targetProperty": ""
                                }
                            ],
                            "then": [
                                {
                                    "target": "",
                                    "targetProperty": "",
                                    "assignment": "",
                                    "value": ""
                                }
                            ]
                        }
                    ],
                    "tag": "input",
                    "attrs": {
                        "required": false,
                        "type": "text",
                        "className": "",
                        "name": "target_weight"
                    },
                    "config": {
                        "label": "Target Weight"
                    },
                    "meta": {
                        "group": "common",
                        "icon": "text-input",
                        "id": "text-input"
                    },
                    "id": "77492f24-12da-4296-9583-26c5f3ff3c89"
                }
            }
      },
      status: true,
      created_at: '2024-10-27 00:00:00',
      updated_at: '2024-10-27 00:00:00',
    }
  ],
  questionerQuestion: {
    id: 1,
    name: 'Weight Loss',
    description: 'Some text',
    date: {
          "id": "3b8a6fbf-099b-4b1a-98a1-a169eeb1afb1",
          "stages": {
              "d39d5596-83ea-48a6-a229-81ba6f90e427": {
                  "children": [
                      "854f855b-a181-418d-ad92-c5cb08da8735"
                  ],
                  "id": "d39d5596-83ea-48a6-a229-81ba6f90e427"
              }
          },
          "rows": {
              "854f855b-a181-418d-ad92-c5cb08da8735": {
                  "config": {
                      "fieldset": false,
                      "legend": "",
                      "inputGroup": false
                  },
                  "children": [
                      "e973ada4-5762-49f2-9c3d-df6614356551"
                  ],
                  "className": [
                      "formeo-row"
                  ],
                  "id": "854f855b-a181-418d-ad92-c5cb08da8735"
              }
          },
          "columns": {
              "e973ada4-5762-49f2-9c3d-df6614356551": {
                  "config": {
                      "width": "100%"
                  },
                  "children": [
                      "77492f24-12da-4296-9583-26c5f3ff3c89"
                  ],
                  "className": "formeo-column",
                  "id": "e973ada4-5762-49f2-9c3d-df6614356551"
              }
          },
          "fields": {
              "77492f24-12da-4296-9583-26c5f3ff3c89": {
                  "conditions": [
                      {
                          "if": [
                              {
                                  "source": "",
                                  "sourceProperty": "",
                                  "comparison": "",
                                  "target": "",
                                  "targetProperty": ""
                              }
                          ],
                          "then": [
                              {
                                  "target": "",
                                  "targetProperty": "",
                                  "assignment": "",
                                  "value": ""
                              }
                          ]
                      }
                  ],
                  "tag": "input",
                  "attrs": {
                      "required": false,
                      "type": "text",
                      "className": "",
                      "name": "target_weight"
                  },
                  "config": {
                      "label": "Target Weight"
                  },
                  "meta": {
                      "group": "common",
                      "icon": "text-input",
                      "id": "text-input"
                  },
                  "id": "77492f24-12da-4296-9583-26c5f3ff3c89"
              }
          }
    },
    status: true,
    created_at: '2024-10-27 00:00:00',
    updated_at: '2024-10-27 00:00:00',
  },
  questionerForms: [
    {
      id: 1,
      name: 'Weight Loss',
    }
  ],
  questionerFormData: {
    name: 'Weight Loss',
    data: {
          "id": "3b8a6fbf-099b-4b1a-98a1-a169eeb1afb1",
          "stages": {
              "d39d5596-83ea-48a6-a229-81ba6f90e427": {
                  "children": [
                      "854f855b-a181-418d-ad92-c5cb08da8735"
                  ],
                  "id": "d39d5596-83ea-48a6-a229-81ba6f90e427"
              }
          },
          "rows": {
              "854f855b-a181-418d-ad92-c5cb08da8735": {
                  "config": {
                      "fieldset": false,
                      "legend": "",
                      "inputGroup": false
                  },
                  "children": [
                      "e973ada4-5762-49f2-9c3d-df6614356551"
                  ],
                  "className": [
                      "formeo-row"
                  ],
                  "id": "854f855b-a181-418d-ad92-c5cb08da8735"
              }
          },
          "columns": {
              "e973ada4-5762-49f2-9c3d-df6614356551": {
                  "config": {
                      "width": "100%"
                  },
                  "children": [
                      "77492f24-12da-4296-9583-26c5f3ff3c89"
                  ],
                  "className": "formeo-column",
                  "id": "e973ada4-5762-49f2-9c3d-df6614356551"
              }
          },
          "fields": {
              "77492f24-12da-4296-9583-26c5f3ff3c89": {
                  "conditions": [
                      {
                          "if": [
                              {
                                  "source": "",
                                  "sourceProperty": "",
                                  "comparison": "",
                                  "target": "",
                                  "targetProperty": ""
                              }
                          ],
                          "then": [
                              {
                                  "target": "",
                                  "targetProperty": "",
                                  "assignment": "",
                                  "value": ""
                              }
                          ]
                      }
                  ],
                  "tag": "input",
                  "attrs": {
                      "required": false,
                      "type": "text",
                      "className": "",
                      "name": "target_weight"
                  },
                  "config": {
                      "label": "Target Weight"
                  },
                  "meta": {
                      "group": "common",
                      "icon": "text-input",
                      "id": "text-input"
                  },
                  "id": "77492f24-12da-4296-9583-26c5f3ff3c89"
              }
          }
    }
  },
  patientQuestionerFormData: {
    uuid: 'fdkfjsdk',
    name: 'Weight Loss',
    data: {
      "targeted_weight": "100",
      "height": "5"
    }
  },
  consentForms:[
    {
      id: 1,
      uuid: '',
      practationer_name: '',
      name: 'OPD',
      description: 'Some Text',
      data: {},
      status: true,
      created_at: '2024-10-27 00:00:00',
      updated_at: '2024-10-27 00:00:00',
    }
  ],
  consentForm: {
    id: 1,
    practationer_id: '',
    name: 'OPD',
    description: 'Some Text',
    data: {},
    status: true,
    created_at: '2024-10-27 00:00:00',
    updated_at: '2024-10-27 00:00:00',
  },
  consentFormsList: [
    {
      id: 1,
      name: 'OPD',
    }
  ],
  consentFormData: {
    name: 'Weight Loss',
    description: 'some text',
    data: {}
  },
  patientConsentForms:[
    {
      id: 1,
      uuid: '',
      form_name: 'OPD',
      name: null,
      signature: '',
      created_at: '2024-10-27 00:00:00',
      updated_at: '2024-10-27 00:00:00',
    }
  ],
  patientConsentFormData: {
    id:1,
    practationer_id: null,
    uuid: 'fdkfjsdk',
    form_name: 'OPD',
    description: 'some text',
    data: {
      "attendent_name": "abc",
      "contact": "123"
    },
    name: null,
    signature: null
  },
  submittedIntakes:[
    {
      id: 1,
      patient_name: 'John',
      form_id: 2,
      form_name: 'Weight Loss',
      form_type: 'intake form',
      data: {},
      description: '',
      created_at: '2024-10-27 00:00:00',
      updated_at: '2024-10-27 00:00:00',
    },
  ]
}
