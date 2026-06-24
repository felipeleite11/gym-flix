import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import 'animate.css'
import '@/styles/sonner.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GYM Flix",
  description: "Plataforma para gestão e acompanhamento de treinos de musculação.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
          {children}

          <Toaster
            position="top-center"
            toastOptions={{
              unstyled: true
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
