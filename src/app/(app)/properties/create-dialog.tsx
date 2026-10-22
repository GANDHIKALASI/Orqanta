"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import { propertySchema, type PropertyInput } from "@/lib/validators";
import { createPropertyAction } from "./actions";
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

interface CreatePropertyDialogProps {
  triggerText?: string;
}

export function CreatePropertyDialog({ triggerText = "Add Property" }: CreatePropertyDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "",
      owner_name: "",
      owner_email: "",
      units: 1,
    },
  });

  const onSubmit = (values: PropertyInput) => {
    startTransition(async () => {
      const result = await createPropertyAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Property added to portfolio!");
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
          <DialogTitle className="text-[#073b3a]">Add New Property</DialogTitle>
          <DialogDescription>
            Register a building or complex to organize units and tenant tickets.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Property Name *</Label>
            <Input
              id="name"
              placeholder="Grand Oak Apartments"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Full Address *</Label>
            <Input
              id="address"
              placeholder="104 Elm Street, Austin, TX"
              disabled={isPending}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-500 font-medium">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="units">Total Units *</Label>
              <Input
                id="units"
                type="number"
                min="1"
                disabled={isPending}
                {...register("units", { valueAsNumber: true })}
              />
              {errors.units && (
                <p className="text-xs text-red-500 font-medium">{errors.units.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="owner_name">Owner Name</Label>
              <Input
                id="owner_name"
                placeholder="Jane Doe"
                disabled={isPending}
                {...register("owner_name")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="owner_email">Owner Email (for reports)</Label>
            <Input
              id="owner_email"
              type="email"
              placeholder="owner@example.com"
              disabled={isPending}
              {...register("owner_email")}
            />
            {errors.owner_email && (
              <p className="text-xs text-red-500 font-medium">{errors.owner_email.message}</p>
            )}
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
                "Save Property"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
