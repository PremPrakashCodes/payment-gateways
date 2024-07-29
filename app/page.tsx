import Image from "next/image";
import Link from "next/link";

const paymentGateways = [
  {
    name: "Stripe",
    description:
      "Integrate Stripe's secure and flexible payment processing for global transactions.",
    href: "/stripe",
  },
  {
    name: "Razorpay",
    description: "Implement Razorpay for seamless payments tailored for the Indian market.",
    href: "/razorpay",
  },
  {
    name: "Paypal",
    description: "Set up PayPal to offer a trusted payment option recognized worldwide.",
    href: "/paypal",
  },
  {
    name: "Coinbase",
    description: "Integrate Coinbase Commerce to accept cryptocurrency payments securely.",
    href: "/coinbase",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Souce code available at&nbsp;
          <Link
            className="hover:underline"
            href="https://github.com/PremPrakashCodes/payment-gateways"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code className="font-mono font-bold">github.com</code>
          </Link>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <Link
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://github.com/PremPrakashCodes"
            target="_blank"
            rel="noopener noreferrer"
          >
            By <span className="text-2xl tracking-tighter">Prem Prakash Sharma</span>
          </Link>
        </div>
      </div>

      <div className="relative m-5 z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-lg rounded-full"
          src="/images/profile.png"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 mt-24 grid text-center gap-4 lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {paymentGateways.map((gateway, index) => (
          <Link
            key={index}
            href={gateway.href}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              {gateway.name}&nbsp;
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">{gateway.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
