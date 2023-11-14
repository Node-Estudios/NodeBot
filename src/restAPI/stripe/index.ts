import express, { Router as router, Request } from 'express'
import NodeManager from '#structures/NodeManager.js'

import { Stripe } from 'stripe'
import logger from '#utils/logger.js'

const stripeAcces = new Stripe(process.env.STRIPE, { apiVersion: '2022-11-15', typescript: true })
const endpointSecret = ''
// export default router
export default class StripeApi {
    manager: NodeManager
    router = router()
    // app: Express.Application
    constructor (manager: NodeManager) {
        this.manager = manager
        this.#load()
    }

    #load () {
        this.router.use(express.json())
        this.router.post('/pay', async (req: Request<{}, {}, payBody>, res) => {
            const product = await stripeAcces.products.retrieve(req.body.product_id)
            const price = await stripeAcces.prices.retrieve(product.default_price as string)
            const session = await stripeAcces.checkout.sessions.create({
                line_items: [
                    {
                        price: price.id,
                        quantity: 1,
                    },
                ],
                mode: price.type === 'recurring' ? 'subscription' : 'payment',
                success_url: req.body.success_url,
                cancel_url: req.body.cancel_url,
                metadata: {
                    user_id: req.body.user_id,
                },
            })

            res.status(303).redirect(session.url ?? '')
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
                logger.error('⚠️  Webhook signature verification failed.', err.message)
                return response.sendStatus(400)
            }

            // Handle the event
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object as any
                    logger.debug(`PaymentIntent for ${paymentIntent.amount} was successful!`)
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
                    logger.debug(`Unhandled event type ${event.type}.`)
            }

            // Return a 200 response to acknowledge receipt of the event
            response.send()
        })
        return this.router
    }
}

// '/pay' body
interface payBody {
    success_url: string // like a 'https://myweb.com/pay_sucess'
    cancel_url?: string // like a 'https://myweb.com/cancel'
    payment_method_types?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[]
    product_id: string
    user_id: string
}
