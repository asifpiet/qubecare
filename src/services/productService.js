import baseService from './baseService';

class ProductService extends baseService {

    async getProductsList() {
        let res = await $api(GET_PRACTITIONER_PRODUCTS, {
            method: 'GET',
        })

        return res.data
    }
    async getProductsListForPatientPortal(id) {
        let res = await $api(`${GET_PATIENT_PRODUCTS_API}/${id}`, {
            method: 'GET',
        })

        return res.data
    }



    async saveProduct(data, id) {
        let res = await $api(id ? `${UPDATE_PRODUCT_API}/${id}` : SAVE_PRODUCT_API, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async deleteProduct(id) {
        let res = await $api(`${DELETE_PRODUCT}/${id}`, {
            method: 'DELETE',
        })

        return res
    }

    mapProductData(data) {
        return {
            id: data.id,
            product: {
                name: data.pro_name,
                slug: data.slug,
                description: data.description,
                price: data.price,
                type: data.type,
                isPrescription: data.prescription,
                inTakeForm_id: data.in_take_form_id,
                questiioneriesForm_id: data.questiioneries_form_id,
                category_id: Number(data.category_ids),
                sku: data.sku && data.sku == "null" ? '' : data.sku,
                status: data.status
            },
        }
    }
}

export const productService = new ProductService()
