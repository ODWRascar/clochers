// app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clochers du Frontonnais",
  description:
    "Lectures du jour, messes, événements et carte des clochers — Ensemble paroissial Fronton–Villemur.",
  // ✅ Lien vers le manifest PWA (quand tu l'ajouteras dans /public)
  manifest: "/manifest.webmanifest",
  // ✅ Couleur de thème pour la barre du navigateur
  themeColor: "#19565E",
  // ✅ Icônes de l'app (quand tu les ajouteras dans /public/icons)
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      // iOS utilisera cette icône si présente
      { url: "/icons/icon-192.png" }
    ]
  },
  // ✅ Mode “web app” sur iOS (sans nouveau fichier)
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Clochers"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
