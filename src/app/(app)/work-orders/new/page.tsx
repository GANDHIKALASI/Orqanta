import { createClient } from "@/lib/supabase/server";
import { CreateWorkOrderForm } from "./create-form";

export default async function NewWorkOrderPage() {
  const supabase = createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create Work Order
        </h1>
        <p className="text-sm text-zinc-500">
          Log a new maintenance request. Orqanta AI will automatically analyze and summarize the repair.
        </p>
      </div>

      <CreateWorkOrderForm properties={properties || []} />
    </div>
  );
}
