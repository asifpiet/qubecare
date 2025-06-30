import { $api } from '@/utils/api';
import baseService from './baseService';

class InventoryService extends baseService {

    async saveInventory(data, id) {
        let res = await $api(data.id ? `${UPDATE_INVENTORY_API}/${data.id}` : ADD_INVENTORY_API, {
            method: 'POST',
            body: data,
        })
        return res
    }

    async getInventory(id) {
        let res = await $api(`${GET_SINGLE_INVENTORY_API}/${id}`, {
            method: 'GET',
        })
        return res;
    }

    async deleteInventory(id) {
        let res = await $api(`${DELETE_INVENTORY_API}/${id}`, {
            method: 'DELETE',
        })

        return res
    }

}

export const inventoryService = new InventoryService()
