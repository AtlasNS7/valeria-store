import type { Metadata } from "next";
import { Spectral, Familjen_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const spectral = Spectral({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500"],
});

const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Valéria Gift & Essence",
  description: "Presentes e perfumes artesanais, feitos à mão por Valéria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${spectral.variable} ${familjenGrotesk.variable} h-full antialiased`}
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
