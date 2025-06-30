<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Builder Edit',
  },
})
import { useBuilderStore } from '@/stores/builderStore';
import { useFormsStore } from '@/stores/formsStore';
import { usePractitionerStore } from '@/stores/practitionerStore';
import { useProductStore } from '@/stores/productStore';
import { requiredValidator } from '@core/utils/validators';
import { onMounted, ref } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { useRoute, useRouter } from 'vue-router';

const builderStore = useBuilderStore();
const practitionerStore = usePractitionerStore();
const formsStore = useFormsStore()
const productStore = useProductStore()
const route = useRoute();
const router = useRouter();
const tab = ref(null);
const bulderForm = ref();
const builder_name = ref(null)
const practitioners = ref([]);
const practitioner = ref(null);
const intakes = ref([]);
const intake = ref([]);
const questioners = ref([]);
const questioner = ref([]);
const paymentOptions = ref(null)
const practitioner_fee = ref(0)
const bgColor = ref(null)
const btnColor = ref(null)
const textColor = ref(null)
const builderData = ref(null)
let id = route.params.id;
const list = ref([]);
const products = ref([]);
const product = ref([]);

const themes = ref([]);
const theme = ref(null);
const snackbar = ref(false);
const baseURL = `${window.location.protocol}//${window.location.host}${router.options.history.base}`;
const link = ref(null)

await practitionerStore.practitionersList()
await formsStore.getIntakeFormsList();
await formsStore.getQuestionnaireFormsList();
await productStore.productsList()
await builderStore.getAllThemesList()
await builderStore.getBuilderItem(id)
const copyToClipboard = () => {
  navigator.clipboard.writeText(link.value).then(() => {
    snackbar.value = true; // Show success message
  });
};

onMounted(async () => {


  const practitionersData = practitionerStore.practitioners;
  practitioners.value = practitionersData.map(practitioner => ({
    name: `${practitioner.fname} ${practitioner.lname}`,
    id: practitioner.uuid,
  }));


  intakes.value = formsStore.intakeForms

  questioners.value = formsStore.questionnaireForms

  products.value = productStore.products

  themes.value = builderStore.themesList

  theme.value = themes.value[0].id;


  builderData.value = builderStore.builder
  builder_name.value = builderData.value.builder_name
  practitioner.value = builderData.value.practitioner_id
  intake.value = builderData.value.intakes
  questioner.value = builderData.value.questionnaire
  product.value = builderData.value.products
  list.value = builderData.value.patientFlow
  paymentOptions.value = builderData.value.paymentOption
  theme.value = builderData.value.theme_id
  bgColor.value = builderData.value.bg_color
  btnColor.value = builderData.value.btn_color
  textColor.value = builderData.value.text_color
  practitioner_fee.value = builderData.value.practitioner_fee

  link.value = baseURL + '/review-cart?bid=' + btoa(id)
});


const submitForm = async () => {
  const { valid } = await bulderForm.value.validate();
  if (valid) {
    console.log('Form valid:', list.value);
    await builderStore.saveBuilder(
      {
        builder_name: builder_name.value,
        practitioner_id: practitioner.value,
        intakes: intake.value,
        questionnaire: questioner.value,
        products: product.value,
        paymentOption: paymentOptions.value,
        patientFlow: list.value
      },
      id
    )
    await builderStore.saveBuilderConfig(
      {
        theme: theme.value,
        bgColor: bgColor.value,
        btncolor: btnColor.value,
        textColor: textColor.value,
        practitioner_fee: practitioner_fee.value,
      },
      'update',
      id
    )
    router.replace(route.query.to ? String(route.query.to) : '/provider/settings/builder')
  }
};

</script>

