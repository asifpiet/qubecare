import { $api } from '@/utils/api';
import baseService from './baseService';

class CategoryService extends baseService {

    async getCategoryList() {
        let res = await $api(`${GET_CATEGORY_API}`, {
            method: 'GET',
        })

        return res.data
    }

    async saveCategory(data, id) {
        let res = await $api(id ? `${UPDATE_CATEGORY_API}/${id}` : SAVE_CATEGORY_API, {
            method: 'POST',
            body: data,
        })
        return res
    }

    mapCategoryData(data) {
        return {
            id: data.id,
            category: {
                name: data.name,
                inTakeForm_id: data.intake_form_id,
                questiioneriesForm_id: data.questionire_form_id,
            },
        }
    }

}

export const categoryService = new CategoryService()
