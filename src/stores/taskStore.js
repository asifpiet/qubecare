import { taskService } from '@/services/taskService'
import { showLoader } from '@/utils/showLoader'
import { defineStore } from 'pinia'

const tasks = {
    patient_name: '',
    title: '',
    priority: '',
    task_type: '',
    due_date: '',
    activityStatus: '',
    task_owner: '',
    task_watchers: '',
    access_restriction: '',
    activityMessage: '',
    activityDueDate: '',
    owner: '',
    sendEmailtoPatientApplicationForTask: 'true',
    notes: '',
    id: '',
}

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: { ...tasks },
        isDrawerOpen: false,
    }),
    actions: {

        unloadTask() {
            this.tasks = { ...tasks }
        },

        async loadTask(id) {
            showLoader()
            await taskService.getTask(id).then((response) => {
                this.tasks = response;
                console.log("getTask", this.tasks);
            })
            hideLoader()
        },
        async saveTask(id) {
            showLoader()
            this.tasks.activityMessage = this.tasks.title + ' - ' + this.tasks.task_type;
            this.tasks.activityDueDate = this.tasks.due_date;
            this.tasks.owner = this.tasks.task_owner + ' | ' + this.tasks.task_watchers,
                await taskService.saveTask(this.tasks, id).then((response) => {
                    if (response && response?.message) {
                        addAlert(response?.message, 'success')
                    }
                    else {
                        addAlert(response?.error, 'error')
                    }
                })
            hideLoader()
        },

    },
    getters: {

    },
})    
