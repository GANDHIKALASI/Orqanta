"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/types";

export async function toggleDemoDataAction(enable: boolean): Promise<ActionResult<{ isDemo: boolean }>> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const orgId = profile.org_id;
    const admin = createAdminClient();

    // 1. CLEAR existing demo data if disabling OR before reloading fresh demo data
    // Delete demo work orders first (cascade foreign keys)
    await admin
      .from("work_orders")
      .delete()
      .eq("org_id", orgId)
      .ilike("title", "%[Demo]%");

    // Delete demo vendors
    await admin
      .from("vendors")
      .delete()
      .eq("org_id", orgId)
      .ilike("name", "%[Demo]%");

    // Delete demo properties
    await admin
      .from("properties")
      .delete()
      .eq("org_id", orgId)
      .ilike("name", "%[Demo]%");

    const rawOrg = profile.organization;
    const org = Array.isArray(rawOrg) ? rawOrg[0] : rawOrg;
    const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};

    if (!enable) {
      // Disabling demo mode
      await admin
        .from("organizations")
        .update({
          feature_flags: {
            ...currentFlags,
            demo_mode: false,
          },
        })
        .eq("id", orgId);

      revalidatePath("/dashboard");
      revalidatePath("/work-orders");
      revalidatePath("/properties");
      revalidatePath("/vendors");
      revalidatePath("/reports");
      return { success: true, data: { isDemo: false } };
    }

    // 2. ENABLING demo mode: Insert rich, realistic demo data
    // A. Demo Properties
    const { data: insertedProps, error: propErr } = await admin
      .from("properties")
      .insert([
        {
          org_id: orgId,
          name: "Grand Oak Heights [Demo]",
          address: "742 Evergreen Terrace, Springfield",
          units: 48,
          owner_name: "Eleanor Vance",
          owner_email: "vance.properties@example.com",
        },
        {
          org_id: orgId,
          name: "Highland Modern Lofts [Demo]",
          address: "108 Ocean Boulevard, Suite 400",
          units: 24,
          owner_name: "Marcus Sterling",
          owner_email: "m.sterling@example.com",
        },
        {
          org_id: orgId,
          name: "Sunset Marina Residences [Demo]",
          address: "450 Marina Way, Bayside",
          units: 36,
          owner_name: "Claire Dupont",
          owner_email: "c.dupont@example.com",
        },
      ])
      .select("id, name");

    if (propErr || !insertedProps || insertedProps.length === 0) {
      return { success: false, error: propErr?.message || "Failed to create demo properties" };
    }

    const propGrandOak = insertedProps.find((p) => p.name.includes("Grand Oak"))?.id || insertedProps[0].id;
    const propHighland = insertedProps.find((p) => p.name.includes("Highland"))?.id || insertedProps[1]?.id || propGrandOak;
    const propSunset = insertedProps.find((p) => p.name.includes("Sunset"))?.id || insertedProps[2]?.id || propGrandOak;

    // B. Demo Vendors
    const { data: insertedVendors, error: vendorErr } = await admin
      .from("vendors")
      .insert([
        {
          org_id: orgId,
          name: "Apex Emergency Plumbing [Demo]",
          trade: "plumbing",
          email: "dispatch@apexplumbing.demo",
          phone: "+1 (555) 234-5678",
          rate_notes: "$125/hr standard, 24/7 priority emergency line",
          insurance_expiry: "2027-12-31",
        },
        {
          org_id: orgId,
          name: "VoltCraft Electrical Specialists [Demo]",
          trade: "electrical",
          email: "service@voltcraft.demo",
          phone: "+1 (555) 345-6789",
          rate_notes: "$110/hr licensed master electricians",
          insurance_expiry: "2027-09-30",
        },
        {
          org_id: orgId,
          name: "PolarAir HVAC Solutions [Demo]",
          trade: "hvac",
          email: "contracts@polarair.demo",
          phone: "+1 (555) 456-7890",
          rate_notes: "$95/hr commercial & multi-family cooling",
          insurance_expiry: "2028-03-15",
        },
        {
          org_id: orgId,
          name: "Prime Surface & Roofing [Demo]",
          trade: "roofing",
          email: "office@primeroofing.demo",
          phone: "+1 (555) 567-8901",
          rate_notes: "$85/hr exterior maintenance (Renewal pending)",
          insurance_expiry: "2024-01-10", // Intentionally expired for compliance guard warning
        },
      ])
      .select("id, name");

    if (vendorErr || !insertedVendors || insertedVendors.length === 0) {
      return { success: false, error: vendorErr?.message || "Failed to create demo vendors" };
    }

    const vPlumbing = insertedVendors.find((v) => v.name.includes("Apex"))?.id || insertedVendors[0].id;
    const vElectrical = insertedVendors.find((v) => v.name.includes("VoltCraft"))?.id || insertedVendors[1]?.id || vPlumbing;
    const vHvac = insertedVendors.find((v) => v.name.includes("PolarAir"))?.id || insertedVendors[2]?.id || vPlumbing;
    const vRoofing = insertedVendors.find((v) => v.name.includes("Prime"))?.id || insertedVendors[3]?.id || vPlumbing;

    // C. Demo Work Orders (with Orqanta AI Autonomous Triage Fields)
    const { data: insertedOrders, error: orderErr } = await admin
      .from("work_orders")
      .insert([
        {
          org_id: orgId,
          property_id: propGrandOak,
          unit_number: "Unit 304",
          vendor_id: vPlumbing,
          title: "Main water pipe leaking into hallway ceiling [Demo]",
          description:
            "Persistent heavy drip from the hallway ceiling tile directly outside apartment 304. Drywall is sagging with bubbling paint, directly beneath Unit 404 riser line.",
          priority: "urgent",
          status: "in_progress",
          source: "portal",
          submitter_email: "tenant.304@grandoak.demo",
          ai_summary:
            "High-velocity water ingress detected directly threatening hallway electrical junction. Immediate isolation of riser shutoff valve recommended. Dispatched to verified plumbing partner.",
          ai_category: "Plumbing",
          ai_suggested_vendor_id: vPlumbing,
        },
        {
          org_id: orgId,
          property_id: propGrandOak,
          unit_number: "Unit 204",
          vendor_id: vHvac,
          title: "HVAC blowing warm air during summer heat advisory [Demo]",
          description:
            "Central air conditioning stopped cooling early this morning. Thermostat set to 68°F but ambient inside temperature has reached 82°F.",
          priority: "high",
          status: "open",
          source: "portal",
          submitter_email: "tenant.204@grandoak.demo",
          ai_summary:
            "Refrigerant loop pressure fault or dual-run capacitor blowout. High priority due to ambient indoor temperature exceeding 80°F during regional heat advisory.",
          ai_category: "HVAC",
          ai_suggested_vendor_id: vHvac,
        },
        {
          org_id: orgId,
          property_id: propHighland,
          unit_number: "Laundry Facility",
          vendor_id: vElectrical,
          title: "Breaker subpanel humming with intermittent plastic odor [Demo]",
          description:
            "Commercial dryer subpanel in communal basement laundry tripped twice today. Faint ozone smell observed around breaker switch 4.",
          priority: "urgent",
          status: "open",
          source: "portal",
          submitter_email: "manager@highland.demo",
          ai_summary:
            "Potential arc-fault or busbar thermal degradation in shared high-load utility area. Urgent fire prevention assessment recommended.",
          ai_category: "Electrical",
          ai_suggested_vendor_id: vElectrical,
        },
        {
          org_id: orgId,
          property_id: propHighland,
          unit_number: "Unit 112",
          vendor_id: null,
          title: "Dishwasher pump humming and standing water [Demo]",
          description:
            "Dishwasher runs wash cycle but fails to drain. Standing water left in base basin at completion.",
          priority: "medium",
          status: "open",
          source: "sdk",
          submitter_email: "resident.112@highland.demo",
          ai_summary:
            "Mechanical drain impeller blockage or solenoid valve failure. Non-emergency repair scheduled for regular operating hours.",
          ai_category: "Appliance",
        },
        {
          org_id: orgId,
          property_id: propSunset,
          unit_number: "North Eaves",
          vendor_id: vRoofing,
          title: "Wind-damaged roof shingle detachment [Demo]",
          description:
            "Perimeter aluminum flashing and three asphalt shingles detached along the north gutter line during weekend squall.",
          priority: "low",
          status: "resolved",
          source: "portal",
          submitter_email: "resident@sunsetmarina.demo",
          ai_summary:
            "Exterior cladding displaced by wind sheer. Warning: Contractor insurance status flagged for policy renewal before final sign-off.",
          ai_category: "Roofing",
          ai_suggested_vendor_id: vRoofing,
        },
      ])
      .select("id, title");

    if (orderErr) {
      return { success: false, error: orderErr.message };
    }

    // D. Log Demo Activity
    if (insertedOrders && insertedOrders.length > 0) {
      await admin.from("activity_log").insert([
        {
          org_id: orgId,
          work_order_id: insertedOrders[0].id,
          actor_id: user.id,
          action: "ai_triage_completed",
          details: {
            confidence: "99.6%",
            category: "Plumbing",
            priority: "urgent",
            trade_detected: "Plumbing",
          },
        },
        {
          org_id: orgId,
          work_order_id: insertedOrders[0].id,
          actor_id: user.id,
          action: "vendor_assigned",
          details: {
            vendor: "Apex Emergency Plumbing [Demo]",
            insurance_verified: true,
          },
        },
      ]);
    }

    // E. Save demo_mode: true on Organization
    await admin
      .from("organizations")
      .update({
        feature_flags: {
          ...currentFlags,
          demo_mode: true,
        },
      })
      .eq("id", orgId);

    revalidatePath("/dashboard");
    revalidatePath("/work-orders");
    revalidatePath("/properties");
    revalidatePath("/vendors");
    revalidatePath("/reports");

    return { success: true, data: { isDemo: true } };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle demo data",
    };
  }
}
