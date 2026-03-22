import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/app/context/app-context";
import { Navigation } from "@/components/Navigation";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mental Wellness Platform",
  description: "A comprehensive mental wellness platform for youth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          <AppProvider>
            <div className="min-h-screen bg-background pb-20 lg:pb-0">
                <Navigation />
                <main className="pt-16">{children}</main>
                <Toaster />
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
