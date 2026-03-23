import Stripe from "stripe";
import { env, getStripeEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

const stripeEnv = getStripeEnv();

const stripe = new Stripe(stripeEnv.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});

export async function createBillingCheckout(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName,
      metadata: { userId: user.id },
    });

    customerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: stripeEnv.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?billing=success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?billing=canceled`,
    metadata: {
      userId: user.id,
    },
  });

  return checkout;
}

export async function handleStripeWebhook(rawBody: string, signature: string) {
  const event = stripe.webhooks.constructEvent(rawBody, signature, stripeEnv.STRIPE_WEBHOOK_SECRET);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const stripeSubscriptionId =
      typeof session.subscription === "string" ? session.subscription : undefined;

    if (!userId || !stripeSubscriptionId) {
      return;
    }

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripePriceId: stripeEnv.STRIPE_PRICE_ID,
        stripeSubscriptionId,
        status: "ACTIVE",
        currentPeriodEnd: null,
      },
      update: {
        stripePriceId: stripeEnv.STRIPE_PRICE_ID,
        stripeSubscriptionId,
        status: "ACTIVE",
        currentPeriodEnd: null,
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: "CANCELED",
        currentPeriodEnd: null,
      },
    });
  }
}
