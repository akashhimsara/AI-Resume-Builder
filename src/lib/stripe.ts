import Stripe from "stripe";
import { getStripeEnv } from "@/lib/env";

const { STRIPE_SECRET_KEY } = getStripeEnv();
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});
