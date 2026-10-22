"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import { vendorSchema, type VendorInput } from "@/lib/validators";
import { createVendorAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateVendorDialogProps {
  triggerText?: string;
}

const trades = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC" },
  { value: "appliance", label: "Appliance Repair" },
  { value: "roofing", label: "Roofing" },
  { value: "carpentry", label: "Carpentry" },
  { value: "pest_control", label: "Pest Control" },
  { value: "general_handyman", label: "General Handyman" },
];

export function CreateVendorDialog({ triggerText = "Add Vendor" }: CreateVendorDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VendorInput>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      trade: "plumbing",
      phone: "",
      email: "",
      rate_notes: "",
      insurance_expiry: "",
    },
  });

  const onSubmit = (values: VendorInput) => {
    startTransition(async () => {
      const result = await createVendorAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Vendor added to directory!");
      reset();
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#073b3a] hover:bg-[#0b4847] text-white font-medium gap-1.5 shadow-sm">
          <Plus className="size-4" />
          <span>{triggerText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#073b3a]">Add Contractor / Vendor</DialogTitle>
          <DialogDescription>
            Register a trusted vendor to enable one-click work order dispatch and AI matching.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Company / Contractor Name *</Label>
            <Input
              id="name"
              placeholder="Apex Plumbing Pro"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="trade">Primary Trade *</Label>
            <Select
              defaultValue="plumbing"
              onValueChange={(val) => setValue("trade", val as any)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary trade" />
              </SelectTrigger>
              <SelectContent>
                {trades.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="dispatch@apexplumb.com"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="(555) 019-2834"
                disabled={isPending}
                {...register("phone")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rate_notes">Hourly Rate / Notes</Label>
            <Input
              id="rate_notes"
              placeholder="$95/hr standard, $140 emergency"
              disabled={isPending}
              {...register("rate_notes")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="insurance_expiry">Liability Insurance Expiry</Label>
            <Input
              id="insurance_expiry"
              type="date"
              disabled={isPending}
              {...register("insurance_expiry")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-[#073b3a] hover:bg-[#0b4847] text-white">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Vendor"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
