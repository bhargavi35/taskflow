"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { registerUser } from "@/actions/auth.actions";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerUser, null);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-2">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <p className="text-sm text-gray-500">Get started with TaskFlow</p>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" minLength={6} required />
          </div>
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {pending ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
        </p>
      </CardContent>
    </Card>
  );
}
