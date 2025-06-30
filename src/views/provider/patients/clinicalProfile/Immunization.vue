<script setup>
import { useClinicalProfileStore } from '@/stores/clinicalProfileStore';
const clinicalProfileStore = useClinicalProfileStore()
const props = defineProps({
  entries: {
    type: Array,
    required: true,
  },
  patient: {
    type: Object,
    required: true,
  },


})
const emit = defineEmits([
  'immunization'
]);

const locations = [
  { value: '10204', text: 'TKO Wellness-NV' },
  { value: '17412', text: 'Test Location' },
  { value: '18285', text: 'Vagas' },
];

const administeredOptions = [
  { value: 'false', text: 'Yes' },
  { value: 'true', text: 'No' },
];

const fundingSources = [
  { value: '', text: 'Select' },
  { value: 'VXC1', text: 'Federal funds' },
  { value: 'PHC68', text: 'Military funds' },
  { value: 'OTH', text: 'Other' },
  { value: 'PHC70', text: 'Private funds' },
  { value: 'VXC2', text: 'State funds' },
  { value: 'VXC3', text: 'Tribal funds' },
  { value: 'UNK', text: 'Unknown' },
  { value: 'VXC50', text: 'Public Blended CVP' },
];

const vfcEligibilityOptions = [
  { value: '', text: 'Select' },
  { value: 'V01', text: 'Not VFC eligible' },
  { value: 'V02', text: 'VFC eligible Medicaid/Medicaid Managed Care' },
  { value: 'V03', text: 'VFC eligible - Uninsured' },
  { value: 'V04', text: 'VFC eligible - American Indian/Alaskan Native' },
  { value: 'V05', text: 'VFC eligible - Under-insured' },
  { value: 'V07', text: 'Local-specific eligibility' },
];

// Validation rules
const dateRules = [(v) => !!v || 'Please enter a date'];
const nameRules = [(v) => !!v || 'Please enter a vaccine name'];
const locationRules = [(v) => !!v || 'Please select a location'];
const reasonRules = [(v) => immunization.administered === 'true' || !!v || 'Please mention reason if not administered'];
const typeRules = [(v) => !!v || 'Please enter vaccine type'];
const administeredLocationRules = [(v) => !!v || 'Please select administered location'];
const fundingSourceRules = [(v) => !!v || 'Please select a funding source'];
const vfcEligibilityRules = [(v) => !!v || 'Please select VFC eligibility'];
const batchRules = [(v) => !!v || 'Please enter batch'];
const manufacturerRules = [(v) => !!v || 'Please enter manufacturer'];
const expiryRules = [(v) => !!v || 'Please select expiry date'];
const administeredByRules = [(v) => !!v || 'Please enter the administrator\'s name'];
const quantityRules = [(v) => !!v || 'Please enter a quantity greater than zero'];

// Methods
const addMore = () => {
  clinicalProfileStore.Immunizations.immunizationsEntries.push({
    date: new Date(),
    name: '',
    nameKey: 'UNK',
    practitionerLocation: '',
    administered: 'false',
    reason: '',
    type: '',
    typeKey: 'UNK',
    administeredLocation: '',
    administeredLocationKey: 'UNK',
    fundingSource: '',
    vfcEligibility: '',
    batch: '',
    manufacturer: '',
    manufacturerKey: 'UNK',
    expiryDate: '',
    administeredBy: '',
    consent: '',
    quantity: '',
    comments: '',
  });
};

const removeEntry = (index) => {
  clinicalProfileStore.Immunizations.immunizationsEntries.splice(index, 1);
};
const onSubmitImmunization = () => {
  return clinicalProfileStore.saveImmunization(props.patient.id)
};

</script>

