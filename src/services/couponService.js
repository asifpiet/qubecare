import {
    ADD_COUPON_API,
    APPLY_COUPON_API,
    DELETE_COUPON_API,
    GET_COUPON_BY_ID_API,
    GET_COUPONS_API,
    UPDATE_COUPON_API,
    VALIDATE_COUPON_API
} from '@/utils/constants';
import baseService from './baseService';

class CouponService extends baseService {

    async getCoupons() {
        let res = await $api(GET_COUPONS_API, {
            method: 'GET',
        })
        return res.data
    }

    async getCouponById(id) {
        let res = await $api(`${GET_COUPON_BY_ID_API}/${id}`, {
            method: 'GET',
        })
        return res.data
    }

    async saveCoupon(data, id) {
        let res = await $api(id ? `${UPDATE_COUPON_API}/${id}` : ADD_COUPON_API, {
            method: id ? 'PUT' : 'POST',
            body: data,
        })
        return res
    }

    async deleteCoupon(id) {
        let res = await $api(`${DELETE_COUPON_API}/${id}`, {
            method: 'DELETE',
        })
        return res
    }

    async validateCoupon(code, providerId, totalAmount) {
        let res = await $api(VALIDATE_COUPON_API, {
            method: 'POST',
            body: {
                promo_code: code,
                provider_id: providerId,
                total_amount: totalAmount
            }
        })
        return res
    }

    async applyCoupon(code, providerId, totalAmount, items) {
        let res = await $api(APPLY_COUPON_API, {
            method: 'POST',
            body: {
                code,
                provider_id: providerId,
                total_amount: totalAmount,
                items
            }
        })
        return res
    }
}

export const couponService = new CouponService()
