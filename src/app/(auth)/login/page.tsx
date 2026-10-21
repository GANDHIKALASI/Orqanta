import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-sm border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to Orqanta
          </CardTitle>
          <CardDescription className="text-zinc-500 text-sm">
            Enter your credentials to access your maintenance workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@example.com"
                required
                className="bg-white dark:bg-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="bg-white dark:bg-zinc-900"
              />
            </div>
            <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white">
              Sign In
            </Button>
          </form>
          <div className="text-center text-sm text-zinc-500">
            Don&apos;t have an organization account?{" "}
            <Link href="/signup" className="underline font-medium text-zinc-900 dark:text-zinc-100">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
