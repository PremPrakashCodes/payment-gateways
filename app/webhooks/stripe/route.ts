import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  const sig = headers().get("stripe-signature") as string;

  let event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error: any) {
    console.error(`Webhook Error: ${error}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.async_payment_failed":
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      console.log("checkout.session.async_payment_failed", checkoutSessionAsyncPaymentFailed);
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case "checkout.session.async_payment_succeeded":
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      console.log("checkout.session.async_payment_succeeded", checkoutSessionAsyncPaymentSucceeded);
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      console.log("checkout.session.completed", checkoutSessionCompleted);
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case "checkout.session.expired":
      const checkoutSessionExpired = event.data.object;
      console.log("checkout.session.expired", checkoutSessionExpired);
      // Then define and call a function to handle the event checkout.session.expired
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("Webhook received", { status: 200 });
}
