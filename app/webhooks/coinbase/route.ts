import { createHmac } from "crypto";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
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
  const { event } = await JSON.parse(body);

  console.log(event.data);

  switch (event.type) {
    case "charge:created":
      // Handle charge created event
      console.log("Charge created", event.data);
      break;
    case "charge:pending":
      // Handle charge created event
      console.log("Charge pending", event.data);
      break;
    case "charge:confirmed":
      // Handle charge created event
      console.log("Charge confirmed", event.data);
      break;
    case "charge:failed":
      // Handle charge created event
      console.log("Charge failed", event.data);
      break;
    default:
      console.log("Unhandled event", event.type);
  }

  return Response.json({ received: true });
}
