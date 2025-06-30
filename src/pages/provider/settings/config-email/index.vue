<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Email Template Config View',
  },
})

import { useEmailTemplateStore } from '@/stores/emailTemplateStore';
const emailTemplateStore = useEmailTemplateStore()
emailTemplateStore.unloadTemplate()
emailTemplateStore.getSelectedEmailField()
emailTemplateStore.getTemplateList()
const templatesOptions = computed(() => {
  const templates = emailTemplateStore.templates.map(user => ({
    ...user,
    fullName: `${user.name || ''}`.trim(),
  }));
  return [{ id: 'default', fullName: 'Default' }, ...templates];
});
const update = () => {
  emailTemplateStore.updateConfigEmailTemplate()
}

</script>
<<style>
.css-10nakn3-MuiModal-root-MuiPopover-root-MuiMenu-root {
  z-index: 1000000 !important;
}
</style>>
  <template>
    <VCard :title="$t('Configure Email')">
      <VCardText class="pt-2">
        <!-- 👉 Form -->
        <VForm class="mt-3" v-if="emailTemplateStore.emailTemplateField">
          <VRow>
            <!-- Loop through emailTemplateStore.emailTemplateField to render each dropdown with label -->
            <VCol v-for="(label, field) in emailTemplateStore.emailTemplateField" :key="field" cols="12" md="12">
              <VRow class="align-items-center"> <!-- Align items in the same row -->
                <!-- Label (Text) -->
                <VCol cols="5" class="pr-2">
                  <label :for="field">{{ field }}</label>
                </VCol>

                <!-- Dropdown (AppSelect) -->
                <VCol cols="6">
                  <AppSelect v-model="emailTemplateStore.emailTemplateField[field]" :items="templatesOptions"
                    item-title="fullName" item-value="id" />
                </VCol>
              </VRow>
            </VCol>

            <!-- Update Button -->
            <VCol cols="12">
              <VBtn @click="update"> {{ $t('Update') }} </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </template>