<template>
  <v-container>
    <div v-if="setEntries"></div>
    <div class="tw-om-box-inner">
      <div class="tw-om-box-header">
        <span class="font-medium text-base">{{ $t('Immunization Entry') }}</span>
        <input type="hidden" name="patimmutbl_edit-3" maxlength="255" />
      </div>

      <v-form>
        <v-row v-for="(immunization, index) in clinicalProfileStore.Immunizations.immunizationsEntries" :key="index"
          class="mb-5">
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Date" v-model="immunization.date" type="date" :rules="[dateRules]"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Name')" v-model="immunization.name" :placeholder="$t('Type few letters to search')"
              autocomplete="off" :rules="[nameRules]"></v-text-field>
            <input type="hidden" v-model="immunization.nameKey" />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-select :label="$t('Practitioner Location')" v-model="immunization.practitionerLocation" :items="locations"
              :rules="[locationRules]" item-title="text" item-value="value"></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-select :label="$t('Is the vaccine administered?')" v-model="immunization.administered"
              :items="administeredOptions" item-title="text" item-value="value"></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t(`If not administered, reason:`)" v-model="immunization.reason"
              :rules="[reasonRules]"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Type')" v-model="immunization.type" :placeholder="$t('Type few letters to search')"
              autocomplete="off" :rules="[typeRules]"></v-text-field>
            <input type="hidden" v-model="immunization.typeKey" />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Administered Location')" v-model="immunization.administeredLocation"
            :placeholder="$t('Type few letters to search')" autocomplete="off"
              :rules="[administeredLocationRules]"></v-text-field>
            <input type="hidden" v-model="immunization.administeredLocationKey" />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-select :label="$t('Vaccine Funding Source')" v-model="immunization.fundingSource" :items="fundingSources"
              :rules="[fundingSourceRules]" item-title="text" item-value="value"></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-select :label="$t('VFC Eligibility')" v-model="immunization.vfcEligibility" :items="vfcEligibilityOptions"
              :rules="[vfcEligibilityRules]" item-title="text" item-value="value"></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Batch')" v-model="immunization.batch" :rules="[batchRules]"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Manufacturer')" v-model="immunization.manufacturer"
            :placeholder="$t('Type few letters to search')" autocomplete="off" :rules="[manufacturerRules]"></v-text-field>
            <input type="hidden" v-model="immunization.manufacturerKey" />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Expiry')" v-model="immunization.expiryDate" type="date"
              :rules="[expiryRules]"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Given by')" v-model="immunization.administeredBy"
              :rules="[administeredByRules]"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Patient Consent?')" v-model="immunization.consent"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field :label="$t('Quantity In ml')" v-model="immunization.quantity" type="number"
              :rules="[quantityRules]"></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea :label="$t('Comments')" v-model="immunization.comments"></v-textarea>
          </v-col>

          <v-col cols="12" class="text-right">
            <v-btn @click="removeEntry(index)" class="tw-om-bl-btn-sec-small space-x-2">
              <v-icon left>mdi-delete</v-icon>
              <span>{{ $t('Remove Entry') }}</span>
            </v-btn>
          </v-col>
        </v-row>


        <v-btn @click="addMore" class="mt-4" color="primary">{{ $t('Add Immunization Entry') }}</v-btn>
      </v-form>
    </div>
  </v-container>
  <v-container>
    <v-row class="tw-om-box-content" id="block">
      <v-col v-for="(section, index) in clinicalProfileStore.Immunizations.sections" :key="index" cols="12" md="4"
        class="mb-4">
        <v-card>
          <v-card-title>
            <span class="tw-om-regtxt">{{ section.title }}</span>
          </v-card-title>
          <v-card-text>
            <v-textarea v-model="section.info" :label="'Info (' + section.title + ')'" rows="4"
              class="tw-om-txt-medium resize-none"></v-textarea>
          </v-card-text>
        </v-card>
      </v-col>
      <VCol cols="12">
        <VBtn @click="onSubmitImmunization" class="me-3">
          {{ $t('Update Immunization') }}
        </VBtn>

      </VCol>
    </v-row>
  </v-container>
</template>
<style scoped>
.tw-om-input-label {
  font-weight: bold;
}

.tw-om-pink-badge {
  color: pink;
}

.tw-om-regtxt {
  font-weight: bold;
  font-size: 1.2em;
}

.tw-om-txt-medium {
  width: 100%;
}
</style>
