import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile and organization details
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organization:organizations(*)")
    .eq("id", user.id)
    .single();

  const orgName = profile?.organization?.name;
  const userName = profile?.full_name;
  const userEmail = profile?.email || user.email;

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-foreground">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          userEmail={userEmail}
          userName={userName}
          orgName={orgName}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          userEmail={userEmail}
          userName={userName}
          orgName={orgName}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
