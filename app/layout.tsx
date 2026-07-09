import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LocaleProvider } from "@/providers/locale-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Dentistry",
    template: "%s | Dentistry",
  },
  description:
    "Stomatoloqların peşəkar portfoliyo və reputasiya platforması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <LocaleProvider>
          <AuthProvider>
            <ToastProvider>
              <ThemeProvider>
                <QueryProvider>{children}</QueryProvider>
              </ThemeProvider>
            </ToastProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
