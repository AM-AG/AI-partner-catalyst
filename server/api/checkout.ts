// pages/api/checkout.ts
import { createStripeCheckout } from "../../src/pages/stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { planId } = req.body;

  try {
    const checkoutUrl = await createStripeCheckout(planId);

    res.status(200).json({ checkoutUrl });
  } catch (err) {
    res.status(500).json({ error: "Unable to create checkout" });
  }
}