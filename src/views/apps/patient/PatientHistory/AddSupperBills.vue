<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { VForm } from 'vuetify/components/VForm';
import { useStore } from 'vuex';
const store = useStore()
const isFormValid = ref(false)
const  isLoading = ref(false)
const refForm = ref()
const patientTags = ref([]);
const newTag = ref(''); 
const dateOfVisit = ref()
const location = ref()
const services = ref()
const servicesTemplate = ref()
const packges = ref()
const additionalformFields = ref([
  { paymentType: '', amount: '', paymentMethod: '', paymentDate: '', detail: '' }
]);
const addNewFields = () => {
  additionalformFields.value.push({ paymentType: '', amount: '', paymentMethod: '', paymentDate: '', detail: '' });
};

const servicesFields = ref([
  { cpt: '', quantity: '', charges: '', discount: '', amount_discount: '', net_charges: '' }
]);
const dispensary= ref()
const optiMantraDatabase = ref()
const productsFields = ref([
  { supplement: '', quantity: '', unitPrice:'', discount: '', amount_discount: '', net_charges: '' }
]);
const notes = ref()
const notesOnAccountStatements = ref()
const sumaryChargesFields = ref([
  { chargesType: '', gross: '', addtnlDisc: '', addtnlDiscAmt	: '', total: '', tax: '', taxAmt:'', netConsultCharge:'' }
]);

const subtotalCharges = ref()
const tipsGratuity = ref()
const insuranceAmountSubmittedToInsurance = ref()
const previousBalanceNotRecommended = ref()
const total = ref()
const dateOfPayment = ref()
const PaymentCash= ref()
const prepaidAmount= ref()
const prepaidAmountType= ref()

const paymentBank= ref()
const paymentBankType= ref()
const checkNo= ref()

const paymentCardAmount= ref()
const paymentCardType= ref()
const cardLastFourDigit= ref()

const additionalPaymentType = ref()
const additionalPaymentAmount = ref()
const additionalPaymentDate = ref()
const additionalDetail = ref()


const balance = ref()
const sendEmail = ref()
const printPdf = ref()


const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  // healthMantainceData:{
  //   type: Array,
  // }
})

const emit = defineEmits([
  'closeForm',
  'patientData'
]);

