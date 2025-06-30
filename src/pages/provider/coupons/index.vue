<script setup>
definePage({
  meta: {
    action: 'read',
    subject: 'Promo Code View',
  },
})
import { useCouponStore } from '@/stores/couponStore'
import { onMounted, ref } from 'vue'
import { GET_COUPONS_API } from '@/utils/constants'
import AddNewCoupon from './add.vue'
import { format } from 'date-fns';

const couponStore = useCouponStore()
const selectedCoupon = ref(null)
const isConfirmDialogVisible = ref(false)
const couponToDelete = ref(null)
const dataTable = ref(null);

const headers = [
  { title: 'Code', key: 'code', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Value', key: 'discount_amount', sortable: true },
  { title: 'Usage Limit', key: 'usage_limit', sortable: false },
  { title: 'Used', key: 'used_count', sortable: false },
  { title: 'Status', key: 'is_active', sortable: true },
  { title: 'Valid Until', key: 'valid_to', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const sortByData = ref([{ 'key': 'code', 'order': 'desc' }])

const formatCouponValue = (coupon) => {
  if (coupon.type === 'percentage') {
    return `${coupon.value}%`
  } else {
    return `$${coupon.value}`
  }
}

const formatUsage = (coupon) => {
  if (coupon.usage_limit) {
    return `${coupon.used_count}/${coupon.usage_limit}`
  }
  return coupon.used_count || 0
}

const formatDate = (date) => {
  if (!date) return 'No expiry'
  return format(date, 'MM-dd-yyyy');
}

const getStatusColor = (status) => {
  switch (status) {
    case 1: return 'success'
    case 0: return 'error'
    default: return 'default'
  }
}

const editCoupon = (coupon) => {
  selectedCoupon.value = coupon
  couponStore.coupon = { ...coupon }
  couponStore.isDrawerOpen = true
}

const confirmDelete = (coupon) => {
  couponToDelete.value = coupon
  isConfirmDialogVisible.value = true
}

const handleConfirm = async () => {
  if (couponToDelete.value) {
    await couponStore.deleteCoupon(couponToDelete.value.id)
    couponToDelete.value = null
    reload()
  }
  isConfirmDialogVisible.value = false
}

const handleCancel = () => {
  couponToDelete.value = null
  isConfirmDialogVisible.value = false
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const resolveStatusVariant = status => {
  if (status === 1)
    return 'Active'  
  else
    return 'Inactive'
}

onMounted(() => {
  couponStore.getCoupons()
})

const reload = () => dataTable.value.reload()

watch(() => couponStore.isDrawerOpen, (val) => {
  if (!val) {
    reload()
  }
})
</script>

<template>
  <section>
    <DataTable 
      ref="dataTable" 
      :cardTitle="$t('Promo Code')" 
      :btnTitle="$t('Add New Promo Code')" 
      :headers="headers"
      :api="GET_COUPONS_API" 
      :sortBy="sortByData"
      @onBtnClick="[couponStore.isDrawerOpen = true, selectedCoupon = null, couponStore.resetCoupon()]"
    >
      <template #item.code="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VChip 
            color="primary" 
            variant="tonal" 
            size="small"
            class="font-weight-medium"
          >
            {{ item.code }}
          </VChip>
        </div>
      </template>

      

      <template #item.type="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VChip 
            :color="item.type === 'percentage' ? 'info' : 'success'" 
            variant="tonal" 
            size="small"
          >
            {{ capitalize(item.type) }}
          </VChip>
        </div>
      </template>

      <template #item.value="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span class="font-weight-medium">{{ formatCouponValue(item) }}</span>
        </div>
      </template>

      <template #item.usage="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span>{{ formatUsage(item) }}</span>
        </div>
      </template>

      <template #item.is_active="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VChip 
            :color="getStatusColor(item.is_active)" 
            variant="tonal" 
            size="small"
          >
            {{ resolveStatusVariant(item.is_active) }}
          </VChip>
        </div>
      </template>

      <template #item.valid_to="{ item }">
        <div class="d-flex align-center gap-x-4">
          <span>{{ formatDate(item.valid_to) }}</span>
        </div>
      </template>

      <template #item.actions="{ item }">
        <IconBtn @click="editCoupon(item)" v-if="$can('read', 'Promo Code Edit')">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn @click="confirmDelete(item)" v-if="$can('read', 'Promo Code Delete')">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </DataTable>

    <ConfirmDialog 
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Are you sure you want to delete this coupon?" 
      confirm-title="Deleted!"
      confirm-msg="Coupon deleted successfully." 
      cancel-title="Cancelled" 
      cancel-msg="Deletion Cancelled!!"
      @confirm="handleConfirm" 
      @cancel="handleCancel" 
    />

    <teleport to="body">
      <AddNewCoupon :coupon="selectedCoupon" v-if="couponStore.isDrawerOpen" />
    </teleport>
  </section>
</template>
