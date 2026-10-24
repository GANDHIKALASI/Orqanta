import type {
  BillingInvoice,
  OrganizationBillingData,
} from "@/lib/types";

export function getDefaultBillingData(
  orgName = "Orqanta Workspace",
  userEmail = "billing@orqanta.com",
  userName = "Property Manager",
  plan: "monthly" | "annual" = "annual"
): OrganizationBillingData {
  const isAnnual = plan === "annual";
  const amount = isAnnual ? 1999 : 199;
  const planName = isAnnual ? "Annual Pro Plan" : "Monthly Starter Plan";

  // Next renewal: 1 year from now (or 30 days for monthly)
  const nextRenewalDate = new Date();
  if (isAnnual) {
    nextRenewalDate.setFullYear(nextRenewalDate.getFullYear() + 1);
  } else {
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
  }

  const subtotal = Math.round((amount / 1.18) * 100) / 100;
  const taxAmount = Math.round((amount - subtotal) * 100) / 100;

  const defaultInvoices: BillingInvoice[] = [
    {
      id: "inv-2026-001",
      invoice_number: "INV-2026-001",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      paid_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount,
      subtotal,
      tax_rate: 18,
      tax_amount: taxAmount,
      currency: "INR",
      plan_name: planName,
      billing_period: isAnnual ? "Oct 2025 – Oct 2026" : "Sep 2026 – Oct 2026",
      status: "paid",
      payment_method_last4: "4242",
      payment_method_brand: "visa",
    },
    {
      id: "inv-2025-012",
      invoice_number: "INV-2025-012",
      created_at: new Date(Date.now() - 395 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() - 395 * 24 * 60 * 60 * 1000).toISOString(),
      paid_at: new Date(Date.now() - 395 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 1999,
      subtotal: 1694.07,
      tax_rate: 18,
      tax_amount: 304.93,
      currency: "INR",
      plan_name: "Annual Pro Plan",
      billing_period: "Oct 2024 – Oct 2025",
      status: "paid",
      payment_method_last4: "4242",
      payment_method_brand: "visa",
    },
  ];

  return {
    plan,
    plan_name: planName,
    planName,
    amount,
    currency: "INR",
    next_billing_date: nextRenewalDate.toISOString(),
    auto_renew: true,
    payment_methods: [
      {
        id: "pm-default-1",
        brand: "visa",
        last4: "4242",
        exp_month: "12",
        exp_year: "28",
        cardholder_name: userName || "Authorized Representative",
        is_default: true,
        created_at: new Date().toISOString(),
      },
    ],
    billing_details: {
      company_name: `${orgName} Management Corp`,
      contact_email: userEmail,
      address_line1: "450 Property Lane, Suite 200",
      city: "Austin",
      state: "TX",
      postal_code: "78701",
      country: "United States",
      vat_number: "US-EIN-948201948", // VAT / Tax / GST ID
    },
    failed_payment: null,
    invoices: defaultInvoices,
  };
}
