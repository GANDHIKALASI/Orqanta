import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata = {
  title: "Orqanta — AI-Native Property Maintenance Platform",
  description:
    "Autonomous maintenance operations for property managers (50–500 units). Cut dispatch time by 70% with Orqanta AI triage and vetted vendor matching.",
};

export default async function HomePage() {
  let isAuthenticated = false;
  let userEmail: string | null = null;

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      isAuthenticated = true;
      userEmail = user.email || null;
    }
  } catch {
    // If not authenticated or error, default to unauthenticated landing view
    isAuthenticated = false;
  }

  return <LandingPage isAuthenticated={isAuthenticated} userEmail={userEmail} />;
}
