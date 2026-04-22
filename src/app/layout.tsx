import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ToastProvider } from "@/components/shared/Toast";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Charity Golf | Track Scores, Win Prizes, Support Charities",
  description: "Join the most impactful golf community. Track your Stableford scores, enter monthly draws, and support your favorite charities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <AuthInitializer />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          {/* S2 — Global toast provider. Renders toasts triggered via toast.success/error() */}
          <ToastProvider
            position="top-right"
            toastOptions={{
              style: {
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                fontFamily: 'var(--font-inter)',
                borderRadius: '1rem',
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
