// ==============================================================================
// Orqanta — Domain Types
// ==============================================================================

export type UserRole = "manager" | "tenant" | "vendor" | "owner";

export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";

export type WorkOrderStatus = "open" | "in_progress" | "resolved" | "closed";

export type WorkOrderSource = "portal" | "sdk" | "api";

export type VendorTrade =
  | "plumbing"
  | "electrical"
  | "hvac"
  | "appliance"
  | "roofing"
  | "carpentry"
  | "pest_control"
  | "general_handyman";

export interface FeatureFlags {
  ai_triage: boolean;
  ai_vendor_suggestion: boolean;
  ai_draft_message: boolean;
  ai_monthly_report: boolean;
  ai_duplicate_detect: boolean;
  sdk_enabled: boolean;
  api_enabled: boolean;
}

export type SubscriptionStatus = "trialing" | "active" | "locked" | "past_due";

export interface PaymentMethod {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "discover" | "other";
  last4: string;
  exp_month: string;
  exp_year: string;
  cardholder_name: string;
  is_default: boolean;
  created_at?: string;
}

export interface BillingInvoice {
  id: string;
  invoice_number: string;
  created_at: string;
  due_date: string;
  paid_at: string | null;
  amount: number;
  subtotal: number;
  tax_rate: number; // e.g. 18 for 18%
  tax_amount: number;
  currency: string;
  plan_name: string;
  billing_period?: string;
  status: "paid" | "failed" | "pending";
  payment_method_last4?: string;
  payment_method_brand?: string;
  pdf_url?: string;
}

export interface BillingDetails {
  company_name?: string;
  contact_email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  vat_number?: string; // Tax ID / VAT / GSTIN
}

export interface FailedPaymentInfo {
  is_failed: boolean;
  failed_at: string;
  amount: number;
  plan_name: string;
  reason: string;
  retry_count: number;
  grace_period_ends_at: string;
}

export interface OrganizationBillingData {
  plan: "monthly" | "annual";
  plan_name: string;
  planName?: string;
  amount: number;
  currency: string;
  next_billing_date: string;
  auto_renew: boolean;
  payment_methods: PaymentMethod[];
  billing_details: BillingDetails;
  failed_payment?: FailedPaymentInfo | null;
  invoices: BillingInvoice[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  feature_flags: FeatureFlags & {
    trial_ends_at?: string;
    subscription_status?: SubscriptionStatus;
    billing?: Partial<OrganizationBillingData>;
  };
  api_key: string | null;
  trial_ends_at?: string;
  subscription_status?: SubscriptionStatus;
  created_at: string;
}

export interface Property {
  id: string;
  org_id: string;
  name: string;
  address: string;
  owner_name: string | null;
  owner_email: string | null;
  units: number;
  created_at: string;
}

export interface Profile {
  id: string;
  org_id: string;
  role: UserRole;
  property_id: string | null;
  unit_number: string | null;
  full_name: string;
  phone: string | null;
  email: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  org_id: string;
  name: string;
  trade: VendorTrade;
  phone: string | null;
  email: string;
  rate_notes: string | null;
  insurance_expiry: string | null;
  created_at: string;
}

export interface WorkOrder {
  id: string;
  org_id: string;
  property_id: string;
  unit_number: string | null;
  tenant_id: string | null;
  vendor_id: string | null;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  photo_keys: string[];
  source: WorkOrderSource;
  submitter_email: string | null;
  ai_summary: string | null;
  ai_category: string | null;
  ai_suggested_vendor_id: string | null;
  ai_suggested_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined relation fields for UI
  property?: Property;
  tenant?: Profile;
  vendor?: Vendor;
}

export interface ActivityLog {
  id: string;
  org_id: string;
  work_order_id: string;
  actor_id: string | null;
  action: string;
  meta: Record<string, unknown>;
  created_at: string;
  actor?: Profile;
}

export interface MonthlyReport {
  id: string;
  org_id: string;
  month: string; // YYYY-MM
  markdown: string;
  metrics: Record<string, unknown>;
  created_at: string;
}

// Server Action Response Pattern
export type ActionResult<T = void> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };
