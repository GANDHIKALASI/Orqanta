"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { signupSchema, type SignupInput } from "@/lib/validators";
import { signupAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      orgName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignupInput) => {
    startTransition(async () => {
      const result = await signupAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Organization created successfully! Redirecting...");
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <Card className="w-full shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <CardHeader className="space-y-1.5 text-center pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create your organization
        </CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Set up your workspace to automate maintenance triage and vendor coordination
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="fullName"
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Your Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Alex Johnson"
              disabled={isPending}
              className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="orgName"
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Company / Organization Name
            </Label>
            <Input
              id="orgName"
              placeholder="Skyline Property Management"
              disabled={isPending}
              className={errors.orgName ? "border-red-500 focus-visible:ring-red-500" : ""}
              {...register("orgName")}
            />
            {errors.orgName && (
              <p className="text-xs text-red-500 font-medium">{errors.orgName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Work Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="alex@skylinemanagement.com"
              disabled={isPending}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              disabled={isPending}
              className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 font-medium transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up workspace...
              </>
            ) : (
              "Get Started"
            )}
          </Button>

          <div className="text-center text-sm text-zinc-500 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
