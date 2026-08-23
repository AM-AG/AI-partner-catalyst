// pages/payments/stripe.ts
import Stripe from "stripe";
import {PRICING_PLANS} from "../components/InfoModals";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function createStripeCheckout(planId: string) {
  const price_plan = PRICING_PLANS.find(plan => plan.id === planId)?.price;

  if (!price_plan) {
    throw new Error("Invalid plan");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: price_plan,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return session.url!;
}
