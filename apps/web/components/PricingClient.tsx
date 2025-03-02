// components/PricingClient.tsx
"use client";

import { useState } from "react";
import { Pricing, PricingPlan } from "@/components/pricing";
import { useUser } from "@clerk/nextjs";
import { OrderDialog } from "./orderdialog";
import { useCurrency } from "@/hooks/useCurrency";
import { useRouter } from "next/navigation";

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "0",
    yearlyPrice: "0",
    period: "month",
    features: [
      "Basic AI model access",
      "Limited API calls",
      "Community support",
    ],
    description: "Great for testing and exploring basic AI models.",
    buttonText: "Get Started",
    href: "/",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "29",
    yearlyPrice: "290",
    period: "month",
    features: [
      "Access to premium AI models",
      "Increased API limits",
      "Priority support",
    ],
    description: "Perfect for developers and AI enthusiasts.",
    buttonText: "Upgrade Now",
    href: "/",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "99",
    yearlyPrice: "990",
    period: "month",
    features: [
      "Unlimited API access",
      "Dedicated support",
      "Custom AI model integration",
    ],
    description: "Best for large-scale businesses and enterprises.",
    buttonText: "Contact Us",
    href: "/contact",
    isPopular: false,
  },
];

export function PricingClient() {
  const currency = useCurrency();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  // Check if the user is already upgraded (only relevant for Pro/Enterprise)
  const isUpgraded = user?.publicMetadata?.isUpgraded;

  // Callback from Pricing when a plan is selected.
  const onPlanSelect = (plan: PricingPlan) => {
    if (plan.name === "Pro" || plan.name === "Enterprise") {
      // If the user is already upgraded, do not proceed.
      if (isUpgraded) {
        alert("You are already upgraded!");
        return;
      }
      setSelectedPlan(plan);
    }
  };

  const closeDialog = () => {
    setSelectedPlan(null);
  };

  const handlePayment = async () => {
    if (!isSignedIn) {
      // Redirect to sign in if user is not signed in.
      router.push("/sign-in");
      return;
    }
    if (!selectedPlan) return;

    try {
      // Create Razorpay order via API.
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(selectedPlan.price),
          currency,
          receipt: `receipt_${Date.now()}`,
        }),
      });
      const orderData = await orderRes.json();

      // Load Razorpay Checkout script if not already present.
      if (!document.getElementById("razorpay-script")) {
        const script = document.createElement("script");
        script.id = "razorpay-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: `AIPortalx ${selectedPlan.name} Payment`,
        description: `Payment for the ${selectedPlan.name} plan.`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // After successful payment, update Clerk metadata.
          await fetch("/api/clerk/update-upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user?.id,
              upgrade: true,
            }),
          });
          // Redirect to /deployment.
          router.push("/deployment");
        },
        prefill: {
          name: user?.fullName,
          email: user?.emailAddresses?.[0]?.emailAddress,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <main>
      {/* Render Pricing component and pass the dynamic currency and onPlanSelect callback */}
      <Pricing plans={plans} currency={currency} onPlanSelect={onPlanSelect} />
      {/* Render the payment dialog if a plan is selected */}
      <OrderDialog
        plan={selectedPlan}
        onConfirm={handlePayment}
        onClose={closeDialog}
      />
    </main>
  );
}
