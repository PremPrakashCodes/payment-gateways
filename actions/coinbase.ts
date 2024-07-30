"use server";

import products from "@/data/products.json";

type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
};

export async function createCharge({
  productId,
  quantity,
}: {
  productId: number;
  quantity: number;
}): Promise<{ error?: string; url?: string }> {
  // Validate inputs
  if (!productId || quantity <= 0) {
    return { error: "Invalid product or quantity" };
  }

  const product = products.find((p: Product) => p.id === productId);

  if (!product) {
    return { error: "Product not found" };
  }

  // Calculate total amount based on quantity and product price
  const totalAmount = (product.price - (product.price * product.discount) / 100) * quantity;

  try {
    const response = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CC-Api-Key": process.env.COINBASE_API_KEY!,
      },
      body: JSON.stringify({
        local_price: {
          amount: totalAmount.toFixed(2),
          currency: "USD", //currency
        },
        pricing_type: "fixed_price",
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?status=success`,
        name: product.name,
        metadata: {
          //Otional
          email: "user@example.com",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return { url: result.data.hosted_url };
  } catch (error) {
    console.error("Error creating charge:", error);
    return { error: "Failed to create charge" };
  }
}
