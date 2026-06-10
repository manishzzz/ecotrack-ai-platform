import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoTrack AI",
  description: "AI-powered carbon footprint awareness platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        ) : (
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}
