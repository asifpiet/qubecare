import { $api } from '@/utils/api';
import baseService from './baseService';

class LocationService extends baseService {

    async getLocations() {
        let res = await $api(`${LOCATIONS_API}`, {
            method: 'GET',
        })

        return res.data
    }

    async saveLocation(data, id) {
        let res = await $api(id ? `${UPDATE_LOCATIONS_API}/${id}` : ADD_LOCATIONS_API, {
            method: 'POST',
            body: data,
        })
        return res
    }
}

export const locationService = new LocationService()
