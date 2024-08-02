"use client";
import { createPayment } from "@/actions/paypal";
import products from "@/data/products.json";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "react-toastify";

export default function Paypal() {
  const [loading, startTransition] = useTransition();
  const product = products[0];

  function handleBuy() {
    startTransition(async () => {
      const result = await createPayment({ productId: product.id, quantity: 1 });
      if (result.error) {
        toast.error(result.error);
        return;
      }

      window.location.href = result.url;
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
                ${(product.price - product.price * (product.discount / 100)).toFixed(2)}
              </span>
              <span className="text-sm text-slate-900 dark:text-gray-200 line-through">
                ${product.price.toFixed(2)}
              </span>
            </p>
          </div>
          <button
            disabled={loading}
            onClick={handleBuy}
            className="w-full rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {loading ? "Loading..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
