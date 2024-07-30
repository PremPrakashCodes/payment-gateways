import { createHmac } from "crypto";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const signature = headers().get("x-cc-webhook-signature");

  if (!signature) {
    return Response.json({ error: "No signature provided" }, { status: 400 });
  }

  const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return Response.json({ error: "Webhook secret not found" }, { status: 500 });
  }

  const hmac = createHmac("sha256", webhookSecret);
  const computedSignature = hmac.update(body).digest("hex");

  if (signature !== computedSignature) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the webhook event
  const event = body.event;

  switch (event.type) {
    case "charge:confirmed":
      // Payment confirmed
      console.log("Payment confirmed for charge:", event.data.id);
      // Update your database, fulfill the order, etc.
      break;
    case "charge:failed":
      // Payment failed
      console.log("Payment failed for charge:", event.data.id);
      // Update your database, notify the customer, etc.
      break;
    // Add more cases as needed
    default:
      console.log("Unhandled event type:", event.type);
  }
  return Response.json({ received: true });
}
