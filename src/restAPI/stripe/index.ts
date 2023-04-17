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
        this.router.post('/pay', async (req, res) => {
            const session = await stripeAcces.checkout.sessions.create({
                success_url: `/success?session_id={CHECKOUT_SESSION_ID}`, // TODO: front payment success
                cancel_url: '/cancel', // front payment cancel
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'NodeBot Premium',
                            },
                            unit_amount: 5_000, // 5 usd
                        },
                    },
                ],
            })

            return res.json({ url: session.url })
        })

        this.router.post('/webhook', express.raw({ type: 'application/json' }), (request, response): any => {
            let event: Stripe.Event
            try {
                event = stripeAcces.webhooks.constructEvent(
                    request.body,
                    request.headers['stripe-signature'] ?? '',
                    endpointSecret,
                )
            } catch (err: any) {
                console.log(`⚠️  Webhook signature verification failed.`, err.message)
                return response.sendStatus(400)
            }

            // Handle the event
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object as any
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
