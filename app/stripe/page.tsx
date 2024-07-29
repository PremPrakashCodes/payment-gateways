"use client";
import Image from "next/image";
import products from "@/data/products.json";
import { useTransition } from "react";
import { createCheckoutSession } from "@/actions/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

export default function Stripe() {
  const [loading, startTransition] = useTransition();

  const product = products[0];

  function handleBuy() {
    startTransition(async () => {
      const result = await createCheckoutSession({ productId: product.id, quantity: 1 });

      if (!result || result.error || !result.sessionId) {
        toast.error("Error creating checkout session");
        return;
      }

      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
      if (!publishableKey) {
        toast.error("Stripe public key is missing!");
        return;
      }
      const stripe = await loadStripe(publishableKey);

      if (!stripe) {
        toast.error("Error loading Stripe");
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: result.sessionId,
      });

      if (error) {
        toast.error("Error redirecting to checkout");
      }
    });
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex w-full max-w-xs flex-col overflow-hidden rounded-lg  bg-white dark:bg-gray-950 shadow-md">
        <div className="relative m-2 flex h-60 overflow-hidden rounded-xl">
          <Image
            height={500}
            width={500}
            className="object-cover"
            src={product.image}
            alt="product image"
          />
          <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
            {product.discount}% OFF
          </span>
        </div>
        <div className="mt-4 px-5 pb-5">
          <a href="#">
            <h5 className="text-xl tracking-tight text-slate-900 dark:text-gray-200">
              {product.name}
            </h5>
          </a>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-3xl font-bold text-slate-900 dark:text-gray-200">
                ${product.price - product.price * (product.discount / 100)}
              </span>
              <span className="text-sm text-slate-900 dark:text-gray-200 line-through">
                ${product.price}
              </span>
            </p>
            <div className="flex items-center">
              {[...Array(product.rating)].map((_, index) => (
                <svg
                  key={index}
                  aria-hidden="true"
                  className="h-5 w-5 text-yellow-500 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}

              <span
                className="mr-2 ml-3 rounded bg-yellow-500 text-white
               px-2.5 py-0.5 text-xs font-semibold"
              >
                {product.rating}.0
              </span>
            </div>
          </div>
          <button
            disabled={loading}
            onClick={handleBuy}
            className="w-full rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {loading ? "Loading..." : "Hire Me"}
          </button>
        </div>
      </div>
    </div>
  );
}
