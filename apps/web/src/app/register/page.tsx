"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("Create your account to start tracking emissions.");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();

  async function register() {
    setLoading(true);
    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });
      await refreshUser();
      setMessage("Registration successful. Redirecting to your dashboard...");
      startTransition(() => {
        router.push("/dashboard");
        router.refresh();
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <Card className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold">Create your EcoTrack account</h1>
        <div className="mt-6 space-y-4">
          <Input placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <Input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          <Button className="w-full" onClick={register} disabled={loading}>
            Register
          </Button>
          <div className="rounded-3xl border border-white/10 p-4 text-sm text-muted-foreground">{message}</div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-foreground">Log in</Link>
        </p>
      </Card>
    </main>
  );
}
