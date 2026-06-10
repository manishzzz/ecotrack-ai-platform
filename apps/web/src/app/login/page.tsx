"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Sign in to access your carbon dashboard, history, and AI advisor.");
  const [loading, setLoading] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const { refreshUser } = useAuth();
  const router = useRouter();

  async function login() {
    setLoading(true);
    try {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      await refreshUser();
      setMessage("Login successful. Redirecting to your dashboard...");
      startTransition(() => {
        router.push("/dashboard");
        router.refresh();
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin(response: CredentialResponse) {
    if (!response.credential) return;
    setLoading(true);
    try {
      await api("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: response.credential })
      });
      await refreshUser();
      startTransition(() => {
        router.push("/dashboard");
        router.refresh();
      });
    } catch {
      setMessage("Google login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <Card className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to calculate, track, and improve your footprint.</p>
        <div className="mt-6 space-y-4">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          <Button className="w-full" onClick={login} disabled={loading}>
            Login
          </Button>
          {googleClientId ? (
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setMessage("Google login failed.")} />
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 p-4 text-sm text-muted-foreground">
              Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to enable Google sign-in.
            </div>
          )}
          <div className="rounded-3xl border border-white/10 p-4 text-sm text-muted-foreground">{message}</div>
        </div>
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <Link href="/register">Create account</Link>
          <Link href="/forgot-password">Forgot password</Link>
        </div>
      </Card>
    </main>
  );
}
