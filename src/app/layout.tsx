import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const interTightDisplay = Inter_Tight({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const publicSans = Inter_Tight({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Valéria Gift & Essence",
  description: "Presentes e perfumes artesanais, feitos à mão por Valéria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${interTightDisplay.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
