import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lamia Analytics",
  description: "Dashboard responsivo em Next.js, Tailwind CSS e Shadcn UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
