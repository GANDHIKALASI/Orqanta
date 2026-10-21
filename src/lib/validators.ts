import { z } from "zod";

// ==============================================================================
// Auth Schemas
// ==============================================================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ==============================================================================
// Property Schemas
// ==============================================================================

export const propertySchema = z.object({
  name: z.string().min(2, "Property name is required"),
  address: z.string().min(5, "Address is required"),
  owner_name: z.string().optional().nullable(),
  owner_email: z.string().email("Valid email required").optional().or(z.literal("")).nullable(),
  units: z.number().int().min(1, "Must have at least 1 unit"),
});

// ==============================================================================
// Vendor Schemas
// ==============================================================================

export const vendorTradeSchema = z.enum([
  "plumbing",
  "electrical",
  "hvac",
  "appliance",
  "roofing",
  "carpentry",
  "pest_control",
  "general_handyman",
]);

export const vendorSchema = z.object({
  name: z.string().min(2, "Vendor name is required"),
  trade: vendorTradeSchema,
  phone: z.string().optional().nullable(),
  email: z.string().email("Valid vendor email is required"),
  rate_notes: z.string().optional().nullable(),
  insurance_expiry: z.string().optional().nullable(),
});

// ==============================================================================
// Tenant Invitation Schema
// ==============================================================================

export const inviteTenantSchema = z.object({
  fullName: z.string().min(2, "Tenant name is required"),
  email: z.string().email("Valid email is required"),
  propertyId: z.string().uuid("Please select a property"),
  unitNumber: z.string().min(1, "Unit number is required"),
  phone: z.string().optional().nullable(),
});

// ==============================================================================
// Work Order Schemas
// ==============================================================================

export const prioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export const statusSchema = z.enum(["open", "in_progress", "resolved", "closed"]);

export const createWorkOrderSchema = z.object({
  property_id: z.string().uuid("Please select a property"),
  unit_number: z.string().optional().nullable(),
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(10, "Please provide more details (at least 10 characters)"),
  priority: prioritySchema,
  photo_keys: z.array(z.string()),
});

export const updateWorkOrderStatusSchema = z.object({
  workOrderId: z.string().uuid(),
  status: statusSchema,
});

export const assignVendorSchema = z.object({
  workOrderId: z.string().uuid(),
  vendorId: z.string().uuid().nullable(),
});

// ==============================================================================
// Public SDK Submission Schema
// ==============================================================================

export const sdkSubmitSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(10, "Please provide more details"),
  property_id: z.string().uuid().optional(),
  unit_number: z.string().optional(),
  submitter_email: z.string().email("Valid submitter email required"),
  photos: z.array(z.string()).optional(),
});

// Types inferred from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type VendorInput = z.infer<typeof vendorSchema>;
export type InviteTenantInput = z.infer<typeof inviteTenantSchema>;
export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
