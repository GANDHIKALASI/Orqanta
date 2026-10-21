import { createClient } from "@/lib/supabase/server";
import { Building2, MapPin, Mail, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreatePropertyDialog } from "./create-dialog";

export default async function PropertiesPage() {
  const supabase = createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Property Portfolio
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your buildings, total unit counts, and property owner details.
          </p>
        </div>

        <CreatePropertyDialog />
      </div>

      {/* Property Cards Grid */}
      {!properties || properties.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center py-16">
          <CardContent className="space-y-4 max-w-sm mx-auto">
            <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
              <Building2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                No properties added yet
              </h3>
              <p className="text-xs text-zinc-500">
                Register your first building or multi-unit property to begin assigning units and work orders.
              </p>
            </div>
            <CreatePropertyDialog triggerText="Add Your First Property" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {property.name}
                    </CardTitle>
                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                      <MapPin className="size-3 shrink-0" />
                      <span>{property.address}</span>
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs shrink-0">
                    {property.units} {property.units === 1 ? "unit" : "units"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-2 text-xs space-y-2 border-t border-zinc-100 dark:border-zinc-800/80">
                {property.owner_name && (
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <User className="size-3 text-zinc-400" />
                      Owner
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-200">
                      {property.owner_name}
                    </span>
                  </div>
                )}
                {property.owner_email && (
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3 text-zinc-400" />
                      Owner Email
                    </span>
                    <span className="truncate max-w-[150px] font-mono text-[11px]">
                      {property.owner_email}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
