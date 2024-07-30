"use server";

import products from "@/data/products.json";

export async function createPayment({
  productId,
  quantity,
}: {
  productId: number;
  quantity: number;
}) {
  // Validate inputs
  if (!productId || quantity <= 0) {
    return { error: "Invalid product or quantity" };
  }

  // Find the product
  const product = products.find((product) => product.id === productId);
  if (!product) {
    return { error: "Product not found" };
  }

  // Calculate total amount based on quantity and product price
  const totalAmount = (product.price - (product.price * product.discount) / 100) * quantity;

  const client_id = process.env.PAYPAL_CLIENT_ID;
  const client_secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    console.log("Paypal client id or secret not found");
    return { error: "Paypal client id or secret not found" };
  }

  try {
    // Create PayPal order
    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders", // Sandbox URL; change to production URL when ready
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              items: [
                {
                  name: product.name,
                  quantity,
                  unit_amount: {
                    currency_code: "USD",
                    value: (product.price - (product.price * product.discount) / 100).toFixed(2),
                  },
                },
              ],
              amount: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: totalAmount.toFixed(2),
                  },
                },
              },
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=failed`,
          },
        }),
      }
    );

    // Handle response
    if (!response.ok) {
      console.error("Failed to create payment", await response.json());
      return { error: "Failed to create payment" };
    }

    // Parse response JSON
    const data = await response.json();

    const url = data.links.find(
      (link: {
        href: string;
        method: "GET" | "PATCH" | "POST";
        rel: "self" | "approve" | "update" | "capture";
      }) => link.rel === "approve"
    ).href;

    return { success: true, url };
  } catch (error) {
    console.error("Error creating payment", error);
    return { error: "Error creating payment" };
  }
}
