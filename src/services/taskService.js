import baseService from './baseService';

class TaskService extends baseService {

    async saveTask(data, id) {

        // return $api(`${data.id ? `${UPDATE_TASK_DATA}/${data.id}` : ADD_TASK_API_T}`, {
        //     method: data.id ? 'PUT' : 'POST',
        //     body: data,
        // });

        const url = data.id ? `${UPDATE_TASK_DATA}/${data.id}` : `${ADD_TASK_API_T}/${id}`;
        const method = data.id ? 'PUT' : 'POST';

        return $api(url, {
            method,
            body: data,
        });
    }

    async getTask(id) {
        let res = await $api(`${GET_TASK_BY_ID}/${id}`, {
            method: 'GET',
        })
        return res;
    }
}

export const taskService = new TaskService()
