"use server";
import Razorpay from "razorpay";
import products from "@/data/products.json";
import { createHmac } from "crypto";

interface CreateOrdersInput {
  productId: number;
  quantity: number;
}

export async function createOrders({ productId, quantity }: CreateOrdersInput) {
  if (!productId || !quantity) {
    return { error: "Invalid input" };
  }

  const product = products.find((product) => product.id === productId);

  if (!product) {
    return { error: "Product not found" };
  }

  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.log("Razorpay keys are missing");
      return { error: "Razorpay keys are missing" };
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const orders = await instance.orders.create({
      amount: (product.price - product.price * (product.discount / 100)) * 100,
      currency: "INR",
    });

    if (!orders) {
      return { error: "Error creating orders" };
    }

    // Save the order details in the database

    return { orderId: orders.id };
  } catch (error) {
    console.log("Error creating orders", error);
    return { error: "Error creating orders" };
  }
}

export async function verifyPayment(data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  try {
    const shasum = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== data.razorpay_signature) {
      return { error: "Transaction not legit!" };
    }

    // Save the payment details in the database

    return { success: true };
  } catch (error) {
    console.log("Error verifying payment", error);
    return { error: "Error verifying payment" };
  }
}
