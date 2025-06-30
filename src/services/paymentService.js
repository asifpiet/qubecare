import baseService from './baseService';

class PaymentService extends baseService {




    async savePaymentMethod(data) {

        console.log("savePayment", data);
        const res = await $api(SAVE_PAYMENT_METHOD_API, {
            method: 'POST',
            body: {
                name: data.paymentMethod,
                config: { apiKey: data.apiKey, apiSecret: data.apiSecret },

            },


        }
        )

        return res

    }
    async stripeConnect(provider_id) {


        const res = await $api(STRIPE_CONNECT, {
            method: 'GET',
        }
        )
        return res

    }
    async getStatusConnection() {
        const res = await $api(CHECK_STATUS_GATEWAY, {
            method: 'GET',
        }
        )
        return res
    }
    async paymentProcess(data) {
        console.log("savePayment", data);
        const res = await $api(PAYMENT_PROCESS_API, {
            method: 'POST',
            body: data
        }
        )

        return res

    }
}

export const paymentService = new PaymentService()
