"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

import { createWorkOrderSchema, type CreateWorkOrderInput } from "@/lib/validators";
import { createWorkOrderAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Property } from "@/lib/types";

interface CreateWorkOrderFormProps {
  properties: Property[];
}

export function CreateWorkOrderForm({ properties }: CreateWorkOrderFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateWorkOrderInput>({
    resolver: zodResolver(createWorkOrderSchema),
    defaultValues: {
      property_id: properties[0]?.id || "",
      unit_number: "",
      title: "",
      description: "",
      priority: "medium",
      photo_keys: [],
    },
  });

  const onSubmit = (values: CreateWorkOrderInput) => {
    startTransition(async () => {
      const result = await createWorkOrderAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Work order created! AI triage started.");
      router.push(`/work-orders/${result.data.id}`);
      router.refresh();
    });
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="property_id">Target Property *</Label>
              <Select
                defaultValue={properties[0]?.id}
                onValueChange={(val) => setValue("property_id", val)}
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
              {errors.property_id && (
                <p className="text-xs text-red-500 font-medium">{errors.property_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="unit_number">Apartment / Unit #</Label>
              <Input
                id="unit_number"
                placeholder="e.g. Unit 302 or Common Area"
                disabled={isPending}
                {...register("unit_number")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Issue Summary / Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Kitchen sink leaking under the cabinet"
              disabled={isPending}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe the issue, symptoms, when it started, and any tenant instructions..."
              disabled={isPending}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="priority">Initial Priority</Label>
            <Select
              defaultValue="medium"
              onValueChange={(val) => setValue("priority", val as any)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low — Routine maintenance / cosmetic</SelectItem>
                <SelectItem value="medium">Medium — Standard issue, non-critical</SelectItem>
                <SelectItem value="high">High — Impairs tenant daily living</SelectItem>
                <SelectItem value="urgent">Urgent — Water leak, gas, electrical hazard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3.5 rounded-lg bg-violet-50/70 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/40 flex items-start gap-3">
            <Sparkles className="size-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Upon submission, <strong>Orqanta AI</strong> will automatically categorize the trade, extract urgency, and recommend an eligible contractor.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Order...
                </>
              ) : (
                "Create Work Order"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
