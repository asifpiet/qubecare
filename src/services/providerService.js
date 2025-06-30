import { $api } from '@/utils/api';
import baseService from './baseService';

class ProviderService extends baseService {


    async getDashbaordStats(start_date, end_date) {
        let res = await $api(`${DASHBOARD_API}`, {
            method: 'POST',
            body: {
                start_date: start_date,
                end_date: end_date,
            },
        })
        return res
    }

    async getAppointmentReport(start_date, end_date, status, provider) {
        let res = await $api(`${APPIONMENT_REPORT_API}`, {
            method: 'POST',
            body: {
                start_date: start_date,
                end_date: end_date,
                provider: provider,
                status: status,
            },
        })
        return res
    }

    async getProviderReport(start_date, end_date) {
        let res = await $api(`${PROVIDER_STATS_API}`, {
            method: 'POST',
            body: {
                start_date: start_date,
                end_date: end_date,
            },
        })
        return res
    }

    async getInvoiceStats() {
        let res = await $api(`${INVOICE_STATE}`, {
            method: 'GET',
        })
        return res
    }

    async forgotPassword(email) {
        let res = await $api(`${PROVIDER_FORGOT_PASSWORD_API}`, {
            method: 'POST',
            body: {
                email: email
            },
        })
        return res
    }

    async resetPassword(data) {
        let res = await $api(PROVIDER_RESET_PASSWORD_API, {
            method: 'POST',
            body: data
        });

        return res
    }

    async importxls(data, isExistDelete) {
        const formData = new FormData();
        formData.append('file', data);
        formData.append('delete_existing', isExistDelete);

        let res = await $api(`${IMPORT_XLS}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'multipart/form-data',

            },
        })

        return res
    }





    async downloadFile(type, source, start_date, end_date, provider) {
        let url = '';
        if (type == 'pdf' && source == 'provider') {
            url = `${PROVIDER_REPORT_PDF}?`;
        }
        if (type == 'csv' && source == 'provider') {
            url = `${PROVIDER_STATS_CSV}?`;
        }
        if (type == 'csv' && source == 'appointment') {
            url = `${DOWNLOAD_APPIONMENT_CSV_REPORT_API}?provider=${provider}&`;
        }
        if (type == 'pdf' && source == 'appointment') {
            url = `${DOWNLOAD_APPIONMENT_PDF_REPORT_API}?provider=${provider}&`;
        }
        if (type == 'csv' && source == 'invoice') {
            url = `${INVOICE_CSV_REPORT_API}?`;
        }
        if (type == 'pdf' && source == 'invoice') {
            url = `${INVOICE_PDF_REPORT_API}?`;
        }
        try {
            const api_url = `${url}start_date=${start_date}&end_date=${end_date}`;
            const res = await $api(api_url, {
                method: 'GET',
                responseType: 'blob',
            });
            console.log("file", res);

            const urlBlob = window.URL.createObjectURL(res);
            const link = document.createElement('a');
            link.href = urlBlob;
            const fileName = `${source}-report-${start_date}-${end_date}.${type}`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);

        } catch (error) {
            console.error('Error downloading the PDF:', error);
        } finally {

        }

    }





    async getInvocieReport(start_date, end_date) {
        let res = await $api(`${INVOICE_REPORT_API}`, {
            method: 'POST',
            body: {
                start_date: start_date,
                end_date: end_date,
            },
        })
        return res
    }
    async getTimeLineReport(start_date, end_date) {
        let res = await $api(`${ORDER_TIMELINE_REPORT}`, {
            method: 'POST',
            body: {
                start_date: start_date,
                end_date: end_date,
            },
        })
        return res
    }
    async getPrescriptionReport(start_date, end_date) {
        let res = await $api(`${PRESCRIPTION_REPORT}`, {
            method: 'POST',
            body: {
                start_date: start_date,
                end_date: end_date,
            },
        })
        return res
    }


}

export const providerService = new ProviderService()
