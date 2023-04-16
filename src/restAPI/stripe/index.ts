import express, { Router as router } from 'express'
import NodeManager from '../../structures/NodeManager.js'

import { Stripe } from 'stripe'
const stripeAcces = new Stripe(process.env.STRIPE!, { apiVersion: '2022-11-15', typescript: true })
const endpointSecret = 'whsec_49455f433220997b19b1470c119bfa10304a72f4638e02eca17d06636bea7ab3'
// export default router
export class stripe {
    manager: NodeManager
    router = router()
    // app: Express.Application
    constructor(manager: NodeManager) {
        this.manager = manager
        this.#load()
    }
    #load() {
        this.router.use(express.json())
        this.router.get('/webhook', (req, res) => {
            res.send('Hello World!')
        })
        this.router.post('/webhook', express.raw({ type: 'application/json' }), (request, response): any => {
            let event = request.body
            // Only verify the event if you have an endpoint secret defined.
            // Otherwise use the basic event deserialized with JSON.parse
            if (endpointSecret) {
                // Get the signature sent by Stripe
                console.log(request.headers)
                const signature = request.headers['stripe-signature']
                // console.log(signature)
                try {
                    event = stripeAcces.webhooks.constructEvent(request.body, signature as any, endpointSecret)
                } catch (err: any) {
                    console.log(`⚠️  Webhook signature verification failed.`, err.message)
                    return response.sendStatus(400)
                }
            }

            // Handle the event
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object
                    console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)
                    // Then define and call a method to handle the successful payment intent.
                    // handlePaymentIntentSucceeded(paymentIntent);
                    break
                case 'payment_method.attached':
                    const paymentMethod = event.data.object
                    // Then define and call a method to handle the successful attachment of a PaymentMethod.
                    // handlePaymentMethodAttached(paymentMethod);
                    break
                default:
                    // Unexpected event type
                    console.log(`Unhandled event type ${event.type}.`)
            }

            // Return a 200 response to acknowledge receipt of the event
            response.send()
        })
        return this.router
    }
}