<template>
  <v-snackbar v-model="snackbar" timeout="2000">
    Copied to clipboard!
  </v-snackbar>
  <v-card title="Edit Builder">
    <v-tabs v-model="tab">
      <v-tab value="one">Builder</v-tab>
      <v-tab value="two">Config</v-tab>
    </v-tabs>

    <v-card-text>
      <v-form ref="bulderForm">
        <v-window v-model="tab">
          <v-window-item value="one">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="12">
                  <label>Builder Name</label>
                  <VTextField v-model="builder_name" placeholder="e.g. Your Company Name" :rules="[requiredValidator]"
                    density="comfortable" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <AppSelect v-model="practitioner" label="Practitioner" :items="practitioners" item-value="id"
                    item-title="name" :rules="[requiredValidator]" />
                </v-col>
                <v-col cols="12" md="3">
                  <AppSelect v-model="intake" label="Intake" :items="intakes" item-value="id" item-title="name" multiple
                    clearable />
                </v-col>
                <v-col cols="12" md="3">
                  <AppSelect v-model="questioner" label="Questioner" :items="questioners" item-value="id"
                    item-title="name" multiple clearable />
                </v-col>
                <v-col cols="12" md="3">
                  <AppSelect v-model="product" label="Products" :items="products" item-value="id" item-title="name"
                    multiple clearable />
                </v-col>
                <v-col cols="12" md="12">
                  <v-radio-group v-model="paymentOptions" inline>
                    <v-radio label="Disable Payment" value="Disable Payment" hide-details dense />
                    <v-radio label="Trial" value="Trial" hide-details dense />
                    <v-radio label="Discount Coupon" value="Discount Coupon" hide-details dense />
                    <v-radio label="Take Payment" value="Take Payment" hide-details dense />
                  </v-radio-group>
                </v-col>
              </v-row>
              <!-- draggable -->
              <v-row>
                <v-col cols="12" md="3">
                  <h4 class="mb-4">Patient Flow</h4>
                  <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center draggable-item-disabled">
                    Login/Signup
                  </div>
                  <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center draggable-item-disabled">
                    Product Selection
                  </div>
                  <VueDraggableNext class="dragArea list-group w-full" :list="list" @end="log" filter=".nodrag">
                    <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center draggable-item"
                      v-for="element in list" :key="element">
                      {{ element }}
                    </div>
                  </VueDraggableNext>
                </v-col>
              </v-row>
            </v-card-text>
          </v-window-item>

          <v-window-item value="two">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="12">
                  <h5 class="text-h5 mb-5">
                    Share the link
                  </h5>
                  <div class="d-flex gap-4 align-center flex-wrap">
                    <AppTextField v-model="link" label="" readonly />
                    <div class="d-flex align-self-end gap-x-2">
                      <VBtn @click="copyToClipboard" icon class="rounded" color="secondary">
                        <VIcon color="white" icon="tabler-copy" />
                      </VBtn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <label>Practitioner Fee</label>
                  <VTextField v-model="practitioner_fee" label="" :rules="[requiredValidator]" density="comfortable"
                    type="number" />
                </v-col>
                <v-col cols="12" md="6">
                  <AppSelect v-model="theme" label="Theme" :items="themes" item-value="id" item-title="name"
                    :rules="[requiredValidator]" />
                </v-col>
                <v-col cols="12" md="3">
                  <label>Background Color</label>
                  <v-color-picker v-model="bgColor" width="255" mode="hex"></v-color-picker>
                </v-col>
                <v-col cols="12" md="3">
                  <label>Button Color</label>
                  <v-color-picker v-model="btnColor" width="255" mode="hex"></v-color-picker>
                </v-col>
                <v-col cols="12" md="3">
                  <label>Text Color</label>
                  <v-color-picker v-model="textColor" width="255" mode="hex"></v-color-picker>
                </v-col>
              </v-row>
            </v-card-text>
          </v-window-item>
        </v-window>
        <v-row class="mt-2">
          <v-col cols="4">
            <v-btn @click="submitForm">Save</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style>
.draggable-item {
  border: 1px solid silver;
  border-radius: 5px;
  padding: 5px;
  background: #c0c0c052;
  color: black;
  margin-bottom: 5px;
  cursor: move;
}

.draggable-item-disabled {
  border: 1px solid silver;
  border-radius: 5px;
  padding: 5px;
  background: #c0c0c052;
  color: black;
  margin-bottom: 5px;
  cursor: not-allowed;
}

.non-draggable {
  color: gray;
}

.draggable {
  cursor: move;
}
</style>
