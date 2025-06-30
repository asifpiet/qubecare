import baseService from './baseService';

class AffiliateProductService extends baseService {

    async saveAffiliateProduct(data, id) {
        let res = await $api(id ? `${UPDATE_AFFILIATE_PRODUCTS_BY_ID}/${id}` : STORE_AFFILIATE_PRODUCTS, {
            method: id ? 'PUT' : 'POST',
            body: data,
        })
        return res
    }

    async deleteAffiliateProduct(id) {
        let res = await $api(`${DELETE_AFFILIATE_PRODUCTS_BY_ID}/${id}`, {
            method: 'DELETE',
        })

        return res
    }

    mapAffiliateProductData(data) {
        return {
            id: data.affiliate_product_id,
            affiliateProduct: {
                product_id: data.product_id,
                builder_id: data.builder_id,
                referral_fee: data.referral_fee,
                status: data.status === 1 ? true : false,
            },
        }
    }
}

export const affiliateProductService = new AffiliateProductService()
