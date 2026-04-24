import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Stock Dashboard",
  description: "Stock price tracker",
};

export default function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;

}>) {
  return (
    <html
      lang="en"
      className="antialiased"
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <QueryProvider>
          {children}
        </QueryProvider>

        <Toaster position="top-center"/>
      </body>
    </html>
  );
}
