import "./globals.css";
import Header from "@/components/Header";
import QueryProvider from "@/components/QueryProvider";
import { ReactNode } from "react";
import { GamesProvider } from "@/context/GamesContext";

export const metadata = {
  title: "★ Games Review",
  description: "Aplicação para reviews de jogos que você já jogou",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-900 text-white">
        <div className="min-h-screen flex flex-col">
          <Header />

          <QueryProvider>
            <GamesProvider>
              <main className="flex-1">
                <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
              </main>
            </GamesProvider>
          </QueryProvider>

          <footer className="bg-gray-800 text-center py-4 mt-12">
            <p className="text-gray-400">
              © 2025 Games Review ★ desenvolvido por Hayverson
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
