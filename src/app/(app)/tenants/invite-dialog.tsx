"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import { inviteTenantSchema, type InviteTenantInput } from "@/lib/validators";
import { inviteTenantAction } from "./actions";
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
import type { Property } from "@/lib/types";

interface InviteTenantDialogProps {
  properties: Property[];
  triggerText?: string;
}

export function InviteTenantDialog({ properties, triggerText = "Invite Tenant" }: InviteTenantDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InviteTenantInput>({
    resolver: zodResolver(inviteTenantSchema),
    defaultValues: {
      fullName: "",
      email: "",
      propertyId: properties[0]?.id || "",
      unitNumber: "",
      phone: "",
    },
  });

  const onSubmit = (values: InviteTenantInput) => {
    startTransition(async () => {
      const result = await inviteTenantAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Tenant invited! Welcome email sent.");
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
          <DialogTitle className="text-[#073b3a]">Invite Tenant</DialogTitle>
          <DialogDescription>
            Grant a resident access to their unit portal to submit maintenance requests.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Sarah Miller"
              disabled={isPending}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="sarah@example.com"
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="propertyId">Property *</Label>
              <Select
                defaultValue={properties[0]?.id}
                onValueChange={(val) => setValue("propertyId", val)}
                disabled={isPending || properties.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyId && (
                <p className="text-xs text-red-500 font-medium">{errors.propertyId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="unitNumber">Unit / Apt # *</Label>
              <Input
                id="unitNumber"
                placeholder="Apt 4B"
                disabled={isPending}
                {...register("unitNumber")}
              />
              {errors.unitNumber && (
                <p className="text-xs text-red-500 font-medium">{errors.unitNumber.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              placeholder="(555) 321-9876"
              disabled={isPending}
              {...register("phone")}
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
                  Sending Invite...
                </>
              ) : (
                "Send Invite"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
