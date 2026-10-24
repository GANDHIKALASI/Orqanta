// ==============================================================================
// Orqanta — Razorpay Payment Gateway Integration
// ==============================================================================

export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

/**
 * Dynamically loads the official Razorpay Checkout SDK
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    // Already loaded in window
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayCheckoutOptions {
  plan: "monthly" | "annual";
  amount: number; // in INR rupees, e.g. 199 or 1999
  currency?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  orgName?: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  onError?: (error: unknown) => void;
  onDismiss?: () => void;
}

/**
 * Triggers the official Razorpay Checkout modal
 */
export async function initiateRazorpayCheckout({
  plan,
  amount,
  currency = "INR",
  userName = "Property Manager",
  userEmail = "",
  userPhone = "",
  orgName = "Orqanta Workspace",
  onSuccess,
  onError,
  onDismiss,
}: RazorpayCheckoutOptions): Promise<void> {
  if (!RAZORPAY_KEY_ID) {
    throw new Error(
      "Razorpay API Key ID is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in your environment variables."
    );
  }

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error("Unable to load Razorpay payment gateway. Please check your network connection.");
  }

  const planLabel = plan === "annual" ? "Annual Pro Plan (1 Year)" : "Monthly Starter Plan (1 Month)";
  const amountInPaise = Math.round(amount * 100);

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise,
    currency,
    name: "Orqanta",
    description: `Subscription: ${planLabel}`,
    image: "/icon.png",
    prefill: {
      name: userName || orgName,
      email: userEmail,
      contact: userPhone || "",
    },
    notes: {
      platform: "Orqanta Property Maintenance Workspace",
      plan,
      organization: orgName,
    },
    theme: {
      color: "#073b3a", // Orqanta brand primary deep emerald
    },
    modal: {
      confirm_close: true,
      ondismiss: function () {
        onDismiss?.();
      },
    },
    handler: function (response: {
      razorpay_payment_id: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }) {
      onSuccess(response);
    },
  };

  const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: typeof options) => { open: () => void; on: (event: string, handler: (err: unknown) => void) => void } }).Razorpay;

  if (!RazorpayConstructor) {
    throw new Error("Razorpay SDK not initialized.");
  }

  const rzp = new RazorpayConstructor(options);

  rzp.on("payment.failed", function (response: unknown) {
    onError?.(response);
  });

  rzp.open();
}
