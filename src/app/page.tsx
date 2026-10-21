import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  } catch {
    // If Supabase environment is not yet configured or fails, fallback to login
    redirect("/login");
  }
}
