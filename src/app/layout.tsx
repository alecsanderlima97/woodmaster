import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WoodMaster | Orquestracs",
  icons: {
    apple: "/pwa-192.png",
    icon: [
      { sizes: "32x32", url: "/favicon.png" },
      { sizes: "192x192", url: "/pwa-192.png" },
      { sizes: "512x512", url: "/pwa-512.png" },
    ],
    shortcut: "/favicon.png",
  },
  description: "Sistema Premium de Gestão para Marcenarias Modernas",
};

import { AuthProvider } from "@/modules/auth/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
