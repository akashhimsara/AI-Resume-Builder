import Stripe from "stripe";
import { getAppUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new AppError("Missing STRIPE_SECRET_KEY", 500, "STRIPE_CONFIG_ERROR");
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-02-25.clover",
  });
}

function getStripePriceId() {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new AppError("Missing STRIPE_PRICE_ID", 500, "STRIPE_CONFIG_ERROR");
  }

  return priceId;
}

function mapStripeError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : "Stripe request failed";

  if (/Invalid API Key provided/i.test(message)) {
    return new AppError("Invalid STRIPE_SECRET_KEY. Use a valid Stripe test/live secret key.", 500, "STRIPE_CONFIG_ERROR");
  }

  return new AppError("Stripe request failed. Please verify billing configuration.", 500, "STRIPE_REQUEST_ERROR");
}

export async function createBillingCheckout(userId: string) {
  const stripe = getStripeClient();
  const stripePriceId = getStripePriceId();

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
    let customer;
    try {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: { userId: user.id },
      });
    } catch (error) {
      throw mapStripeError(error);
    }

    customerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  let checkout;
  try {
    checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${getAppUrl()}/dashboard?billing=success`,
      cancel_url: `${getAppUrl()}/dashboard?billing=canceled`,
      metadata: {
        userId: user.id,
      },
    });
  } catch (error) {
    throw mapStripeError(error);
  }

  return checkout;
}

export async function createBillingPortal(userId: string) {
  const stripe = getStripeClient();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (!user.stripeCustomerId) {
    throw new AppError("No Stripe customer found for this user", 400, "BILLING_CUSTOMER_MISSING");
  }

  let portal;
  try {
    portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${getAppUrl()}/dashboard/billing`,
    });
  } catch (error) {
    throw mapStripeError(error);
  }

  return portal;
}

export async function handleStripeWebhook(rawBody: string, signature: string) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new AppError("Missing STRIPE_WEBHOOK_SECRET", 500, "STRIPE_CONFIG_ERROR");
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  const stripePriceId = process.env.STRIPE_PRICE_ID ?? "";

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
        stripePriceId,
        stripeSubscriptionId,
        status: "ACTIVE",
        currentPeriodEnd: null,
      },
      update: {
        stripePriceId,
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
