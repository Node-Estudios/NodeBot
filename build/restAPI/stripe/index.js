import express, { Router as router } from 'express';
import { Stripe } from 'stripe';
import logger from '#utils/logger.js';
const stripeAcces = new Stripe(process.env.STRIPE, { apiVersion: '2022-11-15', typescript: true });
const endpointSecret = 'whsec_49455f433220997b19b1470c119bfa10304a72f4638e02eca17d06636bea7ab3';
export default class StripeApi {
    manager;
    router = router();
    constructor(manager) {
        this.manager = manager;
        this.#load();
    }
    #load() {
        this.router.use(express.json());
        this.router.post('/pay', async (req, res) => {
            const product = await stripeAcces.products.retrieve(req.body.product_id);
            const price = await stripeAcces.prices.retrieve(product.default_price);
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
            });
            res.status(303).redirect(session.url ?? '');
        });
        this.router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
            let event;
            try {
                event = stripeAcces.webhooks.constructEvent(request.body, request.headers['stripe-signature'] ?? '', endpointSecret);
            }
            catch (err) {
                logger.error('⚠️  Webhook signature verification failed.', err.message);
                return response.sendStatus(400);
            }
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    logger.debug(`PaymentIntent for ${paymentIntent.amount} was successful!`);
                    break;
                case 'payment_method.attached':
                    const paymentMethod = event.data.object;
                    break;
                default:
                    logger.debug(`Unhandled event type ${event.type}.`);
            }
            response.send();
        });
        return this.router;
    }
}
//# sourceMappingURL=index.js.map