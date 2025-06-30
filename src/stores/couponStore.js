import { couponService } from '@/services/couponService'
import { addAlert, showLoader, hideLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const coupon = {
    id: null,
    code: '',
    name: '',
    description: '',
    type: 'percentage', // percentage or fixed
    value: 0,
    discount_amount: 0,
    max_discount: null,
    usage_limit: null,
    used_count: 0,
    valid_from: null,
    valid_to: null,
    is_active: 1, // active, inactive, expired
    provider_id: null,
    applicable_products: [], // array of product IDs, empty means all products
    created_at: null,
    updated_at: null
}

export const useCouponStore = defineStore('coupons', {
    state: () => ({
        coupon: { ...coupon },
        coupons: [],
        isDrawerOpen: false,
        appliedCoupon: null,
        couponDiscount: 0,
        couponCode: '',
        isValidatingCoupon: false,
    }),

    actions: {
        resetCoupon() {
            this.coupon = { ...coupon }
        },

        async getCoupons() {
            try {
                showLoader()
                const response = await couponService.getCoupons()
                this.coupons = response
                hideLoader()
            } catch (error) {
                hideLoader()
                addAlert(error.response?.data?.message || 'Failed to fetch coupons', 'error')
                console.error('Error fetching coupons:', error)
            }
        },

        async getCouponById(id) {
            try {
                showLoader()
                const response = await couponService.getCouponById(id)
                this.coupon = response
                hideLoader()
                return response
            } catch (error) {
                hideLoader()
                addAlert(error.response?.data?.message || 'Failed to fetch coupon', 'error')
                console.error('Error fetching coupon:', error)
            }
        },

        async saveCoupon(data, id = null) {
            try {
                showLoader()
                const response = await couponService.saveCoupon(data, id)
                
                if (id) {
                    addAlert('Coupon updated successfully', 'success')
                } else {
                    addAlert('Coupon created successfully', 'success')
                }
                
                this.resetCoupon()
                this.isDrawerOpen = false
                hideLoader()
                return response
            } catch (error) {
                hideLoader()
                addAlert(error.response?.data?.message || 'Failed to save coupon', 'error')
                console.error('Error saving coupon:', error)
                throw error
            }
        },

        async deleteCoupon(id) {
            try {
                showLoader()
                await couponService.deleteCoupon(id)
                addAlert('Coupon deleted successfully', 'success')
                hideLoader()
            } catch (error) {
                hideLoader()
                addAlert(error.response?.data?.message || 'Failed to delete coupon', 'error')
                console.error('Error deleting coupon:', error)
            }
        },

        async validateCoupon(code, providerId, totalAmount) {
            try {
                this.isValidatingCoupon = true
                const response = await couponService.validateCoupon(code, providerId, totalAmount)
                
                if (response.promo_data) {
                    this.appliedCoupon = response.promo_data.coupon
                    this.couponDiscount = response.promo_data.discount_amount
                    this.couponCode = code
                    addAlert('Coupon applied successfully', 'success')
                    return response
                } else {
                    this.clearAppliedCoupon()
                    addAlert(response.message || 'Invalid coupon code', 'error')
                    return response
                }
            } catch (error) {
                this.clearAppliedCoupon()
                addAlert(error.response?.data?.message || 'Failed to validate coupon', 'error')
                console.error('Error validating coupon:', error)
                throw error
            } finally {
                this.isValidatingCoupon = false
            }
        },

        clearAppliedCoupon() {
            this.appliedCoupon = null
            this.couponDiscount = 0
            this.couponCode = ''
        },

        calculateDiscountedTotal(originalTotal) {
            if (!this.appliedCoupon || this.couponDiscount <= 0) {
                return originalTotal
            }
            return Math.max(0, originalTotal - this.couponDiscount)
        }
    },

    getters: {
        activeCoupons: (state) => {
            return state.coupons.filter(coupon => 
                coupon.status === 'active' && 
                (!coupon.end_date || new Date(coupon.end_date) >= new Date())
            )
        },

        hasAppliedCoupon: (state) => {
            return state.appliedCoupon !== null && state.couponDiscount > 0
        },

        formattedDiscount: (state) => {
            if (!state.appliedCoupon || state.couponDiscount <= 0) return '$0.00'
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(state.couponDiscount)
        }
    }
})
