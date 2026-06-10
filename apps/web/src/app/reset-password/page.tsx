"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Enter your new password.");
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  async function submit() {
    try {
      const response = await api<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reset password.");
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <h1 className="text-3xl font-semibold">Reset password</h1>
      <div className="mt-6 space-y-4">
        <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" />
        <Button className="w-full" onClick={submit}>
          Update password
        </Button>
        <div className="rounded-3xl border border-white/10 p-4 text-sm text-muted-foreground">{message}</div>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <Suspense fallback={<Card className="w-full max-w-lg">Loading reset form...</Card>}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
