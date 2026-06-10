"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("We’ll send a secure reset link to your inbox.");

  async function submit() {
    try {
      const response = await api<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send reset email.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <Card className="w-full max-w-lg">
        <h1 className="text-3xl font-semibold">Forgot password</h1>
        <div className="mt-6 space-y-4">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" />
          <Button className="w-full" onClick={submit}>
            Send reset link
          </Button>
          <div className="rounded-3xl border border-white/10 p-4 text-sm text-muted-foreground">{message}</div>
        </div>
      </Card>
    </main>
  );
}
