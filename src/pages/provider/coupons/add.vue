<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import { useCouponStore } from '@/stores/couponStore';
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  coupon: {
    type: Object,
    required: false,
    default: null
  }
})

const couponStore = useCouponStore()

const refForm = ref()
const isLoading = ref(false)

// Form fields
const code = ref('')
const name = ref('')
const description = ref('')
const type = ref('percentage')
const value = ref(0)
const minimumAmount = ref(0)
const maximumDiscount = ref(null)
const usageLimit = ref(null)
const startDate = ref('')
const endDate = ref('')
const status = ref('1') // use string '1' for Active by default
const applicableProducts = ref([])

const typeOptions = [
  { title: 'Percentage', value: 'percentage' },
  { title: 'Fixed Amount', value: 'fixed' }
]

const statusOptions = [
  { title: 'Active', value: '1' },
  { title: 'Inactive', value: '0' }
]

// Watch for coupon prop changes (edit mode)
watch(() => props.coupon, (newCoupon) => {
  if (newCoupon) {
    code.value = newCoupon.code || ''
    description.value = newCoupon.description || ''
    type.value = newCoupon.type || 'percentage'
    value.value = newCoupon.discount_amount || 0
    maximumDiscount.value = newCoupon.max_discount || null
    usageLimit.value = newCoupon.usage_limit || null
    startDate.value = newCoupon.valid_from ? format(newCoupon.valid_from, 'yyyy-MM-dd') : ''
    endDate.value = newCoupon.valid_to ? format(newCoupon.valid_to, 'yyyy-MM-dd') : ''
    status.value = newCoupon.is_active !== undefined ? String(newCoupon.is_active) : '1'
  }
}, { immediate: true })

const resetForm = () => {
  code.value = ''
  description.value = ''
  type.value = 'percentage'
  value.value = 0
  maximumDiscount.value = null
  usageLimit.value = null
  startDate.value = ''
  endDate.value = ''
  status.value = '1'
  applicableProducts.value = []
}

const onSubmit = async () => {
  const { valid } = await refForm.value?.validate()
  if (!valid) return

  isLoading.value = true

  try {
    const formData = {
      // Only include `code` if we're creating a new coupon
      ...(props.coupon ? {} : { code: code.value.toUpperCase() }),
      name: name.value,
      description: description.value,
      type: type.value,
      discount_amount: parseFloat(value.value) || 0,
      max_discount: maximumDiscount.value ? parseFloat(maximumDiscount.value) : null,
      usage_limit: usageLimit.value ? parseInt(usageLimit.value) : null,
      valid_from: startDate.value || null,
      valid_to: endDate.value || null,
      is_active: parseInt(status.value),
      used_count: 0,
      applicable_products: applicableProducts.value,
    }

    await couponStore.saveCoupon(formData, props.coupon?.id)
    resetForm()
  } catch (error) {
    console.error('Error saving coupon:', error)
  } finally {
    isLoading.value = false
  }
}


const onCancel = () => {
  couponStore.isDrawerOpen = false
  resetForm()
}

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  code.value = result
}

onMounted(async () => {
})
</script>


<template>
  <VNavigationDrawer temporary :width="400" location="end" :model-value="couponStore.isDrawerOpen"
    @update:model-value="couponStore.isDrawerOpen = $event">
    <!-- Header -->
    <AppDrawerHeaderSection :title="props.coupon ? 'Edit Promo Code' : 'Add New Promo Code'" @cancel="onCancel" />

    <VDivider />

    <!-- Scrollable Content -->
    <div class="drawer-body">
      <VCard flat>
        <VCardText>
          <VForm ref="refForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- Coupon Code -->
              <VCol cols="12">
                <VTextField v-model="code" :label="$t('Coupon Code')" :rules="[requiredValidator]"
                  placeholder="Enter coupon code" :disabled="!!props.coupon" required>
                  <template #append-inner>
                    <VBtn icon variant="text" size="small" @click="generateCode" :disabled="!!props.coupon">
                      <VIcon icon="tabler-refresh" />
                    </VBtn>
                  </template>
                </VTextField>

              </VCol>

              <!-- Description -->
              <VCol cols="12">
                <VTextarea v-model="description" :label="$t('Description')" placeholder="Enter coupon description"
                  rows="3" />
              </VCol>

              <!-- Type and Value -->
              <VCol cols="12">
                <VSelect v-model="type" :label="$t('Discount Type')" :items="typeOptions" :rules="[requiredValidator]"
                  required />
              </VCol>

              <VCol cols="12">
                <VTextField v-model="value" :label="type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount ($)'"
                  type="number" :rules="[requiredValidator]" :min="0" :max="type === 'percentage' ? 100 : undefined"
                  required />
              </VCol>

              <!-- Maximum Discount (for percentage type) -->
              <VCol cols="12">
                <VTextField v-model="maximumDiscount" :label="$t('Maximum Discount Amount ($)')" type="number" min="0"
                  placeholder="No limit" :rules="[requiredValidator]"/>
              </VCol>

              <!-- Usage Limit -->
              <VCol cols="12">
                <VTextField v-model="usageLimit" :label="$t('Usage Limit')" type="number" min="1"
                  placeholder="Unlimited" :rules="[requiredValidator]"/>
              </VCol>

              <!-- Start Date -->
              <VCol cols="12">
                <VTextField v-model="startDate" :label="$t('Start Date')" type="date" :rules="[requiredValidator]"/>
              </VCol>

              <!-- End Date -->
              <VCol cols="12">
                <VTextField v-model="endDate" :label="$t('End Date')" type="date" :rules="[requiredValidator]"/>
              </VCol>

              <!-- Status -->
              <VCol cols="12">
                <VSelect v-model="status" :label="$t('Status')" :items="statusOptions" :rules="[requiredValidator]"
                  required />
              </VCol>

              <!-- Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3" :loading="isLoading">
                  {{ props.coupon ? 'Update' : 'Create' }}
                </VBtn>
                <VBtn type="reset" variant="tonal" color="secondary" @click="onCancel">
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </VNavigationDrawer>
</template>

<style scoped>
.drawer-body {
  height: calc(100vh - 64px);
  /* Adjust 64px based on your header height */
  overflow-y: auto;
  overflow-x: hidden;
}

/* Optional: Custom scrollbar styling */
.drawer-body::-webkit-scrollbar {
  width: 6px;
}

.drawer-body::-webkit-scrollbar-track {
  background: transparent;
}

.drawer-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.drawer-body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
