<script setup>
import EmailBuilder from '@/lib/email-builder/index.js';
import { useEmailTemplateStore } from '@/stores/emailTemplateStore';

import { onMounted, ref } from 'vue';
import Help from './help.vue';
const props = defineProps({
  templateId: {
    type: String,
    required: false,
  }
})
let emailBuilderRoot = null;
const emailContainer = ref(null);
const emailTemplateStore = useEmailTemplateStore()
emailTemplateStore.unloadTemplate()
const refForm = ref()
const isHelpDialogVisible = ref(false)
const emit = defineEmits([
  'update:isDrawerOpen',
  'customEvent'
])

if (props.templateId) {
  await emailTemplateStore.getTemplate(props.templateId)
  emailContainer.value = emailTemplateStore.template.html
  console.log(emailTemplateStore.template.doc);
}
const closeNavigationDrawer = () => {
  emit('customEvent', false)
};
const onSubmit = async (hmtl) => {
  refForm.value?.validate().then(async ({ valid }) => {
    console.log(valid);
    if (valid) {
      let res = await templateStore.saveTemplate()
      closeNavigationDrawer();
      return res;
    }
  });
}
const onSave = async (doc, html) => {
  refForm.value?.validate().then(async ({ valid }) => {
    console.log(valid);
    if (valid) {
      emailTemplateStore.template.html = html;
      emailTemplateStore.template.doc = doc;
      await emailTemplateStore.saveTemplate();
    }

  });



}
const onFileUpload = async (file) => {

}
const onClose = async () => {

}
const onTestEmail = async (html, email) => {
  this.template.html = html;
}


onMounted(() => {
  console.log('onMounted', emailContainer.value, emailTemplateStore.template.doc);
  emailBuilderRoot =
    EmailBuilder.initialize(emailContainer.value, {
      onClose,
      onSave,
      onFileUpload,
      onTestEmail,
      document: emailTemplateStore.template.doc
    });
})
</script>

<template>
  <v-form ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
    <VCardText>
      <v-row>
        <v-col cols="12" sm="12">
          <v-text-field v-model="emailTemplateStore.template.name" :rules="[requiredValidator]"
            :label="$t('Template Name')" maxlength="255" placeholder=""></v-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <div ref="emailContainer" class=" emailOuter"></div>
        </v-col>
        <VBtn class="text-right" @click="isHelpDialogVisible = true">{{ $t('Help') }}</VBtn>
      </v-row>
    </VCardText>
    <VDialog v-model="isHelpDialogVisible" max-width="800">

      <DialogCloseBtn @click="isHelpDialogVisible = !isHelpDialogVisible" />
      <Help />
    </VDialog>
  </v-form>

</template>

<style scoped>
.emailOuter {
  position: relative;
}

.emailOuter :deep(.MuiDrawer-root.MuiDrawer-docked) {
  position: unset
}

.emailOuter :deep(.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation2.MuiDrawer-paper.MuiDrawer-paperAnchorRight.MuiDrawer-paperAnchorDockedRight) {
  position: absolute
}

.emailOuter> :deep(.MuiStack-root > .MuiBox-root) {
  height: calc(-297px + 100vh)
}
</style>
