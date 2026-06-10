"use client";

import Link from "next/link";
import { Leaf, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/components/providers/auth-provider";
import { navigation } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">EcoTrack AI</div>
            <div className="text-xs text-muted-foreground">Carbon awareness platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
          {loading ? null : user ? (
            <>
              {user.role === "ADMIN" ? (
                <Button variant="outline" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              ) : null}
              <Button variant="outline" onClick={() => void logout()}>
                Logout
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
