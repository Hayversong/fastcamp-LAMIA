import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yu-Gi-Oh! Regulation Dashboard",
  description: "Listas atuais de cartas proibidas e limitadas.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <QueryProvider>
          <Header />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