const closeNavigationDrawer = () => {
  
  emit('update:isDrawerOpen', false)  
  emit('reset-form')
  
  
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const onSubmit = async() => {
  isLoading.value = true
  refForm.value?.validate().then(async({ valid }) => {
    if (valid) {
      const newEntryId = Date.now();
      // let heathMantaince = store.getters.getPatientPorfile.healthMantaince;
      
      emit('healthMantaince', {
        id: store.getters.getPatientPorfile.patientId,
        healthMantaince:[
        ...store.getters.getPatientPorfile.healthMantaince,  
        {
          id:newEntryId, 
          name:name.value,
          typeOfItem:typeOfItem.value,
          lastDate:lastDate.value,
          nextDate: nextDate.value,
          screeningDetails: screeningDetails.value,
          flag: flag.value
        }
      ]
      })
      
         
    }
  })
  
}

const items = ref([
  'Streaming',
  'Eating',
  'Programming',
  'Playing games',
  'Sleeping',
])
const desserts = [
  {
    dessert: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
  }
];


const numberedSteps = [
  {
    title: 'Patient Info',
  },
  {
    title: 'Office Visits',
  },
  {
    title: 'Products & Supplies',
  },
  {
    title: 'Summary of Charges',
  },
  {
    title: 'Payment',
  },
]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
const isCurrentStepValid = ref(true)
const refAccountForm = ref()
const refPersonalForm = ref()
const refSocialLinkForm = ref()
const refSumaryCharges = ref()

const patient = ref({
  patientTags:'',
  dateOfVisit:'',
  location:'',
  username: '',
  email: '',
  password: '',
  cPassword: '',
})

const visitDetail = ref({
  services: '',
  servicesTemplate: '',
  Packages: '',
  
})

const socialForm = ref({
  twitter: '',
  facebook: '',
  googlePlus: '',
  LinkedIn: '',
})

const validateAccountForm = () => {
  refAccountForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validatePersonalForm = () => {
  refPersonalForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}
const validateSummaryCharges = () => {
  refSumaryCharges.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validatePayment = () => {
  refPayment.value?.validate().then(valid => {
    if (valid.valid) {
      isCurrentStepValid.value = false
    } else {
      isCurrentStepValid.value = false
    }
  })
}


const deleteFields = (index) => {
  if (additionalformFields.value.length > 1) {
    additionalformFields.value.splice(index, 1);
  }
};


const validateSocialLinkForm = () => {
  console.log('validateSocialLinkForm');
  refSocialLinkForm.value?.validate().then(valid => {
    if (valid.valid) {
      console.log('validatTES');
      currentStep.value++
      isCurrentStepValid.value = true
      
    } else {
      console.log('validatnNo');
      isCurrentStepValid.value = false
    }
  })
}
</script>

<template>
    <div v-if="viewHealthMantaince"></div>
    <VNavigationDrawer
    temporary
    :width="1000"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
   
  >
    
    <AppDrawerHeaderSection
      title=" Add SupperBills"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard>
    <VCardText>
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
        :is-active-step-valid="isCurrentStepValid"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <VRow>
        <VCol cols="12">
          <VWindow
            v-model="currentStep"
            class="disable-tab-transition"
          >
            <VWindowItem>
              <VForm
                ref="refAccountForm"
                @submit.prevent="validateAccountForm"
              >
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >

                  <AppCombobox
                        v-model="patient.patientTags"
                        chips
                        clearable
                        multiple
                        closable-chips
                        clear-icon="tabler-circle-x"
                        :items="items"
                        label="Patient Tags"
                        prepend-icon="Patient Tags"
                      />
                  </VCol>

                  <VCol cols="6">
                    <AppTextField
                      v-model="dateOfVisit"
                      type="date"
                      label="Date oF Visit"
                      placeholder="Date oF Visit"
                    />
                    </VCol>
                  <VCol cols="6">
                    <AppSelect
                      v-model="location"
                      label="Location"
                      placeholder="Location"
                      :items="['Test1', 'Test2']"
                    />
                    </VCol>
                    <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn
                        color="secondary"
                        variant="tonal"
                        disabled
                      >
                        <VIcon
                          icon="tabler-arrow-left"
                          start
                          class="flip-in-rtl"
                        />
                        Previous  
                      </VBtn>

                      <VBtn type="submit">


                        Next 
                        <VIcon
                          icon="tabler-arrow-right"
                          end
                          class="flip-in-rtl"
                        />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm
                ref="refPersonalForm"
                @submit.prevent="validatePersonalForm"
              >
                <VRow>
                  <VCol cols="4">
                    <AppSelect
                      v-model="visitDetail.services"
                      label="Services"
                      placeholder="Services"
                      :items="['Test1', 'Test2']"
                    />
                    </VCol>

                    <VCol cols="4">
                    <AppSelect
                      v-model="visitDetail.servicesTemplate"
                      label="Service Templates"
                      placeholder="Service Templates"
                      :items="['Test1', 'Test2']"
                    />
                    </VCol>

                    <VCol cols="4">
                    <AppSelect
                      v-model="visitDetail.packges"
                      label="Packages"
                      placeholder="Packages"
                      :items="['Test1', 'Test2']"
                    />
                    </VCol>

                    <VCol cols="12">
                      <VTable class="text-no-wrap">
                        <thead>
                          <tr>
                            <th>
                              
                            </th>
                            <th>
                              CPT (Code/Description)
                            </th>
                            <th>
                              Quantity
                            </th>
                            <th>
                              Charge ($)
                            </th>
                            <th>
                              % Disc
                            </th>
                            <th>
                              Amt Disc (-$)
                            </th>
                            <th>
                              Net charge($)
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr
                            v-for="item in desserts"
                            :key="item.dessert"
                          >
                          <td>
                            <IconBtn>
                                <VIcon icon="tabler-trash" />
                              </IconBtn>
                            </td>
                            <td class="py-4">
                              <v-textarea cols="4" rows="2">{{ item.dessert }}</v-textarea>
                            </td>
                            <td>
                              <AppTextField
                                      v-model="quantity"
                                    />
                            </td>
                            <td>$
                              <VChip size="small">
                                0.00
                              </VChip>
                            </td>
                            <td>%
                              <VChip size="small">
                                0.00
                              </VChip>
                            </td>
                            <td>$
                              <VChip size="small">
                                0.00
                              </VChip>
                            </td>
                            <td>$
                              <VChip size="small">
                                0.00
                              </VChip>
                            </td>
                          </tr>
                        </tbody>
                      </VTable>
                    </VCol>

                    <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn
                        color="secondary"
                        variant="tonal"
                        @click="currentStep--"
                      >
                        <VIcon
                          icon="tabler-arrow-left"
                          start
                          class="flip-in-rtl"
                        />
                        Previous
                      </VBtn>

                      <VBtn type="submit">
                        Next
                        <VIcon
                          icon="tabler-arrow-right"
                          end
                          class="flip-in-rtl"
                        />
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm
                ref="refSocialLinkForm"
                @submit.prevent="validateSocialLinkForm"
              >
            
                <VRow>
                  <VCol cols="6">
                    <AppSelect
                      v-model="dispensary"
                      label="Search Your Dispensary"
                      placeholder="Search Your Dispensary"
                      :items="['Test1', 'Test2']"
                    />
                    </VCol>

                    <VCol cols="6">
                    <AppSelect
                      v-model="optiMantraDatabase"
                      label="Search OptiMantra Database"
                      placeholder="Search OptiMantra Database"
                      :items="['Test1', 'Test2']"
                    />
                    </VCol>
                    <VCol cols="12">
                      <VTable class="text-no-wrap">
                        <thead>
                          <tr>
                            <th>
                              
                            </th>
                            <th>
                              Supplement
                            </th>
                            <th>
                              
                            </th>
                            <th>
                              Quantity
                            </th>
                            <th>
                              Unit Price ($)
                            </th>
                            <th>
                              % Disc
                            </th>
                            <th>
                              Amt Disc (-$)
                            </th>
                            <th>
                              Net charge($)
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr
                            v-for="item in desserts"
                            :key="item.dessert"
                          >
                          <td>
                            <IconBtn>
                                <VIcon icon="tabler-trash" />
                              </IconBtn>
                            </td>
                            <td class="py-4">
                            {{ item.dessert }}
                            </td>

                            <td>
                              <AppSelect
                                width="100"
                                v-model="optiMantraDatabase"
                                :items="['Test1', 'Test2']"
                              />
                            </td>
                            
                            <td>
                              <AppTextField
                                      v-model="quantity"
                                    />
                            </td>
                            
                            <td>$
                              <VChip size="small">
                                0.00
                              </VChip>
                            </td>
                            <td>%
                              <VChip size="small">
                                0.00
                              </VChip>
                            </td>
                            <td>$
                              <VChip size="small">
                                0.00
                              </VChip>
                            </td>
                            <td>$
                              <VChip size="small">
                                0.00
                              </VChip>
                            </td>
                          </tr>
                        </tbody>
                      </VTable>
                    </VCol>
                    <VCol cols="12" class="pb-0">
                      <v-textarea v-model="notes"
                      label="Notes"
                      placeholder="Notes">

                      </v-textarea>
                    </VCol>
                    <VCol cols="12" class="pt-0">
                      <VCheckbox
                      v-model="notesOnAccountStatements"
                      label="Print These Notes On Account Statements"
                    />
                    </VCol>
                    <VCol cols="12">
                      <VBtn class="mr-3">Saves Notes As a Template</VBtn>
                      <VBtn>Import A Notes Template</VBtn>
                    </VCol>

                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn
                        color="secondary"
                        variant="tonal"
                        @click="currentStep--"
                      >
                        <VIcon
                          icon="tabler-arrow-left"
                          start
                          class="flip-in-rtl"
                        />
                        Previous
                      </VBtn>
                      <VBtn type="submit">
                        Next
                        <VIcon
                          icon="tabler-arrow-right"
                          end
                          class="flip-in-rtl"
                        />
                      </VBtn> 
                      <!-- <VBtn
                        color="success"
                        type="submit"
                      >
                        submit
                      </VBtn> -->
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm
                ref="refSumaryCharges"
                @submit.prevent="validateSummaryCharges"
              >
            
                <VRow>
                  <VCol cols="12">
                      <VTable class="text-no-wrap">
                        <thead>
                          <tr>
                            <th>
                              
                            </th>
                            <th>
                              Charge Type
                            </th>
                            <th>
                              Gross
                            </th>
                            <th>
                              Addtnl. Disc
                            </th>
                            <th>
                              Addtnl. Disc Amt	
                            </th>
                            <th>
                              Total
                            </th>
                            <th>
                              Tax
                            </th>
                            <th>
                              Tax Amt
                            </th>
                            <th>
                              Net Consult Charge
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                          <td>
                            <IconBtn>
                                <VIcon icon="tabler-trash" />
                              </IconBtn>
                            </td>
                            <td>
                              Services
                            </td>

                            <td class="py-4">
                            
                                
                                  <AppTextField
                                    width="100"
                                    v-model="gross"
                                    prepend-inner-icon="tabler-currency-dollar"
                                    readOnly
                                  />
                                
                            </td>
                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="addtnlDisc"
                                  prefix="%"
                                />
                            </td>
                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="addtnlDiscAmt"
                                  prepend-inner-icon="tabler-currency-dollar"
                                  
                                  readOnly
                                />
                            </td>

                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="total"
                                  prepend-inner-icon="tabler-currency-dollar"
                                  readOnly
                                />
                            </td>

                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="tax"
                                  prefix="%"
                                />
                            </td>

                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="taxAmt"
                                  prepend-inner-icon="tabler-currency-dollar"
                                />
                            </td>

                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="netConsultCharge"
                                  prepend-inner-icon="tabler-currency-dollar"
                                  readOnly
                                />
                            </td>
                          </tr>
                          <tr>
                          <td>
                            <IconBtn>
                                <VIcon icon="tabler-trash" />
                              </IconBtn>
                            </td>
                            <td>
                              Supplies/Products
                            </td>

                            <td class="py-4">
                            
                                
                                  <AppTextField
                                    width="100"
                                    v-model="gross"
                                    prepend-inner-icon="tabler-currency-dollar"
                                    readOnly
                                  />
                                
                            </td>
                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="addtnlDisc"
                                  prefix="%"
                                />
                            </td>
                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="addtnlDiscAmt"
                                  prepend-inner-icon="tabler-currency-dollar"
                                  
                                  readOnly
                                />
                            </td>

                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="total"
                                  prepend-inner-icon="tabler-currency-dollar"
                                  readOnly
                                />
                            </td>

                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="tax"
                                  prefix="%"
                                />
                            </td>

                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="taxAmt"
                                  prepend-inner-icon="tabler-currency-dollar"
                                />
                            </td>

                            <td class="py-4">
                              <AppTextField
                                  width="100"
                                  v-model="netConsultCharge"
                                  prepend-inner-icon="tabler-currency-dollar"
                                  readOnly
                                />
                            </td>
                          </tr>
                        </tbody>
                      </VTable>
                    </VCol>
                    <VCol cols="6">
                      <AppTextField
                        v-model="subtotalCharges"
                        label="Subtotal Charges"
                        prepend-inner-icon="tabler-currency-dollar"
                      />
                    </VCol>
                    <VCol cols="6">
                      <label class="mr-1">Tips Gratuity</label>
                      
                      <VBtn variant="tonal" size="small" class="mr-1">
                        15% 
                      </VBtn>
                      <VBtn variant="tonal" size="small" class="mr-1">
                        20% 
                      </VBtn>
                      <VBtn variant="tonal" size="small" class="mr-1">
                        22.5%
                      </VBtn>
                      <VBtn variant="tonal" size="small" class="mr-1">
                        25%
                      </VBtn>
                      <AppTextField
                        v-model="tipsGratuity"
                        prepend-inner-icon="tabler-currency-dollar"
                                  
                                />
                    </VCol>
                    <VCol cols="6">
                      <AppTextField
                                  v-model="insuranceAmountSubmittedToInsurance"
                                  label="Insurance(-) Amount submitted to insurance"
                                  prepend-inner-icon="tabler-currency-dollar"
                                  
                                />
                    </VCol>
                    <VCol cols="6">
                      <AppTextField
                                  v-model="previousBalanceNotRecommended"
                                  label="Previous Balance Not Recommended"
                                  prepend-inner-icon="tabler-currency-dollar"
                                />
                    </VCol>
                    <VCol cols="6">
                      <AppTextField
                                  v-model="total"
                                  label="Total"
                                  prepend-inner-icon="tabler-currency-dollar"
                                />
                    </VCol>

                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn
                        color="secondary"
                        variant="tonal"
                        @click="currentStep--"
                      >
                        <VIcon
                          icon="tabler-arrow-left"
                          start
                          class="flip-in-rtl"
                        />
                        Previous
                      </VBtn>
                      <VBtn type="submit">
                        Next
                        <VIcon
                          icon="tabler-arrow-right"
                          end
                          class="flip-in-rtl"
                        />
                      </VBtn> 
                      <!-- <VBtn
                        color="success"
                        type="submit"
                      >
                        submit
                      </VBtn> -->
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>

            <VWindowItem>
              <VForm
                ref="refPayment"
                @submit.prevent="validatePayment"
              >
            
                <VRow>
                  <VCol cols="12" md="6">
                      <AppTextField
                          type="date"
                          v-model="dateOfPayment"
                          label="Date Of Payment"
                          />
                    </VCol>
                    </VRow>
                    <VRow>
                    <VCol cols="4">
                      <AppTextField
                                  v-model="PaymentCash"
                                  label="Payment (Cash) $"
                                  prepend-inner-icon="tabler-currency-dollar"
                                />
                    </VCol>
                    <VCol cols="4">
                      <AppTextField
                                  v-model="prepaidAmount"
                                  label="Prepaid Amount"
                                  prepend-inner-icon="tabler-currency-dollar"
                                />
                    </VCol>
                    <VCol cols="4">
                      <AppSelect
                        v-model="prepaidAmountType"
                        label="Prepaid Amount Type"
                        :items="['Prepaid', 'Gift']"
                        />
                    </VCol>

                    <VCol cols="4">
                      <AppTextField
                                  v-model="paymentBank"
                                  label="Payment (Bank) $"
                                  prepend-inner-icon="tabler-currency-dollar"
                                />
                    </VCol>
                    <VCol cols="4">
                      <AppSelect
                                  v-model="paymentBankType"
                                  label="Payment Bank Type"
                                  :items="['Check', 'E-Check', 'Wire', 'ACH', 'EFT', 'Mobile', 'Insurance (EFT)', '3rd Party Deposit']"
                                />
                    </VCol>
                    <VCol cols="4">
                      <AppTextField
                        v-model="checkNo"
                        label="Check No."
                      />
                    </VCol>
                  

                    <VCol cols="4">
                      <AppTextField
                                  v-model="paymentCardAmount"
                                  label="Payment (Card) $"
                                  prepend-inner-icon="tabler-currency-dollar"
                                />
                    </VCol>
                    <VCol cols="4">
                      <AppSelect
                                  v-model="paymentCardType"
                                  label="Payment Type"
                                  :items="['Card', 'Amex', 'Debit', 'Discover', 'Mastercard', 'Visa', 'Other']"
                                />
                    </VCol>
                    <VCol cols="4">
                      <AppTextField
                        v-model="cardLastFourDigit"
                        type="number"
                        label="Last 4"
                        maxLength="4"
                      />
                    </VCol>
                    <VCol cols="12">
                      <VBtn size="small" @click="addNewFields"> + Additional Information</VBtn>
                    </VCol>
                    <VRow v-for="(field, index) in additionalformFields" :key="index">
                      <VCol cols="4">
                        <AppSelect
                          v-model="field.paymentType"
                          label="Payment"
                          placeholder="Payment" 
                          :items="['Cash', 'Check', 'Card', 'Prepaid']"
                        />
                      </VCol>
                      
                      <VCol cols="4">
                        <AppTextField 
                          v-model="field.amount"
                          label="Amount"
                          placeholder="Amount" />
                      </VCol>
                      
                      <VCol cols="4">
                        <AppSelect
                          v-model="field.paymentMethod"
                          label="Payment"
                          placeholder="Payment" 
                          :items="['Cash', 'Check', 'Card', 'Prepaid']"
                        />
                      </VCol>
                      
                      <VCol cols="4">
                        <AppTextField  type="date" v-model="field.paymentDate" label="Date" placeholder="Date" />
                      </VCol>
                      
                      <VCol cols="4">
                        <AppTextField v-model="field.detail" label="Detail" placeholder="Detail" />
                      </VCol>
                      
                      <VCol cols="12" v-if="index > 0" class="d-flex justify-end">
                        <VBtn @click="deleteFields(index)" color="error" class="mb-3">Delete</VBtn>
                      </VCol>
                    </VRow>
                    <VCol cols="12">
                        <p class="v-theme--light bg-primary rounded px-3 py-1">
                          For Card Payments: click on 'Take Card Payment' and the Balance Amount will populate automatically in the Card Payment pop up; if payment is successful, the paid amount field will update automatically
                        </p>
                    </VCol>
                    </VRow>
                    <VRow>
                    <VCol cols="6">
                      <AppTextField
                        v-model="balance"
                        label="Balance"
                        type="number"
                        prepend-inner-icon="tabler-currency-dollar"
                      />
                    </VCol> 
                  </VRow>
                  <VRow>
                    <VCol cols="12">
                    <VCheckbox
                      v-model="sendEmail"
                      label="Send Email "
                    />
                    <VCheckbox
                      v-model="printPdf"
                      label="Print PDF"
                    />
                    </VCol>
                    
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn
                        color="secondary"
                        variant="tonal"
                        @click="currentStep--"
                      >
                        <VIcon
                          icon="tabler-arrow-left"
                          start
                          class="flip-in-rtl"
                        />
                        Previous
                      </VBtn>
                      
                      <VBtn
                        color="success"
                        type="submit"
                      >
                        Save And Close
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VWindowItem>
          </VWindow>
        </VCol>
        <!-- <VCol cols="4">
          <VCard flat
          variant="outlined"> 
            <VCardText>
          <h6 class="text-h6 mb-4">
            Price Details
          </h6>

          <div class="text-high-emphasis">
            <div class="d-flex justify-space-between mb-2">
              <span>Bag Total</span>
              <span class="text-medium-emphasis">$100.00</span>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Coupon Discount</span>
              <a href="#">Apply Coupon</a>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Order Total</span>
              <span class="text-medium-emphasis">$100.00</span>
            </div>

            <div class="d-flex justify-space-between">
              <span>Delivery Charges</span>

              <div class="d-flex align-center">
                <div class="text-decoration-line-through text-disabled me-2">
                  $5.00
                </div>
                <VChip
                  size="small"
                  color="success"
                >
                  FREE
                </VChip>
              </div>
            </div>
          </div>
        </VCardText>

            <VDivider />

            <VCardText class="d-flex justify-space-between pa-6">
              <h6 class="text-h6">
                Total
              </h6>
              <h6 class="text-h6">
                $100.00
              </h6>
            </VCardText>
      
          </VCard>
        </VCol> -->
      </VRow>
    
    </VCardText>
  </VCard>
     
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
<style scoped>
.tags-container {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
}

.remove-tag-btn {
  margin-left: 5px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}
</style>
