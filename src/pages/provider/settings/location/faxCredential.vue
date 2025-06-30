<script setup>
import { useStore } from 'vuex';
const store = useStore()
const aPIKey = ref()
const encryptionKey = ref()
const faxNoAcc = ref()
const userName = ref()
const vector = ref()



const updateFaxCredentials = computed(() => {
    let data = store.getters.getLocation;
    console.log("data",data);
    aPIKey.value = data.aPIKey;
    encryptionKey.value = data.encryptionKey;
    faxNoAcc.value = data.faxNoAcc
    userName.value = data.userName;
    vector.value = data.vector;
});

</script>

<template>
    <div v-if="updateFaxCredentials"></div>
    <VCard title="Edit SFax Detail">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="6"
          >
            <AppTextField
              v-model="aPIKey"
              label="API Key"
              placeholder="API Key"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="6"
          >
            <AppTextField
              v-model="encryptionKey"
              label="Encryption Key"
              placeholder="Encryption Key"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="6"
          >
            <AppTextField
              v-model="faxNoAcc"
              label="Fax No"
              placeholder="Fax No"
            />
          </VCol>

          <VCol cols="12"
            sm="6"
            md="6">
            <AppTextField
              v-model="userName"
              label="User Name"
              placeholder="User Name"
            />
          </VCol>
           <VCol cols="12" sm="6"
           md="6">
            <AppTextField
              v-model="vector"
              label="Vector"
              placeholder="Vector"
            />
            
          </VCol>
          <VCol cols="12">
                
                <VBtn class="mr-2">Save</VBtn>
                <VBtn
                  color="secondary"
                  variant="tonal"
                >
                  Cancel
                </VBtn>
                </VCol>
        </VRow>
      </VCardText>
    </VCard>
</template>
