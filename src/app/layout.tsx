import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Gym Love | Moda Fitness",
  description:
    "Catalogo de moda fitness Gym Love. Macaquinhos, leggings, tops e conjuntos com estilo e conforto para seus treinos.",
  keywords: ["moda fitness", "gym love", "macaquinho", "legging", "top", "boa vista"],
  openGraph: {
    title: "Gym Love | Moda Fitness",
    description: "Catalogo de moda fitness com estilo e conforto",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
